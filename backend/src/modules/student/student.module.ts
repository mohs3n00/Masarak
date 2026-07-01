import { Module } from '@nestjs/common';
import { StudentRepository } from './student.repository';
import { StudentDashboardService } from './services/student-dashboard.service';
import { StudentAnalyticsService } from './services/student-analytics.service';
// import { StudentLearningService } from './services/student-learning.service';
// import { StudentGamificationService } from './services/student-gamification.service';

@Module({
  controllers: [],
  providers: [
    StudentRepository,
    StudentDashboardService,
    StudentAnalyticsService,
  ],
  exports: [
    StudentRepository,
    StudentDashboardService,
    StudentAnalyticsService,
  ],
})
export class StudentModule {}
