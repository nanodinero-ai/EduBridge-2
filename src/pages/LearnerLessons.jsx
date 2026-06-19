import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import BottomNav from '@/components/learner/BottomNav';
import LessonCard from '@/components/learner/LessonCard';
import { ArrowLeft, Search, Loader2, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';

export default function LearnerLessons() {
  const params = new URLSearchParams(window.location.search);
  const filterSubject = params.get('subject') || '';
  const filterGrade = params.get('grade') || '';

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const query = { status: 'published' };
        if (filterSubject) query.subject = filterSubject;
        if (filterGrade) query.grade = filterGrade;
        const data = await base44.entities.Lesson.filter(query, '-created_date', 50);
        setLessons(data);
      } catch (e) {}
      setLoading(false);
    };
    load();
  }, [filterSubject, filterGrade]);

  const filtered = search
    ? lessons.filter(l => l.title.toLowerCase().includes(search.toLowerCase()))
    : lessons;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 bg-background z-40 px-4 pt-4 pb-3 border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <Link to="/learner" className="p-1.5 rounded-lg hover:bg-muted"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="font-heading font-extrabold text-lg flex-1">
            {filterSubject || 'All Lessons'}
          </h1>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search lessons..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-10 rounded-xl text-sm" />
        </div>
      </div>

      <div className="px-4 py-4 space-y-2.5">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-sky-blue" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No lessons yet for this subject.</p>
            <p className="text-xs text-muted-foreground mt-1">Your teacher will upload them soon!</p>
          </div>
        ) : (
          filtered.map(l => <LessonCard key={l.id} lesson={l} />)
        )}
      </div>

      <BottomNav />
    </div>
  );
}
