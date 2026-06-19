import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import BottomNav from '@/components/learner/BottomNav';
import DataSaverBanner from '@/components/learner/DataSaverBanner';
import SubjectCard from '@/components/learner/SubjectCard';
import LessonCard from '@/components/learner/LessonCard';
import { Sun, Moon, Sparkles, ChevronRight, Loader2 } from 'lucide-react';

const gradeSubjects = {
  primary: ['Mathematics','English','Afrikaans','isiZulu','Life Skills','Natural Sciences','Social Sciences','Technology'],
  high: ['Mathematics','English','Afrikaans','isiZulu','Life Orientation','Natural Sciences','Social Sciences','Economic Management Sciences','Physical Sciences','Geography','History','Accounting','Business Studies','Computer Applications','Technology'],
};

export default function LearnerHome() {
  const [profile, setProfile] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [dataSaver, setDataSaver] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const profiles = await base44.entities.LearnerProfile.list('-created_date', 1);
        if (profiles.length > 0) {
          setProfile(profiles[0]);
          setDataSaver(profiles[0].data_saver_mode !== false);
          const allLessons = await base44.entities.Lesson.filter({ grade: profiles[0].grade, status: 'published' }, '-created_date', 5);
          setLessons(allLessons);
        }
      } catch (e) {}
      setLoading(false);
    };
    load();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const GreetIcon = hour < 17 ? Sun : Moon;

  const gradeNum = profile ? parseInt(profile.grade?.replace('Grade ', '')) : 1;
  const subjects = gradeNum <= 7 ? gradeSubjects.primary : gradeSubjects.high;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-sky-blue" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-sky-blue to-blue-600 text-white px-5 pt-6 pb-8 rounded-b-3xl">
        <div className="flex items-center gap-2 mb-1">
          <GreetIcon className="w-5 h-5 text-warm-yellow" />
          <span className="text-sm opacity-90">{greeting}</span>
        </div>
        <h1 className="text-xl font-heading font-extrabold">{profile?.full_name || 'Learner'} 👋</h1>
        <p className="text-sm opacity-80 mt-0.5">{profile?.grade} • Let's learn today!</p>
      </div>

      <DataSaverBanner enabled={dataSaver} onToggle={() => setDataSaver(!dataSaver)} />

      {/* Recent Lessons */}
      {lessons.length > 0 && (
        <div className="px-4 mt-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading font-bold text-base flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-warm-yellow" /> New Lessons
            </h2>
            <Link to="/learner/lessons" className="text-xs text-sky-blue font-semibold flex items-center gap-0.5">
              See all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-2.5">
            {lessons.map(l => <LessonCard key={l.id} lesson={l} />)}
          </div>
        </div>
      )}

      {/* Subjects Grid */}
      <div className="px-4 mt-6">
        <h2 className="font-heading font-bold text-base mb-3">📚 My Subjects</h2>
        <div className="space-y-2">
          {subjects.map(s => (
            <SubjectCard key={s} subject={s} grade={profile?.grade} />
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
