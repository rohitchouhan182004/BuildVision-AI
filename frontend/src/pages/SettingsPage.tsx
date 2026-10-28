import React, { useState } from 'react';
import { Settings, Cpu, Key, Database, CheckCircle2, AlertTriangle, RefreshCw, Plus, Building2 } from 'lucide-react';
import { fetchSystemStatus, createProject } from '../services/api';

interface SettingsPageProps {
  isDemoMode: boolean;
  modelName: string;
  onRefreshStatus: () => void;
  onProjectAdded: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  isDemoMode,
  modelName,
  onRefreshStatus,
  onProjectAdded
}) => {
  const [newProject, setNewProject] = useState({
    name: '',
    project_type: 'Residential Tower',
    location: '',
    budget: '₹5.0 Cr',
    worker_count: 35
  });
  const [adding, setAdding] = useState(false);
  const [projMsg, setProjMsg] = useState<string | null>(null);

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name.trim() || !newProject.location.trim()) return;

    try {
      setAdding(true);
      setProjMsg(null);
      const res = await createProject(newProject);
      if (res.success) {
        setProjMsg(`Project '${newProject.name}' added successfully!`);
        setNewProject({ name: '', project_type: 'Residential Tower', location: '', budget: '₹5.0 Cr', worker_count: 35 });
        onProjectAdded();
      }
    } catch (err: any) {
      setProjMsg('Failed to add project.');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 className="page-title">Platform Configuration & System Settings</h1>
        <p className="page-subtitle">
          AI model settings, environment variables, live vs demo mode status, and project registry.
        </p>
      </div>

      <div className="grid-2">
        {/* System Diagnostics Card */}
        <div className="card">
          <div className="card-title">
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Cpu size={20} color="#1e40af" />
              AI Inference Status
            </span>
            <button className="btn btn-secondary btn-sm" onClick={onRefreshStatus}>
              <RefreshCw size={13} /> Check Health
            </button>
          </div>

          <div style={{ padding: '16px', borderRadius: 8, background: isDemoMode ? '#fffbeb' : '#f0fdf4', border: isDemoMode ? '1px solid #fde68a' : '1px solid #bbf7d0', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '0.95rem', color: isDemoMode ? '#b45309' : '#15803d', marginBottom: 4 }}>
              {isDemoMode ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
              Current Mode: {isDemoMode ? 'Demo / Realistic Mock Mode' : 'Live Google Gemini AI Mode'}
            </div>
            <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
              {isDemoMode
                ? 'The platform is operating with zero-configuration realistic construction models. All 9 modules are fully functional without needing an external API key.'
                : `Connected to Google Gemini Live API utilizing model '${modelName}'. Multimodal vision reasoning is enabled.`}
            </p>
          </div>

          <div style={{ fontSize: '0.875rem', lineHeight: 1.8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', padding: '6px 0' }}>
              <span style={{ color: '#64748b' }}>Active Gemini Model:</span>
              <span style={{ fontWeight: 600 }}>{modelName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', padding: '6px 0' }}>
              <span style={{ color: '#64748b' }}>Backend Framework:</span>
              <span style={{ fontWeight: 600 }}>FastAPI + Pydantic v2</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', padding: '6px 0' }}>
              <span style={{ color: '#64748b' }}>Local Database:</span>
              <span style={{ fontWeight: 600 }}>SQLite (Thread-safe persistence)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
              <span style={{ color: '#64748b' }}>Image Upload Limits:</span>
              <span style={{ fontWeight: 600 }}>25 MB per inspection image</span>
            </div>
          </div>
        </div>

        {/* Environment Variables Guide */}
        <div className="card">
          <div className="card-title">
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Key size={20} color="#d97706" />
              API Key & Deployment Setup
            </span>
          </div>

          <p style={{ fontSize: '0.85rem', color: '#334155', marginBottom: 12, lineHeight: 1.5 }}>
            To enable live multimodal reasoning with your own Google Cloud / Gemini credentials, set the following environment variables in <code>backend/.env</code>:
          </p>

          <pre style={{ background: '#0f172a', color: '#38bdf8', padding: 14, borderRadius: 6, fontSize: '0.8rem', overflowX: 'auto', marginBottom: 14 }}>
{`GOOGLE_API_KEY=AIzaSy...your_gemini_key_here
GEMINI_MODEL=gemini-2.5-flash
WEATHER_API_KEY=optional_openweathermap_key`}
          </pre>

          <div style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5 }}>
            <strong>Security Guarantee:</strong> API keys are held exclusively on the FastAPI backend and are never sent to the client browser. If an API key is missing or quota is exhausted, the backend falls back gracefully to demo mode without crashing.
          </div>
        </div>
      </div>

      {/* Add New Project Registry */}
      <div className="card">
        <div className="card-title">
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Building2 size={20} color="#1e40af" />
            Register New Construction Site
          </span>
        </div>

        <form onSubmit={handleAddProject}>
          <div className="grid-3">
            <div className="form-group">
              <label className="form-label">Project Name:</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="e.g. Metro Line 3 Pier Staging"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Location / City:</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="e.g. Pune, Maharashtra"
                value={newProject.location}
                onChange={(e) => setNewProject({ ...newProject, location: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Project Type:</label>
              <select
                className="form-select"
                value={newProject.project_type}
                onChange={(e) => setNewProject({ ...newProject, project_type: e.target.value })}
              >
                <option value="Residential Tower">Residential Tower</option>
                <option value="Commercial Complex">Commercial Complex</option>
                <option value="Bridge / Flyover">Bridge / Flyover</option>
                <option value="Highway Pavement">Highway Pavement</option>
                <option value="Industrial Plant">Industrial Plant</option>
              </select>
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Budget:</label>
              <input
                type="text"
                className="form-input"
                value={newProject.budget}
                onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Workforce Count:</label>
              <input
                type="number"
                className="form-input"
                value={newProject.worker_count}
                onChange={(e) => setNewProject({ ...newProject, worker_count: parseInt(e.target.value) || 20 })}
              />
            </div>
          </div>

          {projMsg && (
            <div style={{ padding: '10px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 6, color: '#15803d', fontSize: '0.85rem', marginBottom: 14 }}>
              {projMsg}
            </div>
          )}

          <button type="submit" className="btn btn-primary" disabled={adding}>
            <Plus size={16} /> {adding ? 'Registering...' : 'Add Construction Project'}
          </button>
        </form>
      </div>
    </div>
  );
};

