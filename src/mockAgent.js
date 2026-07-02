// Mock Banking State & Databases
let mockState = {
  balance: 45000,
  subscriptions: [
    { id: 'sub_1', name: 'Streaming Premium', cost: 699, unusedDays: 120, status: 'Active', category: 'Entertainment', frequency: 'Monthly' },
    { id: 'sub_2', name: 'Gym Membership', cost: 1500, unusedDays: 75, status: 'Active', category: 'Health', frequency: 'Monthly' },
    { id: 'sub_3', name: 'Cloud Storage Plus', cost: 199, unusedDays: 0, status: 'Active', category: 'Utilities', frequency: 'Monthly' }
  ],
  budgets: {
    diningOut: { spent: 14200, limit: 15000 },
    shopping: { spent: 5000, limit: 8000 },
    rent: { spent: 0, limit: 12000 }
  },
  transactions: [
    { id: 't_1', date: '2026-06-28', description: 'Restaurant Sizzlers', category: 'diningOut', amount: 1200, type: 'Debit' },
    { id: 't_2', date: '2026-06-25', description: 'Grocery Supermart', category: 'shopping', amount: 3500, type: 'Debit' },
    { id: 't_3', date: '2026-06-15', description: 'Gym Mandate auto-debit', category: 'subscriptions', amount: 1500, type: 'Debit' },
    { id: 't_4', date: '2026-06-05', description: 'Streaming Mandate auto-debit', category: 'subscriptions', amount: 699, type: 'Debit' },
    { id: 't_5', date: '2026-06-01', description: 'Salary Credit', category: 'income', amount: 65000, type: 'Credit' }
  ]
};

// Simulated Tool Definitions (with RAG Policy Search)
const bankingTools = {
  get_balance: () => {
    return `Current Balance: INR ${mockState.balance.toLocaleString('en-IN')}`;
  },
  get_subscriptions: () => {
    return JSON.stringify(mockState.subscriptions.filter(s => s.status === 'Active'));
  },
  search_sbi_policy: (topic) => {
    const topicLower = topic.toLowerCase();
    if (topicLower.includes('transfer') || topicLower.includes('rent') || topicLower.includes('limit')) {
      return "POLICY L-204 (Fund Transfers): Daily digital transfer limit per beneficiary is INR 20,000. Outbound transactions exceeding INR 10,000 require Human-in-the-Loop OTP verification. Transactions exceeding INR 20,000 require secondary manager clearance.";
    }
    if (topicLower.includes('subscription') || topicLower.includes('mandate') || topicLower.includes('block')) {
      return "POLICY S-812 (Recurring Mandates): RBI 2021 guidelines grant customers the absolute right to block or cancel recurring auto-debit mandates instantly via digital channels. No vendor clearance is required.";
    }
    return "POLICY G-101 (General): Standard banking operations. Security protocols and daily session timeouts apply.";
  },
  cancel_subscription: (name) => {
    const sub = mockState.subscriptions.find(s => s.name === name);
    if (sub) {
      sub.status = 'Cancelled';
      mockState.transactions.unshift({
        id: `t_${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().split('T')[0],
        description: `Blocked Mandate: ${name}`,
        category: 'subscriptions',
        amount: 0,
        type: 'Debit'
      });
      return `Success: ${name} subscription cancelled. Future auto-debited mandates blocked.`;
    }
    return `Error: Subscription '${name}' not found.`;
  },
  check_recipient: (name) => {
    if (name.toLowerCase() === 'landlord') {
      return JSON.stringify({
        name: 'Landlord Rent Account',
        accountNumber: '9876543210',
        bank: 'SBI (State Bank of India)',
        IFSC: 'SBIN0000001'
      });
    }
    return `Error: Beneficiary '${name}' not registered.`;
  },
  execute_transfer: (name, amount) => {
    if (mockState.balance < amount) {
      return `Error: Insufficient balance. Available: INR ${mockState.balance}`;
    }
    mockState.balance -= amount;
    if (name.toLowerCase() === 'landlord') {
      mockState.budgets.rent.spent += amount;
    }
    const txnId = `SBI-${Math.floor(100000000 + Math.random() * 900000000)}`;
    mockState.transactions.unshift({
      id: `t_${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      description: `Transfer to ${name}`,
      category: name.toLowerCase() === 'landlord' ? 'rent' : 'transfers',
      amount: amount,
      type: 'Debit'
    });
    return `Success: Transferred INR ${amount.toLocaleString('en-IN')} to ${name}. TXN ID: ${txnId}. New Balance: INR ${mockState.balance.toLocaleString('en-IN')}`;
  },
  get_spending_analysis: () => {
    return JSON.stringify(mockState.budgets);
  }
};

// ReAct Agent Workflow Scenarios
export const runAgentWorkflow = async (userMessage, onStepCallback) => {
  const query = userMessage.toLowerCase().trim();

  // Helper to trigger callback with artificial latency to simulate reasoning steps
  const addStep = async (type, label, detail, delay = 1000) => {
    onStepCallback({ type, label, detail, timestamp: new Date().toLocaleTimeString() });
    await new Promise(resolve => setTimeout(resolve, delay));
  };

  // Scenario 1: Subscription Cleanup
  if (query.includes('subscription') || query.includes('leakage') || query.includes('unused')) {
    await addStep('goal', 'Goal Set', 'Scan active recurring payment mandates for utilization leakage.');
    
    await addStep('thought', 'Reasoning', 'Checking recurring subscription mandates and searching relevant RBI/SBI guidelines.');
    await addStep('action', 'Call Tool', 'search_sbi_policy("mandate cancellation")');
    
    const policy = bankingTools.search_sbi_policy("mandate cancellation");
    await addStep('observation', 'Tool Result', policy);

    await addStep('thought', 'Reasoning', 'Policy allows immediate customer-side cancellation. Fetching the active subscriptions list to cross-check usage.');
    await addStep('action', 'Call Tool', 'get_subscriptions()');
    
    const subs = bankingTools.get_subscriptions();
    await addStep('observation', 'Tool Result', subs);
    
    await addStep('thought', 'Reasoning', 'Found 2 active mandates with zero utilization: "Streaming Premium" (120 days idle, cost 699 INR) and "Gym Membership" (75 days idle, cost 1500 INR). Preparing recommendation to block Streaming Premium.');
    
    await addStep('response', 'Agent Response', 
      "I have audited your active recurring mandates. Under RBI guidelines (Policy S-812), I can block these immediately for you:\n\n" +
      "1. **Streaming Premium** (INR 699/month) — Unused for **120 days**.\n" +
      "2. **Gym Membership** (INR 1,500/month) — Unused for **75 days**.\n\n" +
      "Would you like me to block the SBI auto-debit mandate for Streaming Premium?"
    );
    return {
      type: 'options',
      options: ['Cancel Streaming Premium', 'Keep Subscriptions']
    };
  }

  // Scenario 1.5: Cancel mandate confirmation
  if (query.includes('cancel streaming') || query.includes('cancel streaming premium')) {
    await addStep('goal', 'Goal Set', 'Terminate "Streaming Premium" mandate.');
    
    await addStep('thought', 'Reasoning', 'User requested cancellation. Invoking the cancel mandate tool.');
    await addStep('action', 'Call Tool', 'cancel_subscription("Streaming Premium")');
    
    const result = bankingTools.cancel_subscription('Streaming Premium');
    await addStep('observation', 'Tool Result', result);
    
    await addStep('thought', 'Reasoning', 'Auto-debit blocked. Calculating saved budget and generating final response.');
    
    await addStep('response', 'Agent Response', 
      "Mandate for **Streaming Premium** has been blocked. All future debit requests from this provider are restricted. " +
      "This will save you **INR 8,388** annually. Let me know if you want to address the Gym Membership as well."
    );
    return null;
  }

  // Scenario 2: Rent Payment (Settle Rent)
  if (query.includes('rent') || query.includes('settle rent') || query.includes('pay landlord')) {
    await addStep('goal', 'Goal Set', 'Initiate payment of INR 12,000 for rent.');
    
    await addStep('thought', 'Reasoning', 'Checking account balance to ensure sufficient funds.');
    await addStep('action', 'Call Tool', 'get_balance()');
    
    const bal = bankingTools.get_balance();
    await addStep('observation', 'Tool Result', bal);
    
    await addStep('thought', 'Reasoning', 'Balance is sufficient (INR 45,000 > INR 12,000). Consulting SBI Policy RAG database to check transfer limits.');
    await addStep('action', 'Call Tool', 'search_sbi_policy("fund transfer limits")');
    
    const policy = bankingTools.search_sbi_policy("fund transfer limits");
    await addStep('observation', 'Tool Result', policy);
    
    await addStep('thought', 'Reasoning', 'Policy L-204 limits direct transfer mandates to INR 20,000. Rent payment (INR 12,000) is within limits. However, since the amount exceeds the INR 10,000 threshold, a Human-in-the-Loop OTP verification is required. Verifying recipient beneficiary "Landlord" details.');
    await addStep('action', 'Call Tool', 'check_recipient("Landlord")');
    
    const recipient = bankingTools.check_recipient('Landlord');
    await addStep('observation', 'Tool Result', recipient);
    
    await addStep('thought', 'Reasoning', 'Recipient beneficiary verified. Opening transaction approval portal for OTP authorization.');
    
    // Request interactive approval from the user
    await addStep('prompt_approval', 'Authorization Required', {
      type: 'Transfer Funds',
      recipient: 'Landlord Rent Account',
      accountNumber: 'XXXXXX3210 (SBI)',
      amount: 12000
    });
    
    return {
      type: 'approval',
      data: { recipient: 'Landlord', amount: 12000 }
    };
  }

  // Scenario 2.5: Approve Rent Payment
  if (query.includes('__approve_transfer:landlord')) {
    await addStep('goal', 'Goal Set', 'Execute rent transfer of INR 12,000.');
    
    await addStep('thought', 'Reasoning', 'User OTP verification received. Calling execution API.');
    await addStep('action', 'Call Tool', 'execute_transfer("Landlord", 12000)');
    
    const result = bankingTools.execute_transfer('Landlord', 12000);
    await addStep('observation', 'Tool Result', result);
    
    await addStep('thought', 'Reasoning', 'Core transaction logged. Rent budget marked as paid. Notifying user.');
    
    await addStep('response', 'Agent Response', 
      "Transfer successful! **INR 12,000** has been transferred to **Landlord** (SBI Acc: XXXXXX3210). " +
      `Your updated balance is **INR ${mockState.balance.toLocaleString('en-IN')}**. I have logged this under your Rent budget category.`
    );
    return null;
  }

  // Scenario 3: Budget Analysis (Dining Out check)
  if (query.includes('budget') || query.includes('dining') || query.includes('limit') || query.includes('spending')) {
    await addStep('goal', 'Goal Set', 'Check monthly budgets.');
    
    await addStep('thought', 'Reasoning', 'Querying category spending thresholds.');
    await addStep('action', 'Call Tool', 'get_spending_analysis()');
    
    const analysis = bankingTools.get_spending_analysis();
    await addStep('observation', 'Tool Result', analysis);
    
    await addStep('thought', 'Reasoning', 'Dining budget is at 94.6% utilization (INR 14,200/15,000). Warning threshold exceeded. Suggesting proactive limit cap.');
    
    await addStep('response', 'Agent Response', 
      "⚠️ **Dining Budget Warning**: You have spent **INR 14,200** of your **INR 15,000** budget limit (94.6% spent).\n\n" +
      "Only **INR 800** remains. To prevent overdraft, I recommend setting a temporary block on dining card transactions. Shall I lock this budget limit?"
    );
    return {
      type: 'options',
      options: ['Lock Dining Budget', 'Remind Me Later']
    };
  }

  // Fallback for general queries
  await addStep('goal', 'Goal Set', 'Answer banking query.');
  await addStep('thought', 'Reasoning', 'Message does not match predefined triggers. Offering helper prompt.');
  await addStep('response', 'Agent Response', 
    "I am **SBI Dost**, your agentic banking advisor. Select one of the quick scenarios or switch tabs in the dashboard to see me audit subscriptions, check policy RAG limits, or execute rent transfers."
  );
  return null;
};

export const getMockBankingState = () => {
  return { ...mockState };
};
export const resetMockBankingState = () => {
  mockState = {
    balance: 45000,
    subscriptions: [
      { id: 'sub_1', name: 'Streaming Premium', cost: 699, unusedDays: 120, status: 'Active', category: 'Entertainment', frequency: 'Monthly' },
      { id: 'sub_2', name: 'Gym Membership', cost: 1500, unusedDays: 75, status: 'Active', category: 'Health', frequency: 'Monthly' },
      { id: 'sub_3', name: 'Cloud Storage Plus', cost: 199, unusedDays: 0, status: 'Active', category: 'Utilities', frequency: 'Monthly' }
    ],
    budgets: {
      diningOut: { spent: 14200, limit: 15000 },
      shopping: { spent: 5000, limit: 8000 },
      rent: { spent: 0, limit: 12000 }
    },
    transactions: [
      { id: 't_1', date: '2026-06-28', description: 'Restaurant Sizzlers', category: 'diningOut', amount: 1200, type: 'Debit' },
      { id: 't_2', date: '2026-06-25', description: 'Grocery Supermart', category: 'shopping', amount: 3500, type: 'Debit' },
      { id: 't_3', date: '2026-06-15', description: 'Gym Mandate auto-debit', category: 'subscriptions', amount: 1500, type: 'Debit' },
      { id: 't_4', date: '2026-06-05', description: 'Streaming Mandate auto-debit', category: 'subscriptions', amount: 699, type: 'Debit' },
      { id: 't_5', date: '2026-06-01', description: 'Salary Credit', category: 'income', amount: 65000, type: 'Credit' }
    ]
  };
};
