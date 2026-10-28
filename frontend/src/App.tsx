import React, { useState, useEffect } from 'react';
import { Sidebar, TabType } from './components/Sidebar';
import { Header } from './components/Header';
import { Project } from './types';
import { fetchProjects, fetchSystemStatus } from './services/api';

import { DashboardPage } from './pages/DashboardPage';
import { SafetyMonitoringPage } from './pages/SafetyMonitoringPage';
import { ImageAnalysisPage } from './pages/ImageAnalysisPage';
import { CrackAnalysisPage } from './pages/CrackAnalysisPage';
import { ProjectPlanningPage } from './pages/ProjectPlanningPage';
import { PropertyValuationPage } from './pages/PropertyValuationPage';
import { DailyAssistantPage } from './pages/DailyAssistantPage';
import { WeatherAdvisoryPage } from './pages/WeatherAdvisoryPage';
import { KnowledgePage } from './pages/KnowledgePage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 'proj-1',
      name: 'Residential Building - Indore',
      project_type: 'Residential Tower',
      location: 'Indore, MP',
      budget: '₹8.5 Cr',
      status: 'ACTIVE',
      worker_count: 45,
      created_at: new Date().toISOString()
    },
    {
      id: 'proj-2',
      name: 'Commercial Complex - Pune',
      project_type: 'Commercial IT Park',
      location: 'Hinjawadi, Pune',
      budget: '₹24.0 Cr',
      status: 'ACTIVE',
      worker_count: 90,
      created_at: new Date().toISOString()
    },
    {
      id: 'proj-3',
      name: 'Road Infrastructure Project - Bhopal',
      project_type: 'Highway & Flyover',
      location: 'Bhopal Bypass, MP',
      budget: '₹42.0 Cr',
      status: 'ACTIVE',
      worker_count: 120,
      created_at: new Date().toISOString()
    }
  ]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('proj-1');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [modelName, setModelName] = useState<string>('gemini-2.5-flash');

  useEffect(() => {
    loadProjectsAndStatus();
  }, []);

  const loadProjectsAndStatus = async () => {
    try {
      const [projRes, statusRes] = await Promise.all([
        fetchProjects(),
        fetchSystemStatus()
      ]);

      if (projRes.success && projRes.data && projRes.data.length > 0) {
        setProjects(projRes.data);
        if (!selectedProjectId) {
          setSelectedProjectId(projRes.data[0].id);
        }
      }

      if (statusRes.success && statusRes.data) {
        setIsDemoMode(statusRes.data.demo_mode);
        setModelName(statusRes.data.model || 'gemini-2.5-flash');
      }
    } catch (err) {
      console.warn('Backend not yet reachable on startup, using preset seed data:', err);
    }
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardPage onNavigate={setCurrentTab} selectedProjectId={selectedProjectId} />;
      case 'safety':
        return <SafetyMonitoringPage selectedProjectId={selectedProjectId} />;
      case 'image':
        return <ImageAnalysisPage selectedProjectId={selectedProjectId} />;
      case 'crack':
        return <CrackAnalysisPage selectedProjectId={selectedProjectId} />;
      case 'planning':
        return <ProjectPlanningPage />;
      case 'valuation':
        return <PropertyValuationPage />;
      case 'assistant':
        return <DailyAssistantPage selectedProjectId={selectedProjectId} />;
      case 'weather':
        return <WeatherAdvisoryPage />;
      case 'knowledge':
        return <KnowledgePage />;
      case 'reports':
        return <ReportsPage selectedProjectId={selectedProjectId} />;
      case 'settings':
        return (
          <SettingsPage
            isDemoMode={isDemoMode}
            modelName={modelName}
            onRefreshStatus={loadProjectsAndStatus}
            onProjectAdded={loadProjectsAndStatus}
          />
        );
      default:
        return <DashboardPage onNavigate={setCurrentTab} selectedProjectId={selectedProjectId} />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar currentTab={currentTab} onSelectTab={setCurrentTab} />
      <div className="main-content">
        <Header
          projects={projects}
          selectedProjectId={selectedProjectId}
          onSelectProject={setSelectedProjectId}
          isDemoMode={isDemoMode}
          modelName={modelName}
        />
        <main className="content-scrollable">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
