import React, { useState, useEffect } from 'react';
import { FileText, Printer, Plus, ShieldAlert, Activity, CheckCircle, AlertTriangle, Calendar } from 'lucide-react';
import { ReportResult } from '../types';
import { generateReport, fetchReports } from '../services/api';
import { RiskBadge } from '../components/RiskBadge';

interface ReportsPageProps {
  selectedProjectId: string;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ selectedProjectId }) => {
  const [reports, setReports] = useState<any[]>([]);
  const [activeReport, setActiveReport] = useState<ReportResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [reportTitle, setReportTitle] = useState('Weekly Site Intelligence & Quality Audit');

  useEffect(() => {
    loadReportsList();
  }, [selectedProjectId]);

  const loadReportsList = async () => {
    try {
      setLoading(true);
      const res = await fetchReports();
      if (res.success && res.data) {
        setReports(res.data);
        if (res.data.length > 0 && !activeReport) {
          setActiveReport(res.data[0].report_data);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateNewReport = async () => {
    try {
      setGenerating(true);
      const res = await generateReport({
        title: reportTitle,
        project_id: selectedProjectId,
        include_safety: true,
        include_cracks: true,
        include_planning: true,
        include_weather: true
      });
      if (res.success && res.data) {
        setActiveReport(res.data);
        loadReportsList();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 className="page-title">Module 9: AI Site Audit & Compliance Reports</h1>
          <p className="page-subtitle">
            Consolidated structural, safety, environmental, and schedule intelligence reports with exportable print-to-PDF formatting.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary no-print" onClick={handlePrint}>
            <Printer size={16} /> Print / Export PDF
          </button>
          <button className="btn btn-primary no-print" onClick={handleGenerateNewReport} disabled={generating}>
            <Plus size={16} /> {generating ? 'Synthesizing...' : 'Generate New Audit'}
          </button>
        </div>
      </div>

      <div className="grid-3">
        {/* Left List of Past Reports */}
        <div className="card no-print" style={{ height: 'fit-content' }}>
          <div className="card-title">
            <span>Archived Site Audits</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {reports.map((r) => (
              <div
                key={r.id}
                style={{
                  padding: '10px 12px',
                  borderRadius: 6,
                  border: '1px solid #e2e8f0',
                  background: activeReport?.id === r.id ? '#eff6ff' : '#ffffff',
                  borderColor: activeReport?.id === r.id ? '#3b82f6' : '#e2e8f0',
                  cursor: 'pointer'
                }}
                onClick={() => setActiveReport(r.report_data)}
              >
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0f172a' }}>{r.title}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>
                  {r.created_at ? r.created_at.slice(0, 19).replace('T', ' ') : 'Recent'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 2 Columns: Printable Document View */}
        <div style={{ gridColumn: 'span 2' }}>
          {activeReport ? (
            <div className="card" style={{ padding: '36px', background: '#ffffff', color: '#0f172a' }}>
              {/* Document Header */}
              <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: 16, marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e40af', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    BUILDVISION AI • MULTIMODAL ENGINEERING INTELLIGENCE
                  </div>
                  <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: 4 }}>{activeReport.title}</h1>
                  <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: 4 }}>
                    <strong>Project:</strong> {activeReport.project_name} | <strong>Audit Ref:</strong> {activeReport.id}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <RiskBadge level={activeReport.overall_site_risk} />
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 6 }}>
                    Generated: {activeReport.created_at}
                  </div>
                </div>
              </div>

              {/* Executive Summary */}
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 6, color: '#1e40af' }}>
                  1. Executive Summary & Site Status
                </h3>
                <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#334155' }}>
                  {activeReport.executive_summary}
                </p>
              </div>

              {/* Critical Action Items Box */}
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: 14, marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: '0.9rem', color: '#991b1b', marginBottom: 8 }}>
                  <AlertTriangle size={16} /> Urgent Immediate Field Directives:
                </div>
                <ul style={{ paddingLeft: 20, fontSize: '0.85rem', lineHeight: 1.6, color: '#7f1d1d' }}>
                  {activeReport.critical_action_items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Safety Audit Findings Table */}
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 8, color: '#1e40af' }}>
                  2. Visual Safety Inspection Findings
                </h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem' }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #cbd5e1', textAlign: 'left' }}>
                      <th style={{ padding: '8px 10px' }}>Hazard / Protocol Omission</th>
                      <th style={{ padding: '8px 10px' }}>Risk Severity</th>
                      <th style={{ padding: '8px 10px' }}>Engineering Corrective Measure</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeReport.safety_findings.map((sf, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '8px 10px', fontWeight: 600 }}>{sf.hazard}</td>
                        <td style={{ padding: '8px 10px' }}>
                          <RiskBadge level={sf.risk} />
                        </td>
                        <td style={{ padding: '8px 10px', color: '#1e293b' }}>{sf.action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Structural / Crack Findings */}
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 8, color: '#1e40af' }}>
                  3. Structural Crack & Surface Monitoring
                </h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem' }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #cbd5e1', textAlign: 'left' }}>
                      <th style={{ padding: '8px 10px' }}>Member / Location</th>
                      <th style={{ padding: '8px 10px' }}>Severity</th>
                      <th style={{ padding: '8px 10px' }}>Estimated Width</th>
                      <th style={{ padding: '8px 10px' }}>Forensic Recommendation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeReport.structural_crack_findings.map((cf, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '8px 10px', fontWeight: 600 }}>{cf.element}</td>
                        <td style={{ padding: '8px 10px' }}>
                          <RiskBadge level={cf.severity} />
                        </td>
                        <td style={{ padding: '8px 10px' }}>{cf.width}</td>
                        <td style={{ padding: '8px 10px', color: '#1e293b' }}>{cf.recommendation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Planning & Weather Context */}
              <div className="grid-2" style={{ marginBottom: 20 }}>
                {activeReport.planning_summary && (
                  <div style={{ padding: 12, border: '1px solid #e2e8f0', borderRadius: 6, fontSize: '0.825rem' }}>
                    <div style={{ fontWeight: 700, color: '#1e40af', marginBottom: 4 }}>4. Schedule Critical Path</div>
                    <div><strong>Phase:</strong> {activeReport.planning_summary.current_phase}</div>
                    <div><strong>Status:</strong> {activeReport.planning_summary.schedule_status}</div>
                    <div><strong>Site Labor:</strong> {activeReport.planning_summary.worker_capacity}</div>
                  </div>
                )}

                {activeReport.weather_context && (
                  <div style={{ padding: 12, border: '1px solid #e2e8f0', borderRadius: 6, fontSize: '0.825rem' }}>
                    <div style={{ fontWeight: 700, color: '#0284c7', marginBottom: 4 }}>5. Environmental Factors</div>
                    <div><strong>Climatic Data:</strong> {activeReport.weather_context.condition}</div>
                    <div><strong>Impact:</strong> {activeReport.weather_context.concrete_curing_impact}</div>
                  </div>
                )}
              </div>

              {/* Signatures & Professional Disclaimer */}
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 16, marginTop: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, fontSize: '0.8rem' }}>
                  <div>
                    <div style={{ borderBottom: '1px solid #94a3b8', width: 180, marginBottom: 4 }}></div>
                    <div>Project QA/QC Engineer</div>
                  </div>
                  <div>
                    <div style={{ borderBottom: '1px solid #94a3b8', width: 180, marginBottom: 4 }}></div>
                    <div>Resident Safety Officer</div>
                  </div>
                </div>

                <div style={{ fontSize: '0.725rem', color: '#64748b', fontStyle: 'italic', textAlign: 'center' }}>
                  <strong>Disclaimer:</strong> {activeReport.disclaimer}
                </div>
              </div>
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
              <FileText size={48} color="#cbd5e1" style={{ margin: '0 auto 16px' }} />
              <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#334155' }}>No Report Selected</div>
              <p style={{ fontSize: '0.85rem', marginTop: 6 }}>Click "Generate New Audit" to compile current telemetry into a printable report.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

