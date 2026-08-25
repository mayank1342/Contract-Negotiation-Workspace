'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Brain } from 'lucide-react';

const skillsData = [
  { subject: 'Communication', score: 88, fullMark: 100 },
  { subject: 'Price Negotiation', score: 76, fullMark: 100 },
  { subject: 'Risk Awareness', score: 82, fullMark: 100 },
  { subject: 'Concession Mgmt', score: 70, fullMark: 100 },
  { subject: 'Strategic Thinking', score: 90, fullMark: 100 },
];

export function SkillsRadarChart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Brain className="w-5 h-5 text-brand-500" />
          <span>Negotiation Skills Radar</span>
        </CardTitle>
        <CardDescription>Multi-dimensional breakdown of your contract negotiation proficiency</CardDescription>
      </CardHeader>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={skillsData}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fontSize: 11, fontWeight: 600 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
            <Radar name="Skills" dataKey="score" stroke="#0c8de9" fill="#0c8de9" fillOpacity={0.4} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
