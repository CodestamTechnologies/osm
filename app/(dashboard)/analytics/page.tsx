"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { StatCard } from "../../../components/ui/stat-card";
import { Award, Target, AlertTriangle, CheckCircle } from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';

const scoreDistribution = [
  { range: '0-20', count: 15 },
  { range: '21-40', count: 45 },
  { range: '41-60', count: 120 },
  { range: '61-80', count: 210 },
  { range: '81-100', count: 85 },
];

const passFailData = [
  { name: 'Pass', value: 380, color: '#16A34A' },
  { name: 'Fail', value: 95, color: '#DC2626' },
];

const questionDifficulty = [
  { q: 'Q1', avgMarks: 8.5, max: 10 },
  { q: 'Q2', avgMarks: 4.2, max: 10 },
  { q: 'Q3', avgMarks: 7.1, max: 10 },
  { q: 'Q4', avgMarks: 3.8, max: 10 },
  { q: 'Q5', avgMarks: 9.0, max: 10 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-text-primary">Analytics</h1>
        <p className="text-brand-text-secondary">Deep dive into performance metrics and evaluation trends.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <StatCard title="Average Marks" value="68.4%" icon={Target} trend={{ value: 2.1, isPositive: true }} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <StatCard title="Highest Score" value="98/100" icon={Award} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <StatCard title="Pass Percentage" value="80%" icon={CheckCircle} trend={{ value: 5.4, isPositive: true }} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <StatCard title="Flagged Anomalies" value="12" icon={AlertTriangle} trend={{ value: 1.2, isPositive: false }} />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="h-[400px]">
            <CardHeader>
              <CardTitle>Score Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoreDistribution} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                  <RechartsTooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} name="Candidates" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card className="h-[400px]">
            <CardHeader>
              <CardTitle>Pass/Fail Ratio</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={passFailData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {passFailData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="lg:col-span-2">
          <Card className="h-[400px]">
            <CardHeader>
              <CardTitle>Question Difficulty (Average Marks per Question)</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={questionDifficulty} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="q" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} domain={[0, 10]} />
                  <RechartsTooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="avgMarks" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Avg Marks" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
