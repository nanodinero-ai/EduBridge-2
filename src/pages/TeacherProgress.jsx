import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import TeacherNav from '@/components/teacher/TeacherNav';
import { BarChart3, Loader2, CheckCircle, Clock, Users } from 'lucide-react';

export default function TeacherProgress() {
  const [progress, setProgress] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const prog = await base44.entities.LessonProgress.list('-created_date', 100);
        setProgress(prog);
        const att = await base44.entities.AttendanceLog.list('-login_date', 100);
        setAttendance(att);
      } catch (e) {}
      setLoading(false);
    };
    load();
  }, []);

  const completed = progress.filter(p => p.status === 'completed');
  const uniqueLearners = [...new Set(progress.map(p => p.learner_name))];
  const avgScore = completed.filter(c => c.quiz_score).length > 0
    ? Math.round(completed.filter(c => c.quiz_score).reduce((a, c) => a + c.quiz_score, 0) / completed.filter(c => c.quiz_score).length)
    : 0;

  // Subject breakdown
  const subjectStats = {};
  completed.forEach(p => {
    if (!subjectStats[p.subject]) subjectStats[p.subject] = 0;
    subjectStats[p.subject]++;
  });

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-leaf-green" /></div>;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-4 pt-5 pb-3">
        <h1 className="font-heading font-extrabold text-xl">📊 Attendance & Progress</h1>
        <p className="text-sm text-muted-foreground mt-1">Track learner engagement</p>
      </div>

      <div className="px-4">
        {/* Overview */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-card rounded-xl border border-border p-3 text-center">
            <Users className="w-5 h-5 text-sky-blue mx-auto mb-1" />
            <p className="text-lg font-heading font-extrabold">{uniqueLearners.length}</p>
            <p className="text-[10px] text-muted-foreground">Active</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-3 text-center">
            <CheckCircle className="w-5 h-5 text-leaf-green mx-auto mb-1" />
            <p className="text-lg font-heading font-extrabold">{completed.length}</p>
            <p className="text-[10px] text-muted-foreground">Completed</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-3 text-center">
            <BarChart3 className="w-5 h-5 text-warm-yellow mx-auto mb-1" />
            <p className="text-lg font-heading font-extrabold">{avgScore}%</p>
            <p className="text-[10px] text-muted-foreground">Avg Score</p>
          </div>
        </div>

        {/* Subject breakdown */}
        {Object.keys(subjectStats).length > 0 && (
          <div className="mb-6">
            <h2 className="font-heading font-bold text-sm mb-3 text-muted-foreground uppercase tracking-wide">By Subject</h2>
            <div className="space-y-2">
              {Object.entries(subjectStats).sort((a, b) => b[1] - a[1]).map(([subj, count]) => (
                <div key={subj} className="bg-card rounded-xl border border-border p-3 flex items-center justify-between">
                  <span className="text-sm font-heading font-bold">{subj}</span>
                  <span className="text-xs font-bold bg-leaf-green/10 text-leaf-green px-2.5 py-1 rounded-full">{count} done</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <h2 className="font-heading font-bold text-sm mb-3 text-muted-foreground uppercase tracking-wide">Recent Activity</h2>
        {completed.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No activity yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {completed.slice(0, 20).map(p => (
              <div key={p.id} className="bg-card rounded-xl border border-border p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-leaf-green/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-leaf-green" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-heading font-bold truncate">{p.learner_name || 'Learner'}</p>
                  <p className="text-xs text-muted-foreground">{p.lesson_title} • {p.subject}</p>
                </div>
                {p.quiz_score != null && <span className="text-xs font-bold text-sky-blue">{p.quiz_score}%</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      <TeacherNav />
    </div>
  );
}
