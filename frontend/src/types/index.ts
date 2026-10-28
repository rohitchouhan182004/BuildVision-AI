export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ObservationStatus = 'Observed' | 'Likely' | 'Cannot determine';

export interface APIResponse<T> {
  success: boolean;
  data: T | null;
  error: { code: string; message: string; details?: any } | null;
  demo_mode?: boolean;
}

export interface ObservationBreakdown {
  observed: string[];
  likely: string[];
  cannot_determine: string[];
}

export interface HazardItem {
  type: string;
  severity: SeverityLevel;
  status: ObservationStatus;
  location_in_scene?: string;
  description: string;
  recommendation: string;
}

export interface SafetyAnalysisResult {
  overall_risk: SeverityLevel;
  risk_score: number;
  summary: string;
  hazards: HazardItem[];
  observation_breakdown: ObservationBreakdown;
  recommended_actions: string[];
  ppe_compliance_rate?: string;
  image_url?: string;
  timestamp?: string;
}

export interface ImageAnalysisResult {
  scene_description: string;
  detected_objects: string[];
  construction_stage: string;
  visible_materials: string[];
  equipment: string[];
  workers_count_est: string;
  potential_issues: string[];
  recommendations: string[];
  confidence: string;
  observation_breakdown: ObservationBreakdown;
  image_url?: string;
  timestamp?: string;
}

export interface CrackAnalysisResult {
  crack_detected: boolean;
  severity: string;
  type: string;
  location: string;
  estimated_width?: string;
  length_estimate?: string;
  possible_causes: string[];
  recommendation: string;
  inspection_required: boolean;
  urgency: string;
  disclaimer: string;
  image_url?: string;
  timestamp?: string;
}

export interface TaskItem {
  name: string;
  duration_days: number;
  dependencies: string[];
  workers_required: number;
  key_deliverable: string;
}

export interface PhaseItem {
  phase_number: number;
  phase_name: string;
  duration_days: number;
  tasks: TaskItem[];
  milestones: string[];
  critical_checks: string[];
}

export interface ProjectPlanResult {
  project_name: string;
  estimated_total_duration_days: number;
  phases: PhaseItem[];
  dependencies: string[];
  suggested_timeline: string;
  resource_requirements: string[];
  risk_factors: string[];
  milestones: string[];
  recommendations: string[];
  human_readable_summary: string;
}

export interface ValuationResult {
  estimated_value_min: number;
  estimated_value_max: number;
  estimated_value_median: number;
  currency: string;
  price_per_sqft_range: string;
  key_factors: string[];
  positive_factors: string[];
  negative_factors: string[];
  confidence: string;
  explanation: string;
  disclaimer: string;
}

export interface WeatherCurrent {
  temperature_c: number;
  condition: string;
  humidity_percent: number;
  wind_speed_kmh: number;
  precipitation_probability: number;
  uv_index: number;
}

export interface WeatherDayForecast {
  date: string;
  condition: string;
  temp_high: number;
  temp_low: number;
  rain_chance: number;
  wind_kmh: number;
}

export interface WeatherAdvisoryResult {
  location: string;
  weather_risk: string;
  risk_summary: string;
  current: WeatherCurrent;
  forecast: WeatherDayForecast[];
  concrete_work_advisory: string;
  crane_elevated_work_advisory: string;
  excavation_groundwork_advisory: string;
  worker_safety_advisory: string;
  actionable_recommendations: string[];
}

export interface KnowledgeResult {
  question: string;
  category: string;
  answer: string;
  key_points: string[];
  recommended_practice: string;
  safety_note: string;
  standard_references: string[];
  disclaimer: string;
}

export interface SiteAssistantResponse {
  session_id: string;
  reply: string;
  action_checklist: string[];
  safety_reminders: string[];
  suggested_followups: string[];
}

export interface ReportResult {
  id: string;
  title: string;
  project_name: string;
  created_at: string;
  executive_summary: string;
  overall_site_risk: string;
  safety_findings: Array<{ hazard: string; risk: string; action: string }>;
  structural_crack_findings: Array<{ element: string; severity: string; width: string; recommendation: string }>;
  planning_summary?: { current_phase: string; schedule_status: string; worker_capacity: string };
  weather_context?: { condition: string; risk_level: string; concrete_curing_impact: string };
  critical_action_items: string[];
  disclaimer: string;
}

export interface Project {
  id: string;
  name: string;
  project_type: string;
  location: string;
  budget?: string;
  status: string;
  start_date?: string;
  target_date?: string;
  worker_count: number;
  created_at: string;
}

export interface AnalysisRecord {
  id: string;
  project_id?: string;
  module_type: string;
  image_url?: string;
  input_summary: string;
  result_json: any;
  risk_level?: string;
  created_at: string;
}

