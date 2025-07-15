import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
interface AuthScreenProps {
  onSuccess: () => void;
}
export const AuthScreen = ({
  onSuccess
}: AuthScreenProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const {
    login,
    register,
    signInWithGoogle
  } = useAuth();
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
        const {
          error
        } = await login(email, password);
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
        const {
          error
        } = await register(email, password);
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
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const {
        error
      } = await signInWithGoogle();
      if (error) {
        console.error('Google sign in error:', error);
        toast({
          title: "Ошибка входа через Google",
          description: error.message || "Не удалось войти через Google",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Google auth error:', error);
      toast({
        title: "Ошибка",
        description: "Произошла неожиданная ошибка при входе через Google",
        variant: "destructive"
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-plady-pink via-plady-purple to-plady-dark flex items-center justify-center p-6">
      <div className="w-full max-w-md backdrop-blur-sm rounded-3xl p-8 shadow-2xl animate-fade-in bg-zinc-950">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-plady-pink to-plady-purple bg-clip-text mb-2 text-pink-400">
            Plady
          </h1>
          <p className="text-gray-600">
            {isLogin ? 'Войдите в аккаунт' : 'Создайте аккаунт'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-plady-pink focus:ring-plady-pink" />
          </div>

          <div>
            <Input type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-plady-pink focus:ring-plady-pink" />
          </div>

          {!isLogin && <div>
              <Input type="password" placeholder="Подтвердите пароль" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-plady-pink focus:ring-plady-pink" />
            </div>}

          <Button type="submit" disabled={isLoading || isGoogleLoading} className="w-full bg-gradient-to-r from-plady-pink to-plady-purple text-white py-3 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50">
            {isLoading ? 'Загрузка...' : isLogin ? 'Войти' : 'Зарегистрироваться'}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-4 text-sm text-gray-500">или</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        {/* Google Sign In */}
        <Button onClick={handleGoogleSignIn} disabled={isLoading || isGoogleLoading} variant="outline" className="w-full py-3 rounded-xl border-2 border-gray-200 hover:border-plady-pink hover:bg-gray-50 transition-all duration-300 disabled:opacity-50">
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          {isGoogleLoading ? 'Загрузка...' : 'Войти через Google'}
        </Button>

        {/* Switch between login/register */}
        <div className="text-center mt-6">
          <button onClick={() => setIsLogin(!isLogin)} className="text-plady-purple hover:text-plady-pink transition-colors">
            {isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите'}
          </button>
        </div>
      </div>
    </div>;
};