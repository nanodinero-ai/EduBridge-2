import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/learner/BottomNav';
import { Switch } from '@/components/ui/switch';
import { User, Wifi, LogOut, BookOpen, Award, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LearnerProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [progress, setProgress] = useState([]);
  const [dataSaver, setDataSaver] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const profiles = await base44.entities.LearnerProfile.list('-created_date', 1);
        if (profiles.length > 0) {
          setProfile(profiles[0]);
          setDataSaver(profiles[0].data_saver_mode !== false);
        }
        const prog = await base44.entities.LessonProgress.filter({ status: 'completed' }, '-created_date', 100);
        setProgress(prog);
      } catch (e) {}
      setLoading(false);
    };
    load();
  }, []);

  const toggleDataSaver = async (val) => {
    setDataSaver(val);
    if (profile) {
      await base44.entities.LearnerProfile.update(profile.id, { data_saver_mode: val });
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-sky-blue" /></div>;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-gradient-to-br from-sky-blue to-blue-600 text-white px-5 pt-8 pb-10 rounded-b-3xl text-center">
        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
          <User className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-lg font-heading font-extrabold">{profile?.full_name || 'Learner'}</h1>
        <p className="text-sm opacity-80">{profile?.grade} • {profile?.province || 'South Africa'}</p>
      </div>

      <div className="px-4 -mt-5">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <BookOpen className="w-5 h-5 text-sky-blue mx-auto mb-1" />
            <p className="text-xl font-heading font-extrabold">{progress.length}</p>
            <p className="text-xs text-muted-foreground">Lessons Done</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <Award className="w-5 h-5 text-warm-yellow mx-auto mb-1" />
            <p className="text-xl font-heading font-extrabold">
              {progress.length > 0 ? Math.round(progress.filter(p => p.quiz_score).reduce((a, p) => a + (p.quiz_score || 0), 0) / Math.max(progress.filter(p => p.quiz_score).length, 1)) : 0}%
            </p>
            <p className="text-xs text-muted-foreground">Avg Score</p>
          </div>
        </div>

        {/* Data Saver */}
        <div className="bg-card rounded-xl border border-border p-4 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Wifi className="w-5 h-5 text-leaf-green" />
            <div>
              <p className="text-sm font-heading font-bold">Data Saver Mode</p>
              <p className="text-xs text-muted-foreground">Uses less mobile data</p>
            </div>
          </div>
          <Switch checked={dataSaver} onCheckedChange={toggleDataSaver} />
        </div>

        <Button variant="outline" onClick={() => navigate('/')} className="w-full mt-4 h-11 rounded-xl font-heading font-bold gap-2 text-muted-foreground">
          <LogOut className="w-4 h-4" /> Switch Role
        </Button>
      </div>

      <BottomNav />
    </div>
  );
}
