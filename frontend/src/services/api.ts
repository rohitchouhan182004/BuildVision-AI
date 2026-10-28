import { APIResponse } from '../types';

const API_BASE = '/api';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function fetchSystemStatus() {
  const res = await fetch(`${API_BASE}/system/status`);
  return res.json();
}

export async function fetchDashboardMetrics() {
  const res = await fetch(`${API_BASE}/dashboard/metrics`);
  return res.json();
}

export async function fetchProjects() {
  const res = await fetch(`${API_BASE}/projects`);
  return res.json();
}

export async function createProject(data: any) {
  const res = await fetch(`${API_BASE}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function fetchAnalyses(module?: string) {
  const url = module ? `${API_BASE}/analyses?module=${module}` : `${API_BASE}/analyses`;
  const res = await fetch(url);
  return res.json();
}

export async function analyzeSafety(formData: FormData) {
  const res = await fetch(`${API_BASE}/analyze/safety`, {
    method: 'POST',
    body: formData
  });
  return res.json();
}

export async function analyzeImage(formData: FormData) {
  const res = await fetch(`${API_BASE}/analyze/image`, {
    method: 'POST',
    body: formData
  });
  return res.json();
}

export async function analyzeCrack(formData: FormData) {
  const res = await fetch(`${API_BASE}/analyze/crack`, {
    method: 'POST',
    body: formData
  });
  return res.json();
}

export async function planProject(data: any) {
  const res = await fetch(`${API_BASE}/projects/plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function valueProperty(data: any) {
  const res = await fetch(`${API_BASE}/property/valuation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function sendAssistantMessage(sessionId: string, message: string, projectId?: string, projectContext?: string) {
  const res = await fetch(`${API_BASE}/assistant/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id: sessionId,
      message,
      project_id: projectId,
      project_context: projectContext
    })
  });
  return res.json();
}

export async function fetchAssistantHistory(sessionId: string) {
  const res = await fetch(`${API_BASE}/assistant/history/${sessionId}`);
  return res.json();
}

export async function fetchWeatherAdvisory(location: string) {
  const res = await fetch(`${API_BASE}/weather/advisory`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ location, days_ahead: 5 })
  });
  return res.json();
}

export async function askKnowledge(query: string, category: string = 'General') {
  const res = await fetch(`${API_BASE}/knowledge/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, category })
  });
  return res.json();
}

export async function generateReport(data: any) {
  const res = await fetch(`${API_BASE}/reports/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function fetchReports() {
  const res = await fetch(`${API_BASE}/reports`);
  return res.json();
}

