import { Module } from '@nestjs/common';
import { TeacherRepository } from './teacher.repository';
import { TeacherWalletService } from './services/teacher-wallet.service';

@Module({
  providers: [TeacherRepository, TeacherWalletService],
  exports: [TeacherRepository, TeacherWalletService],
})
export class TeacherModule {}
