import * as qrcode from 'qrcode-terminal';
import { Client, MessageMedia, MessageSendOptions } from 'whatsapp-web.js';

import {
  Injectable,
  OnModuleInit,
  Logger,
  Inject,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { WHATSAPP_CLIENT } from './whatsapp.provider';

@Injectable()
export class WhatsappService implements OnModuleInit, OnApplicationShutdown {
  private readonly logger = new Logger(WhatsappService.name, {
    timestamp: true,
  });

  private isShuttingDown = false;

  constructor(
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
    @Inject(WHATSAPP_CLIENT) private readonly client: Client,
  ) {}

  onModuleInit() {
    const authMode = this.configService
      .get<string>('WHATSAPP_AUTH_MODE')
      ?.trim();
    const clientId = this.configService
      .get<string>('WHATSAPP_CLIENT_ID')
      ?.trim();

    this.logger.log(
      `Inicializando cliente de WhatsApp con auth=${authMode || 'sin-definir'} y clientId=${clientId || 'cliente'}.`,
    );

    this.client.on('qr', (qr: string) => {
      this.logger.log(`Escaneá el QR: `);
      qrcode.generate(qr, { small: true });
    });

    this.client.on('authenticated', () => {
      this.logger.log('Sesion autenticada correctamente.');
    });

    this.client.on('auth_failure', (message: string) => {
      this.logger.error(`Fallo la autenticacion de WhatsApp: ${message}`);
    });

    this.client.on('loading_screen', (percent: number, message: string) => {
      this.logger.log(`Cargando WhatsApp (${percent}%): ${message}`);
    });

    this.client.on('change_state', (state: string) => {
      this.logger.log(`Cambio de estado del cliente: ${state}`);
    });

    this.client.on('ready', () => {
      this.logger.log('El cliente está listo para recibir mensajes!!');
    });

    this.client.on('disconnected', (reason: string) => {
      this.logger.warn(`Cliente desconectado de WhatsApp: ${reason}`);
    });

    this.client.on('remote_session_saved', () => {
      this.logger.log('Sesión remota guardada en MongoDB.');
    });

    this.client.on('message', (message) => {
      this.eventEmitter.emit('whatsapp.message', message);
    });

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
    await this.client.sendMessage(to, body);
  }

  async sendSeen(to: string) {
    await this.client.sendSeen(to);
  }

  async sendPhotoWithCaption(
    to: string,
    media: MessageMedia,
    caption?: string,
  ) {
    await this.client.sendMessage(to, media, {
      caption: caption,
    });
  }

  async sendMediaToSticker(
    to: string,
    media: MessageMedia,
    options: MessageSendOptions,
  ) {
    await this.client.sendMessage(to, media, options);
  }
}
