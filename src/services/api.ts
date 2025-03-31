import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

declare module 'vite' {
  interface ImportMetaEnv {
    VITE_API_URL: string;
  }
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Types
interface StartSessionResponse {
  user_id: string;
}

interface ChatRequest {
  user_id: string;
  message: string;
}

interface ChatResponse {
  response: string;
}

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // Here you can implement token refresh logic if needed
      // For now, we'll just clear the token and redirect to login
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// API endpoints
export const matchPriveAPI = {
  // Start a new session
  startSession: async (): Promise<StartSessionResponse> => {
    const response: AxiosResponse<StartSessionResponse> = await api.post('/start/');
    // Store user_id in localStorage for subsequent requests
    localStorage.setItem('user_id', response.data.user_id);
    return response.data;
  },

  // Send a chat message and get GPT response
  sendMessage: async (message: string): Promise<ChatResponse> => {
    const user_id = localStorage.getItem('user_id');
    if (!user_id) {
      throw new Error('No user_id found. Please start a new session.');
    }

    const response: AxiosResponse<ChatResponse> = await api.post('/chat/', {
      user_id,
      message,
    });
    return response.data;
  },

  // Optional admin routes (if needed)
  admin: {
    getProfile: async (userId: string) => 
      api.get(`/api/profile/${userId}`),
    
    getChatHistory: async (userId: string) => 
      api.get(`/api/chat-history/${userId}`),
  }
};

// Helper to check if profile is complete based on GPT response
export const isProfileComplete = (gptResponse: string): boolean => {
  return gptResponse.toLowerCase().includes('your matchprivé profile is complete');
};

export default matchPriveAPI; 