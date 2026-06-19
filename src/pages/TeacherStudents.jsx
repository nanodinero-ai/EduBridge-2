import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import TeacherNav from '@/components/teacher/TeacherNav';
import { Users, Search, Loader2, GraduationCap } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function TeacherStudents() {
  const [learners, setLearners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    base44.entities.LearnerProfile.list('-created_date', 200)
      .then(setLearners)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = search
    ? learners.filter(l => l.full_name?.toLowerCase().includes(search.toLowerCase()) || l.grade?.toLowerCase().includes(search.toLowerCase()))
    : learners;

  const gradeGroups = {};
  filtered.forEach(l => {
    const g = l.grade || 'Unknown';
    if (!gradeGroups[g]) gradeGroups[g] = [];
    gradeGroups[g].push(l);
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-4 pt-5 pb-3">
        <h1 className="font-heading font-extrabold text-xl">👨‍🎓 Learners</h1>
        <p className="text-sm text-muted-foreground mt-1">{learners.length} registered learners</p>
      </div>

      <div className="px-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by name or grade..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-10 rounded-xl text-sm" />
        </div>
      </div>

      <div className="px-4">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-leaf-green" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No learners found.</p>
          </div>
        ) : (
          Object.entries(gradeGroups).sort().map(([grade, students]) => (
            <div key={grade} className="mb-5">
              <h3 className="font-heading font-bold text-sm text-muted-foreground mb-2 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4" /> {grade} ({students.length})
              </h3>
              <div className="space-y-2">
                {students.map(s => (
                  <div key={s.id} className="bg-card rounded-xl border border-border p-3 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-sky-blue/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-sky-blue">{s.full_name?.charAt(0)?.toUpperCase() || '?'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-heading font-bold truncate">{s.full_name}</p>
                      <p className="text-xs text-muted-foreground">{s.province || 'South Africa'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <TeacherNav />
    </div>
  );
}
