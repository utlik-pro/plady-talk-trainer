
export interface UserStats {
  totalUsers: number;
  totalMessages: number;
  totalSpent: number;
  activeSubscriptions: number;
  totalRevenue: number;
  netProfit: number;
}

export interface ElevenLabsUsage {
  id: string;
  user_id: string;
  characters_count: number;
  cost: number;
  created_at: string;
  session_id: string | null;
  conversation_id: string | null;
  metadata: any;
}
