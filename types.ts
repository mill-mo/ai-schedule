
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface Event {
  id: string;
  title: string;
  day: DayOfWeek;
  startTime: string; // "HH:mm" format
  endTime: string; // "HH:mm" format
  color?: string;
}

export const DAYS_OF_WEEK: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
