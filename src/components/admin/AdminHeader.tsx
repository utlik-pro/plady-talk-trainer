
import { Button } from '@/components/ui/button';

interface AdminHeaderProps {
  onLogout: () => void;
}

export const AdminHeader = ({ onLogout }: AdminHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">Админ панель</h1>
      <Button onClick={onLogout} variant="destructive">
        Выйти
      </Button>
    </div>
  );
};
