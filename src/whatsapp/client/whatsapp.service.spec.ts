import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Client, MessageMedia } from 'whatsapp-web.js';

import { WhatsappService } from './whatsapp.service';

describe('WhatsappService', () => {
  it('sends generic media with optional caption through the outbound queue', async () => {
    const client = {
      sendMessage: jest.fn().mockResolvedValue(undefined),
    } as unknown as Client;
    const service = new WhatsappService(
      {} as ConfigService,
      {} as EventEmitter2,
      client,
    );
    jest
      .spyOn(service as any, 'simulateHumanDelivery')
      .mockResolvedValue(undefined);

    const media = new MessageMedia('video/mp4', 'ZmFrZQ==', 'video.mp4');

    await service.sendMediaWithCaption('user@c.us', media, 'caption');

    expect(client.sendMessage).toHaveBeenCalledWith('user@c.us', media, {
      caption: 'caption',
    });
  });
});
