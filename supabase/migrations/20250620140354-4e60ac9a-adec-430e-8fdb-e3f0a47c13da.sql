
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  role TEXT DEFAULT 'free' CHECK (role IN ('free', 'premium')),
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create conversation_sessions table for storing conversation history
CREATE TABLE public.conversation_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  character_name TEXT NOT NULL,
  character_avatar TEXT NOT NULL,
  character_personality TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_time TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER DEFAULT 0,
  total_messages INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create conversation_messages table for individual messages
CREATE TABLE public.conversation_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES public.conversation_sessions(id) ON DELETE CASCADE NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'character')),
  message_text TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create conversation_analysis table for AI analysis results
CREATE TABLE public.conversation_analysis (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES public.conversation_sessions(id) ON DELETE CASCADE NOT NULL,
  overall_score DECIMAL(3,1),
  strengths TEXT[],
  areas_for_improvement TEXT[],
  conversation_flow TEXT,
  recommendations TEXT[],
  detailed_feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_analysis ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for conversation_sessions
CREATE POLICY "Users can view own sessions" ON public.conversation_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sessions" ON public.conversation_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON public.conversation_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for conversation_messages
CREATE POLICY "Users can view messages from own sessions" ON public.conversation_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.conversation_sessions 
      WHERE id = session_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages in own sessions" ON public.conversation_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.conversation_sessions 
      WHERE id = session_id AND user_id = auth.uid()
    )
  );

-- Create RLS policies for conversation_analysis
CREATE POLICY "Users can view analysis of own sessions" ON public.conversation_analysis
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.conversation_sessions 
      WHERE id = session_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create analysis for own sessions" ON public.conversation_analysis
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.conversation_sessions 
      WHERE id = session_id AND user_id = auth.uid()
    )
  );

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, registration_date)
  VALUES (NEW.id, NEW.email, 'free', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
