import * as qrcode from 'qrcode-terminal';
import {
  Client,
  Contact,
  Message,
  MessageMedia,
  MessageSendOptions,
} from 'whatsapp-web.js';

import {
  Injectable,
  OnModuleInit,
  OnApplicationBootstrap,
  Logger,
  Inject,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { WHATSAPP_CLIENT } from './whatsapp.provider';
import {
  WHATSAPP_LIFECYCLE_EVENTS,
  type WhatsappAuthenticatedEvent,
  type WhatsappAuthFailureEvent,
  type WhatsappChangeStateEvent,
  type WhatsappDisconnectedEvent,
  type WhatsappReadyEvent,
} from './whatsapp-lifecycle.events';
import { sleep } from '@shared/utils/sleep.util';

@Injectable()
export class WhatsappService
  implements OnModuleInit, OnApplicationBootstrap, OnApplicationShutdown
{
  private readonly logger = new Logger(WhatsappService.name, {
    timestamp: true,
  });

  private isShuttingDown = false;
  private readonly outboundQueue = new Map<string, Promise<void>>();
  private readonly cachedAddressbookNumbers = new Set<string>();
  private readonly failedAddressbookNumbers = new Set<string>();

  constructor(
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
    @Inject(WHATSAPP_CLIENT) private readonly client: Client,
  ) {}

  onModuleInit() {
    const authMode = this.configService
      .get<string>('WHATSAPP_AUTH_MODE')
      ?.trim();
    const clientId =
      this.configService.get<string>('WHATSAPP_CLIENT_ID')?.trim() || 'cliente';

    this.logger.log(
      `Inicializando cliente de WhatsApp con auth=${authMode || 'sin-definir'} y clientId=${clientId || 'cliente'}.`,
    );

    this.client.on('qr', (qr: string) => {
      this.logger.log(`Escaneá el QR: `);
      qrcode.generate(qr, { small: true });
    });

    this.client.on('authenticated', () => {
      this.logger.log('Sesion autenticada correctamente.');
      const payload: WhatsappAuthenticatedEvent = { clientId };

      this.eventEmitter.emit(WHATSAPP_LIFECYCLE_EVENTS.authenticated, payload);
    });

    this.client.on('auth_failure', (message: string) => {
      this.logger.error(`Fallo la autenticacion de WhatsApp: ${message}`);
      const payload: WhatsappAuthFailureEvent = {
        clientId,
        message,
      };

      this.eventEmitter.emit(WHATSAPP_LIFECYCLE_EVENTS.authFailure, payload);
    });

    this.client.on('loading_screen', (percent: number, message: string) => {
      this.logger.log(`Cargando WhatsApp (${percent}%): ${message}`);
    });

    this.client.on('change_state', (state: string) => {
      this.logger.log(`Cambio de estado del cliente: ${state}`);
      const payload: WhatsappChangeStateEvent = {
        clientId,
        state,
      };

      this.eventEmitter.emit(WHATSAPP_LIFECYCLE_EVENTS.changeState, payload);
    });

    this.client.on('ready', () => {
      this.logger.log('El cliente está listo para recibir mensajes!!');
      const payload: WhatsappReadyEvent = { clientId };

      this.eventEmitter.emit(WHATSAPP_LIFECYCLE_EVENTS.ready, payload);
    });

    this.client.on('disconnected', (reason: string) => {
      this.logger.warn(`Cliente desconectado de WhatsApp: ${reason}`);
      const payload: WhatsappDisconnectedEvent = {
        clientId,
        reason,
      };

      this.eventEmitter.emit(WHATSAPP_LIFECYCLE_EVENTS.disconnected, payload);
    });

    this.client.on('remote_session_saved', () => {
      this.logger.log('Sesión remota guardada en MongoDB.');
    });

    this.client.on('message', (message: Message) => {
      void this.syncContactAddressbook(message);
      this.eventEmitter.emit('whatsapp.message', message);
    });
  }

  onApplicationBootstrap() {
    void this.initializeClient();
  }

  async onApplicationShutdown(signal?: string) {
    this.isShuttingDown = true;
    this.logger.log(
      `Apagando cliente de WhatsApp${signal ? ` por ${signal}` : ''}.`,
    );

    try {
      await this.client.destroy();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.warn(
        `No se pudo destruir el cliente de WhatsApp: ${message}`,
      );
    }
  }

  private async initializeClient() {
    try {
      await this.client.initialize();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      if (!this.isShuttingDown) {
        this.logger.error(
          `Fallo la inicializacion del cliente de WhatsApp: ${message}`,
        );
      }
    }
  }

  async sendMessage(to: string, body: string) {
    await this.enqueueOutboundMessage(to, body.length, async () => {
      await this.client.sendMessage(to, body);
    });
  }

  async sendSeen(to: string) {
    await this.client.sendSeen(to);
  }

  async sendPhotoWithCaption(
    to: string,
    media: MessageMedia,
    caption?: string,
  ) {
    await this.enqueueOutboundMessage(to, caption?.length ?? 0, async () => {
      await this.client.sendMessage(to, media, {
        caption,
      });
    });
  }

  async sendMediaToSticker(
    to: string,
    media: MessageMedia,
    options: MessageSendOptions,
  ) {
    await this.enqueueOutboundMessage(to, 32, async () => {
      await this.client.sendMessage(to, media, options);
    });
  }

  private async enqueueOutboundMessage(
    to: string,
    messageLength: number,
    action: () => Promise<void>,
  ) {
    const previous = this.outboundQueue.get(to) ?? Promise.resolve();

    const next = previous
      .catch(() => undefined)
      .then(async () => {
        await this.simulateHumanDelivery(to, messageLength);
        await action();
      })
      .finally(() => {
        if (this.outboundQueue.get(to) === next) {
          this.outboundQueue.delete(to);
        }
      });

    this.outboundQueue.set(to, next);
    await next;
  }

  private async simulateHumanDelivery(to: string, messageLength: number) {
    await sleep(this.randomInt(900, 2800));
    await this.trySendSeen(to);
    await sleep(this.randomInt(200, 700));

    try {
      const chat = await this.client.getChatById(to);
      await chat.sendStateTyping();

      try {
        await sleep(this.getTypingDurationMs(messageLength));
      } finally {
        await chat.clearState();
      }
    } catch (error) {
      this.logger.warn(
        `No se pudo simular typing para ${to}: ${this.formatError(error)}`,
      );
    }

    await sleep(this.randomInt(100, 450));
  }

  private getTypingDurationMs(messageLength: number): number {
    const boundedLength = Math.max(1, Math.min(messageLength, 500));
    const byTextLength = boundedLength * this.randomInt(25, 45);

    return Math.max(900, Math.min(byTextLength, 7000));
  }

  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private async trySendSeen(to: string) {
    try {
      await this.client.sendSeen(to);
    } catch (error) {
      this.logger.warn(
        `No se pudo enviar estado seen a ${to}: ${this.formatError(error)}`,
      );
    }
  }

  private async syncContactAddressbook(message: Message) {
    const contactId = this.resolveContactId(message);
    if (!contactId) {
      return;
    }

    try {
      const contact = await this.client.getContactById(contactId);
      if (!contact.isUser || contact.isMe) {
        return;
      }

      if (contact.isMyContact) {
        this.cachedAddressbookNumbers.add(contact.number);
        return;
      }

      if (this.cachedAddressbookNumbers.has(contact.number)) {
        return;
      }

      if (this.failedAddressbookNumbers.has(contact.number)) {
        return;
      }

      const { firstName, lastName } = this.buildAddressbookName(contact);

      await this.client.saveOrEditAddressbookContact(
        contact.number,
        firstName,
        lastName,
        true,
      );

      this.cachedAddressbookNumbers.add(contact.number);
      this.logger.log(
        `Contacto agendado automaticamente: ${contact.number} (${firstName} ${lastName})`,
      );
    } catch (error) {
      this.logger.warn(
        `No se pudo agendar el contacto de ${contactId}: ${this.formatError(error)}`,
      );

      const number = this.extractPhoneNumber(contactId);
      if (number) {
        this.failedAddressbookNumbers.add(number);
      }
    }
  }

  private resolveContactId(message: Message): string | undefined {
    if (message.from.endsWith('@c.us') || message.from.endsWith('@lid')) {
      return message.from;
    }

    if (message.from.endsWith('@g.us')) {
      return message.author;
    }

    return undefined;
  }

  private buildAddressbookName(contact: Contact): {
    firstName: string;
    lastName: string;
  } {
    const baseName =
      contact.pushname?.trim() ||
      contact.name?.trim() ||
      contact.shortName?.trim() ||
      `Contacto ${contact.number.slice(-4)}`;

    const cleanName = baseName.replace(/\s+/g, ' ').trim();
    const [firstNameRaw, ...lastNameParts] = cleanName.split(' ');

    const firstName = firstNameRaw || 'Contacto';
    const lastName =
      lastNameParts.join(' ').trim() ||
      this.getDefaultLastName(contact.number.slice(-4));

    return {
      firstName,
      lastName,
    };
  }

  private getDefaultLastName(numberSuffix: string): string {
    return `Whatsapp ${numberSuffix}`;
  }

  private extractPhoneNumber(contactId: string): string | undefined {
    const [number] = contactId.split('@');
    return number || undefined;
  }

  private formatError(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
  }
}
