// API service for backend communication
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Optional mock mode (set VITE_USE_MOCK=true in .env to enable)
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
// Lazy import mock helpers when running in mock mode
let mockAuth: any = null;
let mockTopicService: any = null;

// Load mock module dynamically in the browser (avoid `require` which is not available)
const ensureMocksLoaded = async (): Promise<void> => {
  if (!USE_MOCK) return;
  if (mockAuth && mockTopicService) return;
  const mocks = await import('@/lib/mockData');
  mockAuth = mocks.mockAuth;
  mockTopicService = mocks.mockTopicService;
};

export interface User {
  id: string;
  email: string;
  username: string;
  role: 'user' | 'admin';
  dailyStreak: number;
  practiceStreak: number;
  bestDailyStreak: number;
  bestPracticeStreak: number;
  topicsCompleted: number;
  totalQuizzes: number;
  correctAnswers: number;
  lastDailyCompletion: string | null;
  lastPracticeCompletion: string | null;
}

export interface Question {
  id: string;
  topicId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: number;
  questions: Question[];
  createdAt: string;
  hasCompleted?: boolean;
  isCompleted?: boolean;
}

interface AuthResponse {
  user: User;
  token: string;
}

// Helper function to get auth token
const getToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Helper function to set auth token
const setToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

// Helper function to remove auth token
const removeToken = (): void => {
  localStorage.removeItem('auth_token');
};

// Fetch wrapper with auth
const apiFetch = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Token expired or invalid
      removeToken();
      if (window.location.pathname !== '/auth') {
        window.location.href = '/auth';
      }
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'An error occurred' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response;
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please make sure the backend is running on http://localhost:5000');
    }
    throw error;
  }
};

// Auth API
export const authAPI = USE_MOCK ? {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    await ensureMocksLoaded();
    const user = await mockAuth.login(email, password);
    if (!user) throw new Error('Invalid email or password');
    const token = `mock-token-${user.id}`;
    setToken(token);
    return { user, token } as AuthResponse;
  },

  signup: async (email: string, password: string, username: string): Promise<AuthResponse> => {
    await ensureMocksLoaded();
    const user = await mockAuth.signup(email, password, username);
    if (!user) throw new Error('Unable to create user');
    const token = `mock-token-${user.id}`;
    setToken(token);
    return { user, token } as AuthResponse;
  },

  logout: async (): Promise<void> => {
    mockAuth.logout();
    removeToken();
  },

  getCurrentUser: async (): Promise<User> => {
    await ensureMocksLoaded();
    const user = mockAuth.getCurrentUser();
    if (!user) throw new Error('Unauthorized');
    return user as User;
  },
} : {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    setToken(data.token);
    return data;
  },

  signup: async (email: string, password: string, username: string): Promise<AuthResponse> => {
    const response = await apiFetch('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, username }),
    });
    const data = await response.json();
    setToken(data.token);
    return data;
  },

  logout: async (): Promise<void> => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } finally {
      removeToken();
    }
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiFetch('/auth/me');
    const data = await response.json();
    return data.user;
  },
};

// Topics API
export const topicsAPI = {
  getDailyTopic: async (): Promise<Topic> => {
    if (USE_MOCK) {
      await ensureMocksLoaded();
      return mockTopicService.getDailyTopic();
    }
    const response = await apiFetch('/topics/daily');
    const data = await response.json();
    return data.topic;
  },

  getAllTopics: async (): Promise<Topic[]> => {
    if (USE_MOCK) {
      await ensureMocksLoaded();
      return mockTopicService.getAllTopics();
    }
    const response = await apiFetch('/topics');
    const data = await response.json();
    return data.topics;
  },

  getTopicById: async (topicId: string): Promise<Topic> => {
    if (USE_MOCK) {
      await ensureMocksLoaded();
      const t = mockTopicService.getTopicById(topicId);
      if (!t) throw new Error('Topic not found');
      return t;
    }
    const response = await apiFetch(`/topics/${topicId}`);
    const data = await response.json();
    return data.topic;
  },

  checkTopicCompleted: async (topicId: string): Promise<boolean> => {
    if (USE_MOCK) {
      await ensureMocksLoaded();
      const user = mockAuth.getCurrentUser();
      if (!user) throw new Error('Unauthorized');
      return mockTopicService.hasCompletedTopic(user.id, topicId);
    }
    const response = await apiFetch(`/topics/${topicId}/completed`);
    const data = await response.json();
    return data.completed;
  },
};

// Quizzes API
export const quizzesAPI = {
  submitDailyQuiz: async (correctCount: number, totalQuestions: number): Promise<{ newStreak: number; streakIncreased: boolean; user: User }> => {
    if (USE_MOCK) {
      await ensureMocksLoaded();
      const user = mockAuth.getCurrentUser();
      if (!user) throw new Error('Unauthorized');
      const res = mockTopicService.submitDailyQuiz(user.id, correctCount, totalQuestions);
      return { ...res, user: mockAuth.getCurrentUser() };
    }
    const response = await apiFetch('/quizzes/daily/submit', {
      method: 'POST',
      body: JSON.stringify({ correctCount, totalQuestions }),
    });
    const data = await response.json();
    return data;
  },

  submitPracticeQuiz: async (topicId: string, correctCount: number, totalQuestions: number): Promise<{ newStreak: number; user: User }> => {
    if (USE_MOCK) {
      await ensureMocksLoaded();
      const user = mockAuth.getCurrentUser();
      if (!user) throw new Error('Unauthorized');
      const res = mockTopicService.submitLibraryQuiz(user.id, topicId, correctCount);
      return { ...res, user: mockAuth.getCurrentUser() };
    }
    const response = await apiFetch('/quizzes/practice/submit', {
      method: 'POST',
      body: JSON.stringify({ topicId, correctCount, totalQuestions }),
    });
    const data = await response.json();
    return data;
  },
};

// Export token management for use in contexts
export { getToken, setToken, removeToken };

