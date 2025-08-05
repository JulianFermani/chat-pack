import { Message, Client } from 'whatsapp-web.js';
import { seeMovieSender } from './services/see-movies-sender.service';

export class SeeMoviesHandler {
  static async handle(message: Message, client: Client): Promise<void> {
    switch (true) {
      case true:
        return seeMovieSender(message, client);
    }
  }
}
