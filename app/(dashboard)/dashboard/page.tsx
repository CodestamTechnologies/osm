"use client";

import { motion } from "framer-motion";
import {
  FileText, Clock, CheckCircle2, TrendingUp, Users, Activity,
  Plus, Play, FileEdit, BarChart2, BookOpen, GraduationCap,
  Calendar, Award, MoreVertical, Filter, Download, UploadCloud, Settings
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

// --- MOCK DATA ---
const mockSparklineData1 = [{ v: 10 }, { v: 15 }, { v: 12 }, { v: 20 }, { v: 18 }, { v: 25 }, { v: 22 }];
const mockSparklineData2 = [{ v: 40 }, { v: 35 }, { v: 38 }, { v: 30 }, { v: 25 }, { v: 28 }, { v: 20 }];
const mockBarData = [
  { name: 'Mon', completed: 40, pending: 24 }, { name: 'Tue', completed: 30, pending: 13 },
  { name: 'Wed', completed: 20, pending: 48 }, { name: 'Thu', completed: 27, pending: 39 },
  { name: 'Fri', completed: 18, pending: 48 }, { name: 'Sat', completed: 23, pending: 38 },
];
const pendingEvaluations = [
  { id: 1, name: "John Doe", roll: "CS23-4059", exam: "Midterm", subject: "CS 101", date: "Oct 12", status: "In Progress", priority: "High" },
  { id: 2, name: "Alice Smith", roll: "CS23-4060", exam: "Midterm", subject: "CS 101", date: "Oct 12", status: "Not Started", priority: "Medium" },
  { id: 3, name: "Bob Johnson", roll: "PH23-1022", exam: "Final", subject: "PHY 201", date: "Oct 14", status: "Review", priority: "Urgent" },
];
const recentActivity = [
  { id: 1, user: "AP", action: "Evaluated 15 papers for CS101", time: "2h ago", status: "success" },
  { id: 2, user: "SYS", action: "Auto-saved draft for Roll #40291", time: "3h ago", status: "info" },
  { id: 3, user: "ADM", action: "Assigned 50 new papers to you", time: "5h ago", status: "warning" },
];
const topPerformers = [
  { rank: 1, name: "Dr. Smith", score: "998 papers", progress: 95 },
  { rank: 2, name: "Prof. Johnson", score: "845 papers", progress: 85 },
  { rank: 3, name: "Anamika P.", score: "720 papers", progress: 75 },
];

// --- SUB-COMPONENTS ---
const Sparkline = ({ data, color }: { data: any[], color: string }) => (
  <div className="h-10 w-24">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fillOpacity={1} fill={`url(#grad-${color})`} />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export default function DashboardPage() {
  return (
    <div className="space-y-8 pb-10">
      
      {/* --- WELCOME SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-6 rounded-2xl shadow-brand-sm border border-brand-border">
        <div>
          <h1 className="text-2xl font-bold text-brand-text-primary tracking-tight">Welcome back, Anamika 👋</h1>
          <p className="text-brand-text-secondary mt-1">You have evaluated <strong className="text-brand-primary">15 papers</strong> today. Keep up the great work!</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="hidden sm:flex bg-white shadow-sm border-brand-border hover:bg-brand-bg"><Plus className="w-4 h-4 mr-2"/> Upload Papers</Button>
          <Button className="shadow-md bg-brand-primary hover:bg-brand-primary-hover"><Play className="w-4 h-4 mr-2"/> Continue Evaluation</Button>
        </div>
      </div>

      {/* --- STAT CARDS --- */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Exams", value: "1,248", icon: FileText, trend: "+12%", sparkData: mockSparklineData1, color: "#2563EB", bg: "bg-blue-50" },
          { title: "Pending Evaluation", value: "342", icon: Clock, trend: "-5%", sparkData: mockSparklineData2, color: "#F59E0B", bg: "bg-yellow-50" },
          { title: "Completed Papers", value: "906", icon: CheckCircle2, trend: "+18%", sparkData: mockSparklineData1, color: "#16A34A", bg: "bg-green-50" },
          { title: "Average Score", value: "68.4%", icon: TrendingUp, trend: "+2.1%", sparkData: mockSparklineData1, color: "#8B5CF6", bg: "bg-purple-50" }
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="hover:shadow-brand-md transition-shadow group cursor-default">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-brand-text-secondary">{stat.title}</p>
                    <p className="text-3xl font-bold text-brand-text-primary tracking-tight">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bg} text-${stat.color.replace('#', '')}`}>
                    <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <Badge variant={stat.trend.startsWith('+') ? 'success' : 'warning'} className="bg-opacity-10 text-xs">
                    {stat.trend} vs last week
                  </Badge>
                  <Sparkline data={stat.sparkData} color={stat.color} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* --- QUICK ACTIONS GRID --- */}
      <div>
        <h2 className="text-lg font-bold text-brand-text-primary mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {[
            { name: "Upload", icon: UploadCloud, color: "text-blue-600" },
            { name: "Evaluate", icon: FileEdit, color: "text-green-600" },
            { name: "Drafts", icon: BookOpen, color: "text-purple-600" },
            { name: "Analytics", icon: BarChart2, color: "text-orange-600" },
            { name: "Exams", icon: GraduationCap, color: "text-pink-600" },
            { name: "Candidates", icon: Users, color: "text-cyan-600" },
            { name: "Reports", icon: FileText, color: "text-teal-600" },
            { name: "Settings", icon: Settings, color: "text-slate-600" }
          ].map((action, i) => (
            <motion.button 
              key={i} whileHover={{ y: -4 }} whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-brand-border rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              <div className="p-2 bg-brand-bg rounded-lg"><action.icon className={`w-5 h-5 ${action.color}`} /></div>
              <span className="text-xs font-semibold text-brand-text-secondary">{action.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* --- CHARTS & PENDING TABLE --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Column (2 spans) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="h-[450px] shadow-brand-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b border-brand-border pb-4">
              <div>
                <CardTitle>Evaluation Progress</CardTitle>
                <CardDescription>Completed vs Pending evaluations over the last 7 days.</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm"><Filter className="w-4 h-4 mr-2"/> Filter</Button>
                <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2"/> Export</Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6 h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockBarData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                  <RechartsTooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                  <Bar dataKey="completed" fill="#2563EB" radius={[4, 4, 0, 0]} name="Completed" maxBarSize={40} />
                  <Bar dataKey="pending" fill="#93C5FD" radius={[4, 4, 0, 0]} name="Pending" maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pending Evaluations Table */}
          <Card className="shadow-brand-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-brand-border pb-4">
              <CardTitle>Pending Evaluations</CardTitle>
              <Button variant="ghost" size="sm" className="text-brand-primary">View All</Button>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-brand-text-secondary uppercase bg-brand-bg border-b border-brand-border">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Candidate</th>
                    <th className="px-6 py-4 font-semibold">Exam / Subject</th>
                    <th className="px-6 py-4 font-semibold">Priority</th>
                    <th className="px-6 py-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border bg-white">
                  {pendingEvaluations.map((evalItem) => (
                    <tr key={evalItem.id} className="hover:bg-brand-bg/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-brand-text-primary">{evalItem.name}</div>
                        <div className="text-xs text-brand-text-secondary">{evalItem.roll}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-brand-text-primary">{evalItem.exam}</div>
                        <div className="text-xs text-brand-text-secondary">{evalItem.subject}</div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={evalItem.priority === 'Urgent' ? 'destructive' : evalItem.priority === 'High' ? 'warning' : 'secondary'}>
                          {evalItem.priority}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button size="sm">Evaluate</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Side Column (1 span) */}
        <div className="space-y-6">
          {/* Recent Activity Timeline */}
          <Card className="shadow-brand-sm">
            <CardHeader className="border-b border-brand-border pb-4">
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="relative border-l-2 border-brand-border ml-3 space-y-8">
                {recentActivity.map((activity, i) => (
                  <div key={activity.id} className="relative pl-6">
                    <div className={`absolute -left-[13px] top-1 h-6 w-6 rounded-full border-4 border-white flex items-center justify-center text-[10px] font-bold text-white
                      ${activity.status === 'success' ? 'bg-brand-success' : activity.status === 'warning' ? 'bg-brand-warning' : 'bg-brand-primary'}
                    `}>
                      {activity.user}
                    </div>
                    <p className="text-sm font-medium text-brand-text-primary leading-tight">{activity.action}</p>
                    <p className="text-xs text-brand-text-secondary mt-1">{activity.time}</p>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-6 text-brand-primary text-sm font-semibold">See all activity</Button>
            </CardContent>
          </Card>

          {/* Top Performers Leaderboard */}
          <Card className="shadow-brand-sm">
            <CardHeader className="border-b border-brand-border pb-4">
              <CardTitle className="flex items-center gap-2"><Award className="w-5 h-5 text-brand-warning" /> Top Examiners</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              {topPerformers.map((performer) => (
                <div key={performer.rank} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-brand-text-secondary w-4">{performer.rank}.</span>
                      <span className="font-semibold text-brand-text-primary">{performer.name}</span>
                    </div>
                    <span className="text-brand-text-secondary font-medium">{performer.score}</span>
                  </div>
                  <div className="h-1.5 w-full bg-brand-bg rounded-full overflow-hidden">
                    <div className="h-full bg-brand-primary rounded-full" style={{ width: `${performer.progress}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Exams Mini-Card */}
          <Card className="shadow-brand-sm bg-gradient-to-br from-blue-900 to-indigo-900 text-white border-none">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <Calendar className="w-8 h-8 opacity-80" />
                <Badge className="bg-white/20 hover:bg-white/30 text-white border-none">In 3 Days</Badge>
              </div>
              <h3 className="font-bold text-xl mb-1">Advanced Physics</h3>
              <p className="text-blue-200 text-sm mb-4">Final Examination • 450 Candidates</p>
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-indigo-900 bg-brand-primary flex items-center justify-center text-xs font-bold">
                    E{i}
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-indigo-900 bg-white/20 flex items-center justify-center text-xs font-bold">
                  +12
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
