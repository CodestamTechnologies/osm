"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { CheckCircle2, Clock, AlertTriangle, MessageSquare, FileText } from "lucide-react";
import { Badge } from "../../../components/ui/badge";

const notifications = [
  { id: 1, type: "success", title: "Evaluation Submitted", description: "You have successfully submitted the evaluation for Roll Number 100234.", time: "10 mins ago", icon: CheckCircle2 },
  { id: 2, type: "info", title: "Paper Assigned", description: "You have been assigned 50 new papers for Computer Science 101.", time: "2 hours ago", icon: FileText },
  { id: 3, type: "warning", title: "Reminder", description: "You have 15 pending papers approaching the deadline.", time: "5 hours ago", icon: Clock },
  { id: 4, type: "error", title: "Anomaly Detected", description: "Unusual marking pattern detected in Exam ID 4592. Please review.", time: "1 day ago", icon: AlertTriangle },
  { id: 5, type: "info", title: "Message from Admin", description: "The marking rubric for PHY201 has been updated. Please check the guidelines.", time: "2 days ago", icon: MessageSquare },
];

export default function NotificationsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-text-primary">Notifications</h1>
          <p className="text-brand-text-secondary">Stay updated with your recent activities and alerts.</p>
        </div>
        <Badge variant="secondary" className="px-3 py-1 text-sm">
          3 Unread
        </Badge>
      </div>

      <Card>
        <CardHeader className="border-b border-brand-border">
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-brand-border">
            {notifications.map((notification, index) => {
              const Icon = notification.icon;
              let iconColor = "text-brand-text-secondary";
              let iconBg = "bg-brand-bg";

              if (notification.type === "success") {
                iconColor = "text-brand-success";
                iconBg = "bg-green-50";
              } else if (notification.type === "warning") {
                iconColor = "text-brand-warning";
                iconBg = "bg-yellow-50";
              } else if (notification.type === "error") {
                iconColor = "text-brand-danger";
                iconBg = "bg-red-50";
              } else if (notification.type === "info") {
                iconColor = "text-brand-primary";
                iconBg = "bg-blue-50";
              }

              return (
                <motion.div 
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start p-6 hover:bg-brand-bg/50 transition-colors cursor-pointer"
                >
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${iconBg}`}>
                    <Icon className={`h-6 w-6 ${iconColor}`} />
                  </div>
                  <div className="ml-4 flex-1 space-y-1">
                    <p className="text-base font-medium text-brand-text-primary">
                      {notification.title}
                    </p>
                    <p className="text-sm text-brand-text-secondary">
                      {notification.description}
                    </p>
                  </div>
                  <div className="text-sm text-brand-text-secondary whitespace-nowrap">
                    {notification.time}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
