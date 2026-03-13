import { Message } from 'whatsapp-web.js';

import { Injectable } from '@nestjs/common';

import { seeMovieSender } from './services/see-movies-sender.service';
import { WhatsappService } from '@application/whatsapp.service';

@Injectable()
export class SeeMoviesHandler {
  constructor(private readonly whatsappClient: WhatsappService) {}
  async handle(message: Message): Promise<void> {
    switch (true) {
      case true:
        return seeMovieSender(message, this.whatsappClient);
    }
  }
}
