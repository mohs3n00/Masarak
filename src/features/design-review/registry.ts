export type ReviewCategory = 'Dashboards' | 'Components' | 'Authentication' | 'Settings' | 'Community' | 'Course Engine';

export interface ReviewConfig {
  title: string;
  category: ReviewCategory;
  path: string;
  order: number;
  status: 'Draft' | 'WIP' | 'Implemented';
}

export const reviewRegistry: ReviewConfig[] = [
  {
    title: 'Student Dashboard',
    category: 'Dashboards',
    path: '/design-review/student-dashboard',
    order: 1,
    status: 'Implemented'
  },
  {
    title: 'My Courses',
    category: 'Course Engine',
    path: '/design-review/courses',
    order: 2,
    status: 'Implemented'
  },
  {
    title: 'Course Details Preview',
    category: 'Course Engine',
    path: '/design-review/course-details',
    order: 3,
    status: 'Implemented'
  },
  {
    title: 'Certificates',
    category: 'Course Engine',
    path: '/design-review/certificates',
    order: 4,
    status: 'Implemented'
  },
  {
    title: 'Bookmarks',
    category: 'Dashboards',
    path: '/design-review/bookmarks',
    order: 5,
    status: 'Implemented'
  },
  {
    title: 'Notifications',
    category: 'Dashboards',
    path: '/design-review/notifications',
    order: 6,
    status: 'Implemented'
  },
  {
    title: 'Student Profile',
    category: 'Dashboards',
    path: '/design-review/profile',
    order: 7,
    status: 'Implemented'
  },
  {
    title: 'Component Gallery',
    category: 'Components',
    path: '/design-review/components',
    order: 1,
    status: 'Implemented'
  },
  {
    title: 'المفضلة',
    category: 'Dashboards',
    path: '/design-review/dashboard-student-wishlist',
    order: 10,
    status: 'Implemented'
  },
  {
    title: 'ملاحظاتي',
    category: 'Course Engine',
    path: '/design-review/dashboard-student-notes',
    order: 11,
    status: 'Implemented'
  },
  {
    title: 'التحميلات',
    category: 'Course Engine',
    path: '/design-review/dashboard-student-downloads',
    order: 12,
    status: 'Implemented'
  },
  {
    title: 'الإعدادات',
    category: 'Settings',
    path: '/design-review/dashboard-student-settings',
    order: 13,
    status: 'Implemented'
  },
  {
    title: 'مشغل الكورس',
    category: 'Course Engine',
    path: '/design-review/course-[slug]-player',
    order: 14,
    status: 'Implemented'
  },
  {
    title: 'كورساتي',
    category: 'Course Engine',
    path: '/design-review/dashboard-teacher-courses',
    order: 15,
    status: 'Implemented'
  },
  {
    title: 'بناء كورس جديد',
    category: 'Course Engine',
    path: '/design-review/dashboard-teacher-courses-create',
    order: 16,
    status: 'Implemented'
  },
  {
    title: 'الطلاب',
    category: 'Dashboards',
    path: '/design-review/dashboard-teacher-students',
    order: 17,
    status: 'Implemented'
  },
  {
    title: 'التحليلات',
    category: 'Dashboards',
    path: '/design-review/dashboard-teacher-analytics',
    order: 18,
    status: 'Implemented'
  },
  {
    title: 'الأرباح',
    category: 'Dashboards',
    path: '/design-review/dashboard-teacher-revenue',
    order: 19,
    status: 'Implemented'
  },
  {
    title: 'المحفظة',
    category: 'Dashboards',
    path: '/design-review/dashboard-teacher-wallet',
    order: 20,
    status: 'Implemented'
  },
  {
    title: 'السحوبات',
    category: 'Dashboards',
    path: '/design-review/dashboard-teacher-payouts',
    order: 21,
    status: 'Implemented'
  },
  {
    title: 'التقييمات',
    category: 'Course Engine',
    path: '/design-review/dashboard-teacher-reviews',
    order: 22,
    status: 'Implemented'
  },
  {
    title: 'الإعلانات',
    category: 'Dashboards',
    path: '/design-review/dashboard-teacher-announcements',
    order: 23,
    status: 'Implemented'
  },
  {
    title: 'التقويم',
    category: 'Dashboards',
    path: '/design-review/dashboard-teacher-calendar',
    order: 24,
    status: 'Implemented'
  },
  {
    title: 'الملف الشخصي',
    category: 'Settings',
    path: '/design-review/dashboard-teacher-profile',
    order: 25,
    status: 'Implemented'
  },
  {
    title: 'الإعدادات',
    category: 'Settings',
    path: '/design-review/dashboard-teacher-settings',
    order: 26,
    status: 'Implemented'
  },
  {
    title: 'المستخدمين',
    category: 'Dashboards',
    path: '/design-review/dashboard-admin-users',
    order: 27,
    status: 'Implemented'
  },
  {
    title: 'الطلاب',
    category: 'Dashboards',
    path: '/design-review/dashboard-admin-students',
    order: 28,
    status: 'Implemented'
  },
  {
    title: 'المعلمين',
    category: 'Dashboards',
    path: '/design-review/dashboard-admin-teachers',
    order: 29,
    status: 'Implemented'
  },
  {
    title: 'الكورسات',
    category: 'Course Engine',
    path: '/design-review/dashboard-admin-courses',
    order: 30,
    status: 'Implemented'
  },
  {
    title: 'التصنيفات',
    category: 'Dashboards',
    path: '/design-review/dashboard-admin-categories',
    order: 31,
    status: 'Implemented'
  },
  {
    title: 'المواد الدراسية',
    category: 'Dashboards',
    path: '/design-review/dashboard-admin-subjects',
    order: 32,
    status: 'Implemented'
  },
  {
    title: 'الهيكل الأكاديمي',
    category: 'Dashboards',
    path: '/design-review/dashboard-admin-academic',
    order: 33,
    status: 'Implemented'
  },
  {
    title: 'الكوبونات',
    category: 'Dashboards',
    path: '/design-review/dashboard-admin-coupons',
    order: 34,
    status: 'Implemented'
  },
  {
    title: 'الطلبات',
    category: 'Dashboards',
    path: '/design-review/dashboard-admin-orders',
    order: 35,
    status: 'Implemented'
  },
  {
    title: 'المدفوعات',
    category: 'Dashboards',
    path: '/design-review/dashboard-admin-payments',
    order: 36,
    status: 'Implemented'
  },
  {
    title: 'التقارير',
    category: 'Dashboards',
    path: '/design-review/dashboard-admin-reports',
    order: 37,
    status: 'Implemented'
  },
  {
    title: 'التحليلات',
    category: 'Dashboards',
    path: '/design-review/dashboard-admin-analytics',
    order: 38,
    status: 'Implemented'
  },
  {
    title: 'إعدادات الميزات',
    category: 'Settings',
    path: '/design-review/dashboard-admin-flags',
    order: 39,
    status: 'Implemented'
  },
  {
    title: 'الإشعارات',
    category: 'Dashboards',
    path: '/design-review/dashboard-admin-notifications',
    order: 40,
    status: 'Implemented'
  },
  {
    title: 'الإعدادات العامة',
    category: 'Settings',
    path: '/design-review/dashboard-admin-settings',
    order: 41,
    status: 'Implemented'
  },
  {
    title: 'مكتبة الوسائط',
    category: 'Dashboards',
    path: '/design-review/dashboard-admin-media',
    order: 42,
    status: 'Implemented'
  },
  {
    title: 'سجل النظام',
    category: 'Settings',
    path: '/design-review/dashboard-admin-audit',
    order: 43,
    status: 'Implemented'
  },
  {
    title: 'تذاكر الدعم',
    category: 'Dashboards',
    path: '/design-review/dashboard-admin-support',
    order: 44,
    status: 'Implemented'
  },
  {
    title: 'المجتمع',
    category: 'Community',
    path: '/design-review/community-feed',
    order: 45,
    status: 'Implemented'
  },
  {
    title: 'تفاصيل المنشور',
    category: 'Community',
    path: '/design-review/community-post-[id]',
    order: 46,
    status: 'Implemented'
  },
  {
    title: 'إنشاء منشور',
    category: 'Community',
    path: '/design-review/community-create',
    order: 47,
    status: 'Implemented'
  },
  {
    title: 'التعليقات',
    category: 'Community',
    path: '/design-review/community-comments',
    order: 48,
    status: 'Implemented'
  },
  {
    title: 'الإشعارات',
    category: 'Community',
    path: '/design-review/community-notifications',
    order: 49,
    status: 'Implemented'
  },
  {
    title: 'بحث المجتمع',
    category: 'Community',
    path: '/design-review/community-search',
    order: 50,
    status: 'Implemented'
  },
  {
    title: 'المحفوظات',
    category: 'Community',
    path: '/design-review/community-saved',
    order: 51,
    status: 'Implemented'
  },
  {
    title: 'الشائع',
    category: 'Community',
    path: '/design-review/community-trending',
    order: 52,
    status: 'Implemented'
  },
  {
    title: 'إعادة تعيين كلمة المرور',
    category: 'Authentication',
    path: '/design-review/reset-password',
    order: 53,
    status: 'Implemented'
  },
  {
    title: 'تأكيد البريد',
    category: 'Authentication',
    path: '/design-review/verify-email',
    order: 54,
    status: 'Implemented'
  },
  {
    title: 'رمز التحقق',
    category: 'Authentication',
    path: '/design-review/otp',
    order: 55,
    status: 'Implemented'
  },
  {
    title: 'اختيار الحساب',
    category: 'Authentication',
    path: '/design-review/choose-account',
    order: 56,
    status: 'Implemented'
  },
  {
    title: 'البحث الشامل',
    category: 'Dashboards',
    path: '/design-review/search',
    order: 57,
    status: 'Implemented'
  },
  {
    title: 'ملف المعلم',
    category: 'Dashboards',
    path: '/design-review/teachers-[id]',
    order: 58,
    status: 'Implemented'
  },
  {
    title: 'غير مصرح',
    category: 'Settings',
    path: '/design-review/unauthorized',
    order: 59,
    status: 'Implemented'
  },
  {
    title: 'صيانة',
    category: 'Settings',
    path: '/design-review/maintenance',
    order: 60,
    status: 'Implemented'
  },
  {
    title: 'قريباً',
    category: 'Settings',
    path: '/design-review/coming-soon',
    order: 61,
    status: 'Implemented'
  },
  {
    title: 'التقويم',
    category: 'Dashboards',
    path: '/design-review/dashboard-student-calendar',
    order: 62,
    status: 'Implemented'
  }
];
