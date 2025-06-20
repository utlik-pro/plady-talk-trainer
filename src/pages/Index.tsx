
import { useState, useEffect } from 'react';
import { OnboardingScreen } from '@/components/OnboardingScreen';
import { AuthScreen } from '@/components/AuthScreen';
import { TrainerScreen } from '@/components/TrainerScreen';
import { PaywallScreen } from '@/components/PaywallScreen';
import { ProfileScreen } from '@/components/ProfileScreen';
import { RecommendationsScreen } from '@/components/RecommendationsScreen';
import { HistoryScreen } from '@/components/HistoryScreen';
import { NavigationBar } from '@/components/NavigationBar';
import { useAuth } from '@/hooks/useAuth';

type AppScreen = 'onboarding' | 'auth' | 'trainer' | 'paywall' | 'profile' | 'recommendations' | 'history';

const Index = () => {
  const { isAuthenticated, user, profile, loading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('onboarding');
  const [mainScreen, setMainScreen] = useState<'trainer' | 'profile' | 'recommendations' | 'history'>('trainer');
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    // Check if user has seen onboarding
    const seenOnboarding = localStorage.getItem('plady_onboarding_seen');
    if (seenOnboarding) {
      setHasSeenOnboarding(true);
      if (isAuthenticated) {
        setCurrentScreen('trainer');
      } else {
        setCurrentScreen('auth');
      }
    }
  }, [isAuthenticated]);

  // Show loading while auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-plady-light to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-plady-pink to-plady-purple bg-clip-text text-transparent mb-2">
            Plady
          </div>
          <div className="text-gray-600">Загрузка...</div>
        </div>
      </div>
    );
  }

  const handleOnboardingComplete = () => {
    localStorage.setItem('plady_onboarding_seen', 'true');
    setHasSeenOnboarding(true);
    setCurrentScreen('auth');
  };

  const handleAuthSuccess = () => {
    setCurrentScreen('trainer');
  };

  const handlePaywallReached = () => {
    setCurrentScreen('paywall');
  };

  const handleSubscribe = () => {
    // Mock subscription upgrade - in real app would integrate with payment system
    if (profile) {
      // This would be handled by backend/payment system
    }
    setCurrentScreen('trainer');
  };

  const handleLogout = () => {
    setCurrentScreen('auth');
  };

  const handleScreenChange = (screen: 'trainer' | 'profile' | 'recommendations' | 'history') => {
    setMainScreen(screen);
    setCurrentScreen(screen);
  };

  const handleProfileClick = () => {
    setMainScreen('profile');
    setCurrentScreen('profile');
  };

  const handleBackToTrainer = () => {
    setMainScreen('trainer');
    setCurrentScreen('trainer');
  };

  // Show onboarding if not seen
  if (!hasSeenOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  // Show auth if not authenticated
  if (!isAuthenticated) {
    return <AuthScreen onSuccess={handleAuthSuccess} />;
  }

  // Show paywall
  if (currentScreen === 'paywall') {
    return (
      <PaywallScreen 
        onBack={handleBackToTrainer}
        onSubscribe={handleSubscribe}
      />
    );
  }

  // Main app screens
  return (
    <div className="min-h-screen bg-gray-50">
      {currentScreen === 'trainer' && (
        <TrainerScreen 
          onPaywallReached={handlePaywallReached} 
          onProfileClick={handleProfileClick}
        />
      )}
      
      {currentScreen === 'profile' && (
        <ProfileScreen onLogout={handleLogout} />
      )}

      {currentScreen === 'recommendations' && (
        <RecommendationsScreen onBack={handleBackToTrainer} />
      )}

      {currentScreen === 'history' && (
        <HistoryScreen onBack={handleBackToTrainer} />
      )}

      {/* Navigation Bar - show for main screens */}
      {['trainer', 'profile', 'recommendations', 'history'].includes(currentScreen) && (
        <NavigationBar 
          currentScreen={mainScreen} 
          onScreenChange={handleScreenChange}
        />
      )}
    </div>
  );
};

export default Index;
