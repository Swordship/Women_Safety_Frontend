
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { authApi } from '@/lib/api';
// import { UserProfile, LoginRequest, RegisterRequest } from '@/types/api';
// import { toast } from 'sonner';

// interface AuthContextType {
//   user: UserProfile | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   login: (data: LoginRequest) => Promise<void>;
//   register: (data: RegisterRequest) => Promise<void>;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<UserProfile | null>(null);
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkAuth = async () => {
//       setIsLoading(true);
//       try {
//         const token = localStorage.getItem('empowerher_token');
//         if (!token) {
//           setIsLoading(false);
//           return;
//         }

//         const isValid = await authApi.checkToken();
//         if (isValid) {
//           const userData = await authApi.getCurrentUser();
//           setUser(userData);
//           setIsAuthenticated(true);
//         } else {
//           // Token is invalid
//           localStorage.removeItem('empowerher_token');
//         }
//       } catch (error) {
//         console.error('Auth check failed:', error);
//         localStorage.removeItem('empowerher_token');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     checkAuth();
//   }, []);

//   const login = async (credentials: LoginRequest) => {
//     setIsLoading(true);
//     try {
//       const response = await authApi.login(credentials);
//       localStorage.setItem('empowerher_token', response.access_token);

//       console.log(response.access_token)
      
//       // Get user profile after successful login
//       const userData = await authApi.getCurrentUser();
//       setUser(userData);
//       setIsAuthenticated(true);
      
//       toast.success("Login successful!");
//       navigate('/dashboard');
//     } catch (error) {
//       console.error('Login failed:', error);
//       toast.error("Login failed. Please check your credentials.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const register = async (userData: RegisterRequest) => {
//     setIsLoading(true);
//     try {
//       await authApi.register(userData);
//       toast.success("Registration successful! Please login.");
//       navigate('/login');
//     } catch (error) {
//       console.error('Registration failed:', error);
//       toast.error("Registration failed. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('empowerher_token');
//     setUser(null);
//     setIsAuthenticated(false);
//     navigate('/login');
//     toast.info("You have been logged out");
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         isAuthenticated,
//         isLoading,
//         login,
//         register,
//         logout
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };


//  ================================= Demon Change v1 ===========================

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/lib/api';
import { UserProfile, LoginRequest, RegisterRequest } from '@/types/api';
import { toast } from 'sonner';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('empowerher_token');
        if (!token) {
          setIsLoading(false);
          return;
        }

        // Use the new verify-token endpoint
        const response = await authApi.verifyToken();
        if (response.valid && response.user) {
          setUser(response.user);
          setIsAuthenticated(true);
        } else {
          // Token is invalid
          localStorage.removeItem('empowerher_token');
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('empowerher_token');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(credentials);
      
      // Store the token
      localStorage.setItem('empowerher_token', response.access_token);

      // The login response now includes user info directly
      if (response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        toast.success(`Welcome back, ${response.user.full_name || response.user.username}!`);
        navigate('/dashboard');
      } else {
        // Fallback: get user profile separately if not included in response
        const userData = await authApi.getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
        toast.success(`Welcome back, ${userData.full_name || userData.username}!`);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
      
      // More specific error messages
      let errorMessage = "Login failed. Please check your credentials.";
      if (error.response?.status === 401) {
        errorMessage = "Invalid username/email or password.";
      } else if (error.response?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest) => {
    setIsLoading(true);
    try {
      const response = await authApi.register(userData);
      toast.success("Registration successful! Please login with your new account.");
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
      
      // More specific error messages
      let errorMessage = "Registration failed. Please try again.";
      if (error.response?.status === 400) {
        if (error.response?.data?.detail?.includes('already registered')) {
          errorMessage = "Username or email already exists.";
        } else if (error.response?.data?.detail?.includes('Password must')) {
          errorMessage = error.response.data.detail;
        } else {
          errorMessage = error.response?.data?.detail || "Invalid registration data.";
        }
      } else if (error.response?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call the logout endpoint to invalidate the token on the server side (if implemented)
      await authApi.logout();
    } catch (error) {
      // Even if the server logout fails, we should still clear the local state
      console.error('Server logout failed:', error);
    } finally {
      // Clear local storage and state
      localStorage.removeItem('empowerher_token');
      setUser(null);
      setIsAuthenticated(false);
      navigate('/login');
      toast.info("You have been logged out successfully");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};