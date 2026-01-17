// --------------------------------------------------------------------------------------------------



import { create } from 'zustand';
import { AuthState, User } from '@/types';

// Mock user data for demo
const mockUsers: { email: string; password: string; user: User }[] = [
  {
    email: 'demo@careerforge.com',
    password: 'demo123',
    user: {
      id: '1',
      email: 'demo@careerforge.com',
      name: 'Demo Recruiter',
      createdAt: new Date().toISOString(),
    },
  },
];

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email: string, password: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const found = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (!found) {
      // Allow any email/password combo for demo
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0],
        createdAt: new Date().toISOString(),
      };
      const token = `mock-token-${Date.now()}`;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUser));
      set({ user: newUser, token, isAuthenticated: true, isLoading: false });
      return;
    }

    const token = `mock-token-${Date.now()}`;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(found.user));
    set({ user: found.user, token, isAuthenticated: true, isLoading: false });
  },

  register: async (email: string, password: string, name: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      createdAt: new Date().toISOString(),
    };

    mockUsers.push({ email, password, user: newUser });
    const token = `mock-token-${Date.now()}`;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(newUser));
    set({ user: newUser, token, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  checkAuth: () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        set({ user, token, isAuthenticated: true, isLoading: false });
      } catch {
        set({ isLoading: false });
      }
    } else {
      set({ isLoading: false });
    }
  },
}));

// ----------------------------------------------------------------------------------------------


