export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: 'masarak_access_token',
  REFRESH_TOKEN: 'masarak_refresh_token',
  USER_DATA: 'masarak_user_data',
} as const;

export const AUTH_ROLES = {
  VISITOR: 'VISITOR',
  STUDENT: 'STUDENT',
  TEACHER: 'TEACHER',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
} as const;

export const AUTH_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  CHOOSE_ACCOUNT: '/choose-account',
  SUCCESS: '/success',
} as const;

export const PROTECTED_ROUTES = {
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;
