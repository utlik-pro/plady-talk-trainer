
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  email: string;
  role: 'free' | 'premium';
  registration_date: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ error: any }>;
  register: (email: string, password: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from database
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }
      
      if (data) {
        setProfile({
          id: data.id,
          email: data.email,
          role: data.role as 'free' | 'premium',
          registration_date: data.registration_date
        });
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch profile when user logs in
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });
      
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null); 
      setSession(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      session,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      loading
    }}>
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
