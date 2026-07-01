"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Plus, GraduationCap } from "lucide-react";

export default function ExamsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-brand-text-primary">Exams</h1>
          <p className="text-brand-text-secondary">Manage examination cycles and subjects.</p>
        </div>
        <Button><Plus className="w-4 h-4 mr-2" /> Create Exam</Button>
      </div>

      <Card>
        <CardContent className="py-16 flex flex-col items-center justify-center text-center">
          <div className="h-16 w-16 bg-brand-bg rounded-full flex items-center justify-center mb-4">
            <GraduationCap className="h-8 w-8 text-brand-primary opacity-80" />
          </div>
          <h3 className="text-lg font-bold text-brand-text-primary mb-2">No Active Exams</h3>
          <p className="text-brand-text-secondary max-w-md mb-6">
            There are currently no active examination cycles. Click the button below to create a new exam session and start assigning papers.
          </p>
          <Button variant="outline">Create Exam Session</Button>
        </CardContent>
      </Card>
    </div>
  );
}
