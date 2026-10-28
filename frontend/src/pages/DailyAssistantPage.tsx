import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, CheckSquare, ShieldAlert, Sparkles, User, Bot, HelpCircle } from 'lucide-react';
import { SiteAssistantResponse } from '../types';
import { sendAssistantMessage, fetchAssistantHistory } from '../services/api';

interface DailyAssistantPageProps {
  selectedProjectId: string;
}

interface MessageItem {
  role: 'user' | 'assistant';
  content: string;
  checklist?: string[];
  safety?: string[];
  followups?: string[];
}

export const DailyAssistantPage: React.FC<DailyAssistantPageProps> = ({ selectedProjectId }) => {
  const sessionId = 'daily-site-session-1';
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      role: 'assistant',
      content: 'Good day! I am your AI Daily Site Assistant. How can I assist with your site inspections, pre-pour checks, scaffolding safety, or subcontractor coordination today?',
      checklist: [
        'Review Good-For-Construction drawings for active casting bay',
        'Check personal protective equipment (PPE) compliance at site gate'
      ],
      safety: [
        'Confirm wind speeds before authorizing high crane lifts',
        'Verify edge protection on elevated floor slabs'
      ],
      followups: [
        'What should be checked before concrete pouring?',
        'What should be checked before scaffolding work?',
        'What are today’s top inspection priorities?'
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    'What should be checked before concrete pouring?',
    'What should be checked before scaffolding work?',
    'What are today’s top inspection priorities?',
    'What PPE is mandatory for steel bar-benders?',
    'What tests are needed for ready-mix concrete delivery?'
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSendMessage = async (msgText: string) => {
    if (!msgText.trim() || loading) return;

    const userMsg = msgText.trim();
    setInputMessage('');
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await sendAssistantMessage(sessionId, userMsg, selectedProjectId);
      if (res.success && res.data) {
        const d: SiteAssistantResponse = res.data;
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: d.reply,
            checklist: d.action_checklist,
            safety: d.safety_reminders,
            followups: d.suggested_followups
          }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: 'I encountered an issue connecting to the site intelligence service. Please retry.'
          }
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Network connection error. Please verify the backend service is running.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h1 className="page-title">Module 6: Daily Site Assistant</h1>
        <p className="page-subtitle">
          Voice of the site engineer: Context-aware conversational AI for pre-task briefings, inspections, and checklist enforcement.
        </p>
      </div>

      {/* Quick Prompts Bar */}
      <div style={{ marginBottom: 14, display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 6 }}>
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            className="btn btn-secondary btn-sm"
            style={{ whiteSpace: 'nowrap', fontSize: '0.775rem' }}
            onClick={() => handleSendMessage(q)}
            disabled={loading}
          >
            <Sparkles size={12} color="#2563eb" />
            {q}
          </button>
        ))}
      </div>

      {/* Main Chat Interface */}
      <div className="chat-window">
        <div className="chat-messages" ref={scrollRef}>
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`chat-bubble ${m.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, fontSize: '0.75rem', opacity: 0.8 }}>
                {m.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                <strong>{m.role === 'user' ? 'Site Engineer' : 'BuildVision Site Assistant'}</strong>
              </div>

              <div>{m.content}</div>

              {/* Action Checklist */}
              {m.checklist && m.checklist.length > 0 && (
                <div style={{ marginTop: 10, padding: 10, background: '#ffffff', borderRadius: 6, border: '1px solid #e2e8f0', color: '#0f172a' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: '0.8rem', color: '#1e40af', marginBottom: 4 }}>
                    <CheckSquare size={14} /> Action Checklist:
                  </div>
                  <ul style={{ paddingLeft: 18, fontSize: '0.825rem' }}>
                    {m.checklist.map((item, cIdx) => (
                      <li key={cIdx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Safety Reminders */}
              {m.safety && m.safety.length > 0 && (
                <div style={{ marginTop: 8, padding: 8, background: '#fffbeb', borderRadius: 6, border: '1px solid #fde68a', color: '#92400e', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, marginBottom: 2 }}>
                    <ShieldAlert size={14} color="#d97706" /> Safety Reminder:
                  </div>
                  <ul style={{ paddingLeft: 18 }}>
                    {m.safety.map((item, sIdx) => (
                      <li key={sIdx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suggested Followups */}
              {m.followups && m.followups.length > 0 && (
                <div style={{ marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {m.followups.map((f, fIdx) => (
                    <button
                      key={fIdx}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.725rem', padding: '3px 8px' }}
                      onClick={() => handleSendMessage(f)}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="chat-bubble chat-bubble-ai" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="spinner" style={{ width: 16, height: 16 }}></div>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Consulting site specifications...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          className="chat-input-bar"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputMessage);
          }}
        >
          <input
            type="text"
            className="form-input"
            style={{ flex: 1 }}
            placeholder="Ask about daily priorities, pre-pour checks, scaffolding, or material testing..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={loading}
          />
          <button type="submit" className="btn btn-primary" disabled={loading || !inputMessage.trim()}>
            <Send size={16} /> Send
          </button>
        </form>
      </div>
    </div>
  );
};

