
interface ElevenLabsUsage {
  id: string;
  user_id: string;
  characters_count: number;
  cost: number;
  created_at: string;
  session_id: string | null;
  conversation_id: string | null;
  metadata: any;
}

interface ElevenLabsUsageTableProps {
  usage: ElevenLabsUsage[];
  formatDate: (dateString: string) => string;
}

export const ElevenLabsUsageTable = ({ usage, formatDate }: ElevenLabsUsageTableProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm mb-8">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">Детали использования ElevenLabs</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Дата</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Пользователь</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Символы</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Стоимость</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Сессия</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {usage.slice(0, 10).map((usageItem) => (
              <tr key={usageItem.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(usageItem.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {usageItem.user_id.substring(0, 8)}...
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {usageItem.characters_count}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${usageItem.cost.toFixed(4)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {usageItem.session_id ? usageItem.session_id.substring(0, 8) + '...' : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
