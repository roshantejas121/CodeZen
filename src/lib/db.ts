import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
  fs.mkdirSync(path.join(process.cwd(), 'data'));
}

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
  let next = LEVEL_THRESHOLDS[1] || null;

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
    level: current.level,
    levelTitle: current.title,
    levelColor: current.color,
    xpForNextLevel: next ? next.xp : null,
    xpIntoLevel,
    xpNeeded,
    progress,
    isMaxLevel: !next,
  };
}

const INITIAL_DATA = {
  user: {
    name: null,
    email: null,
    xp: 0,
    streak: 0,
    lastActiveDate: null,
    karma: 0,
    badges: [],
    certifications: [],
    goals: [],
    isNew: true,
  },
  lessons: [
    { id: '1', title: "Generative AI with LLMs", xpReward: 5000, difficulty: "Advanced", category: "AI", duration: "3 Weeks", description: "Master Transformer architecture, RLHF, and prompt engineering.", order: 1, externalLink: "https://www.coursera.org/learn/generative-ai-with-llms" },
    { id: '2', title: "System Design: High Scale", xpReward: 4000, difficulty: "Advanced", category: "Architecture", duration: "4 Months", description: "Design global-scale systems with load balancing and microservices.", order: 2, externalLink: "https://www.coursera.org/specializations/software-design-architecture" },
    { id: '3', title: "Kubernetes Admin (CKA)", xpReward: 4500, difficulty: "Advanced", category: "DevOps", duration: "5 Months", description: "Advanced cluster management and cloud-native security.", order: 3, externalLink: "https://www.coursera.org/specializations/architecting-google-kubernetes-engine" },
    { id: '4', title: "Ethical Hacking & Security", xpReward: 5500, difficulty: "Advanced", category: "Security", duration: "6 Months", description: "Learn penetration testing and digital forensic analysis.", order: 4, externalLink: "https://www.offsec.com/courses/pen-200/" },
    { id: '5', title: "Multi-Cloud Architect", xpReward: 4800, difficulty: "Advanced", category: "Cloud", duration: "4 Months", description: "Design hybrid solutions across AWS, Azure, and Google Cloud.", order: 5, externalLink: "https://aws.amazon.com/certification/certified-solutions-architect-associate/" },
    { id: '6', title: "Blockchain Engineering", xpReward: 5200, difficulty: "Advanced", category: "Web3", duration: "3 Months", description: "Master Solidity, smart contracts, and decentralized finance.", order: 6, externalLink: "https://ethereum.org/en/developers/docs/smart-contracts/" },
    { id: '7', title: "Deep Learning Specialization", xpReward: 6000, difficulty: "Advanced", category: "AI", duration: "5 Months", description: "Neural networks, computer vision, and sequence models.", order: 7, externalLink: "https://www.deeplearning.ai/program/deep-learning-specialization/" },
    { id: '8', title: "Mobile Mastery (Flutter)", xpReward: 3500, difficulty: "Intermediate", category: "Mobile", duration: "2 Months", description: "Build high-performance cross-platform apps with Flutter and Dart.", order: 8, externalLink: "https://flutter.dev/learn" },
    { id: '9', title: "GitOps & CI/CD Pipelines", xpReward: 4200, difficulty: "Intermediate", category: "DevOps", duration: "8 Weeks", description: "Automate delivery with ArgoCD, Jenkins, and GitHub Actions.", order: 9, externalLink: "https://www.cncf.io/training/" }
  ],
  leaderboard: [
    { name: "Linus Torvalds", xp: 99999, streak: 1000, region: "Europe" },
    { name: "Guido van Rossum", xp: 41000, streak: 150, region: "Americas" },
    { name: "Yukihiro Matsumoto", xp: 32000, streak: 200, region: "Asia" },
    { name: "Ada Lovelace", xp: 12000, streak: 5, region: "Europe" },
    { name: "Alan Turing", xp: 8500, streak: 8, region: "Europe" },
  ],
  academy: [
    {
      id: "html", name: "HTML/CSS", category: "Frontend", title: "Modern Web Foundations",
      chapters: [{ id: "html-1", title: "HTML Foundations", desc: "HTML defines the structure of every page.", fact: "HTML was created in 1991.", videoUrl: "https://www.youtube.com/embed/pQN-pnXPaVg", code: "<h1>Hello World</h1>" }]
    },
    {
      id: "javascript", name: "JavaScript", category: "Frontend", title: "Web Programming",
      chapters: [{ id: "js-1", title: "Variables & Logic", desc: "JS is the language of interactivity.", fact: "JS was created in 10 days.", videoUrl: "https://www.youtube.com/embed/W6NZfCO5SIk", code: "let name = 'Coder';\nconsole.log('Hello ' + name);" }]
    },
    {
      id: "typescript", name: "TypeScript", category: "Frontend", title: "Scaleable JS",
      chapters: [{ id: "ts-1", title: "TS Introduction", desc: "Typed superset of JavaScript.", fact: "TS transpiles to plain JS.", videoUrl: "https://www.youtube.com/embed/d56mG7DezGs", code: "let msg: string = 'Hello World';\nconsole.log(msg);" }]
    },
    {
      id: "python", name: "Python 3", category: "Backend", title: "Automating Everything",
      chapters: [{ id: "py-1", title: "Python Basics", desc: "Famous for simple, readable syntax.", fact: "Named after Monty Python.", videoUrl: "https://www.youtube.com/embed/_uQrJ0TkZlc", code: "print('Hello from Python!')" }]
    },
    {
      id: "cpp", name: "C++", category: "Systems", title: "High Performance",
      chapters: [{ id: "cpp-1", title: "C++ Basics", desc: "Used in game engines and browsers.", fact: "Created by Bjarne Stroustrup.", videoUrl: "https://www.youtube.com/embed/vLnPwxZdW4Y", code: "#include <iostream>\nint main() { std::cout << 'C++ Active'; return 0; }" }]
    },
    {
      id: "java", name: "Java", category: "Backend", title: "Enterprise Hub",
      chapters: [{ id: "java-1", title: "Java Foundations", desc: "Object-oriented language for Android/Web.", fact: "Originally named Oak.", videoUrl: "https://www.youtube.com/embed/eIrMbAQSU34", code: "public class Main { public static void main(String[] args) { System.out.println('Java Ready'); } }" }]
    },
    {
      id: "csharp", name: "C#", category: "Backend", title: ".NET Development",
      chapters: [{ id: "cs-1", title: "C# Basics", desc: "Microsoft modern language for apps.", fact: "Originally named Cool.", videoUrl: "https://www.youtube.com/embed/gfkTfcpWqAY", code: "using System; class Program { static void Main() { Console.WriteLine('C# Online'); } }" }]
    },
    {
      id: "rust", name: "Rust", category: "Systems", title: "Memory Safety",
      chapters: [{ id: "rs-1", title: "Memory Safety", desc: "Speed of C++ with memory safety.", fact: "Most loved language for years.", videoUrl: "https://www.youtube.com/embed/MsocPEZBd-M", code: "fn main() { println!('Rust Powered'); }" }]
    },
    {
      id: "go", name: "Go", category: "Backend", title: "Cloud Scale",
      chapters: [{ id: "go-1", title: "Go Basics", desc: "Built by Google for scale.", fact: "Designed at Google in 2007.", videoUrl: "https://www.youtube.com/embed/un6ZyFkqFKo", code: "package main\nimport 'fmt'\nfunc main() { fmt.Println('Go Cloud'); }" }]
    },
    {
      id: "ruby", name: "Ruby", category: "Backend", title: "Rapid Prototyping",
      chapters: [{ id: "rb-1", title: "Ruby Basics", desc: "Focuses on simplicity and productivity.", fact: "Created by Matz.", videoUrl: "https://www.youtube.com/embed/t_ispmWZEjY", code: "puts 'Ruby Hub Connected'" }]
    },
    {
      id: "swift", name: "Swift", category: "Mobile", title: "iOS Ecosystem",
      chapters: [{ id: "sw-1", title: "Swift Basics", desc: "Language for iOS and macOS.", fact: "Released in 2014.", videoUrl: "https://www.youtube.com/embed/comQ1-x2a1Q", code: "print('iOS Dev Mode')" }]
    },
    {
      id: "kotlin", name: "Kotlin", category: "Mobile", title: "Android Mastery",
      chapters: [{ id: "kt-1", title: "Kotlin Basics", desc: "Official language for Android.", fact: "Fully interoperable with Java.", videoUrl: "https://www.youtube.com/embed/F9UC9DY-vIU", code: "fun main() { println('Android Hub'); }" }]
    },
    {
      id: "php", name: "PHP", category: "Backend", title: "Web Scripting",
      chapters: [{ id: "php-1", title: "PHP Basics", desc: "Powers WordPress and Wikipedia.", fact: "Stands for Hypertext Preprocessor.", videoUrl: "https://www.youtube.com/embed/OK_JCtrrv-c", code: "<?php echo 'PHP Ready'; ?>" }]
    },
    {
      id: "bash", name: "Bash", category: "Systems", title: "Shell Mastery",
      chapters: [{ id: "bash-1", title: "Shell Scripting", desc: "Automate tasks in the command line.", fact: "Stands for Bourne Again SHell.", videoUrl: "https://www.youtube.com/embed/e7BufAVwGyM", code: "echo 'Bash Script Active'" }]
    },
    {
      id: "lua", name: "Lua", category: "GameDev", title: "Game Scripting",
      chapters: [{ id: "lua-1", title: "Lua Basics", desc: "Used in Roblox and WoW.", fact: "Lua means Moon in Portuguese.", videoUrl: "https://www.youtube.com/embed/iS9n5u90J7M", code: "print('Lua Script Ready')" }]
    }
  ],
  projects: [
    { id: 'p1', title: 'AI Snippet Manager', xpReward: 800, difficulty: 'Intermediate', category: 'AI Tools', description: 'Build a tool that auto-categorizes code snippets using LLMs.' },
    { id: 'p2', title: 'High-Performance Rust Proxy', xpReward: 1200, difficulty: 'Advanced', category: 'Systems', description: 'Develop a zero-copy TCP proxy with Rust and Tokio.' },
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
      user: { ...INITIAL_DATA.user, ...existing.user },
      leaderboard: existing.leaderboard || INITIAL_DATA.leaderboard,
      academy: INITIAL_DATA.academy,
      lessons: INITIAL_DATA.lessons,
      projects: INITIAL_DATA.projects
    };
  },
  write: (data: any) => { fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2)); },
  updateUser: (updates: any) => {
    const data = db.read();
    data.user = { ...data.user, ...updates };
    db.write(data);
    return data.user;
  },
  addXP: (amount: number) => {
    const data = db.read();
    data.user.xp = (data.user.xp || 0) + amount;
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (data.user.lastActiveDate !== today) {
      data.user.streak = data.user.lastActiveDate === yesterday ? (data.user.streak || 0) + 1 : 1;
      data.user.lastActiveDate = today;
    }
    db.write(data);
    return { xp: data.user.xp, ...getLevelInfo(data.user.xp) };
  },
  getLeaderboard: () => db.read().leaderboard,
  getLessons: () => db.read().lessons,
  getLesson: (id: string) => (db.read().lessons || []).find((l: any) => l.id === id),
  getAcademy: () => db.read().academy,
  getProjects: () => db.read().projects || [],
  claimBelt: (language: string, belt: string) => {
    const data = db.read();
    if (!data.user.certifications) data.user.certifications = [];
    const exists = data.user.certifications.find((c: any) => c.language === language && c.belt === belt);
    if (exists) return exists;
    const cert = {
      id: `CERT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      language, belt, date: new Date().toISOString(), verified: true, score: '100%'
    };
    data.user.certifications.push(cert);
    db.write(data);
    return cert;
  },
  getHighestBelt: (user: any) => {
    if (!user.certifications || user.certifications.length === 0) return "White";
    const beltOrder = ["White", "Yellow", "Orange", "Green", "Blue", "Black"];
    let highestIdx = 0;
    user.certifications.forEach((cert: any) => {
      const idx = beltOrder.indexOf(cert.belt);
      if (idx > highestIdx) highestIdx = idx;
    });
    return beltOrder[highestIdx];
  }
};
