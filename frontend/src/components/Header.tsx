import React from 'react';
import { HardHat, Cpu, CheckCircle2, AlertTriangle, Building2 } from 'lucide-react';
import { Project } from '../types';

interface HeaderProps {
  projects: Project[];
  selectedProjectId: string;
  onSelectProject: (id: string) => void;
  isDemoMode: boolean;
  modelName: string;
}

export const Header: React.FC<HeaderProps> = ({
  projects,
  selectedProjectId,
  onSelectProject,
  isDemoMode,
  modelName
}) => {
  return (
    <header className="top-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Building2 size={20} color="#1e40af" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>PROJECT:</span>
        </div>
        <select
          className="form-select"
          style={{ width: 'auto', minWidth: 260, fontWeight: 500 }}
          value={selectedProjectId}
          onChange={(e) => onSelectProject(e.target.value)}
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.location})
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {isDemoMode ? (
          <div className="badge badge-demo" title="Running in simulated demo mode. Connect GOOGLE_API_KEY for live Gemini inference.">
            <AlertTriangle size={13} />
            <span>Demo Mode</span>
          </div>
        ) : (
          <div className="badge badge-live" title={`Google Gemini Multimodal AI active (${modelName})`}>
            <CheckCircle2 size={13} />
            <span>Live AI ({modelName})</span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderLeft: '1px solid #e2e8f0', paddingLeft: 16 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <HardHat size={18} color="#1e293b" />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f172a' }}>Site Engineer</div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Indore Command Center</div>
          </div>
        </div>
      </div>
    </header>
  );
};

