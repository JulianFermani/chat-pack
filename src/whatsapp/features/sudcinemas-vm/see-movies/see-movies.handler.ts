import { Message } from 'whatsapp-web.js';
import { seeMovieSender } from './services/see-movies-sender.service';
import { Injectable } from '@nestjs/common';
import { WhatsappService } from 'src/whatsapp/application/whatsapp.service';

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
