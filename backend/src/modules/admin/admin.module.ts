import { Module } from '@nestjs/common';
import { AdminRepository } from './admin.repository';
import { AdminPlatformService } from './services/admin-platform.service';

@Module({
  providers: [AdminRepository, AdminPlatformService],
  exports: [AdminRepository, AdminPlatformService],
})
export class AdminModule {}
