import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, GraduationCap, Users, Heart } from 'lucide-react';

const roles = [
  { id: 'learner', label: 'I am a Learner', icon: BookOpen, desc: 'Join classes & learn', color: 'bg-sky-blue', path: '/learner-setup' },
  { id: 'teacher', label: 'I am a Teacher', icon: GraduationCap, desc: 'Manage lessons & students', color: 'bg-leaf-green', path: '/teacher-setup' },
  { id: 'parent', label: 'I am a Parent', icon: Heart, desc: 'Track my child\'s progress', color: 'bg-soft-orange', path: '/parent-setup' },
];

export default function RoleSelect() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-blue-50 flex flex-col items-center justify-center px-5 py-8">
      <div className="text-center mb-10">
        <div className="w-20 h-20 rounded-full bg-warm-yellow flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Users className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-heading font-extrabold text-foreground">iThuto</h1>
        <p className="text-muted-foreground mt-2 text-base font-body">Your Virtual Classroom</p>
        <p className="text-xs text-muted-foreground mt-1">Learn anywhere. No barriers.</p>
      </div>

      <div className="w-full max-w-sm space-y-4">
        {roles.map(role => (
          <button
            key={role.id}
            onClick={() => navigate(role.path)}
            className="w-full flex items-center gap-4 bg-card rounded-2xl p-5 shadow-sm border border-border hover:shadow-md transition-all active:scale-[0.98]"
          >
            <div className={`w-14 h-14 rounded-xl ${role.color} flex items-center justify-center flex-shrink-0`}>
              <role.icon className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <p className="font-heading font-bold text-base">{role.label}</p>
              <p className="text-sm text-muted-foreground">{role.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-8 text-center max-w-xs">
        Free for all South African learners. Works on any phone. 🇿🇦
      </p>
    </div>
  );
}
