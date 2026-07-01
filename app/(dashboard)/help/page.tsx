"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Search, Keyboard, Book, HelpCircle, Mail } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

const faqs = [
  { q: "How do I start an evaluation?", a: "Navigate to the 'Upload' tab, select your scanned sheets, and they will automatically appear in your 'Evaluation' queue." },
  { q: "Can I save a draft and continue later?", a: "Yes, the system automatically saves your progress every 30 seconds. You can safely close the browser and resume later." },
  { q: "How does AI-suggested marking work?", a: "The AI analyzes the scanned answer against the provided rubric and suggests a score. You must review and approve/modify it." },
  { q: "What happens if I encounter a blank page?", a: "You can use the 'Flag Anomaly' button in the Evaluation workspace to mark it for administrative review." },
];

const shortcuts = [
  { key: "Alt + =", action: "Zoom In" },
  { key: "Alt + -", action: "Zoom Out" },
  { key: "Alt + R", action: "Rotate Page" },
  { key: "Alt + ←", action: "Previous Page" },
  { key: "Alt + →", action: "Next Page" },
  { key: "Ctrl + S", action: "Force Save" },
];

export default function HelpCenterPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="text-center py-8 bg-brand-primary text-white rounded-xl shadow-brand-sm">
        <h1 className="text-3xl font-bold mb-4">How can we help you?</h1>
        <div className="max-w-md mx-auto relative text-brand-text-primary">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input 
            className="pl-10 bg-white border-0 h-12 text-base shadow-sm" 
            placeholder="Search for answers..." 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="text-center hover:shadow-brand-md transition-shadow cursor-pointer h-full">
            <CardContent className="pt-6">
              <div className="mx-auto w-12 h-12 bg-brand-bg rounded-full flex items-center justify-center mb-4">
                <Book className="h-6 w-6 text-brand-primary" />
              </div>
              <h3 className="font-semibold text-lg text-brand-text-primary mb-2">Documentation</h3>
              <p className="text-sm text-brand-text-secondary">Read comprehensive guides on using all features.</p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="text-center hover:shadow-brand-md transition-shadow cursor-pointer h-full">
            <CardContent className="pt-6">
              <div className="mx-auto w-12 h-12 bg-brand-bg rounded-full flex items-center justify-center mb-4">
                <HelpCircle className="h-6 w-6 text-brand-primary" />
              </div>
              <h3 className="font-semibold text-lg text-brand-text-primary mb-2">Video Tutorials</h3>
              <p className="text-sm text-brand-text-secondary">Watch step-by-step video guides for common workflows.</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="text-center hover:shadow-brand-md transition-shadow cursor-pointer h-full">
            <CardContent className="pt-6">
              <div className="mx-auto w-12 h-12 bg-brand-bg rounded-full flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-brand-primary" />
              </div>
              <h3 className="font-semibold text-lg text-brand-text-primary mb-2">Contact Support</h3>
              <p className="text-sm text-brand-text-secondary">Create a ticket for technical assistance.</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Quick answers to common issues.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="border-b border-brand-border pb-4 last:border-0 last:pb-0">
                  <h4 className="font-medium text-brand-text-primary mb-1">{faq.q}</h4>
                  <p className="text-sm text-brand-text-secondary">{faq.a}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle>Keyboard Shortcuts</CardTitle>
                <CardDescription>Speed up your evaluation workflow.</CardDescription>
              </div>
              <Keyboard className="h-5 w-5 text-brand-text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mt-4">
                {shortcuts.map((sc, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-sm text-brand-text-secondary">{sc.action}</span>
                    <kbd className="px-2 py-1 bg-brand-bg border border-brand-border rounded text-xs font-mono text-brand-text-primary font-semibold">
                      {sc.key}
                    </kbd>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Button variant="outline" className="w-full">Download Cheat Sheet</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
