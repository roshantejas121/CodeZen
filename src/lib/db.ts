import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
  fs.mkdirSync(path.join(process.cwd(), 'data'));
}

const INITIAL_DATA = {
  user: {
    name: "Roshan Teja",
    email: "roshan@devgrowth.com",
    xp: 24500,
    streak: 15,
    skillLevel: "Advanced",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Roshan",
    karma: 150,
    badges: ['Early Adopter'],
    region: "Asia",
    country: "IN",
    goals: [
      { id: 1, text: 'Master Rust Ownership Model', completed: false },
      { id: 2, text: 'Build a full-stack Next.js App', completed: true },
      { id: 3, text: 'Contribute to Open Source', completed: false },
    ],
    certifications: []
  },
  lessons: [
    { id: '1', title: "Generative AI with LLMs", xpReward: 5000, difficulty: "Advanced", category: "Artificial Intelligence", duration: "3 Weeks", description: "Master Transformer architecture, RLHF, and prompt engineering.", order: 1, externalLink: "https://www.coursera.org/learn/generative-ai-with-llms" },
    { id: '2', title: "System Design: High Scale", xpReward: 4000, difficulty: "Advanced", category: "Architecture", duration: "4 Months", description: "Design global-scale systems with load balancing and microservices.", order: 2, externalLink: "https://www.coursera.org/specializations/software-design-architecture" },
    { id: '3', title: "Kubernetes Admin (CKA)", xpReward: 4500, difficulty: "Advanced", category: "DevOps", duration: "5 Months", description: "Advanced cluster management and cloud-native security.", order: 3, externalLink: "https://www.coursera.org/specializations/architecting-google-kubernetes-engine" },
    { id: '4', title: "Quantum Developer", xpReward: 6000, difficulty: "Advanced", category: "Future Tech", duration: "6 Months", description: "Build the future with Qiskit and quantum algorithms.", order: 4, externalLink: "https://www.coursera.org/learn/quantum-computing-algorithms" },
    { id: '5', title: "Advanced Rust Orchestration", xpReward: 5500, difficulty: "Advanced", category: "Systems Engineering", duration: "4 Weeks", description: "Master safe concurrency and zero-cost abstractions with Rust.", order: 5, externalLink: "https://www.coursera.org/specializations/rust-programming" },
    { id: '6', title: "Full-Stack Edge Deployment", xpReward: 4800, difficulty: "Advanced", category: "Cloud Infrastructure", duration: "3 Weeks", description: "Deploy global-scale apps with Vercel Edge and Supabase.", order: 6, externalLink: "https://www.coursera.org/professional-certificates/meta-front-end-developer" }
  ],
  leaderboard: [
    { name: "Sarah Connor", xp: 45000, karma: 340, badges: { oracleLevel: 2 }, level: "Elite", streak: 42, region: "Americas", country: "US" },
    { name: "Roshan Teja", xp: 24500, karma: 150, badges: { architectLevel: 1 }, level: "Advanced", streak: 15, region: "Asia", country: "IN" },
    { name: "Linus Torvalds", xp: 99999, karma: 890, badges: { sageLevel: 3, oracleLevel: 3 }, level: "God Mode", streak: 1000, region: "Europe", country: "FI" },
    { name: "Ada Lovelace", xp: 12000, karma: 420, badges: { architectLevel: 3 }, level: "Intermediate", streak: 5, region: "Europe", country: "UK" },
    { name: "Alan Turing", xp: 8500, karma: 110, badges: {}, level: "Intermediate", streak: 8, region: "Europe", country: "UK" },
    { name: "Yukihiro Matsumoto", xp: 32000, karma: 560, badges: { sageLevel: 2 }, level: "Elite", streak: 200, region: "Asia", country: "JP" },
    { name: "Guido van Rossum", xp: 41000, karma: 780, badges: { sageLevel: 3 }, level: "Elite", streak: 150, region: "Americas", country: "US" },
  ],
  academy: [
    {
      id: 'html',
      name: 'HTML/CSS',
      category: 'Frontend',
      title: 'HTML5 Modern Standard',
      chapters: [
        { id: 'html-intro', title: 'HTML Introduction', desc: "Standard markup language for Web pages.", fact: "HTML stands for Hyper Text Markup Language.", code: "<h1>Hello World</h1>" }
      ]
    },
    {
      id: 'javascript',
      name: 'JavaScript',
      category: 'Frontend',
      title: 'JavaScript ES6+',
      chapters: [
        { id: 'js-intro', title: 'JS Introduction', desc: "World's most popular language.", fact: "JavaScript is the language of the Web.", code: "console.log('Hello World');" }
      ]
    }
  ],
  reviews: [
    {
      id: 'rev1',
      challengeId: '1',
      submitterId: 'Ada Lovelace',
      reviewerId: 'Roshan Teja',
      status: 'PENDING',
      feedbackText: '',
      codeSnippet: 'import { pipeline } from "transformers";\n\nconst generator = pipeline("text-generation", model="gpt2");\nconsole.log(generator("Hello, I am a language model,")[0].generated_text);',
      helpfulScore: 0,
      createdAt: new Date().toISOString()
    }
  ],
  mentorships: [],
  echoHints: [
    {
      id: 'echo1',
      challengeId: '1',
      authorId: 'Sarah Connor',
      belt: 'YELLOW',
      content: 'Make sure to understand how RLHF maps human preferences to a reward model before tuning the base model.',
      netUpvotes: 14,
      isHidden: false
    },
    {
      id: 'echo2',
      challengeId: '1',
      authorId: 'Linus Torvalds',
      belt: 'YELLOW',
      content: 'Transformers parallelize well. Don\'t get stuck thinking of them as sequential RNNs.',
      netUpvotes: 8,
      isHidden: false
    }
  ],
  squads: []
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
      user: { ...INITIAL_DATA.user, ...existing.user },
      leaderboard: existing.leaderboard || INITIAL_DATA.leaderboard,
      reviews: existing.reviews || INITIAL_DATA.reviews,
      mentorships: existing.mentorships || INITIAL_DATA.mentorships,
      echoHints: existing.echoHints || INITIAL_DATA.echoHints,
      squads: existing.squads || INITIAL_DATA.squads
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

  addKarma: (amount: number) => {
    const data = db.read();
    data.user.karma = (data.user.karma || 0) + amount;
    db.write(data);
    return data.user.karma;
  },

  getReviews: (challengeId?: string) => {
    const reviews = db.read().reviews || [];
    return challengeId ? reviews.filter((r: any) => r.challenge_id === challengeId) : reviews;
  },
  
  addReview: (review: any) => {
    const data = db.read();
    data.reviews = [...(data.reviews || []), { id: Date.now().toString(), ...review }];
    db.write(data);
    return data.reviews;
  },

  getLeaderboard: () => db.read().leaderboard,
  getLessons: () => db.read().lessons,
  getLesson: (id: string) => {
    const lessons = db.read().lessons || [];
    return lessons.find((l: any) => l.id === id);
  },
  getAcademy: () => db.read().academy,
};
