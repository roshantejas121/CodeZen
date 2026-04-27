import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
  fs.mkdirSync(path.join(process.cwd(), 'data'));
}

// ─────────────────────────────────────────────────────────────
// REAL LEVEL PROGRESSION SYSTEM (15 tiers)
// ─────────────────────────────────────────────────────────────
export const LEVEL_THRESHOLDS = [
  { level: 1,  xp: 0,       title: 'Initiate',      color: '#94a3b8' },
  { level: 2,  xp: 300,     title: 'Apprentice',    color: '#64748b' },
  { level: 3,  xp: 800,     title: 'Coder',         color: '#22c55e' },
  { level: 4,  xp: 1800,    title: 'Developer',     color: '#16a34a' },
  { level: 5,  xp: 3500,    title: 'Engineer',      color: '#38bdf8' },
  { level: 6,  xp: 6000,    title: 'Craftsman',     color: '#0ea5e9' },
  { level: 7,  xp: 10000,   title: 'Architect',     color: '#818cf8' },
  { level: 8,  xp: 16000,   title: 'Senior',        color: '#6366f1' },
  { level: 9,  xp: 25000,   title: 'Principal',     color: '#a855f7' },
  { level: 10, xp: 38000,   title: 'Expert',        color: '#9333ea' },
  { level: 11, xp: 56000,   title: 'Distinguished', color: '#f59e0b' },
  { level: 12, xp: 80000,   title: 'Fellow',        color: '#f97316' },
  { level: 13, xp: 112000,  title: 'Legend',        color: '#ef4444' },
  { level: 14, xp: 155000,  title: 'Mythic',        color: '#e11d48' },
  { level: 15, xp: 210000,  title: 'God Mode',      color: '#fbbf24' },
];

export function getLevelInfo(xp: number) {
  let current = LEVEL_THRESHOLDS[0];
  let next: typeof LEVEL_THRESHOLDS[0] | null = LEVEL_THRESHOLDS[1];

  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i].xp) {
      current = LEVEL_THRESHOLDS[i];
      next = LEVEL_THRESHOLDS[i + 1] || null;
      break;
    }
  }

  const xpIntoLevel = next ? xp - current.xp : 0;
  const xpNeeded    = next ? next.xp - current.xp : 1;
  const progress    = next ? Math.min(100, Math.round((xpIntoLevel / xpNeeded) * 100)) : 100;

  return {
    level:          current.level,
    levelTitle:     current.title,
    levelColor:     current.color,
    xpForNextLevel: next ? next.xp : null,
    xpIntoLevel,
    xpNeeded,
    progress,
    isMaxLevel:     !next,
  };
}

// ─────────────────────────────────────────────────────────────
// FRESH USER — starts at 0, nothing faked
// ─────────────────────────────────────────────────────────────
const INITIAL_DATA = {
  user: {
    name: null as string | null,
    email: null as string | null,
    xp: 0,
    streak: 0,
    lastActiveDate: null as string | null,
    karma: 0,
    badges: [] as string[],
    certifications: [] as string[],
    goals: [] as any[],
    isNew: true,
  },
  lessons: [
    { id: '1', title: "Generative AI with LLMs",     xpReward: 5000, difficulty: "Advanced", category: "Artificial Intelligence", duration: "3 Weeks",  description: "Master Transformer architecture, RLHF, and prompt engineering.",    order: 1, externalLink: "https://www.coursera.org/learn/generative-ai-with-llms" },
    { id: '2', title: "System Design: High Scale",   xpReward: 4000, difficulty: "Advanced", category: "Architecture",            duration: "4 Months", description: "Design global-scale systems with load balancing and microservices.", order: 2, externalLink: "https://www.coursera.org/specializations/software-design-architecture" },
    { id: '3', title: "Kubernetes Admin (CKA)",       xpReward: 4500, difficulty: "Advanced", category: "DevOps",                  duration: "5 Months", description: "Advanced cluster management and cloud-native security.",             order: 3, externalLink: "https://www.coursera.org/specializations/architecting-google-kubernetes-engine" },
    { id: '4', title: "Quantum Developer",            xpReward: 6000, difficulty: "Advanced", category: "Future Tech",             duration: "6 Months", description: "Build the future with Qiskit and quantum algorithms.",               order: 4, externalLink: "https://www.coursera.org/learn/quantum-computing-algorithms" },
    { id: '5', title: "Advanced Rust Orchestration", xpReward: 5500, difficulty: "Advanced", category: "Systems Engineering",     duration: "4 Weeks",  description: "Master safe concurrency and zero-cost abstractions with Rust.",      order: 5, externalLink: "https://www.coursera.org/specializations/rust-programming" },
    { id: '6', title: "Full-Stack Edge Deployment",  xpReward: 4800, difficulty: "Advanced", category: "Cloud Infrastructure",    duration: "3 Weeks",  description: "Deploy global-scale apps with Vercel Edge and Supabase.",           order: 6, externalLink: "https://www.coursera.org/professional-certificates/meta-front-end-developer" },
  ],
  leaderboard: [
    { name: "Sarah Connor",       xp: 45000, streak: 42,   region: "Americas" },
    { name: "Linus Torvalds",     xp: 99999, streak: 1000, region: "Europe"   },
    { name: "Ada Lovelace",       xp: 12000, streak: 5,    region: "Europe"   },
    { name: "Alan Turing",        xp: 8500,  streak: 8,    region: "Europe"   },
    { name: "Yukihiro Matsumoto", xp: 32000, streak: 200,  region: "Asia"     },
    { name: "Guido van Rossum",   xp: 41000, streak: 150,  region: "Americas" },
  ],
  academy: [
    { id: 'html',       name: 'HTML/CSS',   category: 'Frontend', title: 'HTML5 Modern Standard', chapters: [{ id: 'html-intro', title: 'HTML Introduction', desc: "Standard markup language for Web pages.", fact: "HTML stands for Hyper Text Markup Language.", code: "<h1>Hello World</h1>" }] },
    { id: 'javascript', name: 'JavaScript', category: 'Frontend', title: 'JavaScript ES6+',       chapters: [{ id: 'js-intro',   title: 'JS Introduction',   desc: "World's most popular language.",          fact: "JavaScript is the language of the Web.",      code: "console.log('Hello World');" }] },
  ],
  reviews:      [],
  mentorships:  [],
  echoHints:    [],
  squads:       [],
  projects: [
    { id: 'p1', title: 'AI Snippet Manager',          xpReward: 800,  difficulty: 'Intermediate', category: 'AI Tools',   description: 'Build a tool that auto-categorizes code snippets using LLMs.' },
    { id: 'p2', title: 'High-Performance Rust Proxy', xpReward: 1200, difficulty: 'Advanced',     category: 'Systems',    description: 'Develop a zero-copy TCP proxy with Rust and Tokio.' },
    { id: 'p3', title: 'Web3 Auth Provider',          xpReward: 1000, difficulty: 'Intermediate', category: 'Blockchain', description: 'Implement a secure authentication layer using Ethereum wallets.' },
  ],
};

export const db = {
  read: () => {
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify(INITIAL_DATA, null, 2));
      return INITIAL_DATA;
    }
    const existing = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    return {
      ...INITIAL_DATA,
      ...existing,
      user:        { ...INITIAL_DATA.user,        ...existing.user        },
      leaderboard: existing.leaderboard || INITIAL_DATA.leaderboard,
      reviews:     existing.reviews     || INITIAL_DATA.reviews,
      mentorships: existing.mentorships || INITIAL_DATA.mentorships,
      echoHints:   existing.echoHints   || INITIAL_DATA.echoHints,
      squads:      existing.squads      || INITIAL_DATA.squads,
      projects:    existing.projects    || INITIAL_DATA.projects,
    };
  },

  write: (data: any) => {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  },

  updateUser: (updates: any) => {
    const data = db.read();
    data.user = { ...data.user, ...updates };
    db.write(data);
    return data.user;
  },

  addXP: (amount: number) => {
    const data = db.read();
    data.user.xp = (data.user.xp || 0) + amount;

    // Streak: increment if last active was yesterday; reset if older
    const today     = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (data.user.lastActiveDate !== today) {
      data.user.streak = data.user.lastActiveDate === yesterday
        ? (data.user.streak || 0) + 1
        : 1;
      data.user.lastActiveDate = today;
    }
    db.write(data);
    return { xp: data.user.xp, ...getLevelInfo(data.user.xp) };
  },

  getReviews:    (challengeId?: string) => { const r = db.read().reviews || []; return challengeId ? r.filter((x: any) => x.challengeId === challengeId) : r; },
  addReview:     (review: any)          => { const data = db.read(); data.reviews = [...(data.reviews || []), { id: Date.now().toString(), ...review }]; db.write(data); return data.reviews; },
  getLeaderboard: () => db.read().leaderboard,
  getLessons:     () => db.read().lessons,
  getLesson:      (id: string) => (db.read().lessons || []).find((l: any) => l.id === id),
  getAcademy:     () => db.read().academy,
  getProjects:    () => db.read().projects || [],
};
