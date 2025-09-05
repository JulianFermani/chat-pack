import { Injectable, OnModuleInit, Logger, Inject } from '@nestjs/common';
import { Client } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
import { WHATSAPP_CLIENT } from './whatsapp.provider';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class WhatsappService implements OnModuleInit {
  private readonly logger = new Logger(WhatsappService.name, {
    timestamp: true,
  });

  constructor(
    private readonly eventEmitter: EventEmitter2,
    @Inject(WHATSAPP_CLIENT) private readonly client: Client,
  ) {}

  onModuleInit() {
    this.client.on('qr', (qr: string) => {
      this.logger.log(`Escaneá el QR: `);
      qrcode.generate(qr, { small: true });
    });

    this.client.on('ready', () => {
      this.logger.log('El cliente está listo para recibir mensajes!!');
    });

    this.client.on('remote_session_saved', () => {
      this.logger.log('Sesión remota guardada en MongoDB.');
    });

    this.client.on('message', (message) => {
      this.eventEmitter.emit('whatsapp.message', message);
    });

    void this.client.initialize();
  }

  async sendMessage(to: string, body: string) {
    await this.client.sendMessage(to, body);
  }

  async sendSeen(to: string) {
    await this.client.sendSeen(to);
  }
}
