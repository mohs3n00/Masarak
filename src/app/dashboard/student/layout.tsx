import { ReactNode } from 'react';
import { StudentSidebar } from '@/components/dashboard/student/StudentSidebar';
import { TopNav } from '@/components/dashboard/student/TopNav';

export default function StudentDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface">
      <StudentSidebar />
      
      {/* Main Content Wrapper - Push content right on desktop */}
      <div className="flex flex-col md:ps-60 min-h-screen">
        <TopNav />
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
