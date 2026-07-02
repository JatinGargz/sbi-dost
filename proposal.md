# Hackathon Submission Proposal: SBI Dost (Digital Engagement)

This document contains the exact content structured for the **HackCulture Submission Portal** for the SBI Hackathon @ GFF 2026.

---

### 1. Theme
**Agentic AI & Emerging Tech** (Selected)

### 2. Problem Statement
**Digital Engagement** (Selected)

### 3. Project Title
`SBI Dost: Autonomous Personal Finance Concierge & Agentic Advisor`

### 4. Team details
*(Enter your team details here, e.g.,)*
- Jatin Garg (Developer & Architect) - [Your Organization/University]

---

### 5. Brief description of the idea (Form Field)
**SBI Dost** is an autonomous personal finance concierge integrated into the SBI ecosystem. Unlike passive, rule-based chatbots, SBI Dost is an **Agentic AI** that proactively engages customers by analyzing their spending patterns, transaction histories, and life events, executing banking workflows through secure tool use. 

**Key Capabilities:**
1. **Proactive Spending Analysis & Subscription Leakage Detection:** Dost monitors transaction logs to identify recurring subscriptions that haven't been utilized in 90 days or detects sudden spikes in utility bills. It doesn't just notify the user; it formulates a plan, drafts a cancellation request or switches to a cheaper provider, and asks for confirmation.
2. **Goal-Driven Savings & Auto-Investing:** A user can set high-level goals like "Help me save 50,000 INR for a trip to Goa in December." Dost continuously runs in the background, analyzing disposable income, budgeting categories, and micro-investing excess cash or rounding up transactions into mutual funds.
3. **Conversational Action Execution (Tool-Use):** Customers can execute transactions using natural language (e.g., "Pay Jatin 10,000 INR for rent and settle my utility bill"). The agent translates this into a sequence of API calls, plans the budget updates, and presents an interactive verification prompt for OTP approval.
4. **Reasoning Transparency:** It showcases a "Reasoning Trace" (Thought -> Action -> Observation) directly to the user, building trust by showing exactly how decisions are made.

---

### 6. Proposed solution Business model/commercial potential (Form Field)
SBI Dost has substantial commercial potential for State Bank of India across multiple vectors:
- **Product Cross-Selling (Fee Income):** By analyzing transaction data and idle balances, the agent contextually recommends SBI Mutual Funds, Fixed Deposits, and Insurance products, increasing digital adoption of high-margin financial services.
- **Improved Customer Retention (LTV):** By proactively helping users manage their money, budget, and avoid subscription leaks, the bank positions itself as a trusted financial partner, reducing customer churn.
- **Increased Average Balance (AUM):** Automating goal-based micro-savings routes money into SBI wealth management products, increasing total assets under management.
- **Operational Savings:** Resolving complex, multi-step queries (like transaction searches, card limit modifications, and subscription blocking) autonomously reduces call-center and customer support loads by up to 40%.

---

### 7. Technology stack details (Form Field)
The prototype is architected with scalability and security in mind:
- **Frontend UI:** **Vite + React** styled with premium Vanilla CSS. Utilizes HSL color models, custom CSS glassmorphism, and smooth animations (using CSS keyframes and transitions).
- **Agent Core Engine (Simulated):** A custom **ReAct (Reasoning and Action) Agent Engine** built in Javascript that maintains state, parses natural language intent, and executes a loop of `Thought -> Plan -> Tool Call -> Result -> Thought -> Response`.
- **Backend / Integration:** Node.js/Python API endpoints (simulated in frontend for prototype speed) interfacing with mock SBI Core Banking APIs (Accounts, Payments, Budgeting, Investment services).
- **Database / RAG:** **Vector Database (Chroma DB / pgvector)** for indexing SBI banking policies, product FAQs, and terms of service, allowing the agent to fetch accurate policy information dynamically before execution.
- **Guardrails & Security:** Input-output validators, prompt injection guards, and a strict **Human-in-the-Loop (HITL)** orchestration layer requiring explicit UI approval for any monetary transactions.

---

### 8. Process flow/architecture (Form Field)
The system operates on an autonomous ReAct loop:

```
[User Input] 
     │
     ▼
[LLM Intent Classifier & Policy Guardrails]
     │
     ▼
[Agent Planner] ◄─────── (Looping ReAct Cycle) ────────► [Tool Execution]
     │                                                        │
     ├─► Thought: Identify budget constraint                   ├─► check_balance()
     ├─► Plan: Fetch transaction history                      ├─► get_transactions()
     └─► Action: Draft transfer & ask confirmation            └─► transfer_funds()
     │
     ▼
[Human-in-the-Loop (HITL) Guardrail] (Requires User Click/OTP to proceed)
     │
     ▼
[SBI Core Banking API Execution]
     │
     ▼
[Transaction Successful & UI Dashboard Refreshed]
```

**Workflow Example:**
1. **User asks:** "Settle my rent of 12,000 INR."
2. **Thought:** The user wants to pay rent. I need to check the balance and confirm the recipient's details.
3. **Action:** Call `get_balance()`. Result: 45,000 INR. Call `get_recipient(name="Landlord")`. Result: Recipient found (Acc: 9876XXXX210).
4. **Thought:** Balance is sufficient. I will draft the transfer and ask the user for authorization.
5. **Observation:** Interactive approval card appears in UI. User approves.
6. **Action:** Call `execute_transfer(to="9876XXXX210", amount=12000)`. Result: Success.
7. **Response:** Rent paid. Dost updates the user's budget and displays the receipt.
