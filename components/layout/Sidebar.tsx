"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  UploadCloud,
  FileEdit,
  Files,
  Users,
  GraduationCap,
  BarChart2,
  TrendingUp,
  Bell,
  Settings,
  HelpCircle,
  User,
  ChevronLeft,
  ChevronRight,
  Database,
  LifeBuoy
} from "lucide-react";
import { cn } from "../../lib/utils";

const mainNav = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Upload Papers", href: "/upload", icon: UploadCloud },
  { name: "Evaluation", href: "/evaluate", icon: FileEdit },
  { name: "Assigned Papers", href: "/assigned", icon: Files, badge: 12 },
  { name: "Candidates", href: "/candidates", icon: Users },
  { name: "Exams", href: "/exams", icon: GraduationCap },
];

const analyticsNav = [
  { name: "Analytics", href: "/analytics", icon: BarChart2 },
  { name: "Reports", href: "/reports", icon: TrendingUp },
];

const settingsNav = [
  { name: "Notifications", href: "/notifications", icon: Bell, badge: 3 },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Help Center", href: "/help", icon: HelpCircle },
  { name: "Profile", href: "/profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const renderNavItems = (items: any[]) => (
    <ul className="space-y-1 mt-2">
      {items.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <li key={item.name} className="relative">
            {isActive && (
              <motion.div
                layoutId="sidebar-active-indicator"
                className="absolute left-0 top-0 h-full w-1 bg-brand-primary rounded-r-md"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <Link
              href={item.href}
              className={cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 mx-2",
                isActive
                  ? "bg-brand-primary/10 text-brand-primary font-semibold"
                  : "text-brand-text-secondary hover:bg-brand-bg hover:text-brand-text-primary"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 flex-shrink-0 transition-colors duration-200",
                  isActive ? "text-brand-primary" : "text-brand-text-secondary group-hover:text-brand-text-primary",
                  !collapsed && "mr-3"
                )}
                aria-hidden="true"
              />
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="flex-1 whitespace-nowrap overflow-hidden"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>

              {!collapsed && item.badge && (
                <span className="ml-auto inline-flex items-center justify-center h-5 min-w-[20px] rounded-full bg-brand-primary text-[10px] font-bold text-white px-1.5">
                  {item.badge}
                </span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <motion.div 
      initial={false}
      animate={{ width: collapsed ? 80 : 260 }}
      className="relative flex h-full flex-col bg-brand-card border-r border-brand-border shadow-brand-sm z-20"
    >
      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 flex h-6 w-6 items-center justify-center rounded-full bg-white border border-brand-border shadow-sm text-brand-text-secondary hover:text-brand-primary focus:outline-none z-30"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      {/* Brand */}
      <div className="flex h-16 shrink-0 items-center px-4 border-b border-brand-border">
        <div className={cn("flex items-center gap-3 font-bold text-xl text-brand-primary overflow-hidden", collapsed ? "justify-center w-full" : "px-2")}>
          <div className="h-8 w-8 shrink-0 rounded-lg bg-brand-primary flex items-center justify-center text-white shadow-sm">
            <LayoutDashboard className="h-5 w-5" />
          </div>
          {!collapsed && <span className="whitespace-nowrap">AuraMark</span>}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 custom-scrollbar">
        <nav className="space-y-6">
          <div>
            {!collapsed && <h3 className="px-5 text-xs font-semibold text-brand-text-secondary uppercase tracking-wider mb-1">Main Menu</h3>}
            {renderNavItems(mainNav)}
          </div>
          <div>
            {!collapsed && <h3 className="px-5 text-xs font-semibold text-brand-text-secondary uppercase tracking-wider mb-1">Insights</h3>}
            {renderNavItems(analyticsNav)}
          </div>
          <div>
            {!collapsed && <h3 className="px-5 text-xs font-semibold text-brand-text-secondary uppercase tracking-wider mb-1">Preferences</h3>}
            {renderNavItems(settingsNav)}
          </div>
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="shrink-0 p-4 border-t border-brand-border space-y-4">
        {!collapsed && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="bg-brand-bg rounded-xl p-4 border border-brand-border"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-brand-text-primary mb-2">
              <Database className="h-4 w-4 text-brand-primary" />
              Storage Usage
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-brand-primary rounded-full w-[65%]" />
            </div>
            <p className="text-xs text-brand-text-secondary">65 GB of 100 GB used</p>
          </motion.div>
        )}

        <div className="flex items-center justify-between px-2">
          {!collapsed && <span className="text-xs text-brand-text-secondary font-medium">v2.4.0-enterprise</span>}
          <button className="text-brand-text-secondary hover:text-brand-primary transition-colors p-1 rounded-md hover:bg-brand-bg" title="Support">
            <LifeBuoy className="h-5 w-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
