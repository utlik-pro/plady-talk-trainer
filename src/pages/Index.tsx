
import { useState, useEffect } from 'react';
import { OnboardingScreen } from '@/components/OnboardingScreen';
import { AuthScreen } from '@/components/AuthScreen';
import { TrainerScreen } from '@/components/TrainerScreen';
import { PaywallScreen } from '@/components/PaywallScreen';
import { ProfileScreen } from '@/components/ProfileScreen';
import { NavigationBar } from '@/components/NavigationBar';
import { useAuth } from '@/hooks/useAuth';

type AppScreen = 'onboarding' | 'auth' | 'trainer' | 'paywall' | 'profile';

const Index = () => {
  const { isAuthenticated, user } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('onboarding');
  const [mainScreen, setMainScreen] = useState<'trainer' | 'profile'>('trainer');
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
    // Mock subscription upgrade
    if (user) {
      user.role = 'premium';
    }
    setCurrentScreen('trainer');
  };

  const handleLogout = () => {
    setCurrentScreen('auth');
  };

  const handleScreenChange = (screen: 'trainer' | 'profile') => {
    setMainScreen(screen);
  };

  // Show onboarding if not seen
  if (!hasSeenOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  // Show auth if not authenticated
  if (!isAuthenticated) {
    return <AuthScreen onSuccess={handleAuthSuccess} />;
  }

  // Main app screens
  return (
    <div className="min-h-screen bg-gray-50">
      {currentScreen === 'trainer' && (
        <>
          <TrainerScreen onPaywallReached={handlePaywallReached} />
          <NavigationBar 
            currentScreen={mainScreen} 
            onScreenChange={handleScreenChange}
          />
        </>
      )}
      
      {currentScreen === 'profile' && (
        <>
          <ProfileScreen onLogout={handleLogout} />
          <NavigationBar 
            currentScreen={mainScreen} 
            onScreenChange={handleScreenChange}
          />
        </>
      )}
      
      {currentScreen === 'paywall' && (
        <PaywallScreen 
          onBack={() => setCurrentScreen('trainer')}
          onSubscribe={handleSubscribe}
        />
      )}

      {/* Handle navigation between trainer and profile */}
      {(currentScreen === 'trainer' || currentScreen === 'profile') && (
        <div style={{ display: currentScreen === mainScreen ? 'block' : 'none' }}>
          {mainScreen === 'trainer' ? (
            <TrainerScreen onPaywallReached={handlePaywallReached} />
          ) : (
            <ProfileScreen onLogout={handleLogout} />
          )}
        </div>
      )}
    </div>
  );
};

export default Index;
