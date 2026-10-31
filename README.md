# DeutschLab

An open-source, full-stack platform designed to take learners from zero (A0) to fluent German (B2). Built with an offline-first architecture, authentic studio-quality pronunciation, spaced repetition (FSRS), interactive grammar analysis, and an optional multi-provider AI engine.

---

## Overview

Most language apps focus either on passive flashcards or complex grammar without real context. DeutschLab bridges that gap by combining structured curriculum levels with contextual sentences, real-life dialogue roleplay, interactive sentence order puzzles, and an AI-assisted grammar engine that explains sentence structures step by step.

The application works completely offline as a Progressive Web App (PWA) with a local SQLite database, and can optionally connect to various AI providers (Google Gemini, OpenAI, Anthropic Claude, OpenRouter, or local models via Ollama/vLLM).

---

## Key Features

- **Full Curriculum (A0 to B2):** Alphabet, pronunciation rules, core vocabulary with 5 contextual sentences per word, essential verb conjugations, and idioms.
- **Natural Studio Pronunciation:** Integrated neural speech engine featuring authentic native German voices (Katja & Conrad) with female and male voice switching.
- **Interactive Practice Arena:**
  - *Der / Die / Das Speed Challenge:* Timed article practice with streak bonuses and morphological suffix rules (-ung, -heit, -keit, -tion, etc.).
  - *Satzbau Syntax Puzzle:* Word-order training for Hauptsatz (Verb at Position 2), Nebensatz (Verb at the end), and Akkusativ/Dativ arrangements.
- **Real-Life Dialogues (Alltagsdialoge):** Common scenarios in Germany (supermarket, doctor, apartment rental, train station, citizen office) with dual-role dialogue playback.
- **Letter & Email Assistant (Brief-Meister):** Templates and Redemittel phrases for Goethe and Telc exam writing tasks with automated evaluation.
- **Spaced Repetition System (FSRS):** Scientific review scheduling tracking stability, difficulty, and retention intervals.
- **Audio Dictation Lab (Diktat):** Audio playback with adjustable playback speeds and immediate character-by-character spelling verification.
- **Multi-Language Interface (i18n):** Native support for 8 languages:
  - Arabic (العربية - RTL)
  - English
  - German (Deutsch)
  - Chinese (中文)
  - Russian (Русский)
  - French (Français)
  - Spanish (Español)
  - Turkish (Türkçe)
- **Multi-Provider AI Gateway:** Built-in adapter for Gemini, OpenAI, Claude, OpenRouter, or local Ollama instances with encrypted credential storage (AES-256).

---

## Tech Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS with RTL/LTR dynamic direction support
- **State & Storage:** LocalStorage, IndexedDB, and HTML5 Audio
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express with TypeScript
- **Database & ORM:** SQLite via Prisma ORM
- **Speech Synthesis:** Microsoft Azure Read Aloud neural voices (`msedge-tts`) with Google TTS fallback
- **Security:** AES-256-GCM encryption for API keys, SSRF protection, Helmet, and rate limiting

---

## Quick Start Guide

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm or pnpm

### 1. Clone the repository
```bash
git clone https://github.com/your-username/DeutschLab.git
cd DeutschLab
```

### 2. Install dependencies
Install all root, backend, and frontend dependencies:
```bash
# Install root dependencies
npm install

# Install server dependencies
npm --prefix server install

# Install client dependencies
npm --prefix client install
```

### 3. Configure environment variables
Copy the example environment file in the `server` directory:
```bash
cp server/.env.example server/.env
```

The default values in `server/.env` work out of the box for local development:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="file:./dev.db"
AES_MASTER_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
JWT_SECRET=your_development_jwt_secret_here
CLIENT_URL=http://localhost:5173
```

### 4. Initialize Database and Seed Data
Generate the Prisma client, push the schema to SQLite, and seed the curriculum:
```bash
# Push database schema
npm run prisma:push

# Seed curriculum, grammar rules, vocabulary, and default providers
npm run seed
```

### 5. Start Development Servers
Run both backend (port 5000) and frontend (port 5173) concurrently:
```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:5173/
```

---

## Connecting an AI Provider (Optional)

The core application (vocabulary, grammar lessons, arena puzzles, shadowing, dialogues, audio) works 100% offline without any API key.

If you wish to enable the AI Teacher and sentence analysis features:
1. Navigate to the **AI Providers** tab in the navigation bar.
2. Select your preferred provider (e.g., Google Gemini, OpenAI, Anthropic, or Local Ollama).
3. Paste your API key and click **Save**.
4. Click **Test Connection** to verify latency and connectivity.
5. All keys are encrypted using AES-256-GCM before storage.

---

## Project Structure

```
DeutschLab/
├── client/                     # Frontend Vite + React application
│   ├── src/
│   │   ├── components/        # View modules (Arena, Vocab, Dialogues, Briefs, etc.)
│   │   ├── i18n/              # Translations and language context (8 languages)
│   │   ├── utils/             # Speech synthesis service and helpers
│   │   ├── types/             # TypeScript definitions
│   │   ├── App.tsx            # Main shell, responsive layout, and navigation
│   │   └── main.tsx           # Entry point and PWA service worker management
│   └── public/                # Static assets, audio, and PWA manifest
├── server/                     # Backend Express API
│   ├── src/
│   │   ├── routes/            # REST API endpoints (TTS, Content, AI, Providers)
│   │   ├── security/          # AES-256 encryption and SSRF guards
│   │   ├── curriculum*.ts     # Structured seed datasets
│   │   ├── prisma.ts          # Database client
│   │   └── index.ts           # Server initialization and middleware
│   └── prisma/
│       └── schema.prisma      # SQLite database schema
├── package.json               # Root monorepo scripts
└── README.md
```

---

## Supporting the Project

DeutschLab is an independent open-source project. If you find it helpful for your language learning or development journey, you can support future development and server costs via cryptocurrency donations:

- **USDT (BEP20 network):**
  ```
  0x03544B54fAc69a1616618aABDBBe31cBDe650ED1
  ```

- **Bitcoin (BTC network):**
  ```
  bc1ql5nlel7n96ax40ve7sg84ddqp9ha3c4jmmv9nv
  ```

- **Ethereum (ETH network):**
  ```
  0x03544B54fAc69a1616618aABDBBe31cBDe650ED1
  ```

- **Solana (SOL network):**
  ```
  GkybF55ShiLanp3sZ6w9h1u9ycQiGX7BJs7eMLLro6de
  ```

- **Tron (TRX network):**
  ```
  TKx9pn6eGFEEMUhr1Br5cHqHh7age4nBKU
  ```

- **BNB Coin (BNB network):**
  ```
  0x03544B54fAc69a1616618aABDBBe31cBDe650ED1
  ```

---

## Contributing

Contributions from the community are warmly welcome!
1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`.
3. Commit your changes: `git commit -m 'Add: feature description'`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Open a Pull Request.

---

## License

This project is licensed under the [MIT License](LICENSE).
