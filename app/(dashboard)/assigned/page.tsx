"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Search, Filter } from "lucide-react";
import { Input } from "../../../components/ui/input";

const assignedPapers = [
  { id: 1, name: "Computer Science 101", count: 145, deadline: "Tomorrow", priority: "High" },
  { id: 2, name: "Advanced Mathematics", count: 82, deadline: "Oct 15", priority: "Medium" },
  { id: 3, name: "Physics 201", count: 34, deadline: "Oct 18", priority: "Low" },
];

export default function AssignedPapersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-brand-text-primary">Assigned Papers</h1>
          <p className="text-brand-text-secondary">Batches of examination papers assigned to you for evaluation.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-brand-border pb-4">
          <CardTitle>Current Assignments</CardTitle>
          <div className="w-64">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-brand-text-secondary" />
              <Input className="pl-9 bg-brand-bg/50" placeholder="Search assignments..." />
            </div>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-brand-text-secondary uppercase bg-brand-bg border-b border-brand-border">
              <tr>
                <th className="px-6 py-4 font-semibold">Subject / Exam</th>
                <th className="px-6 py-4 font-semibold">Paper Count</th>
                <th className="px-6 py-4 font-semibold">Deadline</th>
                <th className="px-6 py-4 font-semibold">Priority</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border bg-white">
              {assignedPapers.map((paper) => (
                <tr key={paper.id} className="hover:bg-brand-bg/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-brand-text-primary">{paper.name}</div>
                    <div className="text-xs text-brand-text-secondary">Midterm Examination</div>
                  </td>
                  <td className="px-6 py-4 font-medium">{paper.count} sheets</td>
                  <td className="px-6 py-4 text-brand-text-secondary">{paper.deadline}</td>
                  <td className="px-6 py-4">
                    <Badge variant={paper.priority === 'High' ? 'destructive' : paper.priority === 'Medium' ? 'warning' : 'secondary'}>
                      {paper.priority}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button size="sm">Start Marking</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
