
interface UserStatsProps {
  totalUsers: number;
  totalMessages: number;
  activeSubscriptions: number;
  elevenLabsUsageCount: number;
}

export const UserStats = ({ totalUsers, totalMessages, activeSubscriptions, elevenLabsUsageCount }: UserStatsProps) => {
  return (
    <div className="grid grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="text-2xl font-bold text-blue-600">{totalUsers}</div>
        <div className="text-sm text-gray-600">Всего пользователей</div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="text-2xl font-bold text-green-600">{totalMessages}</div>
        <div className="text-sm text-gray-600">Всего сообщений</div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="text-2xl font-bold text-orange-600">{activeSubscriptions}</div>
        <div className="text-sm text-gray-600">Активные подписки</div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="text-2xl font-bold text-purple-600">{elevenLabsUsageCount}</div>
        <div className="text-sm text-gray-600">ElevenLabs сессий</div>
      </div>
    </div>
  );
};
