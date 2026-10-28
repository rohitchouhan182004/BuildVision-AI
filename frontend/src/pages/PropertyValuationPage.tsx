import React, { useState } from 'react';
import { TrendingUp, AlertTriangle, ShieldCheck, Home, CheckCircle2, XCircle, FileSpreadsheet } from 'lucide-react';
import { ValuationResult } from '../types';
import { valueProperty } from '../services/api';

export const PropertyValuationPage: React.FC = () => {
  const [formData, setFormData] = useState({
    property_type: 'Residential Apartment (3BHK)',
    location: 'Vijay Nagar, Indore, MP',
    area_sqft: 1550,
    number_of_floors: 5,
    number_of_rooms: 3,
    age_years: 2.5,
    construction_quality: 'Premium RCC Framed (Grade M25, Vitrified, Concealed Wiring)',
    amenities: 'Lift, 100% DG Power Backup, 2 Covered Parking, 24/7 CCTV Security, Club House',
    nearby_facilities: 'Metro Station (400m), Multispeciality Hospital (1.2km), Top CBSE School (800m), Supermarket',
    current_condition: 'Excellent / Like-New',
    additional_notes: 'East-facing corner unit, Italian marble living room finish, double-glazed soundproof balcony doors'
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ValuationResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMsg(null);
      const payload = {
        ...formData,
        amenities: formData.amenities.split(',').map((s) => s.trim()),
        nearby_facilities: formData.nearby_facilities.split(',').map((s) => s.trim())
      };
      const res = await valueProperty(payload);
      if (res.success && res.data) {
        setResult(res.data);
      } else {
        setErrorMsg(res.error?.message || 'Failed to estimate property valuation.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred during valuation.');
    } finally {
      setLoading(false);
    }
  };

  const fmtCurrency = (val: number) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Crore`;
    }
    return `₹${(val / 100000).toFixed(2)} Lakh`;
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 className="page-title">Module 5: Real-Estate & Asset Valuation</h1>
        <p className="page-subtitle">
          Parametric civil cost estimation, comparable local market trends, and risk-adjusted valuation bands.
        </p>
      </div>

      <div className="grid-2">
        {/* Form Column */}
        <div className="card">
          <div className="card-title">
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Home size={20} color="#1e40af" />
              Property Attributes
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Property Type:</label>
              <select
                className="form-select"
                value={formData.property_type}
                onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
              >
                <option value="Residential Apartment (3BHK)">Residential Apartment (3BHK)</option>
                <option value="Residential Independent Villa">Residential Independent Villa</option>
                <option value="Commercial Office Space">Commercial Office Space</option>
                <option value="Retail Showroom Ground Floor">Retail Showroom Ground Floor</option>
                <option value="Industrial Warehouse Shed">Industrial Warehouse Shed</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Location / Sub-Market:</label>
              <input
                type="text"
                className="form-input"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Super Built-Up Area (sq.ft):</label>
                <input
                  type="number"
                  className="form-input"
                  required
                  value={formData.area_sqft}
                  onChange={(e) => setFormData({ ...formData, area_sqft: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Building Age (Years):</label>
                <input
                  type="number"
                  step="0.5"
                  className="form-input"
                  required
                  value={formData.age_years}
                  onChange={(e) => setFormData({ ...formData, age_years: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Floor Number:</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.number_of_floors}
                  onChange={(e) => setFormData({ ...formData, number_of_floors: parseInt(e.target.value) || 1 })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bedrooms / Cabins Count:</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.number_of_rooms}
                  onChange={(e) => setFormData({ ...formData, number_of_rooms: parseInt(e.target.value) || 1 })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Construction Quality Classification:</label>
              <select
                className="form-select"
                value={formData.construction_quality}
                onChange={(e) => setFormData({ ...formData, construction_quality: e.target.value })}
              >
                <option value="Premium RCC Framed (Grade M25, Vitrified, Concealed Wiring)">
                  Premium RCC Framed (A-Grade materials, branded fittings)
                </option>
                <option value="Standard RCC Framed (Standard cement, ceramic tiles)">
                  Standard RCC Framed (Mid-range specifications)
                </option>
                <option value="Economy Construction (Basic brick/block, bare finishes)">
                  Economy Construction (Cost-optimized)
                </option>
                <option value="Ultra-Luxury High-End (Imported fittings, home automation)">
                  Ultra-Luxury High-End (Designer specifications)
                </option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Current Maintenance Condition:</label>
              <select
                className="form-select"
                value={formData.current_condition}
                onChange={(e) => setFormData({ ...formData, current_condition: e.target.value })}
              >
                <option value="Excellent / Like-New">Excellent / Like-New</option>
                <option value="Good / Well-Maintained">Good / Well-Maintained</option>
                <option value="Fair / Minor Repainting Required">Fair / Minor Repainting Required</option>
                <option value="Poor / Significant Renovation Required">Poor / Significant Renovation Required</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Key Amenities (comma-separated):</label>
              <input
                type="text"
                className="form-input"
                value={formData.amenities}
                onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Nearby Facilities / Transit (comma-separated):</label>
              <input
                type="text"
                className="form-input"
                value={formData.nearby_facilities}
                onChange={(e) => setFormData({ ...formData, nearby_facilities: e.target.value })}
              />
            </div>

            {errorMsg && (
              <div style={{ padding: '10px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, color: '#dc2626', fontSize: '0.85rem', marginBottom: 14 }}>
                {errorMsg}
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }} disabled={loading}>
              <TrendingUp size={18} />
              {loading ? 'Evaluating Parametric Indices...' : 'Compute AI Property Valuation'}
            </button>
          </form>
        </div>

        {/* Valuation Result Column */}
        <div>
          {result ? (
            <div>
              {/* Valuation Band Card */}
              <div className="card" style={{ borderLeft: '4px solid #1e40af' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                  Estimated Market Value Band
                </span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e40af', marginTop: 4 }}>
                  {fmtCurrency(result.estimated_value_min)} – {fmtCurrency(result.estimated_value_max)}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#0f172a', fontWeight: 600, marginTop: 4 }}>
                  Indicative Median: {fmtCurrency(result.estimated_value_median)}
                </div>
                <div style={{ fontSize: '0.825rem', color: '#64748b', marginTop: 4 }}>
                  Estimated Price Range: <strong>{result.price_per_sqft_range}</strong>
                </div>

                <div style={{ marginTop: 14, padding: 12, background: '#f8fafc', borderRadius: 6, fontSize: '0.85rem', color: '#334155', lineHeight: 1.5 }}>
                  {result.explanation}
                </div>
              </div>

              {/* Positive and Negative Drivers Grid */}
              <div className="grid-2">
                <div className="card">
                  <div className="card-title">
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#15803d' }}>
                      <CheckCircle2 size={17} /> Value Drivers
                    </span>
                  </div>
                  <ul style={{ listStyleType: 'none', fontSize: '0.825rem', lineHeight: 1.5 }}>
                    {result.positive_factors.map((f, i) => (
                      <li key={i} style={{ marginBottom: 6, display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                        <span style={{ color: '#16a34a' }}>✔</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="card">
                  <div className="card-title">
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#b91c1c' }}>
                      <XCircle size={17} /> Market Adjustments
                    </span>
                  </div>
                  <ul style={{ listStyleType: 'none', fontSize: '0.825rem', lineHeight: 1.5 }}>
                    {result.negative_factors.map((f, i) => (
                      <li key={i} style={{ marginBottom: 6, display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                        <span style={{ color: '#dc2626' }}>•</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Key Factors */}
              <div className="card">
                <div className="card-title">
                  <span>Key Analytical Parameters</span>
                </div>
                <ul style={{ paddingLeft: 18, fontSize: '0.85rem', lineHeight: 1.6 }}>
                  {result.key_factors.map((kf, i) => (
                    <li key={i} style={{ marginBottom: 4 }}>{kf}</li>
                  ))}
                </ul>
              </div>

              {/* Mandatory Disclaimer */}
              <div style={{ padding: '12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, fontSize: '0.775rem', color: '#991b1b', lineHeight: 1.4 }}>
                <strong>Appraisal Disclaimer:</strong> {result.disclaimer}
              </div>
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
              <TrendingUp size={48} color="#cbd5e1" style={{ margin: '0 auto 16px' }} />
              <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#334155' }}>
                No Active Property Valuation
              </div>
              <p style={{ fontSize: '0.85rem', marginTop: 6, maxWidth: 360, margin: '8px auto 0' }}>
                Enter the property details, square footage, specifications, and locality to generate an indicative market valuation band.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

