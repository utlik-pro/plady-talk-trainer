
export interface ConversationSession {
  id: string;
  character_name: string;
  character_avatar: string;
  character_personality: string;
  start_time: string;
  end_time: string | null;
  duration_seconds: number;
  total_messages: number;
  created_at: string;
  analysis?: {
    overall_score: number;
    strengths: string[];
    areas_for_improvement: string[];
    recommendations: string[];
    detailed_feedback: string;
  };
}

export interface ConversationMessage {
  id: string;
  session_id: string;
  sender: 'user' | 'character';
  message_text: string;
  timestamp: string;
}

export interface Character {
  name: string;
  avatar: string;
  personality: string;
}

export interface ConversationAnalysis {
  overall_score: number;
  strengths: string[];
  areas_for_improvement: string[];
  recommendations: string[];
  detailed_feedback: string;
}
