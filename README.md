# Discrete Maths for Engineers

**Discrete Maths for Engineers** is a static website dedicated to discrete mathematics concepts that are fundamental for software engineers and computer scientists.

The goal of this project is to present discrete mathematics in a clear, structured, and practical way, connecting formal theory with real-world engineering and computing problems.

🌐 Website: https://discretemathsforengineers.com

---

## 📚 Topics Covered

The content focuses on core areas of discrete mathematics commonly used in software engineering and computer science, including:

- Logic and propositional reasoning  
- Sets, relations, and functions  
- Proof techniques (induction, contradiction, invariants)  
- Graph theory and trees  
- Combinatorics and counting principles  
- Discrete structures applied to algorithms and systems  

---

## 🛠️ Tech Stack

This is a fully static website built with:

- **HTML5**
- **CSS3**
- **Vanilla JavaScript**

No frameworks, no backend, and no build dependencies are required to run the site.

---

## 📁 Project Structure

```text
discretemathsforengineers.com/
├─ src/
│  ├─ shared/
│  │  ├─ partials/        # Shared layout components
│  │  └─ assets/          # Global CSS and JavaScript
│  │
│  ├─ en/                 # English content
│  │  ├─ index.html
│  │  ├─ pages/           # Topics → Series → Parts
│  │  └─ partials/        # Language-specific sidebar
│  │
│  ├─ pt/                 # Portuguese content
│  │  ├─ index.html
│  │  ├─ pages/           # Topics → Series → Parts
│  │  └─ partials/        # Language-specific sidebar
│
├─ scripts/
│  └─ build.js            # Static site generator
│
├─ dist/                  # Generated deploy
├─ package.json
└─ README.md
```

---

## 🚀 Running Locally
You can run the site locally by simply opening index.html in your browser.

Optionally, you can use a simple static server:
```bash
npx serve src
```

## ✍️ Publishing Content
New articles are added as standalone HTML files under the posts/ directory.

Each post follows a simple structure and can be linked directly from the homepage or topic pages.

## 📄 License
- **Code** (HTML, CSS, JavaScript) is licensed under the **MIT License**.
- **Written content** (articles, explanations, diagrams) is licensed under
**Creative Commons Attribution-NonCommercial 4.0 (CC BY-NC 4.0).**

See the [`LICENSE`](LICENSE) file for details.

## 🤝 Contributions
This is a personal educational project, but suggestions, corrections, and discussions are welcome via issues.

## 📌 Motivation
Discrete mathematics is often seen as abstract or disconnected from practice.
This project aims to bridge that gap by presenting concepts with intuition, rigor, and practical relevance for engineers.