import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import TeacherNav from '@/components/teacher/TeacherNav';
import { BookOpen, Users, FileText, Plus, Loader2, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TeacherDashboard() {
  const [profile, setProfile] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [learnerCount, setLearnerCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const profiles = await base44.entities.TeacherProfile.list('-created_date', 1);
        if (profiles.length > 0) setProfile(profiles[0]);
        const allLessons = await base44.entities.Lesson.list('-created_date', 50);
        setLessons(allLessons);
        const learners = await base44.entities.LearnerProfile.list('-created_date', 200);
        setLearnerCount(learners.length);
      } catch (e) {}
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-leaf-green" /></div>;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-gradient-to-br from-leaf-green to-emerald-700 text-white px-5 pt-6 pb-8 rounded-b-3xl">
        <p className="text-sm opacity-80">Teacher Dashboard</p>
        <h1 className="text-xl font-heading font-extrabold mt-1">{profile?.full_name || 'Teacher'} 👩‍🏫</h1>
        {profile?.school_name && <p className="text-sm opacity-80 mt-0.5">{profile.school_name}</p>}
      </div>

      <div className="px-4 -mt-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-card rounded-xl border border-border p-3 text-center">
            <BookOpen className="w-5 h-5 text-leaf-green mx-auto mb-1" />
            <p className="text-lg font-heading font-extrabold">{lessons.length}</p>
            <p className="text-[10px] text-muted-foreground">Lessons</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-3 text-center">
            <Users className="w-5 h-5 text-sky-blue mx-auto mb-1" />
            <p className="text-lg font-heading font-extrabold">{learnerCount}</p>
            <p className="text-[10px] text-muted-foreground">Learners</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-3 text-center">
            <TrendingUp className="w-5 h-5 text-warm-yellow mx-auto mb-1" />
            <p className="text-lg font-heading font-extrabold">{lessons.filter(l => l.status === 'published').length}</p>
            <p className="text-[10px] text-muted-foreground">Published</p>
          </div>
        </div>

        <Link to="/teacher/upload">
          <Button className="w-full h-12 rounded-xl bg-leaf-green hover:bg-leaf-green/90 font-heading font-bold text-base gap-2 mb-6">
            <Plus className="w-5 h-5" /> Upload New Lesson
          </Button>
        </Link>

        {/* Recent Lessons */}
        <h2 className="font-heading font-bold text-sm mb-3 text-muted-foreground uppercase tracking-wide">Recent Lessons</h2>
        {lessons.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No lessons uploaded yet.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {lessons.slice(0, 10).map(l => (
              <div key={l.id} className="bg-card rounded-xl border border-border p-3.5 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${l.type === 'notes' ? 'bg-leaf-green/10' : l.type === 'live' ? 'bg-destructive/10' : 'bg-sky-blue/10'}`}>
                  {l.type === 'notes' ? <FileText className="w-4 h-4 text-leaf-green" /> : <BookOpen className={`w-4 h-4 ${l.type === 'live' ? 'text-destructive' : 'text-sky-blue'}`} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-heading font-bold truncate">{l.title}</p>
                  <p className="text-xs text-muted-foreground">{l.subject} • {l.grade}</p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${l.status === 'published' ? 'bg-leaf-green/10 text-leaf-green' : 'bg-muted text-muted-foreground'}`}>
                  {l.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <TeacherNav />
    </div>
  );
}
