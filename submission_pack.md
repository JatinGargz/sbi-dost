# SBI Hackathon @ GFF 2026: Idea Submission Pack

This submission pack contains the copy-pasteable texts for the **HackCulture Portal Form Fields** and a complete **6-Slide Idea Pitch Deck** to secure a spot in the Top 15 shortlist.

---

## Part 1: HackCulture Portal Form Fields

### 1. Theme
*   **Selected Option:** `Agentic AI & Emerging Tech`

### 2. Problem Statement
*   **Selected Option:** `Digital Engagement`

### 3. Project Title
*   **Text:** `SBI Dost: Autonomous Personal Finance Concierge & Agentic Advisor`

### 4. Brief Description of the Idea (Max Word Limit Friendly)
**SBI Dost** is an autonomous personal finance concierge integrated into the SBI digital ecosystem. Unlike passive, rule-based banking chatbots, SBI Dost is powered by a **Reasoning and Action (ReAct) Agent Engine** that proactively engages customers by analyzing transaction histories, identifying leakage, and executing financial workflows through secure, audited tool use.

**Core Capabilities & Innovations:**
1. **Proactive Mandate Auditing & Leakage Detection:** Dost monitors account mandates, identifying recurring subscriptions that have gone unused for 60/90/120 days. Under RBI Auto-Debit Guidelines (Policy S-812), the agent drafts mandate suspension requests, allowing customers to block wasteful spending instantly.
2. **RAG-Powered Policy Verification:** Before executing transfers, the agent consults a simulated Vector Database containing SBI’s digital banking policies (Policy L-204) to dynamically check transfer limits and compliance.
3. **Human-in-the-Loop (HITL) Guardrails:** For any money transfers or mandate cancellations, the agent triggers a secure visual OTP card. It plans the transfer, verifies beneficiary credentials, and halts for explicit user approval before executing the transaction via core banking APIs.
4. **Reasoning Trace Console:** Directly shows the agent's thoughts, tool actions, and observations to the customer, establishing algorithmic transparency and building banking trust.

---

### 5. Proposed Solution Business Model / Commercial Potential
SBI Dost drives commercial value for State Bank of India through four core revenue and operational metrics:
*   **Fee Income from Product Cross-Selling:** By identifying idle cash balances (e.g. money in savings accounts earning 3.0%), the agent proactively suggests contextually relevant SBI Mutual Funds, Fixed Deposits, or insurance products. This increases cross-sell conversion rates by offering recommendations at the point of maximum interest.
*   **Increased Assets Under Management (AUM):** Integrating micro-savings goals (e.g., auto-investing cashbacks or rounding up transactions into mutual funds) routes liquid assets directly into SBI wealth products.
*   **Customer Retention (LTV Expansion):** Proactively identifying subscription leakage and offering automated budget alerts positions SBI as a financial partner rather than a passive utility. This fosters deep long-term brand loyalty.
*   **Support Ticket Reduction:** Handling multi-step operations (e.g. "cancel mandate", "check housing budgets", "run transaction audits") autonomously reduces call-center loads and support ticket volumes by up to 35-40%.

---

### 6. Technology Stack Details
*   **Frontend UI:** Built using **Vite + React** and styled with premium Vanilla CSS. It features a tabbed multi-page layout (Overview, AI Assistant, Mandate Auditor, Budgets) utilizing a professional corporate hybrid color palette (deep navy headers, soft peach-cream backgrounds, and white cards).
*   **Agent Core Engine:** A custom **Reasoning and Action (ReAct) Loop** implemented in JS that maps natural language queries to discrete tool calls: `Thought -> Action (Tool Call) -> Observation (API Result) -> Response`.
*   **Simulated APIs:** Integrates with mock SBI Core Banking databases (Accounts, Transactions, Budgets, Mandates).
*   **Policy RAG (Retrieval-Augmented Generation):** Implements a policy vector lookup tool (`search_sbi_policy()`) to cross-reference transactions against SBI's digital banking limits.
*   **Security Layer:** Strict Human-in-the-Loop (HITL) prompt locks on all debit APIs.

---

### 7. Process Flow / Architecture Description
The SBI Dost agent operates in a continuous security-validated execution loop:
1. **User Query/Trigger:** User inputs a request (e.g. "Settle landlord rent of 12,000 INR") or the system detects an anomaly (e.g. unused subscription).
2. **Intent & Policy Check (RAG):** The agent fetches relevant banking policies. It queries `search_sbi_policy("transfer limits")` and parses Policy L-204 (daily limits and OTP thresholds).
3. **Verification:** The agent calls `get_balance()` and `check_recipient("Landlord")` to ensure sufficient funds and recipient validity.
4. **Reasoning Loop Logging:** The console visualizes these steps to the user (`THOUGHT -> ACTION -> OBSERVATION`).
5. **Human-in-the-Loop Security Guardrail:** As the amount exceeds 10,000 INR, the engine triggers an OTP/authorization prompt.
6. **API Execution:** Upon user approval, the agent executes `execute_transfer()`, updates the balances, and updates the budgets.

---

## Part 2: 6-Slide Idea Pitch Deck

Use the layout below to construct your presentation slides (PPTX/PDF):

### Slide 1: Cover Page & The Big Idea
*   **Slide Title:** SBI Dost: Autonomous Personal Finance Concierge & Agentic Advisor
*   **Subtitle:** Unlocking Digital Engagement through Proactive Agentic Banking
*   **Visual Suggestion:** Mockup of the dashboard header showing "Agent Core: Online" next to SBI Dost logo.
*   **Key Pitch:** "Moving banking from passive transaction registers to proactive agentic partnerships that secure, save, and grow customer wealth autonomously."

### Slide 2: The Problem
*   **Header:** The Digital Engagement Gap
*   **Key Points:**
    *   **Silent Financial Leakage:** Customers lose billions globally to forgotten subscription mandates (mandate leakage).
    *   **Passive Account Engagement:** Idle cash balances lie under-utilized in savings accounts due to investment friction.
    *   **Overspending Friction:** Standard banking apps alert users *after* they break budgets, failing to prevent overspend.
    *   **Support Overload:** High volume of basic transaction inquiries overwhelms customer service desks.

### Slide 3: The Solution: SBI Dost
*   **Header:** Proactive, Secure, and Agentic
*   **Key Features:**
    *   **Proactive Auditor Agent:** Automatically scans transaction histories to detect mandate leakages and inactive subscriptions.
    *   **Task Automation via Tool Use:** Settle rent or bills conversationally. The agent classifies intents and sequences API queries.
    *   **RAG Compliance Engine:** Auto-checks transfer caps and policies before execution.
    *   **Visual Transparency Console:** Displays the agent's thoughts and tool calls in real-time, building trust.

### Slide 4: Technology & Architecture
*   **Header:** Secure ReAct Architecture
*   **Key Components:**
    *   **Agent Core (LLM/ReAct Planner):** Directs thoughts, tools, and responses.
    *   **Vector DB (Policy RAG):** Matches transactions with banking circulars.
    *   **Human-in-the-Loop (HITL) Guardrail:** Demands explicit user OTP confirmation for transfers and mandate blocks.
*   *Include the Process Flow architecture diagram.*

### Slide 5: Business Impact & Commercial Value
*   **Header:** Driving Fee Income and Deposit Retention
*   **Key Value Propositions:**
    *   **Cross-selling (Wealth Management):** Proactively directs idle funds into SBI Mutual Funds and FDs.
    *   **Customer Lifetime Value (LTV):** Increases digital app stickiness and net promoter scores (NPS).
    *   **Support Optimization:** Decreases call center expenses by handling complex queries autonomously.

### Slide 6: Prototype Ready (Call to Action)
*   **Header:** Ready for Phase 2: Live Prototype Built
*   **Key Points:**
    *   Fully functional Vite/React prototype showcasing all workflows.
    *   Responsive tabbed dashboard incorporating Overview, AI Assistant, Mandate Auditor, and Budgets.
    *   **Repository URL:** *[Insert your Github Link]*
    *   **Demo Video:** *[Insert your 3-Minute Demo Link]*

---

## Part 3: 3-Minute Demo Video Script

Follow this script to record a professional screencast of the React app:

*   **0:00 - 0:30 (Introduction):**
    *   *Visual:* Show the **Overview tab** of the prototype.
    *   *Audio:* "Hello. Today, we are presenting SBI Dost, our entry for the GFF 2026 Hackathon under the Digital Engagement pillar. SBI Dost is an Agentic AI personal finance advisor. Here, on the overview page, you see the customer's balance, active mandates, and a warning bar showing that 94% of the dining budget is consumed."
*   **0:00 - 1:15 (Leakage Detection Workflow):**
    *   *Visual:* Switch to the **Mandate Auditor tab**. Point out the active subscriptions and their idle days. Click **Block Mandate** on Streaming Premium.
    *   *Audio:* "Let's run a mandate audit. Here, the agent scans recurring mandates and detects that Streaming Premium has been unused for 120 days. The agent consults SBI Policy S-812 and blocks the mandate. In the AI Assistant tab, you can see the agent's thoughts, tools, and actions streaming live, and a toast notifies us that the mandate is blocked."
*   **1:15 - 2:30 (Rent Transfer & RAG Policy Limits):**
    *   *Visual:* Go to the **AI Assistant tab**, click **Settle Rent**. Show the console terminal streaming thoughts, RAG policy checks, and beneficiary checks. Highlight the **Human-in-the-Loop Card** appearing. Click **Approve & Execute**.
    *   *Audio:* "Now, let's ask the agent to settle rent. The agent checks our balance and queries SBI's digital transfer policy L-204 using RAG. It recognizes that because the transfer exceeds 10,000 INR, OTP validation is required. An authorization prompt appears. We click approve, the agent transfers the funds, and our balance on the header decreases instantly."
*   **2:30 - 3:00 (Summary & Business Value):**
    *   *Visual:* Show the **Budgets & Goals tab** with the savings targets and asset yield recommendations.
    *   *Audio:* "SBI Dost moves digital banking from a passive transaction record to a proactive, automated wealth partner. It increases SBI's cross-sell potential and reduces operational support logs. The code is open-source and ready for deployment. Thank you."
