import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';

import {
  WHATSAPP_LIFECYCLE_EVENTS,
  type WhatsappAuthFailureEvent,
  type WhatsappChangeStateEvent,
  type WhatsappDisconnectedEvent,
  type WhatsappReadyEvent,
} from '../whatsapp/client/whatsapp-lifecycle.events';
import { NtfyNotifierService } from './ntfy-notifier.service';

const HEALTHY_STATES = new Set(['CONNECTED']);
const TRANSITION_STATES = new Set(['OPENING', 'PAIRING', 'TIMEOUT']);
const DEGRADED_STATES = new Set([
  'CONFLICT',
  'DEPRECATED_VERSION',
  'PROXYBLOCK',
  'SMB_TOS_BLOCK',
  'TOS_BLOCK',
  'UNLAUNCHED',
  'UNPAIRED',
  'UNPAIRED_IDLE',
]);

@Injectable()
export class WhatsappStatusMonitorService {
  private readonly logger = new Logger(WhatsappStatusMonitorService.name);
  private readonly appName: string;

  private currentState = 'UNKNOWN';
  private lastProblemKey?: string;
  private lastProblemDescription?: string;
  private isDegraded = false;
  private hasSentStartupNotification = false;

  constructor(
    private readonly configService: ConfigService,
    private readonly ntfyNotifier: NtfyNotifierService,
  ) {
    this.appName =
      this.configService.get<string>('APP_NAME')?.trim() || 'Chat Pack';
  }

  @OnEvent(WHATSAPP_LIFECYCLE_EVENTS.changeState)
  async handleStateChange(event: WhatsappChangeStateEvent): Promise<void> {
    this.currentState = event.state;

    if (HEALTHY_STATES.has(event.state)) {
      await this.notifyStartup(event.clientId, event.state, 'change_state');
      await this.notifyRecovery(event.clientId, event.state, 'change_state');
      return;
    }

    if (TRANSITION_STATES.has(event.state)) {
      return;
    }

    if (DEGRADED_STATES.has(event.state)) {
      await this.notifyProblem({
        clientId: event.clientId,
        problemKey: `state:${event.state}`,
        status: event.state,
        eventName: 'change_state',
        detail: event.state,
      });
    }
  }

  @OnEvent(WHATSAPP_LIFECYCLE_EVENTS.authFailure)
  async handleAuthFailure(event: WhatsappAuthFailureEvent): Promise<void> {
    await this.notifyProblem({
      clientId: event.clientId,
      problemKey: 'auth_failure',
      status: this.currentState,
      eventName: 'auth_failure',
      detail: event.message,
    });
  }

  @OnEvent(WHATSAPP_LIFECYCLE_EVENTS.disconnected)
  async handleDisconnected(event: WhatsappDisconnectedEvent): Promise<void> {
    this.currentState = event.reason;

    await this.notifyProblem({
      clientId: event.clientId,
      problemKey: `disconnected:${event.reason}`,
      status: event.reason,
      eventName: 'disconnected',
      detail: event.reason,
    });
  }

  @OnEvent(WHATSAPP_LIFECYCLE_EVENTS.ready)
  async handleReady(event: WhatsappReadyEvent): Promise<void> {
    this.currentState = 'CONNECTED';
    await this.notifyStartup(event.clientId, 'CONNECTED', 'ready');
    await this.notifyRecovery(event.clientId, 'CONNECTED', 'ready');
  }

  private async notifyStartup(
    clientId: string,
    state: string,
    eventName: string,
  ): Promise<void> {
    if (this.hasSentStartupNotification) {
      return;
    }

    this.hasSentStartupNotification = true;

    const message = [
      `${this.appName} | WhatsApp iniciado`,
      `Estado: ${state}`,
      `Evento: ${eventName}`,
      `Cliente: ${clientId}`,
      `Hora: ${this.formatTimestamp()}`,
    ].join('\n');

    await this.sendNotification(message);
  }

  private async notifyProblem(params: {
    clientId: string;
    problemKey: string;
    status: string;
    eventName: string;
    detail: string;
  }): Promise<void> {
    if (this.lastProblemKey === params.problemKey) {
      return;
    }

    this.isDegraded = true;
    this.lastProblemKey = params.problemKey;
    this.lastProblemDescription = params.status;

    const message = [
      `${this.appName} | WhatsApp degradado`,
      `Estado: ${params.status}`,
      `Evento: ${params.eventName}`,
      `Detalle: ${params.detail}`,
      `Cliente: ${params.clientId}`,
      `Hora: ${this.formatTimestamp()}`,
    ].join('\n');

    await this.sendNotification(message);
  }

  private async notifyRecovery(
    clientId: string,
    recoveredState: string,
    eventName: string,
  ): Promise<void> {
    if (!this.isDegraded) {
      return;
    }

    const previousState = this.lastProblemDescription || 'UNKNOWN';

    this.isDegraded = false;
    this.lastProblemKey = undefined;
    this.lastProblemDescription = undefined;

    const message = [
      `${this.appName} | WhatsApp recuperado`,
      `Estado actual: ${recoveredState}`,
      `Evento: ${eventName}`,
      `Recuperado de: ${previousState}`,
      `Cliente: ${clientId}`,
      `Hora: ${this.formatTimestamp()}`,
    ].join('\n');

    await this.sendNotification(message);
  }

  private async sendNotification(message: string): Promise<void> {
    if (!this.ntfyNotifier.isConfigured()) {
      this.logger.warn(
        `Alerta omitida por ntfy no configurado:\n${message}`,
      );
      return;
    }

    try {
      await this.ntfyNotifier.sendMessage(message);
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);

      this.logger.error(`No se pudo enviar la alerta a ntfy: ${detail}`);
    }
  }

  private formatTimestamp(): string {
    return new Intl.DateTimeFormat('es-AR', {
      dateStyle: 'short',
      timeStyle: 'medium',
      timeZone: 'America/Argentina/Buenos_Aires',
    }).format(new Date());
  }
}
