"use client";

import { Bell, Search, Sun, Plus, ChevronRight, MessageSquare } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export function TopNav() {
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="sticky top-0 z-30 flex h-16 flex-shrink-0 items-center justify-between gap-x-4 border-b border-brand-border bg-white/80 backdrop-blur-md px-4 shadow-brand-sm sm:gap-x-6 sm:px-6 lg:px-8">
      
      {/* Left side: Breadcrumbs & Current Context */}
      <div className="flex items-center gap-4 flex-1">
        <nav className="hidden sm:flex items-center text-sm font-medium text-brand-text-secondary">
          <span className="hover:text-brand-text-primary cursor-pointer transition-colors">OSM System</span>
          <ChevronRight className="h-4 w-4 mx-1 opacity-50" />
          <span className="text-brand-text-primary">Dashboard</span>
        </nav>
        <div className="hidden lg:block h-5 w-px bg-brand-border mx-2" />
        <div className="hidden lg:flex items-center gap-2">
          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10">
            Fall 2023 Exam Cycle
          </span>
          <span className="text-xs font-medium text-brand-text-secondary">{currentDate}</span>
        </div>
      </div>

      {/* Middle: Global Search */}
      <div className="flex-1 max-w-md mx-auto relative hidden md:block">
        <div className="relative group">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-text-secondary group-focus-within:text-brand-primary transition-colors" />
          <Input
            className="w-full bg-brand-bg/50 border-brand-border pl-10 pr-12 focus:bg-white transition-all shadow-sm rounded-lg"
            placeholder="Search candidates, papers, or exams..."
            type="search"
          />
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
            <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-brand-border bg-white px-1.5 font-mono text-[10px] font-medium text-brand-text-secondary">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right side: Actions & Profile */}
      <div className="flex items-center gap-x-3 lg:gap-x-5 flex-1 justify-end">
        <Button size="sm" className="hidden sm:flex items-center gap-1.5 shadow-sm rounded-lg">
          <Plus className="h-4 w-4" />
          <span>New</span>
        </Button>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="text-brand-text-secondary hover:bg-brand-bg rounded-full">
            <span className="sr-only">Toggle dark mode</span>
            <Sun className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-brand-text-secondary hover:bg-brand-bg rounded-full">
            <span className="sr-only">Messages</span>
            <MessageSquare className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="relative text-brand-text-secondary hover:bg-brand-bg rounded-full">
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-brand-danger ring-2 ring-white" />
          </Button>
        </div>

        <div className="hidden sm:block h-6 w-px bg-brand-border" />

        {/* Profile Dropdown Trigger */}
        <button type="button" className="flex items-center gap-x-3 rounded-full p-1 hover:bg-brand-bg transition-colors">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-brand-primary to-indigo-500 text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white">
            AP
          </div>
          <div className="hidden lg:flex flex-col items-start">
            <span className="text-sm font-bold text-brand-text-primary leading-none">Anamika Pandey</span>
            <span className="text-xs font-medium text-brand-text-secondary mt-1">Chief Examiner</span>
          </div>
        </button>
      </div>
    </div>
  );
}
