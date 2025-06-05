
import type { ChartDataPoint, AnalyticsData } from '../types/analyticsTypes';

// Transform raw database data into properly typed chart data
export const transformAnalyticsData = (rawData: any): AnalyticsData | null => {
  if (!rawData) return null;

  // Transform daily_stats from JSONB to proper chart data
  const transformedDailyStats: ChartDataPoint[] = [];
  
  if (rawData.daily_stats && Array.isArray(rawData.daily_stats)) {
    rawData.daily_stats.forEach((item: any) => {
      if (item && typeof item === 'object') {
        transformedDailyStats.push({
          date: item.date || new Date().toISOString(),
          questions: Number(item.questions) || 0,
          satisfaction: Number(item.satisfaction) || 0
        });
      }
    });
  }

  return {
    total_questions: Number(rawData.total_questions) || 0,
    avg_satisfaction: rawData.avg_satisfaction ? Number(rawData.avg_satisfaction) : null,
    support_contact_rate: rawData.support_contact_rate ? Number(rawData.support_contact_rate) : null,
    top_questions: getTopQuestions(rawData),
    daily_stats: transformedDailyStats
  };
};

// Type guard function to safely handle top_questions
export const getTopQuestions = (data: any): string[] => {
  if (!data?.top_questions) return [];
  
  // If it's already an array, filter to ensure all items are strings
  if (Array.isArray(data.top_questions)) {
    return data.top_questions.filter((item: any): item is string => 
      typeof item === 'string'
    );
  }
  
  // If it's a single string, wrap it in an array
  if (typeof data.top_questions === 'string') {
    return [data.top_questions];
  }
  
  // For any other type, return empty array
  return [];
};
