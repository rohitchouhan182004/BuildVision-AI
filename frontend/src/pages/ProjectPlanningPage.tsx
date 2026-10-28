import React, { useState } from 'react';
import { CalendarCheck, Clock, Users, AlertTriangle, Layers, Code, FileText, CheckCircle2 } from 'lucide-react';
import { ProjectPlanResult } from '../types';
import { planProject } from '../services/api';

export const ProjectPlanningPage: React.FC = () => {
  const [formData, setFormData] = useState({
    project_name: 'Mayur Vihar G+8 Residential Tower',
    project_type: 'Residential High-Rise',
    location: 'Indore, Madhya Pradesh',
    start_date: '2026-11-01',
    target_completion_date: '2027-11-30',
    budget: '₹8.50 Crore',
    number_of_workers: 45,
    project_description: 'Construction of G+8 residential apartment building with basement car park, framed RCC structural skeleton, AAC block masonry, and modern elevator & fire suppression utilities.',
    major_activities: 'Basement raft casting, 8 typical floors RCC pouring, AAC walling, electrical & plumbing concealed piping, vitrified tiling, and passenger elevator commissioning',
    constraints: 'Monsoon rainfall between July and September; strict municipal noise curfew after 20:00; narrow access road for heavy transit mixers'
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProjectPlanResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showJsonView, setShowJsonView] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMsg(null);
      const payload = {
        ...formData,
        major_activities: formData.major_activities.split(',').map((s) => s.trim()),
        constraints: formData.constraints.split(';').map((s) => s.trim())
      };
      const res = await planProject(payload);
      if (res.success && res.data) {
        setResult(res.data);
      } else {
        setErrorMsg(res.error?.message || 'Failed to generate project plan.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred generating plan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 className="page-title">Module 4: Construction Project Planning</h1>
        <p className="page-subtitle">
          Autonomous WBS scheduling, CPM dependency logic, labor sizing, and milestone governance.
        </p>
      </div>

      <div className="grid-2">
        {/* Planning Form */}
        <div className="card">
          <div className="card-title">
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CalendarCheck size={20} color="#1e40af" />
              Project Parameters & Scope
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Project Name:</label>
              <input
                type="text"
                className="form-input"
                required
                value={formData.project_name}
                onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Project Type:</label>
                <select
                  className="form-select"
                  value={formData.project_type}
                  onChange={(e) => setFormData({ ...formData, project_type: e.target.value })}
                >
                  <option value="Residential High-Rise">Residential High-Rise</option>
                  <option value="Commercial Complex">Commercial Complex</option>
                  <option value="Industrial Shed / Factory">Industrial Shed / Factory</option>
                  <option value="Road & Bridge Infrastructure">Road & Bridge Infrastructure</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Location:</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Target Start Date:</label>
                <input
                  type="date"
                  className="form-input"
                  required
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Target Completion Date:</label>
                <input
                  type="date"
                  className="form-input"
                  required
                  value={formData.target_completion_date}
                  onChange={(e) => setFormData({ ...formData, target_completion_date: e.target.value })}
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Estimated Budget:</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Daily Labor Workforce Size:</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.number_of_workers}
                  onChange={(e) => setFormData({ ...formData, number_of_workers: parseInt(e.target.value) || 20 })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Project Description & Structural Specifications:</label>
              <textarea
                className="form-textarea"
                rows={3}
                value={formData.project_description}
                onChange={(e) => setFormData({ ...formData, project_description: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Major Work Packages (comma-separated):</label>
              <input
                type="text"
                className="form-input"
                value={formData.major_activities}
                onChange={(e) => setFormData({ ...formData, major_activities: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Known Constraints & Risks (semicolon-separated):</label>
              <input
                type="text"
                className="form-input"
                value={formData.constraints}
                onChange={(e) => setFormData({ ...formData, constraints: e.target.value })}
              />
            </div>

            {errorMsg && (
              <div style={{ padding: '10px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, color: '#dc2626', fontSize: '0.85rem', marginBottom: 14 }}>
                {errorMsg}
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }} disabled={loading}>
              <CalendarCheck size={18} />
              {loading ? 'Synthesizing Schedule & WBS...' : 'Generate AI Master Project Plan'}
            </button>
          </form>
        </div>

        {/* Plan Output */}
        <div>
          {result ? (
            <div>
              {/* Timeline Overview Card */}
              <div className="card" style={{ borderLeft: '4px solid #16a34a' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Master Schedule</span>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowJsonView(!showJsonView)}
                  >
                    {showJsonView ? <FileText size={14} /> : <Code size={14} />}
                    {showJsonView ? 'Human-Readable View' : 'Structured JSON View'}
                  </button>
                </div>

                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                  Total Estimated Duration: {result.estimated_total_duration_days} Days
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: 12 }}>
                  {result.suggested_timeline}
                </div>

                <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.5 }}>
                  {result.human_readable_summary}
                </p>
              </div>

              {showJsonView ? (
                /* Structured JSON Mode */
                <div className="card">
                  <div className="card-title">
                    <span>Structured JSON Representation</span>
                  </div>
                  <pre style={{ background: '#0f172a', color: '#38bdf8', padding: 16, borderRadius: 8, fontSize: '0.8rem', overflowX: 'auto', maxHeight: 500 }}>
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              ) : (
                /* Human Readable Phase Breakdown */
                <div>
                  {/* Milestones Card */}
                  <div className="card">
                    <div className="card-title">
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#15803d' }}>
                        <CheckCircle2 size={18} /> Key Project Milestones
                      </span>
                    </div>
                    <ul style={{ listStyleType: 'none', fontSize: '0.85rem' }}>
                      {result.milestones.map((m, i) => (
                        <li key={i} style={{ padding: '6px 0', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ color: '#16a34a', fontWeight: 700 }}>✔</span>
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Sequential Phases Accordion / List */}
                  <div className="card">
                    <div className="card-title">
                      <span>Sequential Work Breakdown Phases ({result.phases.length})</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      {result.phases.map((phase) => (
                        <div key={phase.phase_number} style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 14, background: '#ffffff' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e40af' }}>
                              Phase {phase.phase_number}: {phase.phase_name}
                            </div>
                            <span className="badge badge-low">{phase.duration_days} Days</span>
                          </div>

                          <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: 8 }}>
                            <strong>Critical Quality Checks:</strong> {phase.critical_checks.join(', ')}
                          </div>

                          <div style={{ background: '#f8fafc', padding: 8, borderRadius: 6 }}>
                            <table style={{ width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse' }}>
                              <thead>
                                <tr style={{ color: '#64748b', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                                  <th style={{ padding: '4px 6px' }}>Task</th>
                                  <th style={{ padding: '4px 6px' }}>Duration</th>
                                  <th style={{ padding: '4px 6px' }}>Workers</th>
                                  <th style={{ padding: '4px 6px' }}>Deliverable</th>
                                </tr>
                              </thead>
                              <tbody>
                                {phase.tasks.map((task, tIdx) => (
                                  <tr key={tIdx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '6px', fontWeight: 500 }}>{task.name}</td>
                                    <td style={{ padding: '6px' }}>{task.duration_days} d</td>
                                    <td style={{ padding: '6px' }}>{task.workers_required}</td>
                                    <td style={{ padding: '6px', color: '#334155' }}>{task.key_deliverable}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Risks & Recommendations */}
                  <div className="card">
                    <div className="card-title">
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#d97706' }}>
                        <AlertTriangle size={18} /> Risk Mitigations & Recommendations
                      </span>
                    </div>
                    <ul style={{ paddingLeft: 18, fontSize: '0.85rem', lineHeight: 1.6 }}>
                      {result.recommendations.map((rec, i) => (
                        <li key={i} style={{ marginBottom: 4 }}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
              <CalendarCheck size={48} color="#cbd5e1" style={{ margin: '0 auto 16px' }} />
              <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#334155' }}>
                No Active Master Schedule
              </div>
              <p style={{ fontSize: '0.85rem', marginTop: 6, maxWidth: 360, margin: '8px auto 0' }}>
                Fill out the project scope form on the left to generate end-to-end WBS phases, labor sizing, and CPM dependencies.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

