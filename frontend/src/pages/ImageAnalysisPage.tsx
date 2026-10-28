import React, { useState } from 'react';
import { Camera, Layers, Wrench, Users, AlertCircle, CheckSquare, Eye, ShieldCheck } from 'lucide-react';
import { ImageUploadBox } from '../components/ImageUploadBox';
import { ImageAnalysisResult } from '../types';
import { analyzeImage } from '../services/api';

interface ImageAnalysisPageProps {
  selectedProjectId: string;
}

export const ImageAnalysisPage: React.FC<ImageAnalysisPageProps> = ({ selectedProjectId }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedSampleUrl, setSelectedSampleUrl] = useState<string | null>('/sample_images/construction_site.svg');
  const [contextNote, setContextNote] = useState<string>('Superstructure RCC column and slab deck staging with tower crane');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('Ready');
  const [result, setResult] = useState<ImageAnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const samplePresets = [
    { label: 'Superstructure RCC & Tower Crane', url: '/sample_images/construction_site.svg' },
    { label: 'Scaffolding & Slab Edge Framing', url: '/sample_images/safety_scaffold.svg' }
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
      setLoadingStep('Uploading image to visual engine...');

      const formData = new FormData();
      if (selectedFile) {
        formData.append('file', selectedFile);
      } else if (selectedSampleUrl) {
        formData.append('image_url', selectedSampleUrl);
      }
      formData.append('context', contextNote);
      formData.append('project_id', selectedProjectId);

      setTimeout(() => setLoadingStep('Extracting materials, equipment & structural elements...'), 600);
      setTimeout(() => setLoadingStep('Evaluating construction stage & quality checkpoints...'), 1200);

      const res = await analyzeImage(formData);
      if (res.success && res.data) {
        setResult(res.data);
      } else {
        setErrorMsg(res.error?.message || 'Failed to complete image analysis.');
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
        <h1 className="page-title">Module 2: Construction Image Analysis</h1>
        <p className="page-subtitle">
          Multimodal visual reasoning for site stage identification, materials inventory, heavy equipment, and quality control.
        </p>
      </div>

      <div className="grid-2">
        {/* Upload Column */}
        <div className="card">
          <div className="card-title">
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Camera size={20} color="#1e40af" />
              Upload Construction Scene
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
            <label className="form-label">Context / Member Details (Optional):</label>
            <input
              type="text"
              className="form-input"
              value={contextNote}
              onChange={(e) => setContextNote(e.target.value)}
              placeholder="e.g. 3rd floor slab casting preparation..."
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
            <Layers size={18} />
            {loading ? 'Analyzing Scene...' : 'Analyze Construction Scene'}
          </button>
        </div>

        {/* Results Column */}
        <div>
          {result ? (
            <div>
              {/* Construction Stage & Confidence */}
              <div className="card" style={{ borderLeft: '4px solid #2563eb' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Identified Stage</span>
                  <span className="badge badge-low">{result.confidence}</span>
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>
                  {result.construction_stage}
                </div>
                <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.5 }}>
                  {result.scene_description}
                </p>
                <div style={{ marginTop: 10, fontSize: '0.825rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Users size={15} /> Workforce Count: <strong>{result.workers_count_est}</strong>
                </div>
              </div>

              {/* Detected Objects & Materials Grid */}
              <div className="grid-2">
                <div className="card">
                  <div className="card-title">
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Layers size={17} color="#2563eb" /> Visible Materials
                    </span>
                  </div>
                  <ul style={{ paddingLeft: 18, fontSize: '0.85rem', lineHeight: 1.6 }}>
                    {result.visible_materials.map((mat, i) => (
                      <li key={i}>{mat}</li>
                    ))}
                  </ul>
                </div>

                <div className="card">
                  <div className="card-title">
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Wrench size={17} color="#d97706" /> Equipment & Plant
                    </span>
                  </div>
                  <ul style={{ paddingLeft: 18, fontSize: '0.85rem', lineHeight: 1.6 }}>
                    {result.equipment.map((eq, i) => (
                      <li key={i}>{eq}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Potential Quality Issues */}
              <div className="card">
                <div className="card-title">
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#b91c1c' }}>
                    <AlertCircle size={18} /> Potential Quality & Technical Issues
                  </span>
                </div>
                <ul style={{ listStyleType: 'none', fontSize: '0.875rem' }}>
                  {result.potential_issues.map((iss, i) => (
                    <li key={i} style={{ padding: '8px 0', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <span style={{ color: '#dc2626', fontWeight: 700 }}>•</span>
                      <span>{iss}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div className="card">
                <div className="card-title">
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#15803d' }}>
                    <CheckSquare size={18} /> Engineering Recommendations
                  </span>
                </div>
                <ul style={{ listStyleType: 'none', fontSize: '0.875rem' }}>
                  {result.recommendations.map((rec, i) => (
                    <li key={i} style={{ padding: '8px 0', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <span style={{ color: '#16a34a', fontWeight: 700 }}>✔</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
              <Camera size={48} color="#cbd5e1" style={{ margin: '0 auto 16px' }} />
              <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#334155' }}>
                No Image Analyzed
              </div>
              <p style={{ fontSize: '0.85rem', marginTop: 6, maxWidth: 360, margin: '8px auto 0' }}>
                Upload or select a construction scene photograph to extract stages, objects, materials, and quality checkpoints.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

