
// import { toast } from 'sonner';
// import {
//   AuthResponse,
//   LoginRequest,
//   RegisterRequest,
//   UserProfile,
//   DashboardMetrics,
//   SafetyStats,
//   GenderDistribution,
//   Camera,
//   Alert,
//   PaginatedAlerts,
//   HeatmapData,
//   PoliceStation,
//   SystemInfo,
//   HardwareStatus
// } from '@/types/api';

// const BASE_URL = 'http://localhost:8000/api';

// // Mock user data for testing
// const MOCK_USERS = [
//   {
//     id: "mock-user-1",
//     username: "admin",
//     password: "password",
//     email: "admin@empowerher.com",
//     full_name: "Admin User",
//     is_active: true,
//     created_at: new Date().toISOString()
//   },
//   {
//     id: "mock-user-2",
//     username: "demo",
//     password: "demo123",
//     email: "demo@empowerher.com",
//     full_name: "Demo User",
//     is_active: true,
//     created_at: new Date().toISOString()
//   }
// ];

// // Helper to get stored token
// export const getToken = (): string | null => {
//   return localStorage.getItem('empowerher_token');
// };

// // Helper to handle API errors
// const handleApiError = (error): never => {
//   console.error('API Error:', error);
//   const message = error.response?.data?.detail || error.message || 'An unexpected error occurred';
//   toast.error(message);
//   throw error;
// };

// // Create fetch wrapper with authentication
// const fetchWithAuth = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
//   const token = getToken();
  
//   const headers: HeadersInit = {
//     'Content-Type': 'application/json',
//     ...options.headers,
//   };

//   if (token) {
//     headers['Authorization'] = `Bearer ${token}`;
//   }
  
//   try {
//     // Check if we're in mock mode
//     if (import.meta.env.NODE_ENV === 'development' ) {
//       // Simulate fetching user profile when the endpoint is '/auth/me'
//       if (endpoint === '/auth/me') {
//         const token = getToken();
//         if (token) {
//           const [userId] = token.split('|');
//           const mockUser = MOCK_USERS.find(user => user.id === userId);
//           if (mockUser) {
//             const { password, ...userProfile } = mockUser;
//             return userProfile as UserProfile;
//           }
//         }
//       }

//       // For other endpoints in development, you can add more mock responses here
//     }
    
//     const response = await fetch(`${BASE_URL}${endpoint}`, {
//       ...options,
//       headers,
//     });
    
//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}));
//       throw { response: { status: response.status, data: errorData } };
//     }
    
//     // For endpoints that don't return JSON (like delete operations)
//     if (response.status === 204) {
//       return null;
//     }
    
//     return response.json();
//   } catch (error) {
//     return handleApiError(error);
//   }
// };

// // Authentication API
// export const authApi = {
//   login: async (credentials: LoginRequest): Promise<AuthResponse> => {
//     // Check if we're in mock mode
//     if (import.meta.env.NODE_ENV === 'development' ) {
//       console.log('Using mock login');
//       // Check against our mock users
//       const user = MOCK_USERS.find(
//         u => u.username === credentials.username && u.password === credentials.password
//       );
      
//       if (user) {
//         // Create a mock token with the user's ID
//         const mockToken = `${user.id}|${Math.random().toString(36).substring(2)}`;
//         // Add a small delay to simulate network request
//         await new Promise(resolve => setTimeout(resolve, 500));
        
//         return {
//           access_token: mockToken,
//           token_type: 'bearer'
//         };
//       } else {
//         // Simulate failed login
//         await new Promise(resolve => setTimeout(resolve, 500));
//         throw { response: { status: 401, data: { detail: 'Invalid credentials' } } };
//       }
//     }
    
//     // Original implementation for production
//     const formData = new URLSearchParams();
//     formData.append('username', credentials.username);
//     formData.append('password', credentials.password);
    
//     try {
//       const response = await fetch(`${BASE_URL}/auth/login`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: formData,
//       });
      
//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw { response: { status: response.status, data: errorData } };
//       }
      
//       return response.json();
//     } catch (error) {
//       return handleApiError(error);
//     }
//   },
  
//   register: async (userData: RegisterRequest): Promise<UserProfile> => {
//     // Check if we're in mock mode
//     if (import.meta.env.NODE_ENV === 'development' ) {
//       console.log('Using mock register');
      
//       // Check if username already exists
//       if (MOCK_USERS.some(u => u.username === userData.username)) {
//         throw { response: { status: 400, data: { detail: 'Username already exists' } } };
//       }
      
//       // Create a new mock user
//       const newUser = {
//         id: `mock-user-${MOCK_USERS.length + 1}`,
//         username: userData.username,
//         password: userData.password,
//         email: userData.email,
//         full_name: userData.full_name,
//         is_active: true,
//         created_at: new Date().toISOString()
//       };
      
//       // In a real implementation, you would add this user to your database
//       // For mock purposes, we're not actually modifying the MOCK_USERS array
      
//       // Add a small delay to simulate network request
//       await new Promise(resolve => setTimeout(resolve, 800));
      
//       const { password, ...userProfile } = newUser;
//       return userProfile as UserProfile;
//     }
    
//     return fetchWithAuth('/auth/register', {
//       method: 'POST',
//       body: JSON.stringify(userData),
//     });
//   },
  
//   getCurrentUser: async (): Promise<UserProfile> => {
//     return fetchWithAuth('/auth/me');
//   },
  
//   checkToken: async (): Promise<boolean> => {
//     // In mock mode, just check if a token exists in localStorage
//     if (import.meta.env.NODE_ENV === 'development') {
//       const token = getToken();
//       if (!token) return false;
      
//       // Validate token format (our mock tokens are in the format 'user-id|random-string')
//       const parts = token.split('|');
//       if (parts.length !== 2) return false;
      
//       // Check if the user ID exists
//       const userId = parts[0];
//       return MOCK_USERS.some(user => user.id === userId);
//     }
    
//     try {
//       await fetchWithAuth('/auth/check-token', { method: 'POST' });
//       return true;
//     } catch (error) {
//       return false;
//     }
//   },
// };

// // Dashboard API
// export const dashboardApi = {
//   getMetrics: async (): Promise<DashboardMetrics> => {
//     return fetchWithAuth('/dashboard/metrics');
//   },
  
//   getSafetyStats: async (): Promise<SafetyStats> => {
//     return fetchWithAuth('/dashboard/safety-stats');
//   },
  
//   getGenderDistribution: async (): Promise<GenderDistribution> => {
//     return fetchWithAuth('/dashboard/gender-distribution');
//   },
// };

// // Cameras API
// export const camerasApi = {
//   getAllCameras: async (): Promise<Camera[]> => {
//     return fetchWithAuth('/cameras');
//   },
  
//   getCamera: async (cameraId: string): Promise<Camera> => {
//     return fetchWithAuth(`/cameras/${cameraId}`);
//   },
  
//   createCamera: async (cameraData: Omit<Camera, 'id' | 'last_activity'>): Promise<Camera> => {
//     return fetchWithAuth('/cameras', {
//       method: 'POST',
//       body: JSON.stringify(cameraData),
//     });
//   },
  
//   updateCamera: async (cameraId: string, cameraData: Partial<Camera>): Promise<Camera> => {
//     return fetchWithAuth(`/cameras/${cameraId}`, {
//       method: 'PUT',
//       body: JSON.stringify(cameraData),
//     });
//   },
  
//   deleteCamera: async (cameraId: string): Promise<void> => {
//     return fetchWithAuth(`/cameras/${cameraId}`, {
//       method: 'DELETE',
//     });
//   },
  
//   testConnection: async (rtspUrl: string): Promise<{ success: boolean; message: string }> => {
//     return fetchWithAuth('/cameras/test-connection', {
//       method: 'POST',
//       body: JSON.stringify({ rtsp_url: rtspUrl }),
//     });
//   },
  
//   getSnapshot: (cameraId: string): string => {
//     return `${BASE_URL}/streams/snapshot/${cameraId}?token=${getToken()}`;
//   },
  
//   startStream: async (cameraId: string, rtspUrl: string): Promise<void> => {
//     return fetchWithAuth('/streams/start', {
//       method: 'POST',
//       body: JSON.stringify({
//         camera_id: cameraId,
//         rtsp_url: rtspUrl,
//         enable_detection: true,
//       }),
//     });
//   },
  
//   stopStream: async (cameraId: string): Promise<void> => {
//     return fetchWithAuth('/streams/stop', {
//       method: 'POST',
//       body: JSON.stringify({ camera_id: cameraId }),
//     });
//   },
// };

// // Alerts API
// export const alertsApi = {
//   getAlerts: async (page: number = 1, limit: number = 10): Promise<PaginatedAlerts> => {
//     return fetchWithAuth(`/alerts?page=${page}&limit=${limit}`);
//   },
  
//   getRecentAlerts: async (limit: number = 5): Promise<Alert[]> => {
//     return fetchWithAuth(`/alerts/recent?limit=${limit}`);
//   },
  
//   getAlertStats: async (): Promise<{ [key: string]: number }> => {
//     return fetchWithAuth('/alerts/stats');
//   },
// };

// // Safety Map API
// export const safetyMapApi = {
//   getHotspots: async (): Promise<HeatmapData> => {
//     return fetchWithAuth('/safety-map/hotspots');
//   },
  
//   getCameraLocations: async (): Promise<Camera[]> => {
//     return fetchWithAuth('/safety-map/locations');
//   },
  
//   getPoliceStations: async (): Promise<PoliceStation[]> => {
//     return fetchWithAuth('/safety-map/police-stations');
//   },
// };

// // System API
// export const systemApi = {
//   getSystemInfo: async (): Promise<SystemInfo> => {
//     return fetchWithAuth('/system/info');
//   },
  
//   getHardwareStatus: async (): Promise<HardwareStatus> => {
//     return fetchWithAuth('/system/hardware');
//   },
  
//   healthCheck: async (): Promise<{ status: string }> => {
//     return fetchWithAuth('/health');
//   },
// };


//  ================================= Demon Change v1 ===========================

import { toast } from 'sonner';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UserProfile,
  DashboardMetrics,
  SafetyStats,
  GenderDistribution,
  Camera,
  Alert,
  PaginatedAlerts,
  HeatmapData,
  PoliceStation,
  SystemInfo,
  HardwareStatus
} from '@/types/api';

const BASE_URL = 'http://localhost:8000/api';

// Helper to get stored token
export const getToken = (): string | null => {
  return localStorage.getItem('empowerher_token');
};

// Helper to handle API errors
const handleApiError = (error: any): never => {
  console.error('API Error:', error);
  
  // Handle different error formats
  let message = 'An unexpected error occurred';
  
  if (error.response?.data?.detail) {
    message = error.response.data.detail;
  } else if (error.detail) {
    message = error.detail;
  } else if (error.message) {
    message = error.message;
  }
  
  toast.error(message);
  throw error;
};

// Create fetch wrapper with authentication
// const fetchWithAuth = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
//   const token = getToken();
  
//   const headers: HeadersInit = {
//     'Content-Type': 'application/json',
//     ...options.headers,
//   };

//   if (token) {
//     headers['Authorization'] = `Bearer ${token}`;
//   }
  
//   try {
//     const response = await fetch(`${BASE_URL}${endpoint}`, {
//       ...options,
//       headers,
//     });
    
//     if (!response.ok) {
//       let errorData;
//       try {
//         errorData = await response.json();
//       } catch {
//         errorData = { detail: `HTTP ${response.status}: ${response.statusText}` };
//       }
      
//       // If it's a 401, the token might be invalid
//       if (response.status === 401) {
//         localStorage.removeItem('empowerher_token');
//         window.location.href = '/login';
//       }
      
//       throw { response: { status: response.status, data: errorData } };
//     }
    
//     // For endpoints that don't return JSON (like delete operations)
//     if (response.status === 204) {
//       return null;
//     }
    
//     const data = await response.json();
//     console.log('API Response:', data);
//     return data;
//   } catch (error) {
//     return handleApiError(error);
//   }
// };
// =========================new check in fetch auth v1 ====================
// Improved fetchWithAuth function with better error handling
const fetchWithAuth = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    console.log(`Making API request to: ${BASE_URL}${endpoint}`);
    
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
    
    console.log(`API Response Status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      let errorData;
      const contentType = response.headers.get('content-type');
      
      try {
        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json();
        } else {
          // Handle non-JSON error responses
          const text = await response.text();
          errorData = { 
            detail: text || `HTTP ${response.status}: ${response.statusText}`,
            status: response.status,
            statusText: response.statusText
          };
        }
      } catch (parseError) {
        console.error('Failed to parse error response:', parseError);
        errorData = { 
          detail: `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
          statusText: response.statusText
        };
      }
      
      console.error('API Error Response:', errorData);
      
      // Handle specific status codes
      if (response.status === 401) {
        console.warn('Authentication failed, clearing token and redirecting to login');
        localStorage.removeItem('empowerher_token');
        
        // Only redirect if we're not already on the login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      } else if (response.status === 403) {
        toast.error('You do not have permission to perform this action.');
      } else if (response.status === 500) {
        console.error('Server error detected:', errorData);
        // Don't show the raw database error to users
        if (errorData.detail && errorData.detail.includes('Database objects do not implement truth value testing')) {
          toast.error('Server configuration error. Please contact support.');
        }
      }
      
      throw { 
        response: { 
          status: response.status, 
          data: errorData,
          statusText: response.statusText
        } 
      };
    }
    
    // Handle different response types
    if (response.status === 204) {
      return null; // No content
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log('API Success Response:', data);
      return data;
    } else {
      // Handle non-JSON responses (like text or blob)
      return await response.text();
    }
    
  } catch (error) {
    // Network errors or other fetch errors
    if (!error.response) {
      console.error('Network error or fetch failed:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        toast.error('Unable to connect to server. Please check your internet connection.');
      } else {
        toast.error('Network error occurred. Please try again.');
      }
      
      throw {
        response: {
          status: 0,
          data: { detail: 'Network error' }
        }
      };
    }
    
    // Re-throw API errors
    throw error;
  }
};
// Authentication API
export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    // Create form data as expected by FastAPI OAuth2PasswordRequestForm
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { detail: `HTTP ${response.status}: ${response.statusText}` };
        }
        throw { response: { status: response.status, data: errorData } };
      }
      
      const data = await response.json();
      
      // The backend now returns both token and user info
      return {
        access_token: data.access_token,
        token_type: data.token_type,
        user: data.user // User info is now included in login response
      };
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  register: async (userData: RegisterRequest): Promise<{ message: string; user_id: string; username: string }> => {
    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { detail: `HTTP ${response.status}: ${response.statusText}` };
        }
        throw { response: { status: response.status, data: errorData } };
      }
      
      return response.json();
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  getCurrentUser: async (): Promise<UserProfile> => {
    return fetchWithAuth('/auth/me');
  },
  
  verifyToken: async (): Promise<{ valid: boolean; user?: UserProfile }> => {
    return fetchWithAuth('/auth/verify-token', { method: 'POST' });
  },
  
  logout: async (): Promise<{ message: string }> => {
    return fetchWithAuth('/auth/logout', { method: 'POST' });
  },
};

// Dashboard API
export const dashboardApi = {
  getMetrics: async (): Promise<DashboardMetrics> => {
    const response = await fetchWithAuth('/dashboard/metrics');
    console.log('Raw metrics response:', response);
    
    // Check if response has nested data
    if (response.data) {
      console.log('Unwrapped metrics data:', response.data);
      return response.data;
    }
    
    // If no nested data, return response directly
    console.log('Direct metrics data:', response);
    return response;
  },
  
  getSafetyStats: async (): Promise<SafetyStats> => {
    const response = await fetchWithAuth('/dashboard/safety-stats');
    return response.data || response;
  },
  
  getGenderDistribution: async (): Promise<GenderDistribution> => {
    const response = await fetchWithAuth('/dashboard/gender-distribution');
    return response.data || response;
  },
};

// Cameras API
// export const camerasApi = {
//   getAllCameras: async (): Promise<Camera[]> => {
//     const response = await fetchWithAuth('/cameras');
//     return response.data || response;
//   },
  
//   getCamera: async (cameraId: string): Promise<Camera> => {
//     const response = await fetchWithAuth(`/cameras/${cameraId}`);
//     return response.data || response;
//   },
  
//   createCamera: async (cameraData: Omit<Camera, 'id' | 'last_activity'>): Promise<Camera> => {
//     const response = await fetchWithAuth('/cameras', {
//       method: 'POST',
//       body: JSON.stringify(cameraData),
//     });
//     return response.data || response;
//   },
  
//   updateCamera: async (cameraId: string, cameraData: Partial<Camera>): Promise<Camera> => {
//     const response = await fetchWithAuth(`/cameras/${cameraId}`, {
//       method: 'PUT',
//       body: JSON.stringify(cameraData),
//     });
//     return response.data || response;
//   },
  
//   deleteCamera: async (cameraId: string): Promise<void> => {
//     return fetchWithAuth(`/cameras/${cameraId}`, {
//       method: 'DELETE',
//     });
//   },
  
//   testConnection: async (rtspUrl: string): Promise<{ success: boolean; message: string }> => {
//     const response = await fetchWithAuth('/cameras/test-connection', {
//       method: 'POST',
//       body: JSON.stringify({ rtsp_url: rtspUrl }),
//     });
//     return response.data || response;
//   },
  
//   getSnapshot: (cameraId: string): string => {
//     const token = getToken();
//     return `${BASE_URL}/streams/snapshot/${cameraId}${token ? `?token=${token}` : ''}`;
//   },
  
//   startStream: async (cameraId: string, rtspUrl: string): Promise<void> => {
//     return fetchWithAuth('/streams/start', {
//       method: 'POST',
//       body: JSON.stringify({
//         camera_id: cameraId,
//         rtsp_url: rtspUrl,
//         enable_detection: true,
//       }),
//     });
//   },
  
//   stopStream: async (cameraId: string): Promise<void> => {
//     return fetchWithAuth('/streams/stop', {
//       method: 'POST',
//       body: JSON.stringify({ camera_id: cameraId }),
//     });
//   },
// };
// ===============================check v1 ====================
// 3. UPDATE: src/lib/api.ts - Fix camera creation
export const camerasApi = {
  getAllCameras: async (): Promise<Camera[]> => {
    try {
      const response = await fetchWithAuth('/cameras');
      
      // Handle different response formats
      if (Array.isArray(response)) {
        return response;
      }
      
      if (response?.data && Array.isArray(response.data)) {
        return response.data;
      }
      
      if (response?.cameras && Array.isArray(response.cameras)) {
        return response.cameras;
      }
      
      console.warn('No cameras data found in response:', response);
      return [];
      
    } catch (error) {
      console.error('Failed to fetch cameras:', error);
      return [];
    }
  },
  
  createCamera: async (cameraData: any): Promise<Camera | null> => {
    try {
      // Ensure unique camera_id by adding timestamp
      if (!cameraData.camera_id) {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        cameraData.camera_id = `cam_${timestamp}_${random}`;
      }

      console.log('Sending camera data:', cameraData);
      
      const response = await fetchWithAuth('/cameras', {
        method: 'POST',
        body: JSON.stringify(cameraData),
      });
      
      const camera = response?.camera || response?.data || response;
      toast.success('Camera created successfully!');
      return camera;
      
    } catch (error) {
      console.error('Failed to create camera:', error);
      
      // Handle specific errors
      if (error?.response?.status === 400) {
        const detail = error?.response?.data?.detail;
        if (detail === 'Camera ID already exists') {
          // Retry with new ID
          const timestamp = Date.now();
          const random = Math.random().toString(36).substring(2, 15);
          cameraData.camera_id = `cam_${timestamp}_${random}`;
          
          try {
            const retryResponse = await fetchWithAuth('/cameras', {
              method: 'POST',
              body: JSON.stringify(cameraData),
            });
            
            const camera = retryResponse?.camera || retryResponse?.data || retryResponse;
            toast.success('Camera created successfully!');
            return camera;
          } catch (retryError) {
            toast.error('Failed to create camera after retry.');
            return null;
          }
        } else {
          toast.error('Invalid camera data. Please check your inputs.');
        }
      } else if (error?.response?.status === 500) {
        toast.error('Server error: Unable to create camera.');
      } else {
        toast.error('Failed to create camera. Please try again.');
      }
      
      return null;
    }
  },

  testConnection: async (rtspUrl: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetchWithAuth('/streams/test-connection', {
        method: 'POST',
        body: JSON.stringify({ rtsp_url: rtspUrl }),
      });
      
      const result = response?.data || response;
      
      if (result?.success) {
        toast.success('Camera connection test successful!');
      } else {
        toast.warning(result?.message || 'Camera connection test failed.');
      }
      
      return result;
      
    } catch (error) {
      console.error('Camera connection test failed:', error);
      
      const errorMessage = 'Failed to test camera connection.';
      toast.error(errorMessage);
      
      return {
        success: false,
        message: errorMessage
      };
    }
  },

  // Other methods remain the same...
};

// Alerts API
export const alertsApi = {
  getAlerts: async (page: number = 1, limit: number = 10): Promise<PaginatedAlerts> => {
    const response = await fetchWithAuth(`/alerts?page=${page}&limit=${limit}`);
    return response.data || response;
  },
  
  getRecentAlerts: async (limit: number = 5): Promise<Alert[]> => {
    const response = await fetchWithAuth(`/alerts/recent?limit=${limit}`);
    return response.data || response;
  },
  
  getAlertStats: async (): Promise<{ [key: string]: number }> => {
    const response = await fetchWithAuth('/alerts/stats');
    return response.data || response;
  },
};

// Safety Map API
export const safetyMapApi = {
  getHotspots: async (): Promise<HeatmapData> => {
    const response = await fetchWithAuth('/safety-map/hotspots');
    return response.data || response;
  },
  
  getCameraLocations: async (): Promise<Camera[]> => {
    const response = await fetchWithAuth('/safety-map/locations');
    return response.data || response;
  },
  
  getPoliceStations: async (): Promise<PoliceStation[]> => {
    const response = await fetchWithAuth('/safety-map/police-stations');
    return response.data || response;
  },
};

// System API
export const systemApi = {
  getSystemInfo: async (): Promise<SystemInfo> => {
    const response = await fetchWithAuth('/system/info');
    return response.data || response;
  },
  
  getHardwareStatus: async (): Promise<HardwareStatus> => {
    const response = await fetchWithAuth('/system/hardware');
    return response.data || response;
  },
  
  healthCheck: async (): Promise<{ status: string }> => {
    const response = await fetchWithAuth('/health');
    return response.data || response;
  },
};