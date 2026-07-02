# 🚀 Deploy and Demo Guide: SBI Dost

This guide shows you how to publish your repository to GitHub, deploy the interactive prototype online, and record a 1-minute demo video if needed.

---

## 1. Push Code to GitHub

Since the local Git repository is initialized and committed, you can upload it to GitHub in 3 simple steps:

1. Go to [github.com/new](https://github.com/new) and create a **public** repository named `sbi-dost`.
2. Open your terminal in the `sbi-agentic-banking-hackathon` folder and run:
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/sbi-dost.git
   git push -u origin main
   ```
   *(Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username).*

---

## 2. Deploy Live Interactive Prototype (Free)

Once your code is on GitHub, you can host the website instantly:

### Option A: Vercel (Easiest)
1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **Add New** → **Project**.
3. Import the `sbi-dost` repository.
4. Click **Deploy**. Vercel will automatically build and publish your Vite React app.
5. Copy the live URL (e.g., `https://sbi-dost.vercel.app`) and paste it into your PPT slides and submission form!

---

## 3. 1-Minute Demo Video Script (Voiceover + Click Walkthrough)

If the submission portal requests a video link, follow this simple guide to record one using standard Windows tools:

### Preparation:
1. Open your live hosted URL in Google Chrome.
2. Press **`Win + G`** (Windows Game Bar) and click the **Record** button (or press **`Win + Alt + R`** directly) to start recording your screen and microphone.

### Walkthrough & Script:

| Step | Action on Screen | What to Say (Voiceover) |
|---|---|---|
| **0:00 - 0:15** | Hover over the **Overview Dashboard** stats and the **Recent Transactions** table. | *"Hello everyone, this is SBI Dost, an autonomous Agentic AI personal finance concierge designed for the SBI Hackathon. Here is our clean, professional dashboard displaying real-time balance metrics, active mandates, and transaction logs."* |
| **0:15 - 0:35** | Click the **AI Assistant** tab. Click the quick preset: **"Settle Rent"**. | *"Let's test our fund transfer flow. I will request the agent to pay rent. Watch the Agent Intelligence Console on the right: it starts a ReAct reasoning loop. It fetches the balance, queries our policy vector database, and detects that the transfer exceeds the 10,000 INR limit."* |
| **0:35 - 0:50** | Look at the popped-up **OTP Security Guardrail**. Click **"Authorize & Transfer"**. | *"Because of the policy match, it halts execution and fires a Human-in-the-Loop OTP verification card. Once I authorize it, the transaction completes, core APIs are hit, and our dashboard updates instantly."* |
| **0:50 - 1:00** | Click the **Mandate Auditor** tab. | *"Finally, our Mandate Auditor scans for auto-debit leakage. It identifies unused subscriptions, matches them with RBI Policy S-812, and lets users cancel them in one click. Thank you!"* |

---

*Once done, upload the recorded video to Google Drive / YouTube (unlisted) and add the link to your submission.*
