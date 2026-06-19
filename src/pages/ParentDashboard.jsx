import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, BookOpen, CheckCircle, Calendar, ArrowLeft, Loader2, TrendingUp, Clock } from 'lucide-react';

export default function ParentDashboard() {
  const navigate = useNavigate();
  const [parentLink, setParentLink] = useState(null);
  const [progress, setProgress] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const links = await base44.entities.ParentLink.list('-created_date', 1);
        if (links.length > 0) {
          setParentLink(links[0]);
          if (links[0].learner_id) {
            const prog = await base44.entities.LessonProgress.filter({ learner_id: links[0].learner_id }, '-created_date', 20);
            setProgress(prog);
            const att = await base44.entities.AttendanceLog.filter({ learner_id: links[0].learner_id }, '-login_date', 7);
            setAttendance(att);
          } else {
            const prog = await base44.entities.LessonProgress.list('-created_date', 20);
            setProgress(prog);
          }
          const asgn = await base44.entities.Assignment.list('-created_date', 10);
          setAssignments(asgn);
        }
      } catch (e) {}
      setLoading(false);
    };
    load();
  }, []);

  const completed = progress.filter(p => p.status === 'completed');
  const thisWeekAtt = attendance.length;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-soft-orange" /></div>;
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="bg-gradient-to-br from-soft-orange to-orange-600 text-white px-5 pt-6 pb-8 rounded-b-3xl">
        <button onClick={() => navigate('/')} className="p-1 rounded-lg hover:bg-white/10 mb-2"><ArrowLeft className="w-5 h-5" /></button>
        <p className="text-sm opacity-80">Parent Dashboard</p>
        <h1 className="text-xl font-heading font-extrabold mt-1">{parentLink?.parent_name || 'Parent'} ❤️</h1>
        <p className="text-sm opacity-80 mt-0.5">Tracking: {parentLink?.learner_name || 'Your child'}</p>
      </div>

      <div className="px-4 -mt-4">
        {/* Weekly Summary */}
        <div className="bg-card rounded-2xl border border-border p-5 mb-5 shadow-sm">
          <h2 className="font-heading font-bold text-base mb-4">📋 This Week's Summary</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-sky-blue/10 flex items-center justify-center mx-auto mb-1.5">
                <Calendar className="w-5 h-5 text-sky-blue" />
              </div>
              <p className="text-lg font-heading font-extrabold">{thisWeekAtt}</p>
              <p className="text-[10px] text-muted-foreground">Days Active</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-leaf-green/10 flex items-center justify-center mx-auto mb-1.5">
                <CheckCircle className="w-5 h-5 text-leaf-green" />
              </div>
              <p className="text-lg font-heading font-extrabold">{completed.length}</p>
              <p className="text-[10px] text-muted-foreground">Lessons Done</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-warm-yellow/10 flex items-center justify-center mx-auto mb-1.5">
                <TrendingUp className="w-5 h-5 text-warm-yellow" />
              </div>
              <p className="text-lg font-heading font-extrabold">
                {completed.filter(c => c.quiz_score).length > 0
                  ? Math.round(completed.filter(c => c.quiz_score).reduce((a, c) => a + c.quiz_score, 0) / completed.filter(c => c.quiz_score).length) + '%'
                  : '—'}
              </p>
              <p className="text-[10px] text-muted-foreground">Avg Score</p>
            </div>
          </div>
        </div>

        {/* Recent Completed Lessons */}
        <h2 className="font-heading font-bold text-sm mb-3 text-muted-foreground uppercase tracking-wide">Recent Lessons</h2>
        {completed.length === 0 ? (
          <div className="text-center py-8 mb-5">
            <BookOpen className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No completed lessons yet.</p>
            <p className="text-xs text-muted-foreground mt-1">Your child will appear here as they learn!</p>
          </div>
        ) : (
          <div className="space-y-2 mb-5">
            {completed.slice(0, 10).map(p => (
              <div key={p.id} className="bg-card rounded-xl border border-border p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-leaf-green/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-leaf-green" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-heading font-bold truncate">{p.lesson_title || 'Lesson'}</p>
                  <p className="text-xs text-muted-foreground">{p.subject} • {p.grade}</p>
                </div>
                {p.quiz_score != null && <span className="text-xs font-bold bg-leaf-green/10 text-leaf-green px-2 py-0.5 rounded-full">{p.quiz_score}%</span>}
              </div>
            ))}
          </div>
        )}

        {/* Upcoming Tasks */}
        <h2 className="font-heading font-bold text-sm mb-3 text-muted-foreground uppercase tracking-wide">Upcoming Tasks</h2>
        {assignments.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No upcoming tasks.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {assignments.map(a => (
              <div key={a.id} className="bg-card rounded-xl border border-border p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-warm-yellow/10 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-4 h-4 text-warm-yellow" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-heading font-bold truncate">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.subject} • Due: {a.due_date || 'TBA'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
