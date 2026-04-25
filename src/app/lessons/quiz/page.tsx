"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  ArrowLeft, 
  CheckCircle2, 
  HelpCircle, 
  Trophy,
  ArrowRight
} from "lucide-react";

const quizQuestions = [
  {
    id: 1,
    question: "What is the primary benefit of using React Hooks?",
    options: [
      "Faster rendering of static pages",
      "Sharing stateful logic between components",
      "Replacing CSS with JavaScript",
      "Connecting to a database directly"
    ],
    correct: 1
  },
  {
    id: 2,
    question: "Which hook is used for side effects in React?",
    options: ["useState", "useMemo", "useEffect", "useCallback"],
    correct: 2
  }
];

export default function QuizPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);

  const handleNext = () => {
    if (selectedOption === quizQuestions[currentStep].correct) {
      setScore(score + 1);
    }

    if (currentStep < quizQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div style={{ maxWidth: '600px', margin: '100px auto', textAlign: 'center' }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
          <Trophy size={80} color="#f59e0b" style={{ marginBottom: '24px' }} />
        </motion.div>
        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px' }}>Quiz Completed!</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '18px', marginBottom: '32px' }}>
          You scored {score} out of {quizQuestions.length}. You earned 200 XP!
        </p>
        <Link href="/lessons" style={{ textDecoration: 'none' }}>
          <button style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '12px 32px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>
            Back to Lessons
          </button>
        </Link>
      </div>
    );
  }

  const currentQuestion = quizQuestions[currentStep];

  return (
    <div style={{ maxWidth: '700px', margin: '40px auto' }}>
      <header style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>
            Question {currentStep + 1} of {quizQuestions.length}
          </span>
          <div style={{ width: '150px', height: '6px', background: 'var(--glass-bg)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${((currentStep + 1) / quizQuestions.length) * 100}%`, height: '100%', background: 'var(--primary)', transition: '0.3s' }} />
          </div>
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 700 }}>{currentQuestion.question}</h2>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
        {currentQuestion.options.map((option, index) => (
          <div
            key={index}
            onClick={() => setSelectedOption(index)}
            className="glass-card"
            style={{ 
              padding: '20px', 
              cursor: 'pointer', 
              borderColor: selectedOption === index ? 'var(--primary)' : 'var(--card-border)',
              background: selectedOption === index ? 'rgba(59, 130, 246, 0.05)' : 'var(--card-bg)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ 
                width: '24px', 
                height: '24px', 
                borderRadius: '50%', 
                border: '2px solid', 
                borderColor: selectedOption === index ? 'var(--primary)' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {selectedOption === index && <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary)' }} />}
              </div>
              <span style={{ fontWeight: 500 }}>{option}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          disabled={selectedOption === null}
          onClick={handleNext}
          style={{ 
            background: selectedOption === null ? 'var(--glass-bg)' : 'var(--primary)', 
            color: 'white', 
            border: 'none', 
            padding: '12px 32px', 
            borderRadius: '12px', 
            fontWeight: 700,
            cursor: selectedOption === null ? 'not-allowed' : 'pointer',
            opacity: selectedOption === null ? 0.5 : 1
          }}
        >
          {currentStep === quizQuestions.length - 1 ? 'Finish' : 'Next Question'}
        </button>
      </div>
    </div>
  );
}
