import { Module } from '@nestjs/common';
import { AdminRepository } from './admin.repository';
import { AdminPlatformService } from './services/admin-platform.service';
import { AcademicYearController } from './controllers/academic-year.controller';
import { AcademicYearService } from './services/academic-year.service';

@Module({
  controllers: [AcademicYearController],
  providers: [AdminRepository, AdminPlatformService, AcademicYearService],
  exports: [AdminRepository, AdminPlatformService],
})
export class AdminModule {}
