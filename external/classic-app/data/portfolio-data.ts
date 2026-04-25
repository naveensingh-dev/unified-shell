export const PORTFOLIO_DATA = {
  "hero": {
    "title": "Naveen Singh",
    "subtitle": "Associate Technical Lead: AI & Angular Architect.",
    "tagline": "Frontend Architect & Engineering Lead with 9+ years of enterprise experience — built and scaled a 12-engineer organisation driving architecture on a $50M+/month banking platform.",
    "stats": [
      {
        "label": "Years Exp",
        "value": "9+",
        "suffix": "",
        "target": 9
      },
      {
        "label": "Monthly Vol",
        "value": "50M",
        "suffix": "+",
        "target": 50
      },
      {
        "label": "Load-time ↓",
        "value": "82",
        "suffix": "%",
        "target": 82
      },
      {
        "label": "RAG Accuracy",
        "value": "98",
        "suffix": "%",
        "target": 98
      }
    ]
  },
  "experience": [
    {
      "company": "Primus Software Corporation",
      "role": "Associate Technical Lead (12 Engineers across 3 Squads)",
      "period": "Nov 2019 — Present",
      "location": "Rishikesh, India",
      "progression": "Individual Contributor (2019) → Technical Ownership (2021) → Squad Lead, 6 Engineers (2022) → Associate Technical Lead (2023)",
      "achievements": [
        "<strong>Platform Migration:</strong> Spearheaded Angular v9 monolith → zone-less v19 Micro-Frontend migration on a $50M+/month banking platform — delivered 82% load-time reduction (11s → 2s).",
        "<strong>AI-Augmented Engineering:</strong> Independently shipped a RAG document intelligence platform achieving 98%+ retrieval accuracy and a multi-agent code review engine delivering ~65% LLM cost reduction.",
        "<strong>Release Velocity:</strong> Designed Module Federation MFE architecture decoupling 3 squad release cycles, contributing to 12% faster time-to-market and 35% release-cycle reduction.",
        "<strong>Engineering Leadership:</strong> Built and scaled a 12-engineer organisation; drove quarterly performance reviews and grew 7 engineers from intern to Senior with zero attrition over 6 years.",
        "<strong>Operational Impact:</strong> Achieved ≈$40K/yr in cost avoidance through 20% incident reduction and AI-augmented test scaffolding, validated via Jira velocity exports."
      ],
      "stack": "Angular 6-19 · Signals · Module Federation · Nx · SSR · Docker · SonarQube"
    }
  ],
  "projects": [
    {
      "id": "idp-platform",
      "name": "IDP Platform",
      "tagline": "Production-Grade AI Document Intelligence",
      "techStack": [
        "Angular 18",
        "LangChain",
        "LangGraph",
        "FAISS IVF-PQ",
        "Azure Doc Intelligence",
        "Python FastAPI",
        "Auth0"
      ],
      "status": "PROD",
      "syncRate": 99.8,
      "metric": "98% Retrieval Accuracy",
      "about": "The Intelligent Document Processing (IDP) Platform is a high-scale 'cognitive intake' engine designed for the high-stakes world of global banking and insurance. At its core, the platform is an architectural answer to the massive human bottleneck of document verification. \n\n### The 5-Layer Safety Core\nUnlike standard AI tools that might guess or 'hallucinate' data, IDP uses a proprietary 5-layer verification system. This starts with **Source-Constrained Retrieval**, ensuring the AI only looks at the provided PDF. It then moves through **Confidence Scoring**, where the system mathematically weighs the certainty of every extraction. If the score is low, the system triggers a **Human-in-the-Loop (HITL)** request, ensuring 100% data integrity for critical fields like IBAN numbers or legal termination dates.",
      "challenges": {
        "context": "Modernizing the way a global bank onboarded corporate clients. They had decades of paper records and inconsistent digital files spread across multiple countries.",
        "painPoint": "The primary pain point was the human cost and the error rate. It took 4 days to verify a single corporate folder, and mistakes were found in 15% of cases.",
        "resolution": "We built a 'Neural Intake' pipeline. We used a mix of vision models to 'see' the documents and language models to 'reason' about them. By creating a custom search index (FAISS), we made it possible to find a specific clause in 30,000 documents in less than half a second."
      },
      "blueprint": {
        "groups": [
          {
            "id": "ingest",
            "label": "Ingestion Layer",
            "x": 300,
            "y": 50,
            "w": 200,
            "h": 250
          },
          {
            "id": "intel",
            "label": "Intelligence Core",
            "x": 150,
            "y": 350,
            "w": 500,
            "h": 450
          }
        ],
        "nodes": [
          {
            "x": 400,
            "y": 100,
            "type": "Input",
            "label": "DOC_INGEST",
            "description": "Secure ingestion of multi-format financial documents (PDF/Images) with metadata extraction.",
            "group": "ingest"
          },
          {
            "x": 400,
            "y": 250,
            "type": "Process",
            "label": "AZURE_OCR",
            "description": "Advanced OCR using Azure Document Intelligence for high-fidelity text and layout recovery.",
            "group": "ingest"
          },
          {
            "x": 400,
            "y": 400,
            "type": "Process",
            "label": "SEM_CHUNK",
            "description": "Semantic chunking with contextual overlap to preserve cross-page financial data integrity.",
            "group": "intel"
          },
          {
            "x": 400,
            "y": 550,
            "type": "Store",
            "label": "FAISS_INDEX",
            "description": "Approximate nearest-neighbour indexing via FAISS IVF-PQ for sub-second retrieval at scale.",
            "group": "intel"
          },
          {
            "x": 250,
            "y": 700,
            "type": "Process",
            "label": "RAG_PIPELINE",
            "description": "5-layer hallucination mitigation pipeline with semantic reranking and source grounding.",
            "group": "intel"
          },
          {
            "x": 550,
            "y": 700,
            "type": "Process",
            "label": "HITL_GATE",
            "description": "Human-in-the-Loop escalation workflow for low-confidence extraction anomalies.",
            "group": "intel"
          },
          {
            "x": 400,
            "y": 850,
            "type": "Decision",
            "label": "CONFID_SCORE",
            "description": "Statistical evaluation of extraction confidence against banking regulatory benchmarks."
          },
          {
            "x": 400,
            "y": 1000,
            "type": "Output",
            "label": "AUDIT_READY_UI",
            "description": "WCAG 2.1 AA compliant viewer with source-attribution highlights and immutable logs."
          }
        ],
        "connections": [
          {
            "from": 0,
            "to": 1
          },
          {
            "from": 1,
            "to": 2
          },
          {
            "from": 2,
            "to": 3
          },
          {
            "from": 3,
            "to": 4
          },
          {
            "from": 4,
            "to": 6
          },
          {
            "from": 6,
            "to": 5,
            "label": "LOW_CONF"
          },
          {
            "from": 6,
            "to": 7,
            "label": "VERIFIED"
          },
          {
            "from": 5,
            "to": 7
          }
        ]
      },
      "impact": {
        "outcome": "We crushed the processing time from 4 days down to 4 hours. The accuracy of data extraction hit 98%, higher than human benchmark of 92%.",
        "competitiveEdge": "The system includes a 'Source Grounding' UI. This means when the AI tells you a fact, you can click it, and the system instantly highlights the exact sentence in the original PDF."
      },
      "issues": [
        {
          "anomalousEvent": "The 'Ambiguous Date' Trap",
          "thinkingApproach": "On older documents, the AI couldn't tell if '01/02/03' meant Jan 2nd or Feb 1st.",
          "solution": "We implemented a 'Jurisdictional Metadata' filter."
        }
      ]
    },
    {
      "id": "project-atlas",
      "name": "Project Atlas",
      "tagline": "Full-Stack RAG Platform",
      "techStack": [
        "React 18",
        "FastAPI",
        "Google Gemini API",
        "FAISS",
        "Google Drive API",
        "Tailwind CSS"
      ],
      "status": "PROD",
      "syncRate": 94.2,
      "metric": "sub-200ms p95 latency",
      "about": "Project Atlas is a state-of-the-art **Retrieval-Augmented Generation (RAG)** platform that acts as a private, high-speed 'Neural Brain' for personal and corporate file systems. It solves the primary limitation of modern LLMs: their lack of access to private, non-public data.\n\n### Architectural Blueprint\nAtlas bridges a sleek **React 18** frontend with a high-performance **FastAPI** backend. The system’s secret weapon is its **Dynamic Re-indexing Pipeline**. When you connect your Google Drive via **OAuth 2.0 PKCE**, Atlas doesn't just copy files; it performs 'Semantic Sharding.' It breaks documents into overlapping chunks, converts them into **Vector Embeddings**, and stores them in a highly optimized vault.",
      "challenges": {
        "context": "Most people have thousands of files they never look at because they can't remember which file contains which piece of information.",
        "painPoint": "Standard search only looks for words. If you search for 'revenue,' it won't find a file that says 'total earnings.' Users were wasting hours searching for the right document.",
        "resolution": "We used 'Vector Embeddings.' We convert every paragraph of your files into a list of numbers (a vector) that represents its 'meaning.' Now, searching for 'revenue' will find 'earnings'."
      },
      "blueprint": {
        "groups": [
          {
            "id": "client",
            "label": "Frontend (React/Vite)",
            "x": 100,
            "y": 50,
            "w": 400,
            "h": 200
          },
          {
            "id": "server",
            "label": "Backend (FastAPI)",
            "x": 100,
            "y": 350,
            "w": 400,
            "h": 500
          },
          {
            "id": "external",
            "label": "External Services",
            "x": 550,
            "y": 450,
            "w": 400,
            "h": 350
          }
        ],
        "nodes": [
          {
            "x": 200,
            "y": 100,
            "type": "Process",
            "label": "State Management",
            "description": "React state and store logic.",
            "group": "client"
          },
          {
            "x": 200,
            "y": 200,
            "type": "Process",
            "label": "UI Components",
            "description": "Interactive surface layer.",
            "group": "client"
          },
          {
            "x": 350,
            "y": 200,
            "type": "Process",
            "label": "API Services",
            "description": "Client-side HTTP bridge.",
            "group": "client"
          },
          {
            "x": 350,
            "y": 400,
            "type": "Input",
            "label": "API Endpoints",
            "description": "FastAPI route definitions.",
            "group": "server"
          },
          {
            "x": 350,
            "y": 550,
            "type": "Process",
            "label": "Auth Service (JWT)",
            "description": "OAuth 2.0 PKCE validation.",
            "group": "server"
          },
          {
            "x": 200,
            "y": 650,
            "type": "Process",
            "label": "RAG Pipeline Service",
            "description": "Core semantic logic.",
            "group": "server"
          },
          {
            "x": 200,
            "y": 800,
            "type": "Store",
            "label": "Database Layer",
            "description": "Postgres persistence.",
            "group": "server"
          },
          {
            "x": 500,
            "y": 650,
            "type": "Store",
            "label": "JWT Tokens",
            "description": "Cryptographic session tokens."
          },
          {
            "x": 750,
            "y": 500,
            "type": "Process",
            "label": "Google Drive API",
            "description": "Cloud sync engine.",
            "group": "external"
          },
          {
            "x": 750,
            "y": 750,
            "type": "Store",
            "label": "Vector Store (FAISS)",
            "description": "High-speed semantic index.",
            "group": "external"
          },
          {
            "x": 900,
            "y": 750,
            "type": "Process",
            "label": "Google Gemini AI",
            "description": "LLM Inference core.",
            "group": "external"
          }
        ],
        "connections": [
          {
            "from": 0,
            "to": 1
          },
          {
            "from": 2,
            "to": 3,
            "label": "HTTP"
          },
          {
            "from": 3,
            "to": 4
          },
          {
            "from": 3,
            "to": 5
          },
          {
            "from": 5,
            "to": 6
          },
          {
            "from": 5,
            "to": 9,
            "label": "QUERY"
          },
          {
            "from": 9,
            "to": 10
          },
          {
            "from": 4,
            "to": 7,
            "label": "VALIDATE"
          },
          {
            "from": 7,
            "to": 8
          },
          {
            "from": 3,
            "to": 8,
            "label": "SYNC"
          }
        ]
      },
      "impact": {
        "outcome": "Users can now find information across 10,000 files in sub-200ms. The system has a 94+ Lighthouse score.",
        "competitiveEdge": "The 'Hot-Swap' engine. You can add or remove an entire folder of 1,000 files, and the AI brain updates itself instantly."
      },
      "issues": [
        {
          "anomalousEvent": "The 'Cold Start' Sync Delay",
          "thinkingApproach": "10-min indexing left users with an empty screen.",
          "solution": "Built a 'Priority Ingestion' queue."
        }
      ]
    },
    {
      "id": "gitmind",
      "name": "GitMind",
      "tagline": "Autonomous Multi-Agent Code Review Engine",
      "techStack": [
        "Angular 19",
        "LangGraph",
        "Claude 3.7 Sonnet",
        "DeepSeek-R1",
        "FastAPI",
        "SQLite HITL"
      ],
      "status": "PROD",
      "syncRate": 96,
      "metric": "65% LLM Cost Reduction",
      "about": "GitMind is an autonomous **Multi-Agent Orchestration Engine** designed to replace the slow, manual process of code review. It moves beyond simple 'linting' and enters the realm of **Cognitive DevOps**.\n\n### The Multi-Agent Debate\nBuilt on **LangGraph**, GitMind uses a **Cyclic Directed Acyclic Graph (DAG)** to manage a squad of specialized AI agents. When a developer submits a Pull Request, the system doesn't just run a script. It initiates a structured 'debate':\n1. **Security Sentinel (DeepSeek-R1):** Scans for architectural vulnerabilities and 'Zero-Day' patterns.\n2. **Performance Auditor (Claude 3.7):** Identifies memory leaks and inefficient algorithmic complexity.\n3. **The Cognitive Arbitrator:** Weighs the feedback from both agents, resolves conflicts, and synthesizes the final 'Neural Patch.'",
      "challenges": {
        "context": "Traditional code review is slow. Senior developers spend 30% of their time reviewing basic stuff instead of building new features.",
        "painPoint": "Standard AI code tools often suggest 'hallucinated' fixes that look right but actually break the application.",
        "resolution": "We architected a 'Cyclic DAG' (Directed Acyclic Graph) allowing agents to check each other's work."
      },
      "blueprint": {
        "groups": [
          {
            "id": "github",
            "label": "🌐 GitHub Platform",
            "x": 100,
            "y": 50,
            "w": 600,
            "h": 200
          },
          {
            "id": "nginx",
            "label": "🛡️ Nginx Reverse Proxy",
            "x": 100,
            "y": 300,
            "w": 600,
            "h": 150
          },
          {
            "id": "frontend",
            "label": "🖥️ Frontend Layer - Angular 19+",
            "x": 100,
            "y": 500,
            "w": 600,
            "h": 300
          },
          {
            "id": "backend",
            "label": "🧠 Backend Intelligence Layer - Python 3.11+",
            "x": 100,
            "y": 850,
            "w": 600,
            "h": 300
          },
          {
            "id": "workers",
            "label": "⚙️ Background Workers",
            "x": 100,
            "y": 1200,
            "w": 600,
            "h": 200
          },
          {
            "id": "data",
            "label": "💾 Data Layer",
            "x": 100,
            "y": 1450,
            "w": 600,
            "h": 250
          },
          {
            "id": "llms",
            "label": "🤖 Multi-LLM Intelligence Layer",
            "x": 100,
            "y": 1750,
            "w": 600,
            "h": 300
          }
        ],
        "nodes": [
          {
            "x": 200,
            "y": 120,
            "type": "Input",
            "label": "GH_PR",
            "description": "Pull Request",
            "group": "github"
          },
          {
            "x": 400,
            "y": 120,
            "type": "Input",
            "label": "GH_API",
            "description": "GitHub API",
            "group": "github"
          },
          {
            "x": 600,
            "y": 120,
            "type": "Input",
            "label": "GH_HOOK",
            "description": "Webhooks",
            "group": "github"
          },
          {
            "x": 400,
            "y": 370,
            "type": "Process",
            "label": "NGINX",
            "description": "Nginx Server Load Balancer & SSL",
            "group": "nginx"
          },
          {
            "x": 200,
            "y": 600,
            "type": "Process",
            "label": "ANG",
            "description": "Angular 19+ Zoneless Signals",
            "group": "frontend"
          },
          {
            "x": 400,
            "y": 600,
            "type": "Process",
            "label": "SSR",
            "description": "SSR Node Server Express",
            "group": "frontend"
          },
          {
            "x": 600,
            "y": 600,
            "type": "Process",
            "label": "MERMAID",
            "description": "Mermaid.js Diagram Renderer",
            "group": "frontend"
          },
          {
            "x": 750,
            "y": 600,
            "type": "Process",
            "label": "HIGHLIGHT",
            "description": "Highlight.js Syntax Highlighter",
            "group": "frontend"
          },
          {
            "x": 200,
            "y": 950,
            "type": "Process",
            "label": "API",
            "description": "FastAPI Async REST + SSE",
            "group": "backend"
          },
          {
            "x": 400,
            "y": 950,
            "type": "Process",
            "label": "AGENT",
            "description": "LangGraph Agent Orchestration Engine",
            "group": "backend"
          },
          {
            "x": 600,
            "y": 950,
            "type": "Process",
            "label": "AUTH",
            "description": "Auth Service JWT + OAuth2",
            "group": "backend"
          },
          {
            "x": 750,
            "y": 950,
            "type": "Process",
            "label": "CACHE",
            "description": "Semantic Cache SHA-256 + Redis",
            "group": "backend"
          },
          {
            "x": 300,
            "y": 1270,
            "type": "Process",
            "label": "ARQ",
            "description": "ARQ Worker Async Task Queue",
            "group": "workers"
          },
          {
            "x": 500,
            "y": 1270,
            "type": "Process",
            "label": "ANALYZE",
            "description": "Analysis Pipeline LangGraph DAG",
            "group": "workers"
          },
          {
            "x": 200,
            "y": 1550,
            "type": "Store",
            "label": "POSTGRES",
            "description": "PostgreSQL Async SQLAlchemy + Alembic",
            "group": "data"
          },
          {
            "x": 400,
            "y": 1550,
            "type": "Store",
            "label": "REDIS",
            "description": "Redis Pub/Sub + Cache + Queue",
            "group": "data"
          },
          {
            "x": 600,
            "y": 1550,
            "type": "Store",
            "label": "SQLITE",
            "description": "SQLite HITL Checkpointing",
            "group": "data"
          },
          {
            "x": 150,
            "y": 1850,
            "type": "Process",
            "label": "DEEPSEEK",
            "description": "DeepSeek-R1 Security Sentinel",
            "group": "llms"
          },
          {
            "x": 350,
            "y": 1850,
            "type": "Process",
            "label": "GPT4O",
            "description": "GPT-4o / o1 Security + Review",
            "group": "llms"
          },
          {
            "x": 550,
            "y": 1850,
            "type": "Process",
            "label": "CLAUDE",
            "description": "Claude 3.7 Sonnet Performance Audit",
            "group": "llms"
          },
          {
            "x": 750,
            "y": 1850,
            "type": "Process",
            "label": "GEMINI",
            "description": "Gemini 1.5 Pro Auto-Remediation",
            "group": "llms"
          }
        ],
        "connections": [
          {
            "from": 0,
            "to": 2
          },
          {
            "from": 2,
            "to": 3
          },
          {
            "from": 1,
            "to": 3
          },
          {
            "from": 3,
            "to": 4
          },
          {
            "from": 3,
            "to": 8
          },
          {
            "from": 4,
            "to": 8
          },
          {
            "from": 4,
            "to": 5
          },
          {
            "from": 4,
            "to": 6
          },
          {
            "from": 4,
            "to": 7
          },
          {
            "from": 8,
            "to": 9
          },
          {
            "from": 8,
            "to": 10
          },
          {
            "from": 8,
            "to": 11
          },
          {
            "from": 8,
            "to": 14
          },
          {
            "from": 8,
            "to": 15
          },
          {
            "from": 9,
            "to": 12
          },
          {
            "from": 9,
            "to": 13
          },
          {
            "from": 12,
            "to": 13
          },
          {
            "from": 13,
            "to": 14
          },
          {
            "from": 13,
            "to": 15
          },
          {
            "from": 13,
            "to": 16
          },
          {
            "from": 13,
            "to": 17
          },
          {
            "from": 13,
            "to": 18
          },
          {
            "from": 13,
            "to": 19
          },
          {
            "from": 13,
            "to": 20
          },
          {
            "from": 13,
            "to": 1,
            "label": "patches"
          },
          {
            "from": 8,
            "to": 4,
            "label": "results"
          }
        ]
      },
      "impact": {
        "outcome": "Reduced LLM cost by 65% through aggressive Prompt Caching.",
        "competitiveEdge": "Ships a production-ready 'Neural Patch' instead of just text feedback."
      },
      "issues": [
        {
          "anomalousEvent": "The 'Endless Argument' Loop",
          "thinkingApproach": "Agents couldn't agree on a fix.",
          "solution": "Introduced 'Maximum Recursion Depth' fallback."
        }
      ]
    },
    {
      "id": "sems-nexus",
      "name": "SEMS NEXUS",
      "tagline": "Global Campus Intelligence Matrix",
      "techStack": [
        "Angular 18+",
        "NestJS",
        "XGBoost",
        "Three.js",
        "PostgreSQL",
        "Redis",
        "MongoDB",
        "Prisma"
      ],
      "status": "PRIVATE",
      "syncRate": 93,
      "metric": "92% Attrition Prediction Accuracy",
      "about": "SEMS NEXUS is a futuristic **Institutional Command Center** that transforms massive school campuses and global organizations into a synchronized **Intelligence Matrix**. It is a masterclass in combining high-fidelity 3D visualization with deep data science.\n\n### The Digital Twin Architecture\nAt the heart of NEXUS is a **3D Digital Twin** built with **Three.js**. This isn't just a static map; it is a live, data-driven environment. Every building and node is a live data point. We implemented **Geometry Instancing** and **Frustum Culling** to ensure that even a campus with 5,000+ interactive elements runs at a buttery-smooth 60fps in a standard browser.\n\n### Predictive Foresight\nThe 'Neural Core' (built with **FastAPI** and **NestJS**) connects to disparate academic and operational databases (PostgreSQL, MongoDB, Redis). We utilized **XGBoost models** to perform **Attrition Prediction**, allowing administrators to identify students at risk of dropping out months in advance.",
      "challenges": {
        "context": "Universities often have 50 different buildings and 20 different software systems that don't talk to each other.",
        "painPoint": "Realizing problems too late to fix them.",
        "resolution": "Built a 'Unified Intelligence Matrix' connecting every isolated campus system into one 'Neural Core'."
      },
      "blueprint": {
        "groups": [
          {
            "id": "authority",
            "label": "Authority Layer",
            "x": 100,
            "y": 50,
            "w": 700,
            "h": 150
          },
          {
            "id": "frontend",
            "label": "Visual Command Layer (Frontend)",
            "x": 100,
            "y": 250,
            "w": 700,
            "h": 250
          },
          {
            "id": "backend",
            "label": "Neural Core (Backend)",
            "x": 100,
            "y": 550,
            "w": 700,
            "h": 250
          },
          {
            "id": "persistence",
            "label": "Persistence Layer",
            "x": 100,
            "y": 850,
            "w": 700,
            "h": 200
          }
        ],
        "nodes": [
          {
            "x": 200,
            "y": 120,
            "type": "Input",
            "label": "SA",
            "description": "Super Admin - Level 5",
            "group": "authority"
          },
          {
            "x": 450,
            "y": 120,
            "type": "Input",
            "label": "CA",
            "description": "Campus Admin - Level 3",
            "group": "authority"
          },
          {
            "x": 700,
            "y": 120,
            "type": "Input",
            "label": "STU",
            "description": "Student / Public - Level 1",
            "group": "authority"
          },
          {
            "x": 150,
            "y": 350,
            "type": "Process",
            "label": "HQ",
            "description": "Nexus HQ - 4203",
            "group": "frontend"
          },
          {
            "x": 300,
            "y": 350,
            "type": "Process",
            "label": "NXP",
            "description": "Nexus Prime / Exam Portal - 4201",
            "group": "frontend"
          },
          {
            "x": 450,
            "y": 350,
            "type": "Process",
            "label": "SUI",
            "description": "Main Application - 4200",
            "group": "frontend"
          },
          {
            "x": 600,
            "y": 350,
            "type": "Process",
            "label": "CMD",
            "description": "Command Deck - 4204",
            "group": "frontend"
          },
          {
            "x": 750,
            "y": 350,
            "type": "Process",
            "label": "ARS",
            "description": "Nexus Arsenal - 4202",
            "group": "frontend"
          },
          {
            "x": 300,
            "y": 450,
            "type": "Process",
            "label": "AD",
            "description": "Design Exam",
            "group": "frontend"
          },
          {
            "x": 200,
            "y": 650,
            "type": "Process",
            "label": "HQAPI",
            "description": "HQ Intelligence - 3003",
            "group": "backend"
          },
          {
            "x": 400,
            "y": 650,
            "type": "Process",
            "label": "NXAPI",
            "description": "Prime & Exam Logic - 3001",
            "group": "backend"
          },
          {
            "x": 600,
            "y": 650,
            "type": "Process",
            "label": "API",
            "description": "Core API Gateway - 3000",
            "group": "backend"
          },
          {
            "x": 750,
            "y": 650,
            "type": "Process",
            "label": "AI",
            "description": "AI Intelligence - 8000",
            "group": "backend"
          },
          {
            "x": 250,
            "y": 950,
            "type": "Store",
            "label": "DB",
            "description": "PostgreSQL",
            "group": "persistence"
          },
          {
            "x": 450,
            "y": 950,
            "type": "Store",
            "label": "R",
            "description": "Redis",
            "group": "persistence"
          },
          {
            "x": 650,
            "y": 950,
            "type": "Store",
            "label": "M",
            "description": "MongoDB",
            "group": "persistence"
          }
        ],
        "connections": [
          {
            "from": 0,
            "to": 3,
            "label": "Global Oversight"
          },
          {
            "from": 1,
            "to": 4,
            "label": "Campus Control"
          },
          {
            "from": 2,
            "to": 4,
            "label": "Portal Access"
          },
          {
            "from": 3,
            "to": 4,
            "label": "Provision Node"
          },
          {
            "from": 4,
            "to": 5,
            "label": "Orchestrate"
          },
          {
            "from": 5,
            "to": 2,
            "label": "Register Student"
          },
          {
            "from": 2,
            "to": 4,
            "label": "Dashboard Sync"
          },
          {
            "from": 3,
            "to": 4,
            "label": "Global Standards"
          },
          {
            "from": 4,
            "to": 8,
            "label": "Admin Quiz Panel"
          },
          {
            "from": 8,
            "to": 4,
            "label": "Publish"
          },
          {
            "from": 4,
            "to": 5,
            "label": "Execute Exam"
          },
          {
            "from": 5,
            "to": 11,
            "label": "Final Result"
          },
          {
            "from": 3,
            "to": 9
          },
          {
            "from": 4,
            "to": 10
          },
          {
            "from": 5,
            "to": 11
          },
          {
            "from": 6,
            "to": 11
          },
          {
            "from": 7,
            "to": 11
          },
          {
            "from": 9,
            "to": 11
          },
          {
            "from": 10,
            "to": 11
          },
          {
            "from": 11,
            "to": 13
          },
          {
            "from": 11,
            "to": 12
          },
          {
            "from": 11,
            "to": 14
          },
          {
            "from": 11,
            "to": 15
          }
        ]
      },
      "impact": {
        "outcome": "Achieved a 92% accuracy rate in predicting student attrition.",
        "competitiveEdge": "The '3D Digital Twin' makes 'boring' data feel like a video game."
      },
      "issues": [
        {
          "anomalousEvent": "The 'Graphics Lag' Nightmare",
          "thinkingApproach": "Rendering 5k nodes dropped FPS.",
          "solution": "Implemented 'Frustum Culling' and 'Geometry Instancing'."
        }
      ]
    },
    {
      "id": "ui-builder",
      "name": "UI Builder",
      "tagline": "Low-Code Assembly Engine",
      "techStack": [
        "Angular CDK",
        "AST Builder",
        "JSON-Serializer",
        "Tailwind",
        "SCSS"
      ],
      "status": "PRIVATE",
      "syncRate": 72,
      "metric": "80% Reduction in Dev Time",
      "about": "The UI Builder is a high-performance **Low-Code Assembly Engine** that empowers non-technical users to build production-grade enterprise software. It represents the pinnacle of 'Metadata-Driven UI' architecture.\n\n### Visual-to-AST Transformation\nWhen a user drags a component onto the canvas, the system isn't just moving images. It is dynamically generating a complex **Abstract Syntax Tree (AST)**. This tree captures the logic, the styling (via **Tailwind CSS**), and the data bindings. Upon saving, a custom compiler transforms this AST into **Pure, Optimized Angular Code**. This means there is **zero runtime overhead**—the final app is just as fast as if it were hand-coded by a Staff Engineer.",
      "challenges": {
        "context": "Enterprise teams were overwhelmed by 'small change' requests.",
        "painPoint": "Release cycle was the bottleneck; fixes took weeks.",
        "resolution": "Built a 'Live Metadata' engine allowing instant updates without new releases."
      },
      "blueprint": {
        "groups": [
          {
            "id": "frontend",
            "label": "Frontend Layer",
            "x": 100,
            "y": 50,
            "w": 400,
            "h": 300
          },
          {
            "id": "uilayer",
            "label": "UI & Component Layer",
            "x": 550,
            "y": 50,
            "w": 400,
            "h": 600
          },
          {
            "id": "styling",
            "label": "Styling Layer",
            "x": 100,
            "y": 400,
            "w": 400,
            "h": 200
          },
          {
            "id": "logic",
            "label": "Application Logic",
            "x": 100,
            "y": 650,
            "w": 400,
            "h": 250
          },
          {
            "id": "build",
            "label": "Build & Tooling",
            "x": 550,
            "y": 700,
            "w": 400,
            "h": 300
          },
          {
            "id": "assets",
            "label": "Static Resources",
            "x": 100,
            "y": 950,
            "w": 850,
            "h": 150
          }
        ],
        "nodes": [
          {
            "x": 50,
            "y": 100,
            "type": "Input",
            "label": "Browser",
            "description": "User Browser"
          },
          {
            "x": 200,
            "y": 100,
            "type": "Process",
            "label": "AngularApp",
            "description": "Angular 20 Application",
            "group": "frontend"
          },
          {
            "x": 200,
            "y": 200,
            "type": "Process",
            "label": "Shell",
            "description": "App Shell / Routing",
            "group": "frontend"
          },
          {
            "x": 350,
            "y": 250,
            "type": "Process",
            "label": "Features",
            "description": "Feature Modules",
            "group": "frontend"
          },
          {
            "x": 500,
            "y": 350,
            "type": "Process",
            "label": "Shared",
            "description": "Shared Components",
            "group": "frontend"
          },
          {
            "x": 650,
            "y": 100,
            "type": "Process",
            "label": "Layout",
            "description": "Layout Components",
            "group": "uilayer"
          },
          {
            "x": 650,
            "y": 200,
            "type": "Process",
            "label": "Material",
            "description": "Material Components",
            "group": "uilayer"
          },
          {
            "x": 650,
            "y": 300,
            "type": "Process",
            "label": "CustomUI",
            "description": "Custom UI Components",
            "group": "uilayer"
          },
          {
            "x": 800,
            "y": 100,
            "type": "Output",
            "label": "Dashboard",
            "description": "Dashboard View",
            "group": "uilayer"
          },
          {
            "x": 800,
            "y": 150,
            "type": "Output",
            "label": "Header",
            "description": "Header Component",
            "group": "uilayer"
          },
          {
            "x": 800,
            "y": 200,
            "type": "Output",
            "label": "Sidebar",
            "description": "Sidebar Component",
            "group": "uilayer"
          },
          {
            "x": 800,
            "y": 300,
            "type": "Output",
            "label": "DataGrid",
            "description": "DataGrid Component",
            "group": "uilayer"
          },
          {
            "x": 800,
            "y": 350,
            "type": "Output",
            "label": "SmartForm",
            "description": "SmartForm Component",
            "group": "uilayer"
          },
          {
            "x": 800,
            "y": 400,
            "type": "Output",
            "label": "CanvasIQ",
            "description": "CanvasIQ Component",
            "group": "uilayer"
          },
          {
            "x": 200,
            "y": 450,
            "type": "Process",
            "label": "Tailwind",
            "description": "Tailwind CSS",
            "group": "styling"
          },
          {
            "x": 350,
            "y": 450,
            "type": "Process",
            "label": "SCSS",
            "description": "SCSS / Global Styles",
            "group": "styling"
          },
          {
            "x": 500,
            "y": 450,
            "type": "Process",
            "label": "MaterialDesign",
            "description": "Angular Material Design",
            "group": "styling"
          },
          {
            "x": 200,
            "y": 700,
            "type": "Process",
            "label": "Services",
            "description": "Business Logic Services",
            "group": "logic"
          },
          {
            "x": 350,
            "y": 750,
            "type": "Process",
            "label": "HTTP",
            "description": "HTTP Services",
            "group": "logic"
          },
          {
            "x": 350,
            "y": 800,
            "type": "Process",
            "label": "State",
            "description": "State Management",
            "group": "logic"
          },
          {
            "x": 650,
            "y": 750,
            "type": "Process",
            "label": "CLI",
            "description": "Angular CLI 20",
            "group": "build"
          },
          {
            "x": 650,
            "y": 850,
            "type": "Process",
            "label": "Webpack",
            "description": "Webpack Bundler",
            "group": "build"
          },
          {
            "x": 800,
            "y": 800,
            "type": "Process",
            "label": "PostCSS",
            "description": "PostCSS Processing",
            "group": "build"
          },
          {
            "x": 200,
            "y": 1020,
            "type": "Store",
            "label": "PublicAssets",
            "description": "public/ Assets",
            "group": "assets"
          },
          {
            "x": 500,
            "y": 1020,
            "type": "Store",
            "label": "AppSrc",
            "description": "src/ Application",
            "group": "assets"
          },
          {
            "x": 800,
            "y": 1020,
            "type": "Store",
            "label": "Dependencies",
            "description": "node_modules/",
            "group": "assets"
          }
        ],
        "connections": [
          {
            "from": 0,
            "to": 1
          },
          {
            "from": 1,
            "to": 2
          },
          {
            "from": 2,
            "to": 3
          },
          {
            "from": 3,
            "to": 4
          },
          {
            "from": 4,
            "to": 5
          },
          {
            "from": 4,
            "to": 6
          },
          {
            "from": 4,
            "to": 7
          },
          {
            "from": 5,
            "to": 8
          },
          {
            "from": 5,
            "to": 9
          },
          {
            "from": 5,
            "to": 10
          },
          {
            "from": 7,
            "to": 11
          },
          {
            "from": 7,
            "to": 12
          },
          {
            "from": 7,
            "to": 13
          },
          {
            "from": 1,
            "to": 14
          },
          {
            "from": 1,
            "to": 15
          },
          {
            "from": 6,
            "to": 16
          },
          {
            "from": 3,
            "to": 17
          },
          {
            "from": 17,
            "to": 18
          },
          {
            "from": 17,
            "to": 19
          },
          {
            "from": 20,
            "to": 1
          },
          {
            "from": 21,
            "to": 1
          },
          {
            "from": 22,
            "to": 14
          },
          {
            "from": 23,
            "to": 1
          },
          {
            "from": 24,
            "to": 1
          },
          {
            "from": 25,
            "to": 1
          }
        ]
      },
      "impact": {
        "outcome": "Cut internal tool development time by 80%.",
        "competitiveEdge": "Generates pure Angular code with zero runtime overhead."
      },
      "issues": [
        {
          "anomalousEvent": "Infinite Logic",
          "thinkingApproach": "Users created circular hide/show rules.",
          "solution": "Implemented Graph cycle detector."
        }
      ]
    },
    {
      "id": "sas-platform",
      "name": "SAS Platform",
      "tagline": "Safe AI System Vault",
      "techStack": [
        "NestJS",
        "FastAPI",
        "Zoneless Angular",
        "SSE Streamer",
        "pgvector"
      ],
      "status": "PRIVATE",
      "syncRate": 89,
      "metric": "100% Citation Grounding",
      "about": "The SAS (Safe AI System) Platform is a **High-Integrity AI Vault** designed for industries where factual errors are unacceptable. It is a direct architectural response to the 'Trust Deficit' found in generic AI tools.\n\n### 4-Tier Verification\nSAS is built on a robust 4-tier stack: Presentation (Angular 21), Orchestration (NestJS 11), Intelligence (FastAPI), and Data (PostgreSQL/pgvector). We implemented a **Post-Generation Guardrail** that cross-references every AI sentence against the internal **Vector Store**.",
      "challenges": {
        "context": "Legal firms wanted AI but feared hallucinations.",
        "painPoint": "Generic AI tools use private data for training.",
        "resolution": "Citation-First system isolating AI to grounded RAG only."
      },
      "blueprint": {
        "groups": [
          {
            "id": "presentation",
            "label": "Presentation Layer (Angular 21)",
            "x": 50,
            "y": 50,
            "w": 400,
            "h": 500
          },
          {
            "id": "orchestration",
            "label": "Orchestration Layer (NestJS 11)",
            "x": 500,
            "y": 50,
            "w": 400,
            "h": 600
          },
          {
            "id": "intelligence",
            "label": "Intelligence Layer (FastAPI)",
            "x": 50,
            "y": 600,
            "w": 400,
            "h": 400
          },
          {
            "id": "data",
            "label": "Data Layer",
            "x": 500,
            "y": 700,
            "w": 400,
            "h": 300
          },
          {
            "id": "external",
            "label": "External Services",
            "x": 50,
            "y": 1050,
            "w": 850,
            "h": 150
          }
        ],
        "nodes": [
          {
            "x": 200,
            "y": 100,
            "type": "Process",
            "label": "Shell",
            "description": "Frontend Shell",
            "group": "presentation"
          },
          {
            "x": 100,
            "y": 250,
            "type": "Process",
            "label": "MFE_Auth",
            "description": "MFE Auth Login",
            "group": "presentation"
          },
          {
            "x": 200,
            "y": 250,
            "type": "Process",
            "label": "MFE_Skills",
            "description": "MFE AI Skill Editor",
            "group": "presentation"
          },
          {
            "x": 300,
            "y": 250,
            "type": "Process",
            "label": "MFE_Play",
            "description": "MFE Playground Testing",
            "group": "presentation"
          },
          {
            "x": 650,
            "y": 100,
            "type": "Process",
            "label": "API",
            "description": "NestJS API Gateway",
            "group": "orchestration"
          },
          {
            "x": 600,
            "y": 250,
            "type": "Process",
            "label": "Auth_Mod",
            "description": "Auth Module JWT+RBAC",
            "group": "orchestration"
          },
          {
            "x": 750,
            "y": 250,
            "type": "Process",
            "label": "Chat_Mod",
            "description": "Chat Module SSE",
            "group": "orchestration"
          },
          {
            "x": 750,
            "y": 400,
            "type": "Process",
            "label": "BullMQ",
            "description": "BullMQ Redis Jobs",
            "group": "orchestration"
          },
          {
            "x": 150,
            "y": 700,
            "type": "Process",
            "label": "RAG",
            "description": "RAG Service LangChain",
            "group": "intelligence"
          },
          {
            "x": 300,
            "y": 700,
            "type": "Process",
            "label": "LLM",
            "description": "LLM Service OpenAI/Anthropic",
            "group": "intelligence"
          },
          {
            "x": 200,
            "y": 850,
            "type": "Process",
            "label": "Guardrail",
            "description": "Hallucination Detection",
            "group": "intelligence"
          },
          {
            "x": 600,
            "y": 800,
            "type": "Store",
            "label": "Postgres",
            "description": "PostgreSQL 15 + pgvector",
            "group": "data"
          },
          {
            "x": 750,
            "y": 800,
            "type": "Store",
            "label": "Redis",
            "description": "Redis 7 Cache",
            "group": "data"
          },
          {
            "x": 675,
            "y": 900,
            "type": "Store",
            "label": "VectorDB",
            "description": "Vector Store Qdrant",
            "group": "data"
          },
          {
            "x": 200,
            "y": 1120,
            "type": "Process",
            "label": "OpenAI",
            "description": "OpenAI API",
            "group": "external"
          },
          {
            "x": 450,
            "y": 1120,
            "type": "Process",
            "label": "Claude",
            "description": "Anthropic Claude",
            "group": "external"
          },
          {
            "x": 700,
            "y": 1120,
            "type": "Process",
            "label": "K8s",
            "description": "Kubernetes Production",
            "group": "external"
          }
        ],
        "connections": [
          {
            "from": 0,
            "to": 4,
            "label": "HTTP/WS"
          },
          {
            "from": 4,
            "to": 5
          },
          {
            "from": 4,
            "to": 6
          },
          {
            "from": 6,
            "to": 7
          },
          {
            "from": 6,
            "to": 8
          },
          {
            "from": 8,
            "to": 13
          },
          {
            "from": 8,
            "to": 9
          },
          {
            "from": 9,
            "to": 14
          },
          {
            "from": 9,
            "to": 15
          },
          {
            "from": 8,
            "to": 10
          },
          {
            "from": 5,
            "to": 11
          },
          {
            "from": 7,
            "to": 12
          }
        ]
      },
      "impact": {
        "outcome": "Summarize 500-page files with total factual confidence.",
        "competitiveEdge": "Source-Grounding HUD proving AI isn't lying."
      },
      "issues": [
        {
          "anomalousEvent": "Silent Timeout",
          "thinkingApproach": "Complex questions froze system.",
          "solution": "Implemented 'Streaming Thought-Tokens'."
        }
      ]
    },
    {
      "id": "prompt-forge",
      "name": "PromptForge",
      "tagline": "Prompt Engineering Workbench",
      "techStack": [
        "React",
        "TypeScript",
        "Tailwind",
        "OpenAI",
        "Anthropic",
        "Gemini"
      ],
      "status": "PROD",
      "syncRate": 95,
      "metric": "40% Prompt Cycle Reduction",
      "about": "PromptForge is a professional **Lifecycle Workbench** for AI Prompt Engineering. It transforms the process of 'talking to AI' into a structured, scientific engineering discipline.\n\n### The 'Prompt-Lifecycle' Core\nBuilt around the concept that a prompt is **Code**, PromptForge provides Optimization Rules, Variable Injection, and a Side-by-side execution engine for **OpenAI, Anthropic, and Google** simultaneously.",
      "challenges": {
        "context": "Teams were using inconsistent prompts costing thousands in API waste.",
        "painPoint": "No version control for prompts led to broken features.",
        "resolution": "Central Knowledge Layer treating prompts like versioned source code."
      },
      "blueprint": {
        "nodes": [
          {
            "x": 400,
            "y": 100,
            "type": "Input",
            "label": "EDITOR",
            "description": "Syntax-highlighted space."
          },
          {
            "x": 400,
            "y": 250,
            "type": "Process",
            "label": "ORCHESTRATOR",
            "description": "Multi-model translation."
          },
          {
            "x": 400,
            "y": 400,
            "type": "Output",
            "label": "COMPARISON",
            "description": "Side-by-side quality audit."
          }
        ],
        "connections": [
          {
            "from": 0,
            "to": 1
          },
          {
            "from": 1,
            "to": 2
          }
        ]
      },
      "impact": {
        "outcome": "Improved prompt efficiency by 40%.",
        "competitiveEdge": "Multi-Model Preview for finding the right AI."
      },
      "issues": [
        {
          "anomalousEvent": "Variable Crash",
          "thinkingApproach": "Huge data injection froze UI.",
          "solution": "Implemented Virtual Text Buffers."
        }
      ]
    },
    {
      "id": "research-syndicate",
      "name": "ResearchSyndicate",
      "tagline": "Autonomous Multi-Agent Hub",
      "techStack": [
        "Angular 20",
        "FastAPI",
        "CrewAI",
        "LiteLLM",
        "WebSocket"
      ],
      "status": "PROD",
      "syncRate": 98.2,
      "metric": "12min Automation Cycle",
      "about": "ResearchSyndicate is an **Autonomous Intelligence Hub** that acts as a real-time 'AI Newsroom.' It orchestrates a triad of specialized agents: The Researcher (SerpAPI), The Analyst (Fact Reconciliation), and The Writer (Technical Whitepaper Engine).\n\n### Live Logic Transport\nTo provide a 'Mission Control' experience, we built a **sub-100ms WebSocket Gateway**. This allows the user to see the 'Flight Log'—the literal thought process of the agents—as it happens across the live web.",
      "challenges": {
        "context": "Professional research takes weeks of manual searching.",
        "painPoint": "Reasoning happens behind the curtain, hard to trust.",
        "resolution": "Autonomous Triad with live execution logs via WebSockets."
      },
      "blueprint": {
        "layout": "LR",
        "nodes": [
          {
            "x": 100,
            "y": 300,
            "type": "Input",
            "label": "User",
            "description": "Command Input"
          },
          {
            "x": 300,
            "y": 300,
            "type": "Decision",
            "label": "WS",
            "description": "Neural Grid"
          },
          {
            "x": 500,
            "y": 150,
            "type": "Process",
            "label": "Researcher",
            "description": "Violet Agent"
          },
          {
            "x": 700,
            "y": 150,
            "type": "Process",
            "label": "Analyst",
            "description": "Amber Agent"
          },
          {
            "x": 900,
            "y": 300,
            "type": "Process",
            "label": "Writer",
            "description": "Green Agent"
          },
          {
            "x": 500,
            "y": 450,
            "type": "Output",
            "label": "UI",
            "description": "Neural Interface"
          }
        ],
        "connections": [
          {
            "from": 0,
            "to": 1
          },
          {
            "from": 1,
            "to": 2
          },
          {
            "from": 2,
            "to": 3,
            "label": "Raw Data"
          },
          {
            "from": 3,
            "to": 4,
            "label": "Insights"
          },
          {
            "from": 4,
            "to": 1,
            "label": "MD Report"
          },
          {
            "from": 1,
            "to": 5
          }
        ]
      },
      "impact": {
        "outcome": "What took analyst 4 hours now automated to 12 minutes.",
        "competitiveEdge": "Live Flight Log shows literal agent thought process."
      },
      "issues": [
        {
          "anomalousEvent": "Rabbit Hole",
          "thinkingApproach": "Researcher agents got distracted.",
          "solution": "Built Context Guard validation node."
        }
      ]
    },
    {
      "id": "ai-dash",
      "name": "AI Dash",
      "tagline": "NL Data Viz Engine",
      "techStack": [
        "GPT-4o",
        "BigQuery",
        "Chart.js",
        "Angular 18",
        "Node.js"
      ],
      "status": "PRIVATE",
      "syncRate": 88,
      "metric": "60% Backlog Reduction",
      "about": "A next-generation analytics platform empowering business users to explore massive datasets through Natural Language (NL) prompts. The engine translates plain-English questions into optimized SQL queries executed against Google BigQuery safely.",
      "challenges": {
        "context": "Managers lacked SQL skills.",
        "painPoint": "3-week backlog for simple reports.",
        "resolution": "Created NL-to-SQL layer for instant charting."
      },
      "blueprint": {
        "nodes": [
          {
            "x": 400,
            "y": 100,
            "type": "Input",
            "label": "NL_PROMPT",
            "description": "Plain English prompt."
          },
          {
            "x": 400,
            "y": 250,
            "type": "Process",
            "label": "SQL_GEN",
            "description": "BigQuery optimized SQL."
          },
          {
            "x": 400,
            "y": 400,
            "type": "Decision",
            "label": "ANOMALY_DET",
            "description": "Outlier check."
          },
          {
            "x": 400,
            "y": 550,
            "type": "Output",
            "label": "CHART_RENDER",
            "description": "Signal-driven Chart.js."
          }
        ],
        "connections": [
          {
            "from": 0,
            "to": 1
          },
          {
            "from": 1,
            "to": 2
          },
          {
            "from": 2,
            "to": 3
          }
        ]
      },
      "impact": {
        "outcome": "Reduced ad-hoc BI requests by 60%.",
        "competitiveEdge": "System explains 'why' behind trends via AI."
      },
      "issues": [
        {
          "anomalousEvent": "UI Flicker",
          "thinkingApproach": "Legacy detection re-rendered charts.",
          "solution": "Migrated to Angular 18 Signals."
        }
      ]
    },
    {
      "id": "consolidated-billing",
      "name": "Consolidated Billing",
      "tagline": "Financial Normalization Engine",
      "techStack": [
        "Angular",
        "SQL Server",
        "Node.js",
        "RxJS",
        "BigInt"
      ],
      "status": "PROD",
      "syncRate": 99,
      "metric": "Sub-Second Reconciliation",
      "about": "A mission-critical financial core designed to unify invoicing across disparate enterprise streams, processing millions of dollars monthly. The architecture replaces five legacy siloed applications with a single, high-performance web interface.",
      "challenges": {
        "context": "Fragmented legacy systems globally.",
        "painPoint": "Manual reconciliation was taking 20+ days.",
        "resolution": "Developed unified schema and ETL migration engine."
      },
      "blueprint": {
        "nodes": [
          {
            "x": 400,
            "y": 100,
            "type": "Input",
            "label": "ERP_INGEST",
            "description": "SAP & Oracle ingestion."
          },
          {
            "x": 400,
            "y": 250,
            "type": "Process",
            "label": "RULE_ENGINE",
            "description": "300+ tax rules."
          },
          {
            "x": 250,
            "y": 400,
            "type": "Process",
            "label": "AUTO_MAP",
            "description": "Standard mapping."
          },
          {
            "x": 550,
            "y": 400,
            "type": "Process",
            "label": "MANUAL_FIX",
            "description": "Flags resolution."
          },
          {
            "x": 400,
            "y": 550,
            "type": "Output",
            "label": "PAYMENT_SYNC",
            "description": "Final disbursement."
          }
        ],
        "connections": [
          {
            "from": 0,
            "to": 1
          },
          {
            "from": 1,
            "to": 2
          },
          {
            "from": 1,
            "to": 3
          },
          {
            "from": 2,
            "to": 4
          },
          {
            "from": 3,
            "to": 4
          }
        ]
      },
      "impact": {
        "outcome": "Financial reporting cut from 3 weeks to real-time.",
        "competitiveEdge": "100% audit transparency for multi-national tax."
      },
      "issues": [
        {
          "anomalousEvent": "Rounding Errors",
          "thinkingApproach": "Floats lost precision.",
          "solution": "Migrated to BigInt fixed-point arithmetic."
        }
      ]
    },
    {
      "id": "ums-app",
      "name": "UMS App",
      "tagline": "Zero-Trust Identity Gateway",
      "techStack": [
        "OIDC",
        "JWT",
        "Redis",
        "NestJS",
        "RBAC"
      ],
      "status": "PROD",
      "syncRate": 100,
      "metric": "sub-10ms Permission Resolution",
      "about": "A centralized identity governance hub providing robust Zero-Trust security for the entire enterprise application suite. UMS replaces fragmented login systems with a unified OIDC/JWT-based authentication matrix.",
      "challenges": {
        "context": "Disconnected internal applications oversight.",
        "painPoint": "De-provisioning took days.",
        "resolution": "Centralized node with instant 'Kill Switch'."
      },
      "blueprint": {
        "nodes": [
          {
            "x": 400,
            "y": 100,
            "type": "Input",
            "label": "AUTH_REQ",
            "description": "OIDC/SAML entry point."
          },
          {
            "x": 400,
            "y": 250,
            "type": "Process",
            "label": "JWT_VALIDATOR",
            "description": "Signature check."
          },
          {
            "x": 400,
            "y": 400,
            "type": "Store",
            "label": "REDIS_CACHE",
            "description": "Permission storage."
          },
          {
            "x": 400,
            "y": 550,
            "type": "Process",
            "label": "RBAC_RESOLVER",
            "description": "Matrix mapping."
          },
          {
            "x": 400,
            "y": 700,
            "type": "Output",
            "label": "SESSION_ISSUER",
            "description": "Scoped JWT issuance."
          }
        ],
        "connections": [
          {
            "from": 0,
            "to": 1
          },
          {
            "from": 1,
            "to": 2
          },
          {
            "from": 2,
            "to": 3
          },
          {
            "from": 3,
            "to": 4
          }
        ]
      },
      "impact": {
        "outcome": "Reduced identity-related support tickets by over 50%.",
        "competitiveEdge": "Custom RBAC resolver allows dynamic risk-based shifting."
      },
      "issues": [
        {
          "anomalousEvent": "Token Size",
          "thinkingApproach": "Header limit exceeded.",
          "solution": "Implemented Permissions-by-Reference."
        }
      ]
    },
    {
      "id": "afordit-bank",
      "name": "Afordit Bank",
      "tagline": "High-Performance Banking Portal",
      "techStack": [
        "Signals",
        "Bundle Sharding",
        "Service Workers",
        "Web Vitals"
      ],
      "status": "PROD",
      "syncRate": 96,
      "metric": "60% Load-Time Reduction",
      "about": "A surgical performance optimization project achieving sub-3-second Time-to-Interactive (TTI) for a massive retail banking portal. Serving millions of users daily with a 60% reduction in initial load times.",
      "challenges": {
        "context": "Portal losing users due to 12s load times on 3G.",
        "painPoint": "15% bounce rate on login phase.",
        "resolution": "Optimized critical rendering path achieved 60% reduction."
      },
      "blueprint": {
        "nodes": [
          {
            "x": 400,
            "y": 100,
            "type": "Input",
            "label": "ASSET_REQ",
            "description": "Initial browser request."
          },
          {
            "x": 400,
            "y": 250,
            "type": "Process",
            "label": "SW_CACHE",
            "description": "Service Worker pre-fetching."
          },
          {
            "x": 400,
            "y": 400,
            "type": "Process",
            "label": "BUNDLE_SHARD",
            "description": "Route-based sharding."
          },
          {
            "x": 400,
            "y": 550,
            "type": "Process",
            "label": "SIG_HYDRATE",
            "description": "Signal-based hydration."
          },
          {
            "x": 400,
            "y": 700,
            "type": "Output",
            "label": "TTI_UX",
            "description": "Hydrated secure UI."
          }
        ],
        "connections": [
          {
            "from": 0,
            "to": 1
          },
          {
            "from": 1,
            "to": 2
          },
          {
            "from": 2,
            "to": 3
          },
          {
            "from": 3,
            "to": 4
          }
        ]
      },
      "impact": {
        "outcome": "Sub-3s TTI and 10% volume increase.",
        "competitiveEdge": "Serves users in low-bandwidth regions flawlessly."
      },
      "issues": [
        {
          "anomalousEvent": "CLS shift",
          "thinkingApproach": "Marketing banners pushed content.",
          "solution": "Implemented Aspect-Ratio placeholders."
        }
      ]
    }
  ]
};