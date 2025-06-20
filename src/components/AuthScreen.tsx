
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface AuthScreenProps {
  onSuccess: () => void;
}

export const AuthScreen = ({ onSuccess }: AuthScreenProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!isLogin && password !== confirmPassword) {
        toast({
          title: "Ошибка",
          description: "Пароли не совпадают",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      if (isLogin) {
        const { error } = await login(email, password);
        if (error) {
          console.error('Login error:', error);
          toast({
            title: "Ошибка входа",
            description: error.message || "Неверный email или пароль",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Добро пожаловать!",
            description: "Вы успешно вошли в систему"
          });
          onSuccess();
        }
      } else {
        const { error } = await register(email, password);
        if (error) {
          console.error('Registration error:', error);
          toast({
            title: "Ошибка регистрации",
            description: error.message || "Не удалось создать аккаунт",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Регистрация успешна!",
            description: "Проверьте email для подтверждения аккаунта"
          });
          // После регистрации переключаемся на вход
          setIsLogin(true);
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: "Ошибка",
        description: "Произошла неожиданная ошибка",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-plady-pink via-plady-purple to-plady-dark flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-plady-pink to-plady-purple bg-clip-text text-transparent mb-2">
            Plady
          </h1>
          <p className="text-gray-600">
            {isLogin ? 'Войдите в аккаунт' : 'Создайте аккаунт'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-plady-pink focus:ring-plady-pink"
            />
          </div>

          <div>
            <Input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-plady-pink focus:ring-plady-pink"
            />
          </div>

          {!isLogin && (
            <div>
              <Input
                type="password"
                placeholder="Подтвердите пароль"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-plady-pink focus:ring-plady-pink"
              />
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-plady-pink to-plady-purple text-white py-3 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
          </Button>
        </form>

        {/* Switch between login/register */}
        <div className="text-center mt-6">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-plady-purple hover:text-plady-pink transition-colors"
          >
            {isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите'}
          </button>
        </div>
      </div>
    </div>
  );
};
