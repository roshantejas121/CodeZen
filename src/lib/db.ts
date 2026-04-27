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
    certifications: [] as any[],
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
    {
      "id": "html",
      "name": "HTML/CSS",
      "category": "Frontend",
      "title": "Modern Web Foundations",
      "chapters": [
        {
          "id": "html-1",
          "title": "HTML Foundations",
          "desc": "HTML is the backbone of the web. It defines the structure of every page you visit.",
          "fact": "HTML was created by Tim Berners-Lee in 1991.",
          "videoUrl": "https://www.youtube.com/embed/pQN-pnXPaVg",
          "code": "<h1>Hello World</h1>\n<p>Welcome to CodeZen Academy!</p>"
        },
        {
          "id": "html-2",
          "title": "CSS Styling",
          "desc": "CSS makes the web beautiful. It controls layout, colors, and fonts.",
          "fact": "CSS was first proposed by Håkon Wium Lie in 1994.",
          "videoUrl": "https://www.youtube.com/embed/1Rs2ND1RYYc",
          "code": "<style>\n  h1 { color: #3b82f6; font-family: sans-serif; }\n</style>\n<h1>Styled Title</h1>"
        }
      ]
    },
    {
      "id": "javascript",
      "name": "JavaScript",
      "category": "Frontend",
      "title": "Dynamic Web Programming",
      "chapters": [
        {
          "id": "js-1",
          "title": "Variables & Logic",
          "desc": "JavaScript is the language of interactivity. It allows pages to react to user actions.",
          "fact": "JS was created in just 10 days by Brendan Eich.",
          "videoUrl": "https://www.youtube.com/embed/W6NZfCO5SIk",
          "code": "let name = \"Coder\";\nconsole.log(\"Hello \" + name);"
        },
        {
          "id": "js-2",
          "title": "Arrays & Objects",
          "desc": "Learn how to store and manipulate complex data structures in JavaScript.",
          "fact": "JavaScript is not Java - they are completely different languages.",
          "videoUrl": "https://www.youtube.com/embed/R9I85FE27Yw",
          "code": "const users = [\"Alice\", \"Bob\"];\nconsole.log(users[0]);"
        }
      ]
    },
    {
      "id": "typescript",
      "name": "TypeScript",
      "category": "Frontend",
      "title": "Scaleable JavaScript",
      "chapters": [
        {
          "id": "ts-1",
          "title": "Type Safety",
          "desc": "TypeScript adds a layer of safety to JavaScript by catching errors before you run your code.",
          "fact": "TS is developed and maintained by Microsoft.",
          "videoUrl": "https://www.youtube.com/embed/d56mG7DezGs",
          "code": "interface User { id: number; name: string; }\nconst u: User = { id: 1, name: \"Zen\" };\nconsole.log(u.name);"
        }
      ]
    },
    {
      "id": "python",
      "name": "Python 3",
      "category": "Backend",
      "title": "Automating Everything",
      "chapters": [
        {
          "id": "py-1",
          "title": "Python Basics",
          "desc": "Python is famous for its simple, readable syntax. Perfect for beginners and pros alike.",
          "fact": "Python was named after the comedy group Monty Python.",
          "videoUrl": "https://www.youtube.com/embed/_uQrJ0TkZlc",
          "code": "name = \"World\"\nprint(f\"Hello {name}!\")"
        }
      ]
    },
    {
      "id": "cpp",
      "name": "C++",
      "category": "Systems",
      "title": "High Performance Systems",
      "chapters": [
        {
          "id": "cpp-1",
          "title": "C++ Architecture",
          "desc": "C++ gives you low-level control over hardware, used in game engines and browsers.",
          "fact": "C++ is an extension of the C language created by Bjarne Stroustrup.",
          "videoUrl": "https://www.youtube.com/embed/vLnPwxZdW4Y",
          "code": "#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << \"System Online\" << endl;\n  return 0;\n}"
        }
      ]
    },
    {
      "id": "java",
      "name": "Java",
      "category": "Backend",
      "title": "Enterprise Engineering",
      "chapters": [
        {
          "id": "java-1",
          "title": "Java Syntax",
          "desc": "Java is a robust, object-oriented language that powers Android and enterprise servers.",
          "fact": "Java originally had the name Oak.",
          "videoUrl": "https://www.youtube.com/embed/eIrMbAQSU34",
          "code": "public class Main {\n  public static void main(String[] args) {\n    System.out.println(\"Java Hub Connected\");\n  }\n}"
        }
      ]
    },
    {
      "id": "csharp",
      "name": "C#",
      "category": "Backend",
      "title": ".NET Development",
      "chapters": [
        {
          "id": "cs-1",
          "title": "C# Basics",
          "desc": "C# is Microsoft modern language for building web, desktop, and mobile apps.",
          "fact": "C# was originally named Cool.",
          "videoUrl": "https://www.youtube.com/embed/gfkTfcpWqAY",
          "code": "using System;\nclass Program {\n  static void Main() {\n    Console.WriteLine(\"C# Ready\");\n  }\n}"
        }
      ]
    },
    {
      "id": "rust",
      "name": "Rust",
      "category": "Systems",
      "title": "Safe System Memory",
      "chapters": [
        {
          "id": "rs-1",
          "title": "Memory Safety",
          "desc": "Rust provides the speed of C++ but with guaranteed memory safety.",
          "fact": "Rust has been the most loved language on Stack Overflow for years.",
          "videoUrl": "https://www.youtube.com/embed/MsocPEZBd-M",
          "code": "fn main() {\n  let x = \"Rust\";\n  println!(\"Welcome to {}\", x);\n}"
        }
      ]
    },
    {
      "id": "go",
      "name": "Go",
      "category": "Backend",
      "title": "Cloud Concurrency",
      "chapters": [
        {
          "id": "go-1",
          "title": "Go Basics",
          "desc": "Go was built by Google for high-scale network services and concurrency.",
          "fact": "Go was designed at Google in 2007.",
          "videoUrl": "https://www.youtube.com/embed/un6ZyFkqFKo",
          "code": "package main\nimport \"fmt\"\nfunc main() {\n  fmt.Println(\"Go Cloud\")\n}"
        }
      ]
    },
    {
      "id": "ruby",
      "name": "Ruby",
      "category": "Backend",
      "title": "Rapid Web Prototyping",
      "chapters": [
        {
          "id": "rb-1",
          "title": "Ruby Basics",
          "desc": "Ruby focuses on simplicity and productivity. It reads like English!",
          "fact": "Ruby was created by Yukihiro Matsumoto (Matz).",
          "videoUrl": "https://www.youtube.com/embed/t_ispmWZEjY",
          "code": "puts \"Hello from Ruby\""
        }
      ]
    },
    {
      "id": "swift",
      "name": "Swift",
      "category": "Mobile",
      "title": "Apple Ecosystem",
      "chapters": [
        {
          "id": "sw-1",
          "title": "Swift Basics",
          "desc": "Swift is Apple powerful language for building iOS, macOS, and more.",
          "fact": "Swift was first released in 2014.",
          "videoUrl": "https://www.youtube.com/embed/comQ1-x2a1Q",
          "code": "print(\"iOS Dev Mode\")"
        }
      ]
    },
    {
      "id": "kotlin",
      "name": "Kotlin",
      "category": "Mobile",
      "title": "Android Mastery",
      "chapters": [
        {
          "id": "kt-1",
          "title": "Kotlin Basics",
          "desc": "Kotlin is the official language for Android development, safe and expressive.",
          "fact": "Kotlin is fully interoperable with Java.",
          "videoUrl": "https://www.youtube.com/embed/F9UC9DY-vIU",
          "code": "fun main() { println(\"Android Hub\") }"
        }
      ]
    },
    {
      "id": "php",
      "name": "PHP",
      "category": "Backend",
      "title": "Web Scripting",
      "chapters": [
        {
          "id": "php-1",
          "title": "PHP Basics",
          "desc": "PHP powers the majority of the web, including WordPress and Wikipedia.",
          "fact": "PHP stands for Hypertext Preprocessor.",
          "videoUrl": "https://www.youtube.com/embed/OK_JCtrrv-c",
          "code": "<?php echo \"PHP Hub\"; ?>"
        }
      ]
    },
    {
      "id": "bash",
      "name": "Bash",
      "category": "Systems",
      "title": "Command Line Mastery",
      "chapters": [
        {
          "id": "bash-1",
          "title": "Shell Scripting",
          "desc": "Learn how to automate tasks using the most powerful shell in the world.",
          "fact": "Bash stands for Bourne Again SHell.",
          "videoUrl": "https://www.youtube.com/embed/e7BufAVwGyM",
          "code": "echo \"Shell Active\""
        }
      ]
    },
    {
      "id": "lua",
      "name": "Lua",
      "category": "GameDev",
      "title": "Scriptable Games",
      "chapters": [
        {
          "id": "lua-1",
          "title": "Lua Basics",
          "desc": "Lua is a lightweight language used in games like Roblox and World of Warcraft.",
          "fact": "Lua means Moon in Portuguese.",
          "videoUrl": "https://www.youtube.com/embed/iS9n5u90J7M",
          "code": "print(\"Game Script Active\")"
        }
      ]
    }
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
      academy:     INITIAL_DATA.academy,
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

  claimBelt: (language: string, belt: string) => {
    const data = db.read();
    if (!data.user.certifications) data.user.certifications = [];
    
    // Prevent duplicate belts for the same language/level
    const exists = data.user.certifications.find((c: any) => c.language === language && c.belt === belt);
    if (exists) return exists;

    const cert = {
      id: `CERT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      language,
      belt,
      date: new Date().toISOString(),
      verified: true,
      score: '100%'
    };
    data.user.certifications.push(cert);
    db.write(data);
    return cert;
  }
};
