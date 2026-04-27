import { Injectable } from '@nestjs/common';

import { TinCardRepository } from './tin-card.repository';

export type RegisterTinResult = 'created' | 'updated';
export type DeleteTinResult = 'deleted' | 'not-found';

@Injectable()
export class TinCardService {
  constructor(private readonly repository: TinCardRepository) {}

  async registerTin(chatId: string, tin: string): Promise<RegisterTinResult> {
    const existingTinCard = await this.repository.findByChatId(chatId);

    await this.repository.upsert(chatId, tin);

    return existingTinCard ? 'updated' : 'created';
  }

  async findTinByChatId(chatId: string): Promise<string | undefined> {
    const tinCard = await this.repository.findByChatId(chatId);

    return tinCard?.tin;
  }

  async deleteTinByChatId(chatId: string): Promise<DeleteTinResult> {
    const wasDeleted = await this.repository.deleteByChatId(chatId);

    return wasDeleted ? 'deleted' : 'not-found';
  }
}
