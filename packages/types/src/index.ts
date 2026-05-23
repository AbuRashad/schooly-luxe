export type Role = 'ADMIN' | 'TEACHER' | 'ACCOUNTANT' | 'ICT_ADMIN';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: Role;
  schoolId: string;
}

export interface DashboardSummary {
  studentsCount: number;
  attendanceToday: number;
  presentToday: number;
  assetsCount: number;
  activeAssets: number;
  invoicesOutstanding: number;
  revenueCollected: number;
}
