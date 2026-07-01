"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-brand-text-primary">Settings</h1>
        <p className="text-brand-text-secondary">Manage your application preferences and configurations.</p>
      </div>

      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how the application looks on your device.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-brand-text-primary">Theme</h4>
                  <p className="text-sm text-brand-text-secondary">Select light, dark, or system default.</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" className="border-brand-primary text-brand-primary bg-brand-primary/5">Light</Button>
                  <Button variant="outline">Dark</Button>
                  <Button variant="outline">System</Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-brand-text-primary">Font Size</h4>
                  <p className="text-sm text-brand-text-secondary">Adjust the base font size for better readability.</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">A-</Button>
                  <Button variant="outline" size="sm" className="border-brand-primary text-brand-primary bg-brand-primary/5">A</Button>
                  <Button variant="outline" size="sm">A+</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Configure how you receive alerts and updates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-brand-text-primary">Email Notifications</h4>
                  <p className="text-sm text-brand-text-secondary">Receive daily summaries and critical alerts via email.</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-brand-border text-brand-primary focus:ring-brand-primary" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-brand-text-primary">In-App Alerts</h4>
                  <p className="text-sm text-brand-text-secondary">Show toast notifications for real-time events.</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-brand-border text-brand-primary focus:ring-brand-primary" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader>
              <CardTitle>Accessibility</CardTitle>
              <CardDescription>Features to improve usability for everyone.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-brand-text-primary">High Contrast Mode</h4>
                  <p className="text-sm text-brand-text-secondary">Increase color contrast across the interface.</p>
                </div>
                <input type="checkbox" className="h-4 w-4 rounded border-brand-border text-brand-primary focus:ring-brand-primary" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-brand-text-primary">Reduced Motion</h4>
                  <p className="text-sm text-brand-text-secondary">Minimize animations and transitions.</p>
                </div>
                <input type="checkbox" className="h-4 w-4 rounded border-brand-border text-brand-primary focus:ring-brand-primary" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
