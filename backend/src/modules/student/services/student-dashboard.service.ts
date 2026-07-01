import { Injectable } from '@nestjs/common';
import { StudentRepository } from '../student.repository';

@Injectable()
export class StudentDashboardService {
  constructor(private readonly repo: StudentRepository) {}

  async getDashboardWidgets(userId: string) {
    const stats = await this.repo.getStudentStatistics(userId);
    const streak = await this.repo.getStreak(userId);
    // In a full implementation, this aggregates Reminders, Continue Learning, etc.
    return {
      stats,
      streak,
    };
  }
}
