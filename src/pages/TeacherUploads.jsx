import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import TeacherNav from '@/components/teacher/TeacherNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Upload, FileText, Mic, Video, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const grades = ["Grade 1","Grade 2","Grade 3","Grade 4","Grade 5","Grade 6","Grade 7","Grade 8","Grade 9","Grade 10","Grade 11","Grade 12"];
const subjects = ["Mathematics","English","Afrikaans","isiZulu","isiXhosa","Life Skills","Natural Sciences","Social Sciences","Technology","Economic Management Sciences","Life Orientation","Physical Sciences","Geography","History","Accounting","Business Studies","Computer Applications"];

export default function TeacherUpload() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [grade, setGrade] = useState('');
  const [subject, setSubject] = useState('');
  const [type, setType] = useState('notes');
  const [notesFile, setNotesFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [duration, setDuration] = useState('');
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    base44.entities.TeacherProfile.list('-created_date', 1).then(p => {
      if (p.length) setProfile(p[0]);
    }).catch(() => {});
  }, []);

  const uploadFile = async (file) => {
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    return file_url;
  };

  const handleSubmit = async () => {
    if (!title || !grade || !subject) return;
    setSaving(true);
    try {
      let notes_url, audio_url, video_url;
      if (notesFile) notes_url = await uploadFile(notesFile);
      if (audioFile) audio_url = await uploadFile(audioFile);
      if (videoFile) video_url = await uploadFile(videoFile);

      await base44.entities.Lesson.create({
        title,
        description,
        grade,
        subject,
        type,
        notes_url,
        audio_url,
        video_url,
        duration_minutes: duration ? parseInt(duration) : 0,
        teacher_name: profile?.full_name || 'Teacher',
        status: 'published',
      });
      navigate('/teacher');
    } catch (e) {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 bg-background z-40 px-4 pt-4 pb-3 border-b border-border flex items-center gap-3">
        <Link to="/teacher" className="p-1.5 rounded-lg hover:bg-muted"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="font-heading font-extrabold text-lg">Upload Lesson</h1>
      </div>

      <div className="px-4 py-4 space-y-4">
        <div>
          <label className="text-sm font-heading font-bold mb-1.5 block">Lesson Title *</label>
          <Input placeholder="e.g. Fractions - Adding" value={title} onChange={e => setTitle(e.target.value)} className="h-11 rounded-xl text-sm" />
        </div>

        <div>
          <label className="text-sm font-heading font-bold mb-1.5 block">Description</label>
          <Textarea placeholder="What will learners learn?" value={description} onChange={e => setDescription(e.target.value)} className="rounded-xl text-sm min-h-[80px]" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-heading font-bold mb-1.5 block">Grade *</label>
            <Select value={grade} onValueChange={setGrade}>
              <SelectTrigger className="h-11 rounded-xl text-sm"><SelectValue placeholder="Grade" /></SelectTrigger>
              <SelectContent>{grades.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-heading font-bold mb-1.5 block">Subject *</label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger className="h-11 rounded-xl text-sm"><SelectValue placeholder="Subject" /></SelectTrigger>
              <SelectContent>{subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="text-sm font-heading font-bold mb-1.5 block">Lesson Type</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { val: 'notes', icon: FileText, label: 'Notes/PDF' },
              { val: 'recorded', icon: Video, label: 'Video' },
              { val: 'live', icon: Mic, label: 'Audio' },
            ].map(t => (
              <button
                key={t.val}
                onClick={() => setType(t.val)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${type === t.val ? 'border-leaf-green bg-leaf-green/10 text-leaf-green' : 'border-border text-muted-foreground'}`}
              >
                <t.icon className="w-5 h-5" />
                <span className="text-xs font-semibold">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-heading font-bold mb-1.5 block">Duration (minutes)</label>
          <Input placeholder="e.g. 30" type="number" value={duration} onChange={e => setDuration(e.target.value)} className="h-11 rounded-xl text-sm" />
        </div>

        {/* File uploads */}
        <div className="space-y-3">
          <div>
            <label className="text-sm font-heading font-bold mb-1.5 block">📄 Notes/PDF File</label>
            <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx" onChange={e => setNotesFile(e.target.files[0])} className="text-sm w-full file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-muted file:text-foreground file:font-semibold file:text-sm" />
          </div>
          <div>
            <label className="text-sm font-heading font-bold mb-1.5 block">🎙️ Audio File</label>
            <input type="file" accept="audio/*" onChange={e => setAudioFile(e.target.files[0])} className="text-sm w-full file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-muted file:text-foreground file:font-semibold file:text-sm" />
          </div>
          <div>
            <label className="text-sm font-heading font-bold mb-1.5 block">🎥 Video File</label>
            <input type="file" accept="video/*" onChange={e => setVideoFile(e.target.files[0])} className="text-sm w-full file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-muted file:text-foreground file:font-semibold file:text-sm" />
          </div>
        </div>

        <Button onClick={handleSubmit} disabled={!title || !grade || !subject || saving} className="w-full h-12 rounded-xl bg-leaf-green hover:bg-leaf-green/90 font-heading font-bold text-base gap-2 mt-2">
          {saving ? <><Loader2 className="w-5 h-5 animate-spin" /> Uploading...</> : <><Upload className="w-5 h-5" /> Publish Lesson</>}
        </Button>
      </div>

      <TeacherNav />
    </div>
  );
}
