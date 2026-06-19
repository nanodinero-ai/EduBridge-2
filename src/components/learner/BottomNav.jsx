import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, MessageCircle, Download, User } from 'lucide-react';

const tabs = [
  { path: '/learner', icon: Home, label: 'Home' },
  { path: '/learner/lessons', icon: BookOpen, label: 'Lessons' },
  { path: '/learner/chat', icon: MessageCircle, label: 'Chat' },
  { path: '/learner/downloads', icon: Download, label: 'Saved' },
  { path: '/learner/profile', icon: User, label: 'Me' },
];

export default function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 safe-area-bottom">
      <div className="flex items-center justify-around max-w-lg mx-auto py-1.5">
        {tabs.map(tab => {
          const active = pathname === tab.path || (tab.path !== '/learner' && pathname.startsWith(tab.path));
          return (
            <Link key={tab.path} to={tab.path} className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors ${active ? 'text-sky-blue' : 'text-muted-foreground'}`}>
              <tab.icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] font-heading font-semibold">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
