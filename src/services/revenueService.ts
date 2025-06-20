
import { supabase } from '@/integrations/supabase/client';

export const revenueService = {
  async addSubscriptionRevenue(userId: string, amount: number, subscriptionType: string, paymentMethod?: string, transactionId?: string) {
    try {
      const { error } = await supabase
        .from('subscription_revenue')
        .insert({
          user_id: userId,
          amount: amount,
          subscription_type: subscriptionType,
          payment_method: paymentMethod,
          transaction_id: transactionId
        });

      if (error) {
        console.error('Error adding subscription revenue:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in addSubscriptionRevenue:', error);
      return false;
    }
  },

  async getTotalRevenue(): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('subscription_revenue')
        .select('amount');

      if (error) {
        console.error('Error fetching total revenue:', error);
        return 0;
      }

      return data?.reduce((total, revenue) => total + (revenue.amount || 0), 0) || 0;
    } catch (error) {
      console.error('Error in getTotalRevenue:', error);
      return 0;
    }
  },

  async getRevenueByMonth(): Promise<{ month: string; amount: number }[]> {
    try {
      const { data, error } = await supabase
        .from('subscription_revenue')
        .select('amount, payment_date')
        .order('payment_date', { ascending: false });

      if (error) {
        console.error('Error fetching revenue by month:', error);
        return [];
      }

      const revenueByMonth = data?.reduce((acc: { [key: string]: number }, revenue) => {
        const date = new Date(revenue.payment_date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        acc[monthKey] = (acc[monthKey] || 0) + (revenue.amount || 0);
        return acc;
      }, {}) || {};

      return Object.entries(revenueByMonth).map(([month, amount]) => ({
        month,
        amount
      }));
    } catch (error) {
      console.error('Error in getRevenueByMonth:', error);
      return [];
    }
  }
};
