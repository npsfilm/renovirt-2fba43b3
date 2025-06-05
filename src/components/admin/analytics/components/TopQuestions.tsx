
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TopQuestionsProps {
  questions: string[];
}

const TopQuestions = ({ questions }: TopQuestionsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Häufigste Fragen</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {questions.slice(0, 5).map((question, index) => (
            <div key={index} className="flex items-start gap-3">
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {index + 1}
              </span>
              <p className="text-sm text-gray-600 flex-1">{question}</p>
            </div>
          ))}
          {questions.length === 0 && (
            <p className="text-sm text-gray-500">Keine Daten verfügbar</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopQuestions;
