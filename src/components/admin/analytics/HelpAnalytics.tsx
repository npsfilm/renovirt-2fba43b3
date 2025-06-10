
import React from 'react';
import { useHelpAnalytics, useRecentHelpInteractions } from './hooks/useHelpAnalytics';
import AnalyticsMetrics from './components/AnalyticsMetrics';
import DailyStatsChart from './components/DailyStatsChart';
import TopQuestions from './components/TopQuestions';
import RecentInteractions from './components/RecentInteractions';
import HelpInteractionsTable from './components/HelpInteractionsTable';

const HelpAnalytics = () => {
  const { analytics, isLoading } = useHelpAnalytics();
  const { data: recentInteractions } = useRecentHelpInteractions();

  if (isLoading) {
    return <div className="p-6">Lade Analytics...</div>;
  }

  if (!analytics) {
    return <div className="p-6">Keine Analytics-Daten verfügbar</div>;
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <AnalyticsMetrics analytics={analytics} />

      {/* Daily Questions Chart */}
      <DailyStatsChart data={analytics.daily_stats} />

      {/* Top Questions and Recent Interactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopQuestions questions={analytics.top_questions} />
        <RecentInteractions interactions={recentInteractions} />
      </div>

      {/* Detailed Interactions Table */}
      <HelpInteractionsTable />
    </div>
  );
};

export default HelpAnalytics;
