import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import BottomNav from '@/components/learner/BottomNav';
import { Send, ArrowLeft, MessageCircle, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const chatRooms = [
  { id: 'maths', label: 'Mathematics', emoji: '🔢' },
  { id: 'english', label: 'English', emoji: '📖' },
  { id: 'science', label: 'Natural Sciences', emoji: '🔬' },
  { id: 'social', label: 'Social Sciences', emoji: '🌍' },
  { id: 'lifeskills', label: 'Life Skills', emoji: '🌟' },
  { id: 'general', label: 'General Help', emoji: '💬' },
];

export default function LearnerChat() {
  const params = new URLSearchParams(window.location.search);
  const roomParam = params.get('room');

  const [activeRoom, setActiveRoom] = useState(roomParam || null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    base44.entities.LearnerProfile.list('-created_date', 1).then(p => {
      if (p.length) setProfile(p[0]);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!activeRoom) return;
    setLoading(true);
    base44.entities.ChatMessage.filter({ room_id: activeRoom }, '-created_date', 50)
      .then(msgs => setMessages(msgs.reverse()))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeRoom]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMsg.trim() || sending) return;
    setSending(true);
    try {
      const msg = await base44.entities.ChatMessage.create({
        content: newMsg.trim(),
        sender_name: profile?.full_name || 'Learner',
        sender_role: 'learner',
        room_id: activeRoom,
        grade: profile?.grade,
      });
      setMessages(prev => [...prev, msg]);
      setNewMsg('');
    } catch (e) {}
    setSending(false);
  };

  // Room list view
  if (!activeRoom) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="px-4 pt-5 pb-3">
          <h1 className="font-heading font-extrabold text-xl">💬 Chat Rooms</h1>
          <p className="text-sm text-muted-foreground mt-1">Ask questions, help others</p>
        </div>
        <div className="px-4 space-y-2.5">
          {chatRooms.map(room => (
            <button
              key={room.id}
              onClick={() => setActiveRoom(room.id)}
              className="w-full flex items-center gap-3 bg-card rounded-xl p-4 border border-border hover:shadow-sm transition-all active:scale-[0.98] text-left"
            >
              <span className="text-2xl">{room.emoji}</span>
              <div>
                <p className="font-heading font-bold text-sm">{room.label}</p>
                <p className="text-xs text-muted-foreground">Tap to chat</p>
              </div>
            </button>
          ))}
        </div>
        <BottomNav />
      </div>
    );
  }

  const room = chatRooms.find(r => r.id === activeRoom);

  // Chat view
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="sticky top-0 bg-background z-40 px-4 pt-4 pb-3 border-b border-border flex items-center gap-3">
        <button onClick={() => setActiveRoom(null)} className="p-1.5 rounded-lg hover:bg-muted"><ArrowLeft className="w-5 h-5" /></button>
        <span className="text-xl">{room?.emoji}</span>
        <h1 className="font-heading font-bold text-base flex-1">{room?.label}</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ paddingBottom: '80px' }}>
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-sky-blue" /></div>
        ) : messages.length === 0 ? (
          <div className="text-center py-16">
            <MessageCircle className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No messages yet.</p>
            <p className="text-xs text-muted-foreground">Be the first to ask a question!</p>
          </div>
        ) : (
          messages.map(msg => {
            const isMe = msg.sender_name === profile?.full_name;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 ${isMe ? 'bg-sky-blue text-white rounded-br-md' : 'bg-muted rounded-bl-md'}`}>
                  {!isMe && (
                    <p className={`text-[10px] font-bold mb-0.5 ${msg.sender_role === 'teacher' ? 'text-leaf-green' : 'text-muted-foreground'}`}>
                      {msg.sender_name} {msg.sender_role === 'teacher' ? '👩‍🏫' : ''}
                    </p>
                  )}
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="fixed bottom-16 left-0 right-0 bg-background border-t border-border px-4 py-3">
        <div className="flex items-center gap-2 max-w-lg mx-auto">
          <Input
            placeholder="Type your message..."
            value={newMsg}
            onChange={e => setNewMsg(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            className="flex-1 h-10 rounded-xl text-sm"
          />
          <Button onClick={sendMessage} disabled={!newMsg.trim() || sending} size="icon" className="h-10 w-10 rounded-xl bg-sky-blue hover:bg-sky-blue/90 flex-shrink-0">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
