import React, { useEffect, useState } from 'react';
import {
  ShieldAlert,
  Activity,
  CheckCircle,
  AlertTriangle,
  CloudRain,
  Calendar,
  FileText,
  ArrowRight,
  TrendingUp,
  HardHat
} from 'lucide-react';
import { RiskBadge } from '../components/RiskBadge';
import { fetchDashboardMetrics } from '../services/api';
import { TabType } from '../components/Sidebar';

interface DashboardPageProps {
  onNavigate: (tab: TabType) => void;
  selectedProjectId: string;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, selectedProjectId }) => {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, [selectedProjectId]);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      const res = await fetchDashboardMetrics();
      if (res.success) {
        setMetrics(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !metrics) {
    return (
      <div>
        <div className="spinner" style={{ margin: '40px auto' }}></div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 className="page-title">Construction Intelligence Command Center</h1>
          <p className="page-subtitle">Real-time multimodal site telemetry, structural integrity, and AI risk governance</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" onClick={() => onNavigate('safety')}>
            <ShieldAlert size={16} /> Run Safety Audit
          </button>
          <button className="btn btn-secondary" onClick={() => onNavigate('crack')}>
            <Activity size={16} /> Crack Inspection
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        <div className="metric-box">
          <div className="metric-icon-wrap" style={{ background: '#eff6ff', color: '#1e40af' }}>
            <HardHat size={26} />
          </div>
          <div>
            <div className="metric-value">{metrics?.total_projects || 3}</div>
            <div className="metric-label">Active Sites</div>
          </div>
        </div>

        <div className="metric-box">
          <div className="metric-icon-wrap" style={{ background: '#fef2f2', color: '#dc2626' }}>
            <ShieldAlert size={26} />
          </div>
          <div>
            <div className="metric-value">{metrics?.high_risk_count || 1}</div>
            <div className="metric-label">High Risk Hazards</div>
          </div>
        </div>

        <div className="metric-box">
          <div className="metric-icon-wrap" style={{ background: '#fffbeb', color: '#d97706' }}>
            <Activity size={26} />
          </div>
          <div>
            <div className="metric-value">{metrics?.crack_analyses_count || 1}</div>
            <div className="metric-label">Cracks Monitored</div>
          </div>
        </div>

        <div className="metric-box">
          <div className="metric-icon-wrap" style={{ background: '#f0fdf4', color: '#15803d' }}>
            <FileText size={26} />
          </div>
          <div>
            <div className="metric-value">{metrics?.total_reports || 1}</div>
            <div className="metric-label">Audit Reports</div>
          </div>
        </div>
      </div>

      {/* Weather & Active Projects Grid */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* Weather Card */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-title">
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CloudRain size={20} color="#0284c7" />
              Site Weather Advisory: {metrics?.weather_status?.location || 'Indore, MP'}
            </span>
            <RiskBadge level={metrics?.weather_status?.risk || 'MEDIUM'} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #e2e8f0' }}>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#0f172a' }}>
                {metrics?.weather_status?.temp || 31}°C
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Moderate heat / low humidity</div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('weather')}>
              View 5-Day Advisory <ArrowRight size={13} />
            </button>
          </div>
          <div style={{ marginTop: 12, fontSize: '0.85rem', color: '#334155', lineHeight: 1.5 }}>
            <strong>Operational Advisory:</strong> {metrics?.weather_status?.summary || 'Warm afternoon temperatures require active concrete curing management and worker hydration protocols.'}
          </div>
        </div>

        {/* Priority AI Recommendations */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-title">
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertTriangle size={20} color="#ea580c" />
              Urgent Site Action Items
            </span>
            <span className="badge badge-high">Priority Action</span>
          </div>
          <ul style={{ listStyleType: 'none', fontSize: '0.875rem' }}>
            <li style={{ padding: '8px 0', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <span style={{ color: '#dc2626', fontWeight: 700 }}>•</span>
              <div>
                <strong>Fall Prevention:</strong> Erect temporary OSHA-compliant perimeter guardrails on Floor 5 slab edge before noon.
              </div>
            </li>
            <li style={{ padding: '8px 0', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <span style={{ color: '#d97706', fontWeight: 700 }}>•</span>
              <div>
                <strong>Structural Tell-Tale:</strong> Mount optical displacement gauge over basement column shear crack to monitor live loads.
              </div>
            </li>
            <li style={{ padding: '8px 0', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <span style={{ color: '#16a34a', fontWeight: 700 }}>•</span>
              <div>
                <strong>Pre-Pour Quality:</strong> Schedule cube testing and verify 40mm rebar spacer blocks before 2nd floor concrete pour.
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Recent Visual Analyses Table */}
      <div className="card">
        <div className="card-title">
          <span>Recent Multimodal Site Telemetry</span>
          <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('safety')}>
            View All Analyses
          </button>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Module</th>
                <th>Target / Scope</th>
                <th>Risk Category</th>
                <th>Logged At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {metrics?.recent_analyses && metrics.recent_analyses.length > 0 ? (
                metrics.recent_analyses.map((a: any) => (
                  <tr key={a.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{a.id}</td>
                    <td style={{ textTransform: 'capitalize' }}>
                      <strong>{a.module_type.replace('_', ' ')}</strong>
                    </td>
                    <td>{a.input_summary}</td>
                    <td>
                      <RiskBadge level={a.risk_level || 'MEDIUM'} />
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {a.created_at ? a.created_at.replace('T', ' ').slice(0, 19) : 'Just now'}
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          if (a.module_type === 'safety') onNavigate('safety');
                          else if (a.module_type === 'crack') onNavigate('crack');
                          else onNavigate('image');
                        }}
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                    No recent analyses found. Upload an image to start!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

