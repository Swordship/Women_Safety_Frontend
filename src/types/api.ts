
// Authentication types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  full_name: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user?: UserProfile; 
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  full_name: string;
  is_active: boolean;
  created_at: string;
}

// Dashboard types
export interface DashboardMetrics {
  totalCameras?: number
  womenMonitored: number;
  menDetected: number;
  alertsToday: number;
  hotspotAreas: number;
  dbStatus: string;
}

export interface SafetyStats {
  loneWomen: number;
  surrounded: number;
  sosGestures: number;
  safeInteractions: number;
  totalWomen: number;
}

export interface GenderDistribution {
  women: number;
  men: number;
  total: number;
}

// Camera types
export interface GeoLocation {
  lat: number;
  lng: number;
}

export interface Camera {
  id: string;
  camera_id: string;
  name: string;
  location: GeoLocation;
  address: string;
  rtsp_url: string;
  status: 'online' | 'offline' | 'alert';
  last_activity: string;
}

// Alert types
export enum AlertType {
  SOS = "sos",
  SURROUNDED = "surrounded",
  ISOLATED = "isolated"
}

export enum AlertPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high"
}

export enum AlertStatus {
  NEW = "new",
  ACKNOWLEDGED = "acknowledged",
  RESOLVED = "resolved",
  FALSE_POSITIVE = "false_positive"
}

export interface Alert {
  id: string;
  camera_id: string;
  camera_name: string;
  type: 'threat_detected' | 'suspicious_activity' | 'emergency' | 'system_alert';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: string;
  location: string | { lat: number; lng: number; address?: string }; 
  status: 'active' | 'acknowledged' | 'resolved';
  confidence_score?: number;
  image_url?: string;
  video_url?: string;
}

export interface PaginatedAlerts {
  alerts: Alert[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Safety map types
export interface HeatmapPoint {
  lat: number;
  lng: number;
  value: number;
}

export interface HeatmapData {
  max: number;
  data: HeatmapPoint[];
}

export interface PoliceStation {
  id: string;
  name: string;
  location: GeoLocation;
  phone: string;
}

// System info types
export interface SystemInfo {
  version: string;
  uptime: string;
  started_at: string;
}

export interface HardwareStatus {
  cpu_usage: number;
  memory_usage: number;
  gpu_usage: number;
  disk_space: number;
}
