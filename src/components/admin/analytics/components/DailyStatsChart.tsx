
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import type { ChartDataPoint } from '../types/analyticsTypes';

interface DailyStatsChartProps {
  data: ChartDataPoint[];
}

const DailyStatsChart = ({ data }: DailyStatsChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tägliche Fragen</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(value) => new Date(value).toLocaleDateString('de-DE')}
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              labelFormatter={(value) => new Date(value).toLocaleDateString('de-DE')}
              formatter={(value: number, name: string) => [
                name === 'questions' ? value : `${(value * 100).toFixed(0)}%`,
                name === 'questions' ? 'Fragen' : 'Zufriedenheit'
              ]}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)'
              }}
            />
            <Line type="monotone" dataKey="questions" stroke="hsl(var(--chart-1))" name="questions" />
            <Line type="monotone" dataKey="satisfaction" stroke="hsl(var(--chart-5))" name="satisfaction" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default DailyStatsChart;
