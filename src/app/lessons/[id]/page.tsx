"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle, Code, BookOpen, Rocket, MessageCircle, ThumbsUp, Eye, UserPlus, X, Send } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { LiveEditor } from "@/components/LiveEditor";
import { toast } from "sonner";

export default function LessonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [echoes, setEchoes] = useState<any[]>([]);
  const [revealedEchoes, setRevealedEchoes] = useState<Set<string>>(new Set());
  const [showMentorChat, setShowMentorChat] = useState(false);
  const [mentorChatLogs, setMentorChatLogs] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');

  const requestMentor = () => {
    toast.success("Pinging online Sages...");
    setTimeout(() => {
      setShowMentorChat(true);
      setMentorChatLogs([
        { sender: 'System', text: 'You have been paired with Sage [Guido van Rossum].' },
        { sender: 'Guido', text: 'Hello! I see you are stuck on this lesson. What part is giving you trouble?' }
      ]);
    }, 1500);
  };

  useEffect(() => {
    setMounted(true);
    fetch(`/api/lessons/${params.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          toast.error("Lesson not found");
          router.push("/lessons");
        } else {
          setLesson(data);
        }
        setLoading(false);
      });

    fetch(`/api/echoes/${params.id}`)
      .then(res => res.json())
      .then(data => setEchoes(data || []))
      .catch(() => {});
  }, [params.id, router]);

  if (!mounted || loading) return <div style={{ color: 'white', padding: '40px' }}>Initializing Lesson Engine...</div>;
  if (!lesson) return null;

  const handleComplete = async () => {
    try {
      const userRes = await fetch('/api/user');
      const userData = await userRes.json();
      
      const newCertifications = [...(userData.certifications || [])];
      if (!newCertifications.includes(lesson.title)) {
        newCertifications.push(lesson.title);
      }

      await fetch('/api/user', {
        method: 'PATCH',
        body: JSON.stringify({ 
          xp: (userData.xp || 0) + (lesson.xpReward || 100),
          certifications: newCertifications
        })
      });

      const confetti = (await import('canvas-confetti')).default;
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });

      setCompleted(true);
      toast.success(`Lesson Complete! +${lesson.xpReward} XP Earned.`);
    } catch (e) {
      toast.error("Failed to save progress.");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', minHeight: '100vh' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/lessons" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
            <motion.div whileHover={{ x: -4 }} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ArrowLeft size={20} /> Back
            </motion.div>
          </Link>
          <div style={{ width: '1px', height: '24px', background: 'var(--card-border)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 800 }}>{lesson.title}</h1>
            {lesson.certified && (
              <span title="Verified Course" style={{ background: 'var(--accent)', color: 'white', fontSize: '10px', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>CERTIFIED</span>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {lesson.officialLink && (
            <a href={lesson.officialLink} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: 'var(--primary)', textDecoration: 'none', borderBottom: '1px solid var(--primary)' }}>
              Official Docs
            </a>
          )}
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{lesson.duration}</span>
          <div style={{ padding: '4px 12px', borderRadius: '20px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', fontSize: '12px', fontWeight: 700 }}>
            {lesson.difficulty}
          </div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', height: 'calc(100vh - 200px)' }}>
        {/* Left: Content */}
        <section className="glass-card" style={{ overflowY: 'auto', padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', color: 'var(--primary)' }}>
            <BookOpen size={20} />
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Tutorial Content</h3>
          </div>
          
          <div className="prose prose-invert" style={{ color: 'rgba(255,255,255,0.9)', lineHeight: 1.7 }}>
            <ReactMarkdown>{lesson.content}</ReactMarkdown>
          </div>

          <div style={{ marginTop: '40px', padding: '24px', borderRadius: '16px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
            <h4 style={{ fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Rocket size={18} /> Pro Tip
            </h4>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              Try modifying the code on the right! The environment is live and persistent. 
              Once you feel comfortable with the concept, hit complete below.
            </p>
          </div>

          <button 
            onClick={handleComplete}
            disabled={completed}
            style={{ 
              width: '100%', 
              background: completed ? 'var(--accent)' : 'var(--primary)',
              color: 'white',
              border: 'none',
              padding: '16px',
              borderRadius: '12px',
              fontWeight: 700,
              marginTop: '32px',
              cursor: completed ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              boxShadow: completed ? 'none' : '0 10px 20px rgba(59, 130, 246, 0.3)'
            }}
          >
            {completed ? <CheckCircle size={20} /> : <Code size={20} />}
            {completed ? 'Lesson Completed' : 'Mark as Complete & Claim XP'}
          </button>

          {/* Post-Completion Review Dojo Prompt */}
          {completed && (
             <Link href={`/lessons/${params.id}/review`} style={{ textDecoration: 'none' }}>
               <button style={{ width: '100%', marginTop: '16px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '16px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                 Enter Review Dojo
               </button>
             </Link>
          )}

          {/* Echo Hints Section */}
          {echoes.length > 0 && (
            <div style={{ marginTop: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <MessageCircle size={18} color="var(--primary)" />
                <h4 style={{ fontWeight: 700, fontSize: '16px' }}>Community Echoes</h4>
                <span style={{ fontSize: '11px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '10px' }}>{echoes.length} Available</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {echoes.map((echo: any) => (
                  <div key={echo.id} className="glass-card" style={{ padding: '16px', border: '1px solid var(--card-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: echo.belt === 'YELLOW' ? '#facc15' : 'var(--primary)' }} />
                        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>{echo.authorId}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
                        <ThumbsUp size={12} /> {echo.netUpvotes}
                      </div>
                    </div>
                    
                    {revealedEchoes.has(echo.id) ? (
                      <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', lineHeight: 1.5 }}>
                        {echo.content}
                      </p>
                    ) : (
                      <button 
                        onClick={() => {
                          const newSet = new Set(revealedEchoes);
                          newSet.add(echo.id);
                          setRevealedEchoes(newSet);
                          toast.info("-5 XP to reveal Echo", { duration: 2000 });
                        }}
                        style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--card-border)', borderRadius: '8px', color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                      >
                        <Eye size={14} /> Reveal Hint
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mentorship Trigger */}
          {!completed && !showMentorChat && (
            <button 
              onClick={requestMentor}
              style={{ width: '100%', marginTop: '24px', background: 'transparent', border: '1px solid var(--card-border)', padding: '16px', borderRadius: '12px', color: 'var(--text-muted)', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}
              onMouseOver={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
              onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--card-border)'; }}
            >
              <UserPlus size={16} /> Still stuck? Request a Sage Mentorship Session
            </button>
          )}
        </section>

        {/* Right: Practice Environment */}
        <section style={{ height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', paddingLeft: '8px' }}>
            <Code size={18} color="var(--primary)" />
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>Practice Environment</span>
          </div>
          <LiveEditor />
        </section>
      </div>

      {/* Mentorship Chat Overlay */}
      <AnimatePresence>
        {showMentorChat && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              width: '350px',
              height: '450px',
              background: 'var(--card-bg)',
              border: '1px solid var(--primary)',
              borderRadius: '16px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 1000,
              overflow: 'hidden'
            }}
          >
            <div style={{ padding: '16px', background: 'rgba(59, 130, 246, 0.1)', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
                <span style={{ fontWeight: 700, fontSize: '14px' }}>Sage: Guido van Rossum</span>
              </div>
              <button onClick={() => setShowMentorChat(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>
            
            <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {mentorChatLogs.map((log, i) => (
                <div key={i} style={{ alignSelf: log.sender === 'You' ? 'flex-end' : 'flex-start', background: log.sender === 'You' ? 'var(--primary)' : log.sender === 'System' ? 'transparent' : 'rgba(255,255,255,0.05)', color: log.sender === 'System' ? 'var(--text-muted)' : 'white', padding: log.sender === 'System' ? '0' : '10px 14px', borderRadius: '12px', fontSize: log.sender === 'System' ? '11px' : '13px', textAlign: log.sender === 'System' ? 'center' : 'left', maxWidth: '85%' }}>
                  {log.text}
                </div>
              ))}
            </div>

            <div style={{ padding: '12px', borderTop: '1px solid var(--card-border)', display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && chatInput.trim()) {
                    setMentorChatLogs(prev => [...prev, { sender: 'You', text: chatInput }]);
                    setChatInput('');
                  }
                }}
                placeholder="Message your Sage..." 
                style={{ flex: 1, background: 'rgba(0,0,0,0.2)', border: '1px solid var(--card-border)', borderRadius: '8px', padding: '10px', color: 'white', fontSize: '13px', outline: 'none' }}
              />
              <button 
                onClick={() => {
                  if (chatInput.trim()) {
                    setMentorChatLogs(prev => [...prev, { sender: 'You', text: chatInput }]);
                    setChatInput('');
                  }
                }}
                style={{ background: 'var(--primary)', border: 'none', borderRadius: '8px', padding: '0 12px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
