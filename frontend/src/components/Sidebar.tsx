import React from 'react';
import {
  LayoutDashboard,
  ShieldAlert,
  Camera,
  Activity,
  CalendarCheck,
  TrendingUp,
  MessageSquare,
  CloudSun,
  BookOpen,
  FileText,
  Settings,
  HardHat
} from 'lucide-react';

export type TabType =
  | 'dashboard'
  | 'safety'
  | 'image'
  | 'crack'
  | 'planning'
  | 'valuation'
  | 'assistant'
  | 'weather'
  | 'knowledge'
  | 'reports'
  | 'settings';

interface SidebarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const menuItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'safety', label: 'Site Safety', icon: <ShieldAlert size={18} /> },
    { id: 'image', label: 'Image Analysis', icon: <Camera size={18} /> },
    { id: 'crack', label: 'Crack Analysis', icon: <Activity size={18} /> },
    { id: 'planning', label: 'Project Planning', icon: <CalendarCheck size={18} /> },
    { id: 'valuation', label: 'Property Valuation', icon: <TrendingUp size={18} /> },
    { id: 'assistant', label: 'Daily Site Assistant', icon: <MessageSquare size={18} /> },
    { id: 'weather', label: 'Weather Advisory', icon: <CloudSun size={18} /> },
    { id: 'knowledge', label: 'Knowledge Base', icon: <BookOpen size={18} /> },
    { id: 'reports', label: 'Audit Reports', icon: <FileText size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div style={{ padding: '20px 16px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <HardHat size={22} color="#ffffff" />
        </div>
        <div>
          <div style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '0.3px', color: '#ffffff' }}>
            BuildVision AI
          </div>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Construction Intelligence</div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`nav-item ${currentTab === item.id ? 'active' : ''}`}
            onClick={() => onSelectTab(item.id)}
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      {/* Footer Info */}
      <div style={{ padding: '16px', borderTop: '1px solid #1e293b', fontSize: '0.725rem', color: '#64748b' }}>
        <div>Multimodal AI v1.0</div>
        <div>Civil & Structural Decision Support</div>
      </div>
    </aside>
  );
};

