import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Plus, Users, BarChart3 } from 'lucide-react';

const tabs = [
  { path: '/teacher', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/teacher/upload', icon: Plus, label: 'Upload' },
  { path: '/teacher/students', icon: Users, label: 'Students' },
  { path: '/teacher/progress', icon: BarChart3, label: 'Progress' },
];

export default function TeacherNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around max-w-lg mx-auto py-1.5">
        {tabs.map(tab => {
          const active = pathname === tab.path;
          return (
            <Link key={tab.path} to={tab.path} className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors ${active ? 'text-leaf-green' : 'text-muted-foreground'}`}>
              <tab.icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] font-heading font-semibold">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
