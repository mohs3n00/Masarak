import { Injectable } from '@nestjs/common';
import { TeacherRepository } from '../teacher.repository';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class TeacherWalletService {
  constructor(private readonly repo: TeacherRepository) {}

  /**
   * Listens for an order being completed to extract revenue for the teacher.
   */
  @OnEvent('order.completed')
  async handleOrderCompleted(payload: {
    teacherId: string;
    netAmount: number;
  }) {
    // Platform takes 15%, teacher takes 85%
    const teacherCut = payload.netAmount * 0.85;
    await this.repo.creditWallet(payload.teacherId, teacherCut);
  }
}
