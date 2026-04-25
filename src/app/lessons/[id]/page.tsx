"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle, Code, BookOpen, Rocket } from "lucide-react";
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
    </div>
  );
}
