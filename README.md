# 🏦 SBI Dost — Autonomous Personal Finance Concierge

> **SBI Hackathon @ Global Fintech Fest 2026** | Pillar: Digital Engagement | Theme: Agentic AI & Emerging Tech

![SBI Dost Banner](https://img.shields.io/badge/SBI_Hackathon-GFF_2026-0066CC?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48dGV4dCB5PSIuOWVtIiBmb250LXNpemU9IjkwIj7wn4+mPC90ZXh0Pjwvc3ZnPg==)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.3-646CFF?style=flat-square&logo=vite)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## 🧠 What is SBI Dost?

**SBI Dost** is an **Agentic AI**-powered personal finance concierge that goes far beyond passive chatbots. Instead of waiting for user commands, it **proactively monitors** spending patterns, **detects financial leakage**, and **autonomously executes** banking workflows — all while maintaining full user control through **Human-in-the-Loop (HITL) security guardrails**.

### Key Capabilities

| Feature | Description |
|---------|-------------|
| 🔍 **Proactive Mandate Auditor** | Scans recurring auto-debits, identifies unused subscriptions (e.g., 120 days idle), and recommends/executes cancellations under RBI Policy S-812 |
| 🧠 **RAG-Powered Policy Engine** | Queries a vector database of SBI banking policies before executing any transaction — validates transfer limits, OTP thresholds, and compliance |
| 🛡️ **Human-in-the-Loop Guardrails** | All monetary actions require explicit user authorization via an interactive OTP approval card. The agent plans and verifies, then **halts** for confirmation |
| 📊 **Reasoning Transparency Console** | Displays the agent's THOUGHT → ACTION → OBSERVATION chain in real-time, building algorithmic trust with zero black boxes |
| 💹 **Smart Budget & Goal Tracking** | Category-wise spending monitors, savings goal progress bars, and yield optimization recommendations |

---

## 🏗️ Architecture

The system operates on an autonomous **ReAct (Reasoning & Action) Loop**:

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  User Query  │────►│  Policy RAG  │────►│   Balance &  │
│  or Trigger  │     │   Lookup     │     │   Recipient  │
└──────────────┘     └──────────────┘     └──────────────┘
                                                │
                     ┌──────────────┐     ┌─────▼────────┐
                     │  HITL OTP    │◄────│  Reasoning   │
                     │  Guardrail   │     │  Trace Log   │
                     └──────┬───────┘     └──────────────┘
                            │
                     ┌──────▼───────┐
                     │ API Execute  │
                     │ & UI Refresh │
                     └──────────────┘
```

---

## 🖥️ Interactive Dashboard

The prototype features a **premium multi-tab SaaS dashboard**:

- **Overview** — Real-time balance, transaction table, budget alerts, agent notifications
- **AI Assistant** — Conversational chat + live ReAct reasoning console
- **Mandate Auditor** — Auto-debit audit table with leakage detection & one-click blocking
- **Budgets & Goals** — Category trackers, savings goals, yield optimization

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vite + React 18, Vanilla CSS |
| Agent Engine | Custom ReAct Loop (JavaScript) |
| Policy RAG | Vector Database (Chroma / pgvector) |
| Security | HITL Guardrails + OTP Validation |
| Mock APIs | Stateful SBI Core Banking Simulator |

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/JatinGargz/sbi-dost.git
cd sbi-dost

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📂 Project Structure

```
sbi-dost/
├── index.html              # HTML entry point
├── package.json            # Dependencies & scripts
├── vite.config.js          # Vite configuration
├── src/
│   ├── main.jsx            # React entry
│   ├── App.jsx             # Multi-tab dashboard + Agent engine
│   ├── mockAgent.js        # ReAct agent loop & mock API tools
│   └── index.css           # Premium design system
├── proposal.md             # Hackathon submission text
├── SBI_Dost_Idea_Deck.pptx # Presentation deck
└── README.md               # This file
```

---

## 📄 License

This project is built for the SBI Hackathon @ GFF 2026. MIT License.

---

**Built with ❤️ for the SBI Hackathon @ Global Fintech Fest 2026**
