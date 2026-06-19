import React from 'react';
import { Link } from 'react-router-dom';
import { Play, FileText, Mic, Radio, Clock, Download } from 'lucide-react';

const typeConfig = {
  recorded: { icon: Play, label: 'Video', color: 'text-sky-blue bg-sky-blue/10' },
  notes: { icon: FileText, label: 'Notes', color: 'text-leaf-green bg-leaf-green/10' },
  live: { icon: Radio, label: 'Live', color: 'text-destructive bg-destructive/10' },
};

export default function LessonCard({ lesson }) {
  const config = typeConfig[lesson.type] || typeConfig.recorded;
  const Icon = config.icon;

  return (
    <Link to={`/learner/lesson/${lesson.id}`} className="bg-card rounded-xl border border-border p-3.5 hover:shadow-sm transition-all active:scale-[0.98] block">
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${config.color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-heading font-bold text-sm leading-tight line-clamp-2">{lesson.title}</p>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${config.color}`}>{config.label}</span>
            {lesson.duration_minutes > 0 && (
              <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                <Clock className="w-3 h-3" /> {lesson.duration_minutes} min
              </span>
            )}
          </div>
          {lesson.teacher_name && <p className="text-xs text-muted-foreground mt-1">by {lesson.teacher_name}</p>}
        </div>
      </div>
    </Link>
  );
}
