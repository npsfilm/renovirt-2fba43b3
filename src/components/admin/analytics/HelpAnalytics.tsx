
import React from 'react';
import { useHelpAnalytics, useRecentHelpInteractions } from './hooks/useHelpAnalytics';
import AlertsSection from './components/AlertsSection';
import SimpleMetrics from './components/SimpleMetrics';
import CompactInteractionsList from './components/CompactInteractionsList';
import ActionableSection from './components/ActionableSection';

const HelpAnalytics = () => {
  const { analytics, isLoading } = useHelpAnalytics();
  const { data: recentInteractions } = useRecentHelpInteractions();

  if (isLoading) {
    return <div className="p-6">Lade Analytics...</div>;
  }

  if (!analytics) {
    return <div className="p-6">Keine Analytics-Daten verfügbar</div>;
  }

  // Berechne zusätzliche Metriken für das vereinfachte Dashboard
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const weekStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  const interactionsToday = recentInteractions?.filter(i => 
    new Date(i.created_at) >= todayStart
  ).length || 0;

  const interactionsWeek = recentInteractions?.filter(i => 
    new Date(i.created_at) >= weekStart
  ).length || 0;

  const negativeCount = recentInteractions?.filter(i => 
    i.feedback_rating && i.feedback_rating <= 2
  ).length || 0;

  const supportContactsToday = recentInteractions?.filter(i => 
    i.contacted_support && new Date(i.created_at) >= todayStart
  ).length || 0;

  return (
    <div className="space-y-6">
      {/* Alerts Section - Kritische Fälle sofort sichtbar */}
      <AlertsSection 
        negativeCount={negativeCount}
        supportContactsToday={supportContactsToday}
        avgSatisfaction={analytics.avg_satisfaction}
        totalToday={interactionsToday}
      />

      {/* Vereinfachte Key Metrics */}
      <SimpleMetrics 
        totalToday={interactionsToday}
        totalWeek={interactionsWeek}
        avgSatisfaction={analytics.avg_satisfaction}
        supportRate={analytics.support_contact_rate}
        negativeCount={negativeCount}
      />

      {/* Kompakte Interaktions-Liste statt großer Tabelle */}
      <CompactInteractionsList interactions={recentInteractions || []} />

      {/* Handlungsbereich - Was benötigt Aufmerksamkeit */}
      <ActionableSection interactions={recentInteractions || []} />
    </div>
  );
};

export default HelpAnalytics;
