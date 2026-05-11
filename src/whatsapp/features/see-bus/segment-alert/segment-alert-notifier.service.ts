import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { WhatsappService } from '@client/whatsapp.service';
import { seeBusCookieFetcher } from '../infra/cookie-fetcher.service';
import {
  fetchSegmentTracking,
  SegmentBus,
} from '../infra/segment-bus-tracker.service';
import {
  isBusInLocality,
  resolvePreviousLocality,
} from '../infra/segment-route.util';
import { SegmentAlertSubscriptionService } from './segment-alert-subscription.service';

@Injectable()
export class SegmentAlertNotifierService {
  private readonly logger = new Logger(SegmentAlertNotifierService.name);
  private readonly sentNotifications = new Map<string, number>();
  private readonly cooldownMs = 90 * 60 * 1000;

  constructor(
    private readonly subscriptionService: SegmentAlertSubscriptionService,
    private readonly whatsapp: WhatsappService,
  ) {}

  @Cron('*/2 * * * *', { timeZone: 'America/Argentina/Buenos_Aires' })
  async notifySubscribers(): Promise<void> {
    const subscriptions = await this.subscriptionService.findSubscribers();
    if (subscriptions.length === 0) {
      return;
    }

    const cookie = await seeBusCookieFetcher();

    for (const subscription of subscriptions) {
      const parsedTopic = this.subscriptionService.parseTopic(
        subscription.topic,
      );
      if (!parsedTopic) {
        continue;
      }

      try {
        const trackingData = await fetchSegmentTracking(cookie, parsedTopic);
        const previousLocality = resolvePreviousLocality(
          trackingData.routeDetail,
          parsedTopic.destinationGobId,
        );

        if (!previousLocality) {
          continue;
        }

        const busesInPreviousLocality = trackingData.buses.filter((bus) =>
          isBusInLocality(bus, previousLocality),
        );

        for (const bus of busesInPreviousLocality) {
          if (
            !this.shouldNotify(subscription.chatId, subscription.topic, bus)
          ) {
            continue;
          }

          await this.whatsapp.sendMessage(
            subscription.chatId,
            this.buildNotificationMessage(
              parsedTopic.line,
              parsedTopic.sense,
              bus,
            ),
          );
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        this.logger.error(
          `No pude procesar la notificacion de tramo para ${subscription.chatId}: ${errorMessage}`,
        );
      }
    }

    this.cleanupOldNotifications();
  }

  private shouldNotify(
    chatId: string,
    topic: string,
    bus: SegmentBus,
  ): boolean {
    const identifier = this.getBusIdentifier(bus);
    const key = `${chatId}:${topic}:${identifier}`;
    const now = Date.now();
    const lastNotification = this.sentNotifications.get(key);

    if (lastNotification && now - lastNotification < this.cooldownMs) {
      return false;
    }

    this.sentNotifications.set(key, now);
    return true;
  }

  private getBusIdentifier(bus: SegmentBus): string {
    if (bus.coche && bus.servicio) {
      return `${bus.coche}:${bus.servicio}`;
    }

    if (bus.coche) {
      return bus.coche;
    }

    return `${bus.lat ?? 'na'}:${bus.lon ?? 'na'}`;
  }

  private buildNotificationMessage(
    line: string,
    sense: 'I' | 'V',
    bus: SegmentBus,
  ): string {
    const locality = bus.localidad_nombre ?? 'la localidad previa';
    const busCode = bus.coche ? ` ${bus.coche}` : '';
    const direction = sense === 'I' ? 'ida' : 'vuelta';

    return [
      '🔔 *Aviso de tramo*',
      `La línea ${line} (${direction})${busCode ? `, coche ${busCode.trim()}` : ''} ya está en *${locality}* (localidad previa).`,
      bus.tiempo ? `⏱️ Tiempo reportado: ${bus.tiempo}` : '',
    ]
      .filter(Boolean)
      .join('\n');
  }

  private cleanupOldNotifications() {
    const now = Date.now();

    for (const [key, timestamp] of this.sentNotifications.entries()) {
      if (now - timestamp > this.cooldownMs) {
        this.sentNotifications.delete(key);
      }
    }
  }
}
