
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ElevenLabsUsage } from '@/types/admin';

interface UserElevenLabsUsageProps {
  userId: string;
  formatDate: (dateString: string) => string;
}

export const UserElevenLabsUsage = ({ userId, formatDate }: UserElevenLabsUsageProps) => {
  const [usage, setUsage] = useState<ElevenLabsUsage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserUsage();
  }, [userId]);

  const fetchUserUsage = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('elevenlabs_usage')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user ElevenLabs usage:', error);
        return;
      }

      setUsage(data || []);
    } catch (error) {
      console.error('Error in fetchUserUsage:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalCost = usage.reduce((sum, item) => sum + (item.cost || 0), 0);
  const totalCharacters = usage.reduce((sum, item) => sum + (item.characters_count || 0), 0);

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">Использование ElevenLabs этим пользователем</h2>
        <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Общая стоимость: </span>
            <span className="font-semibold text-red-600">${totalCost.toFixed(4)}</span>
          </div>
          <div>
            <span className="text-gray-500">Всего символов: </span>
            <span className="font-semibold text-blue-600">{totalCharacters}</span>
          </div>
          <div>
            <span className="text-gray-500">Записей: </span>
            <span className="font-semibold text-purple-600">{usage.length}</span>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="p-6 text-center">Загрузка...</div>
      ) : usage.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          Пользователь еще не использовал ElevenLabs
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Дата</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Символы</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Стоимость</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Сессия</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conversation ID</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usage.map((usageItem) => (
                <tr key={usageItem.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(usageItem.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {usageItem.characters_count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="font-semibold text-red-600">
                      ${usageItem.cost.toFixed(4)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {usageItem.session_id ? usageItem.session_id.substring(0, 8) + '...' : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {usageItem.conversation_id ? usageItem.conversation_id.substring(0, 8) + '...' : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
