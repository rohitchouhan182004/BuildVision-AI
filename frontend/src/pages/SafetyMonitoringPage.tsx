import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, Eye, HelpCircle, HardHat } from 'lucide-react';
import { ImageUploadBox } from '../components/ImageUploadBox';
import { RiskBadge } from '../components/RiskBadge';
import { SafetyAnalysisResult } from '../types';
import { analyzeSafety } from '../services/api';

interface SafetyMonitoringPageProps {
  selectedProjectId: string;
}

export const SafetyMonitoringPage: React.FC<SafetyMonitoringPageProps> = ({ selectedProjectId }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedSampleUrl, setSelectedSampleUrl] = useState<string | null>('/sample_images/safety_scaffold.svg');
  const [contextNote, setContextNote] = useState<string>('5th Floor elevated perimeter slab and external scaffolding staging');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('Ready');
  const [result, setResult] = useState<SafetyAnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const samplePresets = [
    { label: '5th Floor Perimeter Scaffolding Hazard', url: '/sample_images/safety_scaffold.svg' },
    { label: 'General Tower Crane & Rebar Deck', url: '/sample_images/construction_site.svg' }
  ];

  const handleImageSelected = (file: File | null, sampleUrl?: string) => {
    setSelectedFile(file);
    setSelectedSampleUrl(sampleUrl || null);
    setErrorMsg(null);
  };

  const handleRunAnalysis = async () => {
    if (!selectedFile && !selectedSampleUrl) {
      setErrorMsg('Please select or upload a construction site photo first.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);
      setLoadingStep('Uploading image to vision pipeline...');

      const formData = new FormData();
      if (selectedFile) {
        formData.append('file', selectedFile);
      } else if (selectedSampleUrl) {
        formData.append('image_url', selectedSampleUrl);
      }
      formData.append('context', contextNote);
      formData.append('project_id', selectedProjectId);

      setTimeout(() => setLoadingStep('Evaluating PPE, fall hazards & heavy machinery proximity...'), 600);
      setTimeout(() => setLoadingStep('Generating OSHA/IS code recommendations...'), 1200);

      const res = await analyzeSafety(formData);
      if (res.success && res.data) {
        setResult(res.data);
      } else {
        setErrorMsg(res.error?.message || 'Failed to complete safety analysis.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error occurred during analysis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 className="page-title">Module 1: Site Safety Monitoring</h1>
        <p className="page-subtitle">
          Autonomous visual inspection for PPE compliance, fall risks, unprotected edges, and dangerous proximity.
        </p>
      </div>

      <div className="grid-2">
        {/* Left Column: Upload & Config */}
        <div className="card">
          <div className="card-title">
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <HardHat size={20} color="#1e40af" />
              Upload Inspection Image
            </span>
          </div>

          <ImageUploadBox
            onImageSelected={handleImageSelected}
            isLoading={loading}
            loadingStep={loadingStep}
            sampleImages={samplePresets}
            defaultPreview={selectedSampleUrl || undefined}
          />

          <div className="form-group">
            <label className="form-label">Site Context / Zone Notes (Optional):</label>
            <input
              type="text"
              className="form-input"
              value={contextNote}
              onChange={(e) => setContextNote(e.target.value)}
              placeholder="e.g. Tower 2 perimeter casting, 4th floor staging..."
            />
          </div>

          {errorMsg && (
            <div style={{ padding: '12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, color: '#dc2626', fontSize: '0.85rem', marginBottom: 16 }}>
              {errorMsg}
            </div>
          )}

          <button
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px' }}
            disabled={loading}
            onClick={handleRunAnalysis}
          >
            <ShieldAlert size={18} />
            {loading ? 'Analyzing Scene...' : 'Run Autonomous Safety Analysis'}
          </button>
        </div>

        {/* Right Column: Results */}
        <div>
          {result ? (
            <div>
              {/* Overall Risk Card */}
              <div className="card" style={{ borderLeft: result.overall_risk === 'HIGH' || result.overall_risk === 'CRITICAL' ? '4px solid #dc2626' : '4px solid #d97706' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Overall Site Risk</span>
                    <div style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: 2 }}>
                      Risk Index: {result.risk_score}/100
                    </div>
                  </div>
                  <RiskBadge level={result.overall_risk} score={result.risk_score} />
                </div>
                <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.5 }}>
                  {result.summary}
                </p>
                {result.ppe_compliance_rate && (
                  <div style={{ marginTop: 10, fontSize: '0.8rem', color: '#64748b' }}>
                    Estimated PPE Compliance Rate: <strong>{result.ppe_compliance_rate}</strong>
                  </div>
                )}
              </div>

              {/* Observed vs Likely vs Cannot Determine Breakdown */}
              <div className="card">
                <div className="card-title">
                  <span>Visual Evidence Breakdown</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.85rem' }}>
                  <div style={{ padding: '10px 14px', background: '#f0fdf4', borderRadius: 6, border: '1px solid #bbf7d0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#15803d', fontWeight: 600, marginBottom: 4 }}>
                      <CheckCircle size={15} /> Observed (Directly Verified):
                    </div>
                    <ul style={{ paddingLeft: 20 }}>
                      {result.observation_breakdown.observed.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ padding: '10px 14px', background: '#fffbeb', borderRadius: 6, border: '1px solid #fde68a' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#d97706', fontWeight: 600, marginBottom: 4 }}>
                      <Eye size={15} /> Likely (Strongly Inferred):
                    </div>
                    <ul style={{ paddingLeft: 20 }}>
                      {result.observation_breakdown.likely.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', fontWeight: 600, marginBottom: 4 }}>
                      <HelpCircle size={15} /> Cannot Determine (Requires Field Inspection):
                    </div>
                    <ul style={{ paddingLeft: 20 }}>
                      {result.observation_breakdown.cannot_determine.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Detected Hazards List */}
              <div className="card">
                <div className="card-title">
                  <span>Detected Hazards & Violations ({result.hazards.length})</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {result.hazards.map((h, idx) => (
                    <div key={idx} style={{ padding: 14, border: '1px solid #e2e8f0', borderRadius: 8, background: '#ffffff' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{h.type}</span>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: 4, background: '#f1f5f9', color: '#475569', fontWeight: 500 }}>
                            {h.status}
                          </span>
                          <RiskBadge level={h.severity} />
                        </div>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: 6 }}>
                        <strong>Location in scene:</strong> {h.location_in_scene || 'Visual Field'}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#1e293b', marginBottom: 8 }}>
                        {h.description}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#166534', background: '#f0fdf4', padding: '8px 10px', borderRadius: 6, border: '1px solid #dcfce7' }}>
                        <strong>Corrective Action:</strong> {h.recommendation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Actions */}
              <div className="card">
                <div className="card-title">
                  <span>Mandatory Engineering Directives</span>
                </div>
                <ol style={{ paddingLeft: 20, fontSize: '0.875rem', lineHeight: 1.6 }}>
                  {result.recommended_actions.map((act, idx) => (
                    <li key={idx} style={{ marginBottom: 6 }}>{act}</li>
                  ))}
                </ol>
              </div>
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
              <ShieldAlert size={48} color="#cbd5e1" style={{ margin: '0 auto 16px' }} />
              <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#334155' }}>
                No Active Safety Audit
              </div>
              <p style={{ fontSize: '0.85rem', marginTop: 6, maxWidth: 360, margin: '8px auto 0' }}>
                Select a sample photo or upload a construction site picture to run multimodal safety reasoning.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

