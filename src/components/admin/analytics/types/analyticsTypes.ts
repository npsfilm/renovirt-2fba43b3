
export interface ChartDataPoint {
  date: string;
  questions: number;
  satisfaction: number;
}

export interface AnalyticsData {
  total_questions: number;
  avg_satisfaction: number | null;
  support_contact_rate: number | null;
  top_questions: string[];
  daily_stats: ChartDataPoint[];
}
