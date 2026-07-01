"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Download, FileText, BarChart } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-brand-text-primary">Reports</h1>
          <p className="text-brand-text-secondary">Generate and download comprehensive evaluation reports.</p>
        </div>
        <Button><Download className="w-4 h-4 mr-2" /> Export All Reports</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5 text-brand-primary" /> Evaluation Summary</CardTitle>
            <CardDescription>High-level overview of completed and pending evaluations.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-brand-text-secondary mb-4">Includes total papers marked, average time per paper, and completion rates across different subjects.</p>
            <Button variant="outline" className="w-full">Generate Report</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BarChart className="w-5 h-5 text-brand-primary" /> Performance Overview</CardTitle>
            <CardDescription>Detailed statistical analysis of examiner performance.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-brand-text-secondary mb-4">Includes accuracy ratings, anomaly detection flags, and comparison against global averages.</p>
            <Button variant="outline" className="w-full">Generate Report</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5 text-brand-primary" /> Subject Analysis</CardTitle>
            <CardDescription>Breakdown of scores and difficulty by subject.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-brand-text-secondary mb-4">Includes score distributions, pass/fail ratios, and historical trend comparisons for specific subjects.</p>
            <Button variant="outline" className="w-full">Generate Report</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BarChart className="w-5 h-5 text-brand-primary" /> Question Analysis</CardTitle>
            <CardDescription>Deep dive into specific question performance.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-brand-text-secondary mb-4">Identifies the most difficult questions, common mistakes, and AI suggestion accuracy rates.</p>
            <Button variant="outline" className="w-full">Generate Report</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
