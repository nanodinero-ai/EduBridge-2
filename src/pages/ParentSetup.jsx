import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import { Heart, ArrowRight } from 'lucide-react';

export default function ParentSetup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [childName, setChildName] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name || !phone) return;
    setSaving(true);
    try {
      await base44.entities.ParentLink.create({
        parent_name: name,
        parent_phone: phone,
        learner_name: childName,
      });
      navigate('/parent');
    } catch (e) { setSaving(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex flex-col items-center px-5 py-8">
      <div className="w-16 h-16 rounded-full bg-soft-orange flex items-center justify-center mb-4 shadow-lg">
        <Heart className="w-8 h-8 text-white" />
      </div>
      <h1 className="text-2xl font-heading font-extrabold mb-1">Welcome, Parent!</h1>
      <p className="text-sm text-muted-foreground mb-8">Track your child's learning</p>

      <div className="w-full max-w-sm space-y-5">
        <div>
          <label className="text-sm font-heading font-bold mb-1.5 block">Your Name</label>
          <Input placeholder="e.g. Mama Dlamini" value={name} onChange={e => setName(e.target.value)} className="h-12 text-base rounded-xl" />
        </div>
        <div>
          <label className="text-sm font-heading font-bold mb-1.5 block">Your Phone Number</label>
          <Input placeholder="e.g. 072 123 4567" value={phone} onChange={e => setPhone(e.target.value)} className="h-12 text-base rounded-xl" />
        </div>
        <div>
          <label className="text-sm font-heading font-bold mb-1.5 block">Child's Name</label>
          <Input placeholder="e.g. Sipho Dlamini" value={childName} onChange={e => setChildName(e.target.value)} className="h-12 text-base rounded-xl" />
        </div>
        <Button onClick={handleSave} disabled={!name || !phone || saving} className="w-full h-12 text-base rounded-xl bg-soft-orange hover:bg-soft-orange/90 font-heading font-bold gap-2">
          {saving ? 'Setting up...' : 'View Dashboard'} <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
