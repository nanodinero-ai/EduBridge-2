import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const subjectColors = {
  'Mathematics': 'bg-sky-blue',
  'English': 'bg-leaf-green',
  'Afrikaans': 'bg-soft-orange',
  'isiZulu': 'bg-warm-yellow',
  'isiXhosa': 'bg-purple-500',
  'Life Skills': 'bg-pink-500',
  'Natural Sciences': 'bg-emerald-500',
  'Social Sciences': 'bg-amber-600',
  'Technology': 'bg-cyan-500',
  'Economic Management Sciences': 'bg-indigo-500',
  'Life Orientation': 'bg-rose-500',
  'Physical Sciences': 'bg-blue-600',
  'Geography': 'bg-teal-500',
  'History': 'bg-orange-600',
  'Accounting': 'bg-violet-500',
  'Business Studies': 'bg-lime-600',
  'Computer Applications': 'bg-slate-600',
};

const subjectEmojis = {
  'Mathematics': '🔢',
  'English': '📖',
  'Afrikaans': '📝',
  'isiZulu': '🗣️',
  'isiXhosa': '🗣️',
  'Life Skills': '🌟',
  'Natural Sciences': '🔬',
  'Social Sciences': '🌍',
  'Technology': '💻',
  'Economic Management Sciences': '💰',
  'Life Orientation': '🧭',
  'Physical Sciences': '⚗️',
  'Geography': '🗺️',
  'History': '📜',
  'Accounting': '📊',
  'Business Studies': '💼',
  'Computer Applications': '🖥️',
};

export default function SubjectCard({ subject, grade, lessonCount }) {
  const color = subjectColors[subject] || 'bg-sky-blue';
  const emoji = subjectEmojis[subject] || '📚';

  return (
    <Link
      to={`/learner/lessons?subject=${encodeURIComponent(subject)}&grade=${encodeURIComponent(grade)}`}
      className="flex items-center gap-3 bg-card rounded-xl p-3.5 border border-border hover:shadow-sm transition-all active:scale-[0.98]"
    >
      <div className={`w-11 h-11 rounded-lg ${color} flex items-center justify-center text-xl flex-shrink-0`}>
        {emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-heading font-bold text-sm truncate">{subject}</p>
        <p className="text-xs text-muted-foreground">{lessonCount || 0} lessons</p>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
    </Link>
  );
}
