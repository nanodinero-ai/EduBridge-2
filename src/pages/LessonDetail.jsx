import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import BottomNav from '@/components/learner/BottomNav';
import { ArrowLeft, Play, FileText, Download, CheckCircle, Loader2, Volume2, Clock } from 'lucide-react';

export default function LessonDetail() {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await base44.entities.Lesson.filter({ id });
        if (data.length > 0) setLesson(data[0]);
      } catch (e) {}
      setLoading(false);
    };
    load();
  }, [id]);

  const markComplete = async () => {
    try {
      const profiles = await base44.entities.LearnerProfile.list('-created_date', 1);
      if (profiles.length > 0) {
        await base44.entities.LessonProgress.create({
          learner_id: profiles[0].id,
          learner_name: profiles[0].full_name,
          lesson_id: lesson.id,
          lesson_title: lesson.title,
          subject: lesson.subject,
          grade: lesson.grade,
          status: 'completed',
          completed_date: new Date().toISOString(),
        });
        setCompleted(true);
      }
    } catch (e) {}
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-sky-blue" /></div>;
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <p className="text-muted-foreground mb-4">Lesson not found</p>
        <Link to="/learner" className="text-sky-blue font-semibold">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 bg-background z-40 px-4 pt-4 pb-3 border-b border-border flex items-center gap-3">
        <Link to="/learner/lessons" className="p-1.5 rounded-lg hover:bg-muted"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="font-heading font-bold text-base flex-1 truncate">{lesson.title}</h1>
      </div>

      <div className="px-4 pt-4">
        {/* Lesson type & meta */}
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-blue/10 text-sky-blue">{lesson.subject}</span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-muted text-muted-foreground">{lesson.grade}</span>
          {lesson.duration_minutes > 0 && (
            <span className="text-xs text-muted-foreground flex items-center gap-0.5"><Clock className="w-3 h-3" /> {lesson.duration_minutes} min</span>
          )}
        </div>

        {lesson.teacher_name && <p className="text-sm text-muted-foreground mb-4">By {lesson.teacher_name}</p>}

        {lesson.description && (
          <div className="bg-muted/50 rounded-xl p-4 mb-4">
            <p className="text-sm leading-relaxed">{lesson.description}</p>
          </div>
        )}

        {/* Audio Player */}
        {lesson.audio_url && (
          <div className="bg-card rounded-xl border border-border p-4 mb-3">
            <div className="flex items-center gap-3 mb-3">
              <Volume2 className="w-5 h-5 text-sky-blue" />
              <span className="text-sm font-heading font-bold">Audio Lesson</span>
            </div>
            <audio controls className="w-full" src={lesson.audio_url}>
              Your browser does not support audio.
            </audio>
          </div>
        )}

        {/* Video Player */}
        {lesson.video_url && (
          <div className="bg-card rounded-xl border border-border p-4 mb-3">
            <div className="flex items-center gap-3 mb-3">
              <Play className="w-5 h-5 text-sky-blue" />
              <span className="text-sm font-heading font-bold">Video Lesson</span>
            </div>
            <video controls className="w-full rounded-lg" src={lesson.video_url}>
              Your browser does not support video.
            </video>
          </div>
        )}

        {/* Notes PDF */}
        {lesson.notes_url && (
          <a href={lesson.notes_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-leaf-green/10 rounded-xl p-4 mb-3 border border-leaf-green/20">
            <FileText className="w-5 h-5 text-leaf-green" />
            <div className="flex-1">
              <p className="text-sm font-heading font-bold text-leaf-green">Lesson Notes (PDF)</p>
              <p className="text-xs text-leaf-green/70">Tap to open or download</p>
            </div>
            <Download className="w-5 h-5 text-leaf-green" />
          </a>
        )}

        {/* Mark Complete */}
        <div className="mt-6">
          {completed ? (
            <div className="flex items-center justify-center gap-2 py-4 bg-leaf-green/10 rounded-xl">
              <CheckCircle className="w-5 h-5 text-leaf-green" />
              <span className="font-heading font-bold text-leaf-green">Lesson Completed! Well done! 🎉</span>
            </div>
          ) : (
            <Button onClick={markComplete} className="w-full h-12 rounded-xl bg-sky-blue hover:bg-sky-blue/90 font-heading font-bold text-base gap-2">
              <CheckCircle className="w-5 h-5" /> Mark as Complete
            </Button>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
