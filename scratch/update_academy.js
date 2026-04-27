const fs = require('fs');
const path = require('path');
const dbPath = path.join(process.cwd(), 'src', 'lib', 'db.ts');
let dbContent = fs.readFileSync(dbPath, 'utf8');

const academyData = [
  { 
    id: 'html', name: 'HTML/CSS', category: 'Frontend', title: 'Modern Web Foundations',
    chapters: [
      { id: 'html-1', title: 'HTML Foundations', desc: 'HTML is the backbone of the web. It defines the structure of every page you visit.', fact: 'HTML was created by Tim Berners-Lee in 1991.', videoUrl: 'https://www.youtube.com/embed/pQN-pnXPaVg', code: '<h1>Hello World</h1>\n<p>Welcome to CodeZen Academy!</p>' },
      { id: 'html-2', title: 'CSS Styling', desc: 'CSS makes the web beautiful. It controls layout, colors, and fonts.', fact: 'CSS was first proposed by Håkon Wium Lie in 1994.', videoUrl: 'https://www.youtube.com/embed/1Rs2ND1RYYc', code: '<style>\n  h1 { color: #3b82f6; font-family: sans-serif; }\n</style>\n<h1>Styled Title</h1>' }
    ]
  },
  { 
    id: 'javascript', name: 'JavaScript', category: 'Frontend', title: 'Dynamic Web Programming',
    chapters: [
      { id: 'js-1', title: 'Variables & Logic', desc: 'JavaScript is the language of interactivity. It allows pages to react to user actions.', fact: 'JS was created in just 10 days by Brendan Eich.', videoUrl: 'https://www.youtube.com/embed/W6NZfCO5SIk', code: 'let name = \"Coder\";\nconsole.log(\"Hello \" + name);' },
      { id: 'js-2', title: 'Arrays & Objects', desc: 'Learn how to store and manipulate complex data structures in JavaScript.', fact: 'JavaScript is not Java - they are completely different languages.', videoUrl: 'https://www.youtube.com/embed/R9I85FE27Yw', code: 'const users = [\"Alice\", \"Bob\"];\nconsole.log(users[0]);' }
    ]
  },
  { 
    id: 'typescript', name: 'TypeScript', category: 'Frontend', title: 'Scaleable JavaScript',
    chapters: [
      { id: 'ts-1', title: 'Type Safety', desc: 'TypeScript adds a layer of safety to JavaScript by catching errors before you run your code.', fact: 'TS is developed and maintained by Microsoft.', videoUrl: 'https://www.youtube.com/embed/d56mG7DezGs', code: 'interface User { id: number; name: string; }\nconst u: User = { id: 1, name: \"Zen\" };\nconsole.log(u.name);' }
    ]
  },
  { 
    id: 'python', name: 'Python 3', category: 'Backend', title: 'Automating Everything',
    chapters: [
      { id: 'py-1', title: 'Python Basics', desc: 'Python is famous for its simple, readable syntax. Perfect for beginners and pros alike.', fact: 'Python was named after the comedy group Monty Python.', videoUrl: 'https://www.youtube.com/embed/_uQrJ0TkZlc', code: 'name = \"World\"\nprint(f\"Hello {name}!\")' }
    ]
  },
  { 
    id: 'cpp', name: 'C++', category: 'Systems', title: 'High Performance Systems',
    chapters: [
      { id: 'cpp-1', title: 'C++ Architecture', desc: 'C++ gives you low-level control over hardware, used in game engines and browsers.', fact: 'C++ is an extension of the C language created by Bjarne Stroustrup.', videoUrl: 'https://www.youtube.com/embed/vLnPwxZdW4Y', code: '#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << \"System Online\" << endl;\n  return 0;\n}' }
    ]
  },
  { 
    id: 'java', name: 'Java', category: 'Backend', title: 'Enterprise Engineering',
    chapters: [
      { id: 'java-1', title: 'Java Syntax', desc: 'Java is a robust, object-oriented language that powers Android and enterprise servers.', fact: 'Java originally had the name Oak.', videoUrl: 'https://www.youtube.com/embed/eIrMbAQSU34', code: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println(\"Java Hub Connected\");\n  }\n}' }
    ]
  },
  { 
    id: 'csharp', name: 'C#', category: 'Backend', title: '.NET Development',
    chapters: [
      { id: 'cs-1', title: 'C# Basics', desc: 'C# is Microsoft modern language for building web, desktop, and mobile apps.', fact: 'C# was originally named Cool.', videoUrl: 'https://www.youtube.com/embed/gfkTfcpWqAY', code: 'using System;\nclass Program {\n  static void Main() {\n    Console.WriteLine(\"C# Ready\");\n  }\n}' }
    ]
  },
  { 
    id: 'rust', name: 'Rust', category: 'Systems', title: 'Safe System Memory',
    chapters: [
      { id: 'rs-1', title: 'Memory Safety', desc: 'Rust provides the speed of C++ but with guaranteed memory safety.', fact: 'Rust has been the most loved language on Stack Overflow for years.', videoUrl: 'https://www.youtube.com/embed/MsocPEZBd-M', code: 'fn main() {\n  let x = \"Rust\";\n  println!(\"Welcome to {}\", x);\n}' }
    ]
  },
  { 
    id: 'go', name: 'Go', category: 'Backend', title: 'Cloud Concurrency',
    chapters: [
      { id: 'go-1', title: 'Go Basics', desc: 'Go was built by Google for high-scale network services and concurrency.', fact: 'Go was designed at Google in 2007.', videoUrl: 'https://www.youtube.com/embed/un6ZyFkqFKo', code: 'package main\nimport \"fmt\"\nfunc main() {\n  fmt.Println(\"Go Cloud\")\n}' }
    ]
  },
  { 
    id: 'ruby', name: 'Ruby', category: 'Backend', title: 'Rapid Web Prototyping',
    chapters: [
      { id: 'rb-1', title: 'Ruby Basics', desc: 'Ruby focuses on simplicity and productivity. It reads like English!', fact: 'Ruby was created by Yukihiro Matsumoto (Matz).', videoUrl: 'https://www.youtube.com/embed/t_ispmWZEjY', code: 'puts \"Hello from Ruby\"' }
    ]
  },
  { 
    id: 'swift', name: 'Swift', category: 'Mobile', title: 'Apple Ecosystem',
    chapters: [
      { id: 'sw-1', title: 'Swift Basics', desc: 'Swift is Apple powerful language for building iOS, macOS, and more.', fact: 'Swift was first released in 2014.', videoUrl: 'https://www.youtube.com/embed/comQ1-x2a1Q', code: 'print(\"iOS Dev Mode\")' }
    ]
  },
  { 
    id: 'kotlin', name: 'Kotlin', category: 'Mobile', title: 'Android Mastery',
    chapters: [
      { id: 'kt-1', title: 'Kotlin Basics', desc: 'Kotlin is the official language for Android development, safe and expressive.', fact: 'Kotlin is fully interoperable with Java.', videoUrl: 'https://www.youtube.com/embed/F9UC9DY-vIU', code: 'fun main() { println(\"Android Hub\") }' }
    ]
  },
  { 
    id: 'php', name: 'PHP', category: 'Backend', title: 'Web Scripting',
    chapters: [
      { id: 'php-1', title: 'PHP Basics', desc: 'PHP powers the majority of the web, including WordPress and Wikipedia.', fact: 'PHP stands for Hypertext Preprocessor.', videoUrl: 'https://www.youtube.com/embed/OK_JCtrrv-c', code: '<?php echo \"PHP Hub\"; ?>' }
    ]
  },
  { 
    id: 'bash', name: 'Bash', category: 'Systems', title: 'Command Line Mastery',
    chapters: [
      { id: 'bash-1', title: 'Shell Scripting', desc: 'Learn how to automate tasks using the most powerful shell in the world.', fact: 'Bash stands for Bourne Again SHell.', videoUrl: 'https://www.youtube.com/embed/e7BufAVwGyM', code: 'echo \"Shell Active\"' }
    ]
  },
  { 
    id: 'lua', name: 'Lua', category: 'GameDev', title: 'Scriptable Games',
    chapters: [
      { id: 'lua-1', title: 'Lua Basics', desc: 'Lua is a lightweight language used in games like Roblox and World of Warcraft.', fact: 'Lua means Moon in Portuguese.', videoUrl: 'https://www.youtube.com/embed/iS9n5u90J7M', code: 'print(\"Game Script Active\")' }
    ]
  }
];

const newAcademyStr = '  academy: ' + JSON.stringify(academyData, null, 2).replace(/\n/g, '\n  ') + ',';

// Smarter regex to find the academy array
const startIndex = dbContent.indexOf('academy: [');
const endIndex = dbContent.indexOf('],', startIndex) + 2;

if (startIndex !== -1 && endIndex !== -1) {
    dbContent = dbContent.substring(0, startIndex) + newAcademyStr + dbContent.substring(endIndex);
    fs.writeFileSync(dbPath, dbContent);
    console.log('Successfully updated academy content!');
} else {
    console.error('Could not find academy array in db.ts');
}
