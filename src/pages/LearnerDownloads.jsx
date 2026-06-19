import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import BottomNav from '@/components/learner/BottomNav';
import { Download, FileText, Volume2, CheckCircle, Loader2, WifiOff } from 'lucide-react';

export default function LearnerDownloads() {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.LessonProgress.list('-created_date', 50)
      .then(setProgress)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-4 pt-5 pb-3">
        <h1 className="font-heading font-extrabold text-xl">📥 Saved & Downloads</h1>
        <p className="text-sm text-muted-foreground mt-1">Access your lessons offline</p>
      </div>

      <div className="mx-4 bg-muted/50 rounded-xl p-4 mb-4 border border-border">
        <div className="flex items-start gap-3">
          <WifiOff className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-heading font-bold">Offline Study Tips</p>
            <p className="text-xs text-muted-foreground mt-1">Connect to free Wi-Fi at your community centre or library to download lessons. Study anytime, even without data!</p>
          </div>
        </div>
      </div>

      <div className="px-4">
        <h2 className="font-heading font-bold text-sm mb-3 text-muted-foreground uppercase tracking-wide">Completed Lessons</h2>
        {loading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-sky-blue" /></div>
        ) : progress.length === 0 ? (
          <div className="text-center py-12">
            <Download className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No saved lessons yet.</p>
            <p className="text-xs text-muted-foreground mt-1">Complete a lesson to see it here!</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {progress.map(p => (
              <div key={p.id} className="bg-card rounded-xl border border-border p-3.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-leaf-green/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4.5 h-4.5 text-leaf-green" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-heading font-bold truncate">{p.lesson_title || 'Lesson'}</p>
                  <p className="text-xs text-muted-foreground">{p.subject} • {p.grade}</p>
                </div>
                {p.quiz_score != null && (
                  <span className="text-xs font-bold text-leaf-green bg-leaf-green/10 px-2 py-1 rounded-full">{p.quiz_score}%</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
