"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { Mail, Briefcase, MapPin, Phone, Award } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-brand-text-primary">Profile</h1>
        <p className="text-brand-text-secondary">Manage your personal information and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Summary */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-6">
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-32 w-32 rounded-full bg-brand-primary text-white flex items-center justify-center text-4xl font-bold mb-4 shadow-brand-md">
                AP
              </div>
              <h2 className="text-xl font-bold text-brand-text-primary">Anamika Pandey</h2>
              <p className="text-brand-text-secondary mb-4">Senior Examiner</p>
              <Badge variant="success" className="mb-6">Active</Badge>

              <div className="w-full space-y-3 text-sm text-left">
                <div className="flex items-center text-brand-text-secondary">
                  <Briefcase className="w-4 h-4 mr-2" /> Department of Computer Science
                </div>
                <div className="flex items-center text-brand-text-secondary">
                  <Mail className="w-4 h-4 mr-2" /> anamika.p@university.edu
                </div>
                <div className="flex items-center text-brand-text-secondary">
                  <Phone className="w-4 h-4 mr-2" /> +1 (555) 123-4567
                </div>
                <div className="flex items-center text-brand-text-secondary">
                  <MapPin className="w-4 h-4 mr-2" /> New York, USA
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-brand-text-secondary">Total Papers Marked</span>
                <span className="font-semibold text-brand-text-primary">4,521</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-brand-text-secondary">Average Marking Time</span>
                <span className="font-semibold text-brand-text-primary">12m / paper</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-brand-text-secondary">Accuracy Rating</span>
                <span className="font-semibold text-brand-success flex items-center">
                  <Award className="w-4 h-4 mr-1" /> 98.5%
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Column: Edit Details */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-brand-text-primary">First Name</label>
                    <Input defaultValue="Anamika" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-brand-text-primary">Last Name</label>
                    <Input defaultValue="Pandey" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-brand-text-primary">Email Address</label>
                    <Input defaultValue="anamika.p@university.edu" type="email" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-brand-text-primary">Phone Number</label>
                    <Input defaultValue="+1 (555) 123-4567" type="tel" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-sm font-medium text-brand-text-primary">Bio</label>
                    <textarea 
                      className="flex min-h-[100px] w-full rounded-md border border-brand-border bg-brand-card px-3 py-2 text-sm ring-offset-background placeholder:text-brand-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      defaultValue="Senior Examiner with over 10 years of experience in grading Computer Science and Engineering examination papers."
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button type="button">Save Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2 max-w-md">
                  <label className="text-sm font-medium text-brand-text-primary">Current Password</label>
                  <Input type="password" />
                </div>
                <div className="space-y-2 max-w-md">
                  <label className="text-sm font-medium text-brand-text-primary">New Password</label>
                  <Input type="password" />
                </div>
                <div className="space-y-2 max-w-md">
                  <label className="text-sm font-medium text-brand-text-primary">Confirm New Password</label>
                  <Input type="password" />
                </div>
                <div className="pt-2">
                  <Button type="button" variant="outline">Update Password</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
