import React, { useState, useEffect, useRef } from 'react';
import { 
  Wallet, 
  CreditCard, 
  AlertTriangle, 
  CheckCircle2, 
  Send, 
  Terminal, 
  ShieldCheck, 
  RefreshCw,
  Clock,
  Check,
  X,
  TrendingUp,
  LayoutDashboard,
  MessageSquare,
  FileText,
  PieChart,
  HelpCircle,
  Bell
} from 'lucide-react';
import { runAgentWorkflow, getMockBankingState, resetMockBankingState } from './mockAgent';

function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState('overview'); // overview, assistant, mandates, budget
  
  // Banking State
  const [bankingState, setBankingState] = useState(getMockBankingState());
  
  // Chat & Agent States
  const [messages, setMessages] = useState([
    {
      sender: 'agent',
      text: "Hello! I am **SBI Dost**, your autonomous financial advisor. I monitor your active mandates, policy limits, and category budgets. Ask me anything or switch tabs to explore your account."
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [agentGoal, setAgentGoal] = useState('Idle');
  const [reasoningLogs, setReasoningLogs] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [activeApproval, setActiveApproval] = useState(null);
  const [optionsToRender, setOptionsToRender] = useState(null);

  // Toast System
  const [toasts, setToasts] = useState([]);

  const messagesEndRef = useRef(null);
  const logsEndRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [reasoningLogs]);

  // Toast trigger helper
  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Sync internal UI state with bank engine state
  const syncState = () => {
    setBankingState(getMockBankingState());
  };

  // Triggers the agent loop
  const handleSendMessage = async (textToSend, bypassUserBubble = false) => {
    if (!textToSend.trim() || isThinking) return;

    if (!bypassUserBubble) {
      setMessages(prev => [...prev, { sender: 'user', text: textToSend }]);
    }
    
    setInputMessage('');
    setIsThinking(true);
    setOptionsToRender(null);
    setActiveApproval(null);

    // Switch to Assistant tab automatically so user sees the console logs executing
    setActiveTab('assistant');

    try {
      const result = await runAgentWorkflow(textToSend, (step) => {
        if (step.type === 'goal') {
          setAgentGoal(step.detail);
        } else if (step.type === 'prompt_approval') {
          setActiveApproval(step.detail);
          addToast("Transaction security authorization required!", "warning");
        }
        setReasoningLogs(prev => [...prev, step]);
      });

      if (result) {
        if (result.type === 'options') {
          setOptionsToRender(result.options);
        }
      }

      // Format response text manually to sync with agent's output
      let responseText = "Task completed successfully.";
      if (textToSend.toLowerCase().includes('subscription') || textToSend.toLowerCase().includes('leakage')) {
        responseText = "I have audited your active recurring mandates. Under RBI guidelines (Policy S-812), I can block these immediately for you:\n\n1. **Streaming Premium** (INR 699/month) — Unused for **120 days**.\n2. **Gym Membership** (INR 1,500/month) — Unused for **75 days**.\n\nWould you like me to block the SBI auto-debit mandate for Streaming Premium?";
      } else if (textToSend.toLowerCase().includes('cancel streaming')) {
        responseText = "Mandate for **Streaming Premium** has been blocked. All future debit requests from this provider are restricted. This will save you **INR 8,388** annually.";
        addToast("Mandate for Streaming Premium successfully blocked", "success");
      } else if (textToSend.toLowerCase().includes('rent') || textToSend.toLowerCase().includes('pay landlord')) {
        responseText = "Rent payment workflow initiated. Please review transfer details and authorize.";
      } else if (textToSend.toLowerCase().includes('budget') || textToSend.toLowerCase().includes('dining')) {
        responseText = "⚠️ **Dining Budget Warning**: You have spent **INR 14,200** of your **INR 15,000** budget limit (94.6% spent).\n\nOnly **INR 800** remains. To prevent overdraft, I recommend setting a temporary block on dining card transactions.";
      } else {
        responseText = "I am **SBI Dost**, your agentic banking advisor. Select one of the quick scenarios or switch tabs in the dashboard to see me audit subscriptions, check policy RAG limits, or execute rent transfers.";
      }

      if (!(textToSend.toLowerCase().includes('rent') || textToSend.toLowerCase().includes('pay landlord'))) {
        setMessages(prev => [...prev, { sender: 'agent', text: responseText }]);
      } else {
        setMessages(prev => [...prev, { sender: 'agent', text: "I have initialized the rent transfer process. Please verify recipient beneficiary details and authorize this payment in the **Agent Intelligence Control Room**." }]);
      }

    } catch (e) {
      console.error(e);
      addToast("Error during agent reasoning cycle", "danger");
    } finally {
      setIsThinking(false);
      syncState();
    }
  };

  // Handles OTP / security approvals
  const handleApproveAction = async () => {
    if (!activeApproval) return;

    setActiveApproval(null);
    setIsThinking(true);
    addToast("Authorizing fund transfer with SBI Secure OTP...", "info");

    try {
      await runAgentWorkflow('__approve_transfer:landlord', (step) => {
        if (step.type === 'goal') setAgentGoal(step.detail);
        setReasoningLogs(prev => [...prev, step]);
      });

      syncState();
      addToast("Rent payment sent successfully!", "success");
      setMessages(prev => [...prev, { 
        sender: 'agent', 
        text: `Transfer successful! **INR 12,000** has been transferred to **Landlord** (SBI Acc: XXXXXX3210). Your updated balance is **INR ${getMockBankingState().balance.toLocaleString('en-IN')}**.`
      }]);
    } catch (e) {
      console.error(e);
      addToast("Failed to complete transfer", "danger");
    } finally {
      setIsThinking(false);
    }
  };

  // Resets sandbox state
  const handleResetSandbox = () => {
    resetMockBankingState();
    syncState();
    setMessages([
      {
        sender: 'agent',
        text: "Sandbox banking state reset. Hello! I am **SBI Dost**, your autonomous financial advisor. How can I help you today?"
      }
    ]);
    setReasoningLogs([]);
    setAgentGoal('Idle');
    setActiveApproval(null);
    setOptionsToRender(null);
    addToast("Sandbox databases refreshed", "info");
  };

  // Text formatter helper for bold tags
  const renderFormattedText = (text) => {
    if (!text) return '';
    return text.split('\n').map((line, idx) => {
      let elements = [];
      let tempText = line;
      let isBullet = false;

      if (tempText.startsWith('1. ') || tempText.startsWith('2. ')) {
        isBullet = true;
        tempText = tempText.substring(3);
      } else if (tempText.startsWith('- ') || tempText.startsWith('👉 ')) {
        isBullet = true;
        tempText = tempText.substring(2);
      }

      const boldRegex = /\*\*(.*?)\*\*/g;
      let match;
      let lastIndex = 0;
      while ((match = boldRegex.exec(tempText)) !== null) {
        if (match.index > lastIndex) {
          elements.push(tempText.substring(lastIndex, match.index));
        }
        elements.push(<strong key={match.index} style={{ color: 'var(--primary-sbi)' }}>{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }
      if (lastIndex < tempText.length) {
        elements.push(tempText.substring(lastIndex));
      }

      if (isBullet) {
        return <li key={idx} style={{ marginLeft: '20px', marginBottom: '4px', listStyleType: 'square' }}>{elements}</li>;
      }
      return <p key={idx} style={{ marginBottom: '6px', lineHeight: '1.4' }}>{elements}</p>;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '24px', backgroundColor: 'var(--bg-main)' }}>
      
      {/* Toast Notification Container */}
      <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {toasts.map(t => (
          <div key={t.id} className="animate-scale-up" style={{ 
            background: t.type === 'success' ? '#e2f8f0' : t.type === 'warning' ? '#fef3c7' : t.type === 'danger' ? '#ffe4e6' : '#ffffff',
            border: `1px solid ${t.type === 'success' ? '#0f766e' : t.type === 'warning' ? '#b45309' : t.type === 'danger' ? '#9f1239' : 'var(--border-light)'}`,
            color: t.type === 'success' ? '#0f766e' : t.type === 'warning' ? '#b45309' : t.type === 'danger' ? '#9f1239' : 'var(--text-primary)',
            padding: '12px 20px', 
            borderRadius: '8px', 
            boxShadow: 'var(--shadow-hover)', 
            fontSize: '0.85rem', 
            fontWeight: '600',
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px'
          }}>
            {t.type === 'success' && <CheckCircle2 size={16} />}
            {t.type === 'warning' && <AlertTriangle size={16} />}
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* Header Panel (Dark Mode Contrast) */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '12px 28px', 
        marginBottom: '20px',
        backgroundColor: 'var(--bg-dark-header)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: 'var(--shadow-premium)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: 'var(--primary-sbi)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '1.4rem', color: '#fff' }}>🤖</span>
          </div>
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: '700', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff' }}>
              SBI DOST <span className="badge badge-sbi" style={{ fontSize: '0.65rem' }}>Agentic Financial Core</span>
            </h1>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)' }}>SBI Hackathon @ GFF 2026 Submission Portal Prototype</p>
          </div>
        </div>

        {/* Tab Selection */}
        <nav style={{ display: 'flex' }}>
          <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><LayoutDashboard size={16} /> Overview</span>
          </button>
          <button className={`tab-btn ${activeTab === 'assistant' ? 'active' : ''}`} onClick={() => setActiveTab('assistant')}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MessageSquare size={16} /> AI Dost Assistant</span>
          </button>
          <button className={`tab-btn ${activeTab === 'mandates' ? 'active' : ''}`} onClick={() => setActiveTab('mandates')}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FileText size={16} /> Mandate Auditor</span>
          </button>
          <button className={`tab-btn ${activeTab === 'budget' ? 'active' : ''}`} onClick={() => setActiveTab('budget')}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><PieChart size={16} /> Budgets & Goals</span>
          </button>
        </nav>

        {/* Sandbox controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.2)' }} onClick={handleResetSandbox}>
            <RefreshCw size={12} /> Reset Sandbox
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success)', display: 'inline-block' }}></span>
            <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.8)', fontWeight: '600', fontFamily: 'var(--font-mono)' }}>Node: Active</span>
          </div>
        </div>
      </header>

      {/* Main Tab Views */}
      <main style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflowY: 'auto' }}>
            
            {/* Top Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              
              {/* Card 1 */}
              <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyBetween: 'space-between', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase' }}>SBI Account Balance</p>
                  <p style={{ fontSize: '1.8rem', fontWeight: '700', marginTop: '6px', color: 'var(--text-primary)' }}>
                    INR {bankingState.balance.toLocaleString('en-IN')}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '4px', fontWeight: '600' }}>✓ Core deposits verified</p>
                </div>
                <div style={{ width: '54px', height: '54px', borderRadius: '12px', background: 'var(--primary-sbi-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Wallet size={24} style={{ color: 'var(--primary-sbi)' }} />
                </div>
              </div>

              {/* Card 2 */}
              <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyBetween: 'space-between', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase' }}>Active Mandates (Auto-Debits)</p>
                  <p style={{ fontSize: '1.8rem', fontWeight: '700', marginTop: '6px', color: 'var(--text-primary)' }}>
                    {bankingState.subscriptions.filter(s => s.status === 'Active').length} Active
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Blocked: {bankingState.subscriptions.filter(s => s.status === 'Cancelled').length} Mandates
                  </p>
                </div>
                <div style={{ width: '54px', height: '54px', borderRadius: '12px', background: 'rgba(249, 58, 86, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CreditCard size={24} style={{ color: 'var(--danger)' }} />
                </div>
              </div>

              {/* Card 3 */}
              <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyBetween: 'space-between', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase' }}>Dining Budget Alert</p>
                    <span className="badge badge-danger">High Risk</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'var(--border-light)', borderRadius: '3px', margin: '8px 0', overflow: 'hidden' }}>
                    <div style={{ width: '94.6%', height: '100%', backgroundColor: 'var(--danger)', borderRadius: '3px' }}></div>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    INR {bankingState.budgets.diningOut.spent.toLocaleString('en-IN')} Spent / INR {bankingState.budgets.diningOut.limit.toLocaleString('en-IN')} Limit
                  </p>
                </div>
                <div style={{ width: '54px', height: '54px', borderRadius: '12px', background: 'rgba(249, 115, 22, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AlertTriangle size={24} style={{ color: 'orange' }} />
                </div>
              </div>

            </div>

            {/* Split dashboard area */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px', flex: 1 }}>
              
              {/* Left Column: Recent Activity Logs */}
              <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '16px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Recent Transactions Log
                </h3>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  <table className="corporate-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Type</th>
                        <th style={{ textAlign: 'right' }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bankingState.transactions.map((t, idx) => (
                        <tr key={t.id || idx}>
                          <td>{t.date}</td>
                          <td style={{ fontWeight: '500' }}>{t.description}</td>
                          <td>
                            <span className="badge badge-sbi" style={{ textTransform: 'capitalize' }}>
                              {t.category}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${t.type === 'Credit' ? 'badge-success' : 'badge-danger'}`}>
                              {t.type || 'Debit'}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right', fontWeight: '700', color: t.type === 'Credit' ? 'var(--success)' : 'var(--text-primary)' }}>
                            {t.type === 'Credit' ? '+' : '-'} INR {t.amount.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Column: Proactive AI Dost Insights */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* AI Insights Card */}
                <div className="glass-panel" style={{ padding: '24px', background: 'var(--bg-panel)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-sbi)', marginBottom: '12px' }}>
                    <Bell size={18} />
                    <h3 style={{ fontSize: '0.95rem', fontWeight: '700' }}>Proactive Agent Auditor</h3>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ background: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                      <p style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        ⚠️ Mandate Leakage Alert
                      </p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        **Streaming Premium** has **zero usage for 120 days**. Recommend blocking mandate.
                      </p>
                      <button className="btn-primary" style={{ fontSize: '0.75rem', padding: '6px 12px', marginTop: '10px', width: '100%' }} onClick={() => handleSendMessage("Audit my subscriptions", true)}>
                        Run Auditor Agent
                      </button>
                    </div>

                    <div style={{ background: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                      <p style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary-sbi)' }}>
                        💡 Idle Balance Opportunity
                      </p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Your balance is INR 45,000. Under SBI guidelines, moving INR 20,000 to a flexi fixed deposit increases interest yield from 3.0% to 6.2%.
                      </p>
                      <button className="btn-secondary" style={{ fontSize: '0.75rem', padding: '6px 12px', marginTop: '10px', width: '100%' }} onClick={() => handleSendMessage("Settle rent", true)}>
                        Verify RAG Transfer Policies
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card Controls Widget */}
                <div className="glass-panel" style={{ padding: '20px' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '12px', color: 'var(--text-secondary)' }}>Security settings</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '6px', borderBottom: '1px solid var(--border-light)' }}>
                      <span>Human-in-the-Loop OTP Guard</span>
                      <span className="badge badge-success">Enabled</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '6px', borderBottom: '1px solid var(--border-light)' }}>
                      <span>Policy Limits Enforcement</span>
                      <span className="badge badge-success">Strict</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Agentic Mandate Control</span>
                      <span className="badge badge-sbi">Active</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* TAB 2: AI ASSISTANT */}
        {activeTab === 'assistant' && (
          <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1.10fr 0.90fr', gap: '20px', flex: 1, minHeight: 0 }}>
            
            {/* Left Side: Agent Chat Interaction */}
            <section className="glass-panel" style={{ display: 'flex', flexDirection: 'column', padding: '20px', minHeight: 0 }}>
              <h2 style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '14px', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px', color: 'var(--text-secondary)' }}>
                Conversational Interface
              </h2>

              {/* Messages Window */}
              <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {messages.map((msg, index) => (
                  <div 
                    key={index} 
                    className="animate-fade-in"
                    style={{ 
                      alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '80%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div style={{ 
                      background: msg.sender === 'user' 
                        ? 'var(--primary-sbi)' 
                        : 'var(--bg-panel)',
                      border: msg.sender === 'user' ? '1px solid var(--primary-sbi)' : '1px solid var(--border-light)',
                      padding: '12px 16px',
                      borderRadius: msg.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                      color: msg.sender === 'user' ? '#ffffff' : 'var(--text-primary)',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                    }}>
                      {renderFormattedText(msg.text)}
                    </div>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px', padding: '0 4px' }}>
                      {msg.sender === 'user' ? 'You' : 'SBI Dost'}
                    </span>
                  </div>
                ))}
                
                {isThinking && (
                  <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-panel)', padding: '12px 16px', borderRadius: '14px', border: '1px solid var(--border-light)' }}>
                    <RefreshCw size={14} style={{ color: 'var(--primary-sbi)', animation: 'borderPulse 1s infinite linear' }} />
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>Agent reasoning...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Option Buttons */}
              {optionsToRender && (
                <div className="animate-fade-in" style={{ display: 'flex', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
                  {optionsToRender.map((opt, i) => (
                    <button 
                      key={i} 
                      className="btn-secondary" 
                      style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: '8px' }}
                      onClick={() => handleSendMessage(opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {/* Preset Buttons Area */}
              <div style={{ marginBottom: '14px' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Simulated Hackathon Flows
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button 
                    className="btn-secondary" 
                    style={{ fontSize: '0.8rem', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '8px' }}
                    onClick={() => handleSendMessage("Audit my subscriptions")}
                  >
                    🔍 Leakage Audit (Policy S-812)
                  </button>
                  <button 
                    className="btn-secondary" 
                    style={{ fontSize: '0.8rem', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '8px' }}
                    onClick={() => handleSendMessage("Settle landlord rent")}
                  >
                    💸 Settle Rent (Policy L-204 limits)
                  </button>
                  <button 
                    className="btn-secondary" 
                    style={{ fontSize: '0.8rem', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '8px' }}
                    onClick={() => handleSendMessage("Check my spending budget limit")}
                  >
                    📈 Spend Warning (Budgets tool)
                  </button>
                </div>
              </div>

              {/* Message Input */}
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputMessage); }}
                style={{ display: 'flex', gap: '10px' }}
              >
                <input 
                  type="text" 
                  placeholder="Ask SBI Dost a banking question..." 
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  disabled={isThinking}
                  style={{ 
                    flex: 1, 
                    background: 'var(--bg-main)', 
                    border: '1px solid var(--border-light)', 
                    borderRadius: '8px', 
                    padding: '12px 16px', 
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-display)',
                    outline: 'none',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary-sbi)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
                />
                <button 
                  type="submit" 
                  className="btn-primary" 
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50px', padding: 0 }}
                  disabled={isThinking}
                >
                  <Send size={18} />
                </button>
              </form>
            </section>

            {/* Right Side: Agent Control Room (Console) */}
            <section className="glass-panel" style={{ display: 'flex', flexDirection: 'column', padding: '20px', minHeight: 0, borderLeft: '1px solid var(--border-light)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
                <h2 style={{ fontSize: '1.05rem', fontWeight: '600', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Terminal size={18} style={{ color: 'var(--primary-sbi)' }} />
                  Agent Control Room (ReAct Engine)
                </h2>
                <button 
                  className="btn-secondary" 
                  style={{ padding: '4px 8px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px', borderRadius: '4px' }}
                  onClick={() => {
                    setReasoningLogs([]);
                    setAgentGoal('Idle');
                    setActiveApproval(null);
                  }}
                >
                  Clear Console
                </button>
              </div>

              {/* Goal Display */}
              <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-light)', padding: '12px 16px', borderRadius: '8px', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>Active Goal</p>
                  <p style={{ fontSize: '0.85rem', fontWeight: '600', marginTop: '2px', color: 'var(--text-primary)' }}>{agentGoal}</p>
                </div>
                <span className="badge badge-sbi">
                  {agentGoal === 'Idle' ? 'Standby' : 'Processing'}
                </span>
              </div>

              {/* Reasoning Steps Terminal (Dark Mode Contrast) */}
              <div style={{ flex: 1, background: 'var(--bg-dark-console)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', padding: '16px', overflowY: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '14px', minHeight: 0 }}>
                {reasoningLogs.length === 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--console-text-secondary)', gap: '8px' }}>
                    <Clock size={20} />
                    <span>Await agent trigger. Click a scenario to witness reasoning logs.</span>
                  </div>
                ) : (
                  reasoningLogs.map((log, index) => {
                    let color = 'var(--console-text)';
                    let tagBg = 'rgba(255, 255, 255, 0.04)';
                    let tagColor = 'var(--console-text-secondary)';

                    if (log.type === 'thought') {
                      color = 'var(--agent-thought)';
                      tagBg = 'var(--agent-thought-glow)';
                      tagColor = 'var(--agent-thought)';
                    } else if (log.type === 'action') {
                      color = 'var(--agent-action)';
                      tagBg = 'var(--agent-action-glow)';
                      tagColor = 'var(--agent-action)';
                    } else if (log.type === 'observation') {
                      color = 'var(--agent-observation)';
                      tagBg = 'rgba(255, 255, 255, 0.04)';
                      tagColor = 'var(--agent-observation)';
                    } else if (log.type === 'prompt_approval') {
                      color = 'var(--danger)';
                      tagBg = 'rgba(249, 58, 86, 0.15)';
                      tagColor = 'var(--danger)';
                    } else if (log.type === 'response') {
                      color = 'var(--success)';
                      tagBg = 'rgba(10, 207, 131, 0.15)';
                      tagColor = 'var(--success)';
                    }

                    return (
                      <div key={index} className="animate-fade-in" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.7rem', color: 'var(--console-text-secondary)' }}>
                          <span style={{ background: tagBg, color: tagColor, padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                            {log.type.toUpperCase()}
                          </span>
                          <span>{log.timestamp}</span>
                        </div>
                        <div style={{ color: log.type === 'observation' ? 'var(--console-text)' : color, wordBreak: 'break-all', whiteSpace: 'pre-wrap', paddingLeft: '4px', marginTop: '4px', lineHeight: '1.4' }}>
                          {log.type === 'action' && <span style={{ color: 'var(--console-text-secondary)', fontWeight: '600' }}>[API CALL] </span>}
                          {log.type === 'prompt_approval' ? "Required OTP / authorization prompt dispatched to user console." : log.detail.toString()}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={logsEndRef} />
              </div>

              {/* Human-in-the-Loop Dialog Container */}
              {activeApproval && (
                <div className="animate-scale-up" style={{ background: 'var(--danger-bg)', border: '1px solid rgba(249, 58, 86, 0.3)', padding: '16px', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--danger)', marginBottom: '8px' }}>
                    <ShieldCheck size={18} />
                    <h3 style={{ fontSize: '0.9rem', fontWeight: '700' }}>Human-in-the-Loop OTP Approval</h3>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    A transaction of INR 12,000 exceeds policy threshold L-204 (INR 10,000). Please authorize:
                  </p>
                  
                  {/* Transaction Details */}
                  <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-light)', marginBottom: '14px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '4px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Recipient:</span>
                      <span style={{ fontWeight: 'bold' }}>{activeApproval.recipient}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>Account:</span>
                      <span>{activeApproval.accountNumber}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>Amount:</span>
                      <span style={{ color: 'var(--danger)', fontWeight: 'bold' }}>INR {activeApproval.amount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      className="btn-primary" 
                      style={{ 
                        flex: 1, 
                        background: 'var(--success)', 
                        borderColor: 'var(--success)',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: '6px',
                        padding: '8px 16px',
                        fontSize: '0.85rem'
                      }}
                      onClick={handleApproveAction}
                    >
                      <Check size={16} /> Authorize & Transfer
                    </button>
                    <button 
                      className="btn-secondary" 
                      style={{ 
                        flex: 0.5, 
                        borderColor: 'rgba(249, 58, 86, 0.4)',
                        color: 'var(--danger)',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: '6px',
                        padding: '8px 16px',
                        fontSize: '0.85rem'
                      }}
                      onClick={() => {
                        setActiveApproval(null);
                        setMessages(prev => [...prev, { sender: 'agent', text: "Transaction canceled. Debit mandate was aborted." }]);
                        setReasoningLogs(prev => [...prev, {
                          type: 'observation',
                          label: 'Failed Authorization',
                          detail: 'User declined OTP validation. Transaction aborted.',
                          timestamp: new Date().toLocaleTimeString()
                        }]);
                        setIsThinking(false);
                        addToast("Transaction cancelled by user", "danger");
                      }}
                    >
                      <X size={16} /> Cancel
                    </button>
                  </div>
                </div>
              )}

            </section>
          </div>
        )}

        {/* TAB 3: MANDATES & SUBSCRIPTIONS */}
        {activeTab === 'mandates' && (
          <div className="glass-panel animate-fade-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '14px' }}>
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)' }}>Recurring Mandates Auditor</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Autonomously reviews active mandates to detect financial leakage.</p>
              </div>
              <button className="btn-primary" onClick={() => handleSendMessage("Find my leakage subscriptions", true)}>
                Run Audit Workflow
              </button>
            </div>

            <table className="corporate-table">
              <thead>
                <tr>
                  <th>Mandate Provider</th>
                  <th>Cost / Period</th>
                  <th>Frequency</th>
                  <th>Days Idle (Zero Usage)</th>
                  <th>Leakage Risk</th>
                  <th>Mandate Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bankingState.subscriptions.map((s, idx) => (
                  <tr key={s.id || idx}>
                    <td style={{ fontWeight: '600' }}>{s.name}</td>
                    <td>INR {s.cost.toLocaleString('en-IN')}</td>
                    <td>{s.frequency || 'Monthly'}</td>
                    <td style={{ fontWeight: '500', color: s.unusedDays > 60 ? 'var(--danger)' : 'var(--text-primary)' }}>
                      {s.unusedDays} Days
                    </td>
                    <td>
                      {s.status === 'Cancelled' ? (
                        <span className="badge badge-success">None (Blocked)</span>
                      ) : s.unusedDays >= 90 ? (
                        <span className="badge badge-danger">Critical Leakage</span>
                      ) : s.unusedDays >= 60 ? (
                        <span className="badge" style={{ backgroundColor: '#fef3c7', color: '#d97706', border: '1px solid #f59e0b' }}>Moderate Risk</span>
                      ) : (
                        <span className="badge badge-success">Efficient</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${s.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {s.status === 'Active' ? (
                        <button 
                          className="btn-secondary" 
                          style={{ padding: '6px 12px', fontSize: '0.75rem', borderColor: 'var(--danger)', color: 'var(--danger)' }}
                          onClick={() => handleSendMessage(`Cancel subscription ${s.name}`, true)}
                        >
                          Block Mandate
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No action required</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 4: BUDGETS & ANALYTICS */}
        {activeTab === 'budget' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflowY: 'auto' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' }}>
              
              {/* Category Budgets */}
              <div className="glass-panel" style={{ padding: '24px' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
                  Monthly Budget Status
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  {/* Category: Dining Out */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>🍔 Dining Out Spending</span>
                      <span style={{ color: 'var(--danger)' }}>INR 14,200 / INR 15,000 (94.6%)</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'var(--bg-panel)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '94.6%', height: '100%', backgroundColor: 'var(--danger)', borderRadius: '4px' }}></div>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Critical limit warning active. Recommend freezing credit card transactions.</p>
                  </div>

                  {/* Category: Shopping */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px' }}>
                      <span>🛍️ Shopping & Apparel</span>
                      <span style={{ color: 'var(--primary-sbi)' }}>INR 5,000 / INR 8,000 (62.5%)</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'var(--bg-panel)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '62.5%', height: '100%', backgroundColor: 'var(--primary-sbi)', borderRadius: '4px' }}></div>
                    </div>
                  </div>

                  {/* Category: Housing/Rent */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px' }}>
                      <span>🏠 Housing & Rent Mandate</span>
                      <span>INR {bankingState.budgets.rent.spent.toLocaleString('en-IN')} / INR 12,000</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'var(--bg-panel)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ 
                        width: `${(bankingState.budgets.rent.spent / 12000) * 100}%`, 
                        height: '100%', 
                        backgroundColor: 'var(--success)', 
                        borderRadius: '4px',
                        transition: 'width 0.3s ease'
                      }}></div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Right Column: Goal Planner & Wealth Recommendations */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Savings Target widget */}
                <div className="glass-panel" style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '14px', color: 'var(--text-secondary)' }}>Savings Goal Planner</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '500' }}>
                      <span>Goal: Goa Trip (Dec 2026)</span>
                      <span style={{ fontWeight: '700' }}>INR 28,000 / INR 50,000</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'var(--border-light)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: '56%', height: '100%', backgroundColor: 'var(--primary-sbi)', borderRadius: '3px' }}></div>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Dost agent is routing micro-transaction round-ups automatically into your SBI Gold savings account.
                    </p>
                  </div>
                </div>

                {/* Wealth and FD recommender */}
                <div className="glass-panel" style={{ padding: '24px', background: 'var(--bg-panel)', border: '1px dashed var(--border-hover)' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--primary-sbi)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <TrendingUp size={16} /> SBI Agentic Yield Optimizer
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    Based on your average balance of **INR 45,000**, our optimization engine recommends:
                  </p>
                  <ul style={{ fontSize: '0.8rem', margin: '10px 0', paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <li>Convert **INR 20,000** into a flexi Fixed Deposit (yield **6.25%** instead of 3.0%).</li>
                    <li>Setup a monthly SIP of **INR 2,500** in SBI Mutual Fund.</li>
                  </ul>
                  <button className="btn-primary" style={{ width: '100%', fontSize: '0.75rem', padding: '6px 12px', marginTop: '6px' }} onClick={() => handleSendMessage("Settle rent", true)}>
                    Consult AI Agent
                  </button>
                </div>

              </div>

            </div>

          </div>
        )}

      </main>

      {/* Footer bar */}
      <footer className="glass-panel" style={{ marginTop: '20px', padding: '10px 24px', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
        <p>© 2026 SBI Dost. All Rights Reserved. Built for SBI Hackathon @ GFF 2026.</p>
        <p style={{ display: 'flex', gap: '16px', fontWeight: '500' }}>
          <span>Pillar: Digital Engagement</span>
          <span>•</span>
          <span>Theme: Agentic AI & Emerging Tech</span>
        </p>
      </footer>

    </div>
  );
}

export default App;
