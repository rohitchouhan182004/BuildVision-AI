import React, { useState } from 'react';
import { Activity, AlertTriangle, ShieldCheck, Ruler, HelpCircle, FileSearch, ArrowRight } from 'lucide-react';
import { ImageUploadBox } from '../components/ImageUploadBox';
import { RiskBadge } from '../components/RiskBadge';
import { CrackAnalysisResult } from '../types';
import { analyzeCrack } from '../services/api';

interface CrackAnalysisPageProps {
  selectedProjectId: string;
}

export const CrackAnalysisPage: React.FC<CrackAnalysisPageProps> = ({ selectedProjectId }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedSampleUrl, setSelectedSampleUrl] = useState<string | null>('/sample_images/concrete_crack.svg');
  const [contextNote, setContextNote] = useState<string>('Basement column-beam junction with visible diagonal crack trace and 25mm coin scale');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('Ready');
  const [result, setResult] = useState<CrackAnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const samplePresets = [
    { label: 'Column Shear Crack with Scale Coin', url: '/sample_images/concrete_crack.svg' },
    { label: 'Elevated Deck Perimeter Joint', url: '/sample_images/safety_scaffold.svg' }
  ];

  const handleImageSelected = (file: File | null, sampleUrl?: string) => {
    setSelectedFile(file);
    setSelectedSampleUrl(sampleUrl || null);
    setErrorMsg(null);
  };

  const handleRunAnalysis = async () => {
    if (!selectedFile && !selectedSampleUrl) {
      setErrorMsg('Please select or upload a concrete surface photo first.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);
      setLoadingStep('Uploading surface photograph...');

      const formData = new FormData();
      if (selectedFile) {
        formData.append('file', selectedFile);
      } else if (selectedSampleUrl) {
        formData.append('image_url', selectedSampleUrl);
      }
      formData.append('context', contextNote);
      formData.append('project_id', selectedProjectId);

      setTimeout(() => setLoadingStep('Analyzing surface morphology & crack propagation pattern...'), 600);
      setTimeout(() => setLoadingStep('Formulating structural forensic hypothesis & testing protocol...'), 1200);

      const res = await analyzeCrack(formData);
      if (res.success && res.data) {
        setResult(res.data);
      } else {
        setErrorMsg(res.error?.message || 'Failed to complete crack analysis.');
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
        <h1 className="page-title">Module 3: Crack Detection & Forensic Analysis</h1>
        <p className="page-subtitle">
          Visual defect classification for reinforced concrete, masonry, slabs, and columns with forensic causality guidance.
        </p>
      </div>

      {/* Mandatory Engineering Caution Callout */}
      <div style={{ padding: '12px 16px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, color: '#92400e', fontSize: '0.85rem', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
        <AlertTriangle size={18} color="#d97706" flex-shrink="0" />
        <div>
          <strong>Engineering Notice:</strong> Photographic crack appraisal is an indicative screening tool. Never replace physical ultrasonic pulse velocity (UPV), core compression, or licensed structural engineer sign-off with AI vision.
        </div>
      </div>

      <div className="grid-2">
        {/* Upload Column */}
        <div className="card">
          <div className="card-title">
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Activity size={20} color="#1e40af" />
              Upload Concrete / Wall Image
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
            <label className="form-label">Structural Member & Scale Details (Optional):</label>
            <input
              type="text"
              className="form-input"
              value={contextNote}
              onChange={(e) => setContextNote(e.target.value)}
              placeholder="e.g. Basement retaining wall, coin/ruler present..."
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
            <FileSearch size={18} />
            {loading ? 'Evaluating Defect...' : 'Analyze Crack Pattern'}
          </button>
        </div>

        {/* Results Column */}
        <div>
          {result ? (
            <div>
              {/* Detection & Severity Card */}
              <div className="card" style={{ borderLeft: result.severity === 'HIGH' || result.severity === 'CRITICAL' ? '4px solid #dc2626' : '4px solid #d97706' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Visual Defect Status</span>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: result.crack_detected ? '#0f172a' : '#15803d' }}>
                      {result.crack_detected ? 'Crack Detected in Visual Field' : 'No Significant Surface Crack Detected'}
                    </div>
                  </div>
                  <RiskBadge level={result.severity} />
                </div>

                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1e40af', marginBottom: 8 }}>
                  Classification: {result.type}
                </div>

                <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: 12 }}>
                  <strong>Location in Member:</strong> {result.location}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, background: '#f8fafc', padding: 12, borderRadius: 6, border: '1px solid #e2e8f0', fontSize: '0.825rem' }}>
                  <div>
                    <span style={{ color: '#64748b' }}>Estimated Width:</span>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{result.estimated_width || 'Uncalibrated / Approx'}</div>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Visible Length:</span>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{result.length_estimate || 'Not determined'}</div>
                  </div>
                </div>

                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.825rem' }}>
                  <span style={{ color: '#64748b' }}>Inspection Urgency:</span>
                  <span style={{ fontWeight: 600, color: '#b91c1c' }}>{result.urgency}</span>
                </div>
              </div>

              {/* Possible Causality Factors */}
              <div className="card">
                <div className="card-title">
                  <span>Inferred Structural Causes</span>
                </div>
                <ul style={{ paddingLeft: 18, fontSize: '0.85rem', lineHeight: 1.6 }}>
                  {result.possible_causes.map((cause, idx) => (
                    <li key={idx} style={{ marginBottom: 4 }}>{cause}</li>
                  ))}
                </ul>
              </div>

              {/* Recommended Action */}
              <div className="card">
                <div className="card-title">
                  <span>Recommended Forensic Testing & Remediation</span>
                </div>
                <div style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#1e293b', background: '#f0fdf4', padding: 14, borderRadius: 6, border: '1px solid #bbf7d0' }}>
                  {result.recommendation}
                </div>
              </div>

              {/* Official Disclaimer */}
              <div style={{ padding: '12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, fontSize: '0.775rem', color: '#991b1b', lineHeight: 1.4 }}>
                <strong>Disclaimer:</strong> {result.disclaimer}
              </div>
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
              <Activity size={48} color="#cbd5e1" style={{ margin: '0 auto 16px' }} />
              <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#334155' }}>
                No Defect Analysis Loaded
              </div>
              <p style={{ fontSize: '0.85rem', marginTop: 6, maxWidth: 360, margin: '8px auto 0' }}>
                Select the column shear crack sample or upload a photo of concrete, beam, or masonry wall.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

