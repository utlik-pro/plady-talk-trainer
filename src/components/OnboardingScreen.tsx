
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Heart, MessageCircle, Brain, Trophy, Target, BarChart3, CheckCircle, Mail, User } from 'lucide-react';

interface OnboardingStep {
  title: string;
  description: string;
  icon: any;
  showButtons?: boolean;
  buttonText?: string;
  hasSecondaryButton?: boolean;
  secondaryButtonText?: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    title: "Начни говорить уверенно",
    description: "Узнай, как наше приложение поможет тебе. Листай дальше!",
    icon: ChevronRight,
    buttonText: "Начать"
  },
  {
    title: "Твой уровень общения",
    description: "Новичок • Начальный • Средний • Продвинутый • Эксперт",
    icon: BarChart3,
    buttonText: "Продолжить"
  },
  {
    title: "Улучшай навыки с каждым разговором",
    description: "Получай обратную связь от ИИ после каждого диалога с девушками на любой платформе.",
    icon: MessageCircle,
    buttonText: "Продолжить"
  },
  {
    title: "Давай поговорим еще немного",
    description: "Нам нужно больше услышать твою речь, чтобы точно оценить твои навыки общения. Пройдем тест заново!",
    icon: Target,
    showButtons: true,
    buttonText: "Пройти тест",
    hasSecondaryButton: true,
    secondaryButtonText: "Пропустить"
  },
  {
    title: "Ты всегда можешь пройти оценку позже!",
    description: "Когда будешь готов, ты найдешь эту опцию в приложении.",
    icon: CheckCircle,
    buttonText: "Продолжить"
  },
  {
    title: "Оцениваем твои навыки общения",
    description: "Анализируем глубину твоих знаний в области флирта и общения",
    icon: Brain,
    buttonText: "Продолжить"
  },
  {
    title: "Анализ твоих навыков готов",
    description: "Потрясающее приложение для изучения искусства общения! Уроки четкие, интерактивные и легкие для понимания. Я действительно улучшил свои навыки. Настоятельно рекомендую всем, кто хочет говорить увереннее с девушками!",
    icon: Heart,
    buttonText: "Продолжить"
  },
  {
    title: "Зарегистрируйся для персонального плана тренировок",
    description: "Мы заботимся о твоей приватности. Твои данные надежно защищены.",
    icon: Mail,
    showButtons: true,
    buttonText: "Регистрация через Google",
    hasSecondaryButton: true,
    secondaryButtonText: "Регистрация через Email"
  },
  {
    title: "Твой уровень общения",
    description: "Начинающий A1 • 5 из 100 баллов\n6 активных техник • 96% ниже среднего для твоего уровня",
    icon: User,
    buttonText: "Продолжить"
  },
  {
    title: "У тебя отличная база!",
    description: "Наш ИИ-тренер создан для таких учеников как ты: целеустремленных, умных и готовых говорить уверенно в важные моменты.",
    icon: Trophy,
    buttonText: "Продолжить"
  }
];

interface OnboardingScreenProps {
  onComplete: () => void;
}

export const OnboardingScreen = ({ onComplete }: OnboardingScreenProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = onboardingSteps[currentStep];
  const IconComponent = step.icon;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col">
      {/* Status bar simulation */}
      <div className="h-safe-area-top bg-transparent" />
      
      {/* Progress indicator */}
      <div className="flex justify-center py-4 px-6">
        {onboardingSteps.map((_, index) => (
          <div
            key={index}
            className={`h-1 flex-1 mx-1 rounded-full transition-colors duration-300 ${
              index <= currentStep ? 'bg-blue-500' : 'bg-gray-600'
            }`}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        {/* Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mb-6 animate-scale-in shadow-lg">
            <IconComponent className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-6 animate-fade-in leading-tight">
          {step.title}
        </h1>

        {/* Description */}
        <p className="text-gray-300 text-lg leading-relaxed max-w-sm animate-fade-in whitespace-pre-line">
          {step.description}
        </p>
      </div>

      {/* Bottom section */}
      <div className="px-6 pb-8">
        {/* Login link */}
        {currentStep < onboardingSteps.length - 1 && (
          <div className="text-center mb-4">
            <span className="text-gray-400 text-sm">
              Уже есть аккаунт?{' '}
              <button
                onClick={onComplete}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Войти
              </button>
            </span>
          </div>
        )}

        {/* Buttons */}
        {step.showButtons ? (
          <div className="space-y-3">
            <Button
              onClick={nextStep}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-2xl text-lg font-semibold hover:shadow-lg transition-all duration-300"
            >
              {step.buttonText}
            </Button>
            {step.hasSecondaryButton && (
              <Button
                onClick={step.secondaryButtonText === "Пропустить" ? onComplete : prevStep}
                variant="outline"
                className="w-full border-gray-600 text-gray-300 bg-gray-800/50 py-4 rounded-2xl text-lg font-semibold hover:bg-gray-700/50 transition-all duration-300"
              >
                {step.secondaryButtonText}
              </Button>
            )}
          </div>
        ) : (
          <Button
            onClick={nextStep}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-2xl text-lg font-semibold hover:shadow-lg transition-all duration-300"
          >
            {step.buttonText || (currentStep === onboardingSteps.length - 1 ? 'Начать' : 'Продолжить')}
          </Button>
        )}

        {/* Home indicator */}
        <div className="w-32 h-1 bg-white/30 rounded-full mx-auto mt-4" />
      </div>
    </div>
  );
};
