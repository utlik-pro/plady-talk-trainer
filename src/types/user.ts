
export interface User {
  id: string;
  email: string;
  role: string;
  is_banned: boolean;
  subscription_expires_at: string | null;
  total_spent: number;
  elevenlabs_usage_count: number;
  registration_date: string;
  total_sessions: number;
  total_conversations: number;
  last_activity: string | null;
}
