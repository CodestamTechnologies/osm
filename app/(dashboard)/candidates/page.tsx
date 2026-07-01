"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Search, Download, Filter } from "lucide-react";
import { Input } from "../../../components/ui/input";

export default function CandidatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-brand-text-primary">Candidates</h1>
          <p className="text-brand-text-secondary">Manage and view candidate information across all exams.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
          <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Export</Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-brand-border pb-4">
          <CardTitle>All Candidates</CardTitle>
          <div className="w-64">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-brand-text-secondary" />
              <Input className="pl-9 bg-brand-bg/50" placeholder="Search by name or roll no..." />
            </div>
          </div>
        </CardHeader>
        <CardContent className="py-12 flex flex-col items-center justify-center text-center">
          <div className="h-16 w-16 bg-brand-bg rounded-full flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-brand-text-secondary opacity-50" />
          </div>
          <h3 className="text-lg font-bold text-brand-text-primary mb-2">No Candidates Found</h3>
          <p className="text-brand-text-secondary max-w-sm mb-6">
            There are currently no candidates assigned to your evaluation queue, or your search query returned no results.
          </p>
          <Button>Sync Candidates Database</Button>
        </CardContent>
      </Card>
    </div>
  );
}
