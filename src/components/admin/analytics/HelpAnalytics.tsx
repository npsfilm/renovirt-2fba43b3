
import React from 'react';
import { useHelpAnalytics, useRecentHelpInteractions } from './hooks/useHelpAnalytics';
import AlertsSection from './components/AlertsSection';
import SimpleMetrics from './components/SimpleMetrics';
import CompactInteractionsList from './components/CompactInteractionsList';
import ActionableSection from './components/ActionableSection';
import { getBerlinDayStart, convertToBerlinTime } from '@/utils/berlinTime';

const HelpAnalytics = () => {
  const { analytics, isLoading } = useHelpAnalytics();
  const { data: recentInteractions } = useRecentHelpInteractions();

  if (isLoading) {
    return <div className="p-6">Lade Analytics...</div>;
  }

  if (!analytics) {
    return <div className="p-6">Keine Analytics-Daten verfügbar</div>;
  }

  // Berechne zusätzliche Metriken für das vereinfachte Dashboard (Berlin Zeit)
  const todayStart = getBerlinDayStart();
  const weekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Debug: Zeige Zeitzone-Informationen
  console.log('[DEBUG] Berlin Zeit - Heute:', todayStart);
  console.log('[DEBUG] Berlin Zeit - Woche:', weekStart);

  const interactionsToday = recentInteractions?.filter(i => {
    const berlinTime = convertToBerlinTime(i.created_at);
    return berlinTime >= todayStart;
  }).length || 0;

  const interactionsWeek = recentInteractions?.filter(i => {
    const berlinTime = convertToBerlinTime(i.created_at);
    return berlinTime >= weekStart;
  }).length || 0;

  // Debug: Zeige gefilterte Ergebnisse
  console.log('[DEBUG] Interaktionen heute (Berlin):', interactionsToday);
  console.log('[DEBUG] Interaktionen Woche (Berlin):', interactionsWeek);
  console.log('[DEBUG] Gesamt Interaktionen:', recentInteractions?.length || 0);

  const negativeCount = recentInteractions?.filter(i => 
    i.feedback_rating && i.feedback_rating <= 2
  ).length || 0;

  const supportContactsToday = recentInteractions?.filter(i => {
    const berlinTime = convertToBerlinTime(i.created_at);
    return i.contacted_support && berlinTime >= todayStart;
  }).length || 0;

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
