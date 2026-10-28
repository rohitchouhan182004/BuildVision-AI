import React, { useState, useEffect } from 'react';
import { CloudSun, Wind, Droplets, Thermometer, ShieldAlert, CheckCircle, Search, Compass, AlertTriangle } from 'lucide-react';
import { WeatherAdvisoryResult } from '../types';
import { fetchWeatherAdvisory } from '../services/api';
import { RiskBadge } from '../components/RiskBadge';

export const WeatherAdvisoryPage: React.FC = () => {
  const [location, setLocation] = useState('Indore, MP');
  const [loading, setLoading] = useState(false);
  const [advisory, setAdvisory] = useState<WeatherAdvisoryResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const locationsList = ['Indore, MP', 'Pune, Maharashtra', 'Bhopal, MP', 'Mumbai, Maharashtra', 'Delhi NCR'];

  useEffect(() => {
    loadAdvisory(location);
  }, []);

  const loadAdvisory = async (loc: string) => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await fetchWeatherAdvisory(loc);
      if (res.success && res.data) {
        setAdvisory(res.data);
      } else {
        setErrorMsg(res.error?.message || 'Could not load weather advisory.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error fetching weather.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim()) {
      loadAdvisory(location.trim());
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 className="page-title">Module 7: Weather-Aware Construction Advisory</h1>
        <p className="page-subtitle">
          Climatic risk modeling for concrete hydration, tower crane wind limits, trench stability, and heat stress.
        </p>
      </div>

      {/* Search / Preset Selector */}
      <div className="card" style={{ padding: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, flex: 1, minWidth: 280 }}>
            <input
              type="text"
              className="form-input"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter construction project city..."
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Search size={16} /> Update
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Quick Sites:</span>
            {locationsList.map((loc) => (
              <button
                key={loc}
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setLocation(loc);
                  loadAdvisory(loc);
                }}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>
      </div>

      {errorMsg && (
        <div style={{ padding: '12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, color: '#dc2626', fontSize: '0.85rem', marginBottom: 16 }}>
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
          <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Consulting meteorological models...</div>
        </div>
      ) : advisory ? (
        <div>
          {/* Current Conditions & Overall Risk */}
          <div className="card" style={{ borderLeft: advisory.weather_risk === 'HIGH' ? '4px solid #dc2626' : '4px solid #d97706' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Active Weather Risk</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: 2 }}>
                  Site: {advisory.location}
                </div>
              </div>
              <RiskBadge level={advisory.weather_risk} />
            </div>

            {/* Current Metrics Strip */}
            <div className="grid-4" style={{ marginBottom: 16 }}>
              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: 6, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 10 }}>
                <Thermometer size={24} color="#ea580c" />
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{advisory.current.temperature_c}°C</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{advisory.current.condition}</div>
                </div>
              </div>

              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: 6, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 10 }}>
                <Wind size={24} color="#0284c7" />
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{advisory.current.wind_speed_kmh} km/h</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Wind Velocity</div>
                </div>
              </div>

              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: 6, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 10 }}>
                <Droplets size={24} color="#3b82f6" />
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{advisory.current.humidity_percent}%</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Relative Humidity</div>
                </div>
              </div>

              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: 6, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 10 }}>
                <CloudSun size={24} color="#f59e0b" />
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{advisory.current.precipitation_probability}%</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Rain Probability</div>
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.9rem', color: '#1e293b', lineHeight: 1.5 }}>
              <strong>Risk Summary:</strong> {advisory.risk_summary}
            </div>
          </div>

          {/* Construction Operational Work Package Advisories */}
          <div className="grid-2">
            <div className="card">
              <div className="card-title">
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1e40af' }}>
                  <Droplets size={18} /> Concrete Work & Curing Advisory
                </span>
              </div>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#334155' }}>
                {advisory.concrete_work_advisory}
              </p>
            </div>

            <div className="card">
              <div className="card-title">
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#d97706' }}>
                  <Wind size={18} /> Tower Crane & Elevated Work
                </span>
              </div>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#334155' }}>
                {advisory.crane_elevated_work_advisory}
              </p>
            </div>

            <div className="card">
              <div className="card-title">
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#78350f' }}>
                  <Compass size={18} /> Deep Excavation & Trenching
                </span>
              </div>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#334155' }}>
                {advisory.excavation_groundwork_advisory}
              </p>
            </div>

            <div className="card">
              <div className="card-title">
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#b91c1c' }}>
                  <ShieldAlert size={18} /> Crew Thermal Safety & Hydration
                </span>
              </div>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#334155' }}>
                {advisory.worker_safety_advisory}
              </p>
            </div>
          </div>

          {/* 5-Day Lookahead Forecast */}
          <div className="card">
            <div className="card-title">
              <span>5-Day Construction Planning Lookahead</span>
            </div>
            <div className="grid-5" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
              {advisory.forecast.map((d, i) => (
                <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 12, textAlign: 'center', background: '#f8fafc' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0f172a' }}>{d.date}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', margin: '4px 0' }}>{d.condition}</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ea580c' }}>
                    {d.temp_high}° / <span style={{ color: '#0284c7' }}>{d.temp_low}°</span>
                  </div>
                  <div style={{ fontSize: '0.725rem', color: '#475569', marginTop: 4 }}>
                    Rain: {d.rain_chance}% | Wind: {d.wind_kmh}k
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Recommendations */}
          <div className="card">
            <div className="card-title">
              <span>Mandatory Weather Precaution Checkpoints</span>
            </div>
            <ul style={{ listStyleType: 'none', fontSize: '0.875rem' }}>
              {advisory.actionable_recommendations.map((rec, i) => (
                <li key={i} style={{ padding: '8px 0', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ color: '#16a34a', fontWeight: 700 }}>✔</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
};

