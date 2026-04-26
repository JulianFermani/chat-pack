import { Message } from 'whatsapp-web.js';

import { Injectable } from '@nestjs/common';

import { WhatsappService } from '@client/whatsapp.service';
import { UserSession } from '@session/user-session.interface';
import { State } from '@shared/interfaces/state.interface';
import { seeBusCookieFetcher } from '../../infra/cookie-fetcher.service';
import { fetchSegmentTracking } from '../../infra/segment-bus-tracker.service';
import { resolvePreviousLocality } from '../../infra/segment-route.util';
import { SegmentAlertEnumCommands } from '../enum/commands.enum';
import { SegmentAlertSessionData } from '../segment-alert.session';
import { SegmentAlertSubscriptionService } from '../segment-alert-subscription.service';

@Injectable()
export class SegmentAlertLineAndSenseState
  implements State<SegmentAlertSessionData>
{
  readonly stepId = SegmentAlertEnumCommands.LINE_AND_SENSE;

  constructor(
    private readonly whatsapp: WhatsappService,
    private readonly subscriptionService: SegmentAlertSubscriptionService,
  ) {}

  async handle(
    message: Message,
    session: UserSession<SegmentAlertSessionData>,
  ) {
    const parsedValue = this.parseLineAndSense(message.body);

    if (!parsedValue) {
      await this.whatsapp.sendMessage(
        message.from,
        'Formato invalido. Envia: *numero_linea sentido* (ejemplo: *35 I*).',
      );
      return session;
    }

    const subscriptionResult = await this.subscriptionService.subscribeChat(
      message.from,
      {
        originGobId: session.data.idOrigin,
        destinationGobId: session.data.idDestination,
        line: parsedValue.line,
        sense: parsedValue.sense,
      },
    );

    const previousLocalityName = await this.tryGetPreviousLocalityName(
      session.data.idOrigin,
      session.data.idDestination,
      parsedValue.line,
      parsedValue.sense,
    );

    const directionText = parsedValue.sense === 'I' ? 'ida' : 'vuelta';
    const resultTextByStatus = {
      'already-active': 'Ya estabas suscripto a esta alerta de tramo.',
      reactivated: 'Volviste a suscribirte a esta alerta de tramo.',
      created: 'Listo. Te suscribi a esta alerta de tramo.',
    };

    const lines = [
      resultTextByStatus[subscriptionResult],
      `📌 Linea: ${parsedValue.line} (${directionText})`,
      previousLocalityName
        ? `🔔 Te voy a avisar cuando el coche entre en *${previousLocalityName}* (localidad previa).`
        : '🔔 Te voy a avisar cuando el coche entre en la localidad previa al destino.',
      'Para desuscribirte de todas las alertas de tramos en este chat usa */desuscribirmeTramos*.',
    ];

    await this.whatsapp.sendMessage(message.from, lines.join('\n'));
    return;
  }

  private parseLineAndSense(
    value: string,
  ): { line: string; sense: 'I' | 'V' } | undefined {
    const sanitized = value.trim().toUpperCase();
    const match = sanitized.match(/^(\d+)\s*([IV])$/);

    if (!match) {
      return;
    }

    return {
      line: match[1],
      sense: match[2] as 'I' | 'V',
    };
  }

  private async tryGetPreviousLocalityName(
    originGobId: string,
    destinationGobId: string,
    line: string,
    sense: 'I' | 'V',
  ): Promise<string | undefined> {
    try {
      const cookie = await seeBusCookieFetcher();
      const trackingData = await fetchSegmentTracking(cookie, {
        originGobId,
        destinationGobId,
        line,
        sense,
      });

      return resolvePreviousLocality(trackingData.routeDetail, destinationGobId)
        ?.name;
    } catch {
      return;
    }
  }
}
