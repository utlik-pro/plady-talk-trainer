
import { Button } from '@/components/ui/button';

interface User {
  id: string;
  email: string;
  role: string;
  is_banned: boolean;
  subscription_expires_at: string | null;
  total_spent: number;
  elevenlabs_usage_count: number;
  registration_date: string;
}

interface UsersTableProps {
  users: User[];
  loading: boolean;
  formatDate: (dateString: string) => string;
  onUserSelect: (user: User) => void;
}

export const UsersTable = ({ users, loading, formatDate, onUserSelect }: UsersTableProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">Пользователи</h2>
      </div>
      
      {loading ? (
        <div className="p-6 text-center">Загрузка...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Тариф</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Потрачено</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Регистрация</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Действия</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'premium' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role === 'premium' ? 'Premium' : 'Free'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.is_banned 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.is_banned ? 'Заблокирован' : 'Активен'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${user.total_spent?.toFixed(4) || '0.0000'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(user.registration_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Button
                      onClick={() => onUserSelect(user)}
                      variant="ghost"
                      size="sm"
                    >
                      Подробнее
                    </Button>
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
