
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Bot, MessageCircle, ThumbsUp, Phone } from 'lucide-react';

const HelpAnalytics = () => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['help-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_help_analytics');
      if (error) throw error;
      return data[0];
    }
  });

  const { data: recentInteractions } = useQuery({
    queryKey: ['recent-help-interactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('help_interactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div className="p-6">Lade Analytics...</div>;
  }

  const dailyData = analytics?.daily_stats || [];
  
  // Properly handle the Json type for top_questions
  let topQuestions: string[] = [];
  if (analytics?.top_questions && Array.isArray(analytics.top_questions)) {
    topQuestions = analytics.top_questions as string[];
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gesamtfragen</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.total_questions || 0}</div>
            <p className="text-xs text-muted-foreground">Letzten 30 Tage</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Zufriedenheit</CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.avg_satisfaction ? `${(analytics.avg_satisfaction * 100).toFixed(0)}%` : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">Durchschnittliche Bewertung</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Support-Kontakte</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.support_contact_rate ? `${analytics.support_contact_rate.toFixed(1)}%` : '0%'}
            </div>
            <p className="text-xs text-muted-foreground">Weiterleitungsrate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI-Effizienz</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.support_contact_rate ? `${(100 - analytics.support_contact_rate).toFixed(1)}%` : '100%'}
            </div>
            <p className="text-xs text-muted-foreground">Selbst gelöste Fragen</p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Questions Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Tägliche Fragen</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('de-DE')}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString('de-DE')}
                formatter={(value: any, name: string) => [
                  name === 'questions' ? value : `${(value * 100).toFixed(0)}%`,
                  name === 'questions' ? 'Fragen' : 'Zufriedenheit'
                ]}
              />
              <Line type="monotone" dataKey="questions" stroke="#8884d8" name="questions" />
              <Line type="monotone" dataKey="satisfaction" stroke="#82ca9d" name="satisfaction" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Questions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Häufigste Fragen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topQuestions.slice(0, 5).map((question: string, index: number) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {index + 1}
                  </span>
                  <p className="text-sm text-gray-600 flex-1">{question}</p>
                </div>
              ))}
              {topQuestions.length === 0 && (
                <p className="text-sm text-gray-500">Keine Daten verfügbar</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Letzte Interaktionen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentInteractions?.slice(0, 5).map((interaction) => (
                <div key={interaction.id} className="border-l-4 border-blue-200 pl-3">
                  <p className="text-sm font-medium truncate">{interaction.question}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">
                      {new Date(interaction.created_at).toLocaleString('de-DE')}
                    </span>
                    {interaction.feedback_rating === 1 && (
                      <ThumbsUp className="w-3 h-3 text-green-600" />
                    )}
                    {interaction.contacted_support && (
                      <Phone className="w-3 h-3 text-orange-600" />
                    )}
                  </div>
                </div>
              ))}
              {(!recentInteractions || recentInteractions.length === 0) && (
                <p className="text-sm text-gray-500">Keine Interaktionen</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HelpAnalytics;
