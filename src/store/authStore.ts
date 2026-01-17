import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

// Extended user type for app-level user data
export interface AppUser {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

interface AuthState {
  user: AppUser | null;
  supabaseUser: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  initialized: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  initialize: () => Promise<void>;
}

// Helper to convert Supabase user to AppUser
const toAppUser = (supabaseUser: User, profileName?: string): AppUser => ({
  id: supabaseUser.id,
  email: supabaseUser.email || '',
  name: profileName || supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
  createdAt: supabaseUser.created_at,
});

// Helper to fetch or create profile
const fetchOrCreateProfile = async (userId: string, email: string, name?: string): Promise<string | null> => {
  try {
    // First try to fetch existing profile
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', userId)
      .single();

    if (existingProfile) {
      return existingProfile.name;
    }

    // If no profile exists and we have a name, create one
    if (name) {
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: email,
          name: name,
        });

      if (insertError) {
        console.error('Error creating profile:', insertError);
        // Profile table might not exist, that's okay - we'll use user_metadata
      }
      return name;
    }

    return null;
  } catch (error) {
    console.error('Profile fetch/create error:', error);
    return null;
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  supabaseUser: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  initialized: false,

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        // Try to get profile name
        const profileName = await fetchOrCreateProfile(
          session.user.id, 
          session.user.email || '',
          session.user.user_metadata?.name
        );

        set({
          user: toAppUser(session.user, profileName || undefined),
          supabaseUser: session.user,
          token: session.access_token,
          isAuthenticated: true,
          isLoading: false,
          initialized: true,
        });
      } else {
        set({
          user: null,
          supabaseUser: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          initialized: true,
        });
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const profileName = await fetchOrCreateProfile(
            session.user.id,
            session.user.email || '',
            session.user.user_metadata?.name
          );
          set({
            user: toAppUser(session.user, profileName || undefined),
            supabaseUser: session.user,
            token: session.access_token,
            isAuthenticated: true,
          });
        } else {
          set({
            user: null,
            supabaseUser: null,
            token: null,
            isAuthenticated: false,
          });
        }
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ isLoading: false, initialized: true });
    }
  },

  checkAuth: async () => {
    const { initialized, initialize } = get();
    if (!initialized) {
      await initialize();
    }
  },

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true });

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        set({
          user: toAppUser(data.user),
          supabaseUser: data.user,
          token: data.session?.access_token || null,
          isAuthenticated: true,
          isLoading: false,
        });
        toast.success('Welcome back!');
      }
    } catch (error: any) {
      set({ isLoading: false });
      toast.error(error.message || 'Invalid credentials');
      throw error;
    }
  },

  register: async (email: string, password: string, name: string) => {
    try {
      set({ isLoading: true });

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Create profile record in profiles table
        await fetchOrCreateProfile(data.user.id, email, name);

        set({
          user: toAppUser(data.user, name),
          supabaseUser: data.user,
          token: data.session?.access_token || null,
          isAuthenticated: true,
          isLoading: false,
        });
        toast.success('Account created successfully!');
      }
    } catch (error: any) {
      set({ isLoading: false });
      toast.error(error.message || 'Failed to create account');
      throw error;
    }
  },

  logout: async () => {
    try {
      await supabase.auth.signOut();
      set({
        user: null,
        supabaseUser: null,
        token: null,
        isAuthenticated: false,
      });
      toast.success('Signed out successfully');
    } catch (error: any) {
      toast.error('Failed to sign out');
    }
  },
}));


