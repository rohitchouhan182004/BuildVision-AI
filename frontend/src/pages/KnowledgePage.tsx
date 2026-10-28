import React, { useState } from 'react';
import { BookOpen, Search, Bookmark, ShieldAlert, CheckCircle2, FileText, ArrowRight, Lightbulb } from 'lucide-react';
import { KnowledgeResult } from '../types';
import { askKnowledge } from '../services/api';

export const KnowledgePage: React.FC = () => {
  const [query, setQuery] = useState('What is the minimum curing period for concrete slabs under IS 456?');
  const [category, setCategory] = useState('Concrete Technology & Quality');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<KnowledgeResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const categories = [
    'All Categories',
    'Concrete Technology & Quality',
    'Site Safety & Fall Protection',
    'Reinforcement & Structural Detailing',
    'Soil & Foundation Engineering',
    'MEP & Fire Protection'
  ];

  const presetQuestions = [
    'What is the minimum curing period for concrete slabs under IS 456?',
    'What are the OSHA requirements for scaffolding guardrails and toe-boards?',
    'What is the minimum concrete cover for foundation footings and RCC columns?',
    'How is concrete slump test performed and what is acceptable range for pumping?',
    'What are the mandatory inspection checks before striking formwork props?'
  ];

  const handleSearch = async (qText: string, catText: string = category) => {
    if (!qText.trim()) return;
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await askKnowledge(qText.trim(), catText);
      if (res.success && res.data) {
        setResult(res.data);
      } else {
        setErrorMsg(res.error?.message || 'Failed to retrieve knowledge entry.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error communicating with knowledge service.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 className="page-title">Module 8: Construction Engineering Knowledge Assistant</h1>
        <p className="page-subtitle">
          Authoritative technical repository for building codes (IS / ACI / OSHA), concrete technology, and execution standards.
        </p>
      </div>

      {/* Query Bar Card */}
      <div className="card">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(query);
          }}
        >
          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            <input
              type="text"
              className="form-input"
              style={{ flex: 1, fontSize: '0.95rem' }}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search standards, curing times, rebar cover, scaffolding safety, slump tests..."
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Search size={16} /> Consult AI Engineer
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Category:</span>
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                className={`btn btn-sm ${category === c ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </form>

        {/* Preset Question Pills */}
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid #f1f5f9' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: 8 }}>Common Technical Inquiries:</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {presetQuestions.map((pq, idx) => (
              <button
                key={idx}
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', textAlign: 'left' }}
                onClick={() => {
                  setQuery(pq);
                  handleSearch(pq);
                }}
              >
                <Lightbulb size={12} color="#d97706" />
                {pq}
              </button>
            ))}
          </div>
        </div>
      </div>

      {errorMsg && (
        <div style={{ padding: '12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, color: '#dc2626', fontSize: '0.85rem', marginBottom: 16 }}>
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
          <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Indexing engineering codes & standards...</div>
        </div>
      ) : result ? (
        <div>
          {/* Main Answer Card */}
          <div className="card" style={{ borderLeft: '4px solid #1e40af' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span className="badge badge-low">{result.category}</span>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Verified Civil Engineering Reference</span>
            </div>

            <h2 style={{ fontSize: '1.2rem', marginBottom: 12, color: '#0f172a' }}>{result.question}</h2>

            <div style={{ fontSize: '0.95rem', lineHeight: 1.6, color: '#1e293b', marginBottom: 16 }}>
              {result.answer}
            </div>

            {/* Key Points */}
            <div style={{ background: '#f8fafc', padding: 14, borderRadius: 6, border: '1px solid #e2e8f0', marginBottom: 16 }}>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1e40af', marginBottom: 8 }}>
                Essential Engineering Principles:
              </div>
              <ul style={{ paddingLeft: 20, fontSize: '0.875rem', lineHeight: 1.6 }}>
                {result.key_points.map((pt, i) => (
                  <li key={i} style={{ marginBottom: 4 }}>{pt}</li>
                ))}
              </ul>
            </div>

            {/* Recommended Field Practice */}
            <div style={{ background: '#f0fdf4', padding: 14, borderRadius: 6, border: '1px solid #bbf7d0', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: '0.85rem', color: '#15803d', marginBottom: 6 }}>
                <CheckCircle2 size={16} /> Recommended Field Practice:
              </div>
              <p style={{ fontSize: '0.875rem', color: '#14532d', lineHeight: 1.5 }}>
                {result.recommended_practice}
              </p>
            </div>

            {/* Safety Warning */}
            <div style={{ background: '#fffbeb', padding: 14, borderRadius: 6, border: '1px solid #fde68a', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: '0.85rem', color: '#b45309', marginBottom: 6 }}>
                <ShieldAlert size={16} /> Crucial Site Safety Precaution:
              </div>
              <p style={{ fontSize: '0.875rem', color: '#78350f', lineHeight: 1.5 }}>
                {result.safety_note}
              </p>
            </div>

            {/* Standards & Code Citations */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Cited Standards:</span>
              {result.standard_references.map((std, i) => (
                <span key={i} style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: 4, background: '#e0e7ff', color: '#3730a3', fontWeight: 500 }}>
                  {std}
                </span>
              ))}
            </div>

            {/* Disclaimer */}
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic', borderTop: '1px solid #f1f5f9', paddingTop: 8 }}>
              {result.disclaimer}
            </div>
          </div>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
          <BookOpen size={48} color="#cbd5e1" style={{ margin: '0 auto 16px' }} />
          <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#334155' }}>
            Knowledge Base Ready
          </div>
          <p style={{ fontSize: '0.85rem', marginTop: 6, maxWidth: 380, margin: '8px auto 0' }}>
            Click one of the suggested technical questions above or enter your own query on concrete, rebar cover, scaffolding, or standards.
          </p>
        </div>
      )}
    </div>
  );
};

