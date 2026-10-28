import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, CheckCircle, RefreshCw } from 'lucide-react';

interface ImageUploadBoxProps {
  onImageSelected: (file: File | null, sampleUrl?: string) => void;
  isLoading: boolean;
  loadingStep?: string;
  sampleImages?: { label: string; url: string }[];
  defaultPreview?: string;
}

export const ImageUploadBox: React.FC<ImageUploadBoxProps> = ({
  onImageSelected,
  isLoading,
  loadingStep = 'Analyzing construction scene...',
  sampleImages = [],
  defaultPreview
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(defaultPreview || null);
  const [fileName, setFileName] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onImageSelected(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setFileName(file.name);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onImageSelected(file);
    }
  };

  const handleSelectSample = (sample: { label: string; url: string }) => {
    setPreviewUrl(sample.url);
    setFileName(sample.label);
    onImageSelected(null, sample.url);
  };

  const handleClear = () => {
    setPreviewUrl(null);
    setFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    onImageSelected(null);
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp,image/svg+xml"
        style={{ display: 'none' }}
      />

      <div
        className="dropzone"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
      >
        {previewUrl ? (
          <div>
            <img src={previewUrl} alt="Inspection Target" className="dropzone-preview" />
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e40af' }}>{fileName || 'Selected Image'}</span>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
              >
                Change Image
              </button>
            </div>
          </div>
        ) : (
          <div style={{ padding: '20px 0' }}>
            <UploadCloud size={44} color="#64748b" style={{ margin: '0 auto 12px' }} />
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>
              Drag & Drop Construction Site Photo Here
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 4 }}>
              Supports JPG, PNG, WEBP, SVG (Max 25MB)
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ marginTop: 14 }}
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Browse Local Files
            </button>
          </div>
        )}
      </div>

      {/* Preset Sample Buttons */}
      {sampleImages.length > 0 && (
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Quick Test Samples:</span>
          {sampleImages.map((s, idx) => (
            <button
              key={idx}
              type="button"
              className="btn btn-secondary btn-sm"
              disabled={isLoading}
              onClick={() => handleSelectSample(s)}
            >
              <ImageIcon size={13} />
              {s.label}
            </button>
          ))}
        </div>
      )}

      {/* Meaningful Loading State */}
      {isLoading && (
        <div className="progress-card" style={{ marginTop: 16 }}>
          <div className="spinner"></div>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#15803d' }}>
              Multimodal Processing Active
            </div>
            <div style={{ fontSize: '0.8rem', color: '#475569' }}>{loadingStep}</div>
          </div>
        </div>
      )}
    </div>
  );
};

