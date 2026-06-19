import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import { GraduationCap, ArrowRight } from 'lucide-react';

export default function TeacherSetup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name) return;
    setSaving(true);
    try {
      await base44.entities.TeacherProfile.create({ full_name: name, school_name: school });
      navigate('/teacher');
    } catch (e) { setSaving(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-green-50 flex flex-col items-center px-5 py-8">
      <div className="w-16 h-16 rounded-full bg-leaf-green flex items-center justify-center mb-4 shadow-lg">
        <GraduationCap className="w-8 h-8 text-white" />
      </div>
      <h1 className="text-2xl font-heading font-extrabold mb-1">Welcome, Teacher!</h1>
      <p className="text-sm text-muted-foreground mb-8">Set up your teaching profile</p>

      <div className="w-full max-w-sm space-y-5">
        <div>
          <label className="text-sm font-heading font-bold mb-1.5 block">Your Name</label>
          <Input placeholder="e.g. Mrs. Nkosi" value={name} onChange={e => setName(e.target.value)} className="h-12 text-base rounded-xl" />
        </div>
        <div>
          <label className="text-sm font-heading font-bold mb-1.5 block">School Name (optional)</label>
          <Input placeholder="e.g. Soweto Community School" value={school} onChange={e => setSchool(e.target.value)} className="h-12 text-base rounded-xl" />
        </div>
        <Button onClick={handleSave} disabled={!name || saving} className="w-full h-12 text-base rounded-xl bg-leaf-green hover:bg-leaf-green/90 font-heading font-bold gap-2">
          {saving ? 'Setting up...' : 'Go to Dashboard'} <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
