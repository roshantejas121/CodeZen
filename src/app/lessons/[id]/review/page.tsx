"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import Editor from "@monaco-editor/react";

export default function ReviewDojo() {
  const params = useParams();
  const router = useRouter();
  const [lesson, setLesson] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch(`/api/lessons/${params.id}`)
      .then(res => res.json())
      .then(data => setLesson(data));

    fetch(`/api/reviews/${params.id}`)
      .then(res => res.json())
      .then(data => setReviews(data));
  }, [params.id]);

  if (!lesson) return <div style={{ padding: '40px', color: 'white' }}>Loading Review Dojo...</div>;

  const currentReview = reviews[currentIndex];

  const handleAction = (action: string) => {
    toast.success(`Review submitted: ${action}. +10 Karma!`);
    if (currentIndex < reviews.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setReviews([]); // Queue clear
      toast.info("Review queue cleared!");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '32px' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <Link href={`/lessons/${params.id}`} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowLeft size={20} /> Exit Dojo
          </div>
        </Link>
        <div style={{ width: '1px', height: '24px', background: 'var(--card-border)' }} />
        <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Review Dojo: {lesson.title}</h1>
      </header>

      {!currentReview ? (
        <div className="glass-card" style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
          <CheckCircle size={48} color="#10b981" style={{ marginBottom: '16px' }} />
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>You are all caught up!</h2>
          <p style={{ color: 'var(--text-muted)' }}>No pending reviews for this challenge.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', flex: 1 }}>
          {/* Left: Problem Context */}
          <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h3 style={{ fontSize: '14px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Reviewing Code From</h3>
              <div style={{ fontSize: '20px', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary)' }} />
                {currentReview.submitterId}
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: '14px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Challenge Goal</h3>
              <p style={{ fontSize: '15px', lineHeight: 1.6, color: 'rgba(255,255,255,0.9)' }}>{lesson.description}</p>
            </div>
            
            <div style={{ marginTop: 'auto' }}>
              <h3 style={{ fontSize: '14px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Feedback Decision</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <button onClick={() => handleAction('Looks Good')} className="hover-glow" style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '12px', color: '#10b981', fontWeight: 700, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={24} /> Looks Good
                </button>
                <button onClick={() => handleAction('Minor Tweak')} className="hover-glow" style={{ padding: '16px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '12px', color: '#f59e0b', fontWeight: 700, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={24} /> Minor Tweak
                </button>
                <button onClick={() => handleAction('Flawed Logic')} className="hover-glow" style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px', color: '#ef4444', fontWeight: 700, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <XCircle size={24} /> Flawed Logic
                </button>
              </div>
            </div>
          </div>

          {/* Right: Code Viewer */}
          <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--card-border)' }}>
            <Editor
              height="100%"
              defaultLanguage="javascript"
              theme="vs-dark"
              value={currentReview.codeSnippet}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 14,
                padding: { top: 24 }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
