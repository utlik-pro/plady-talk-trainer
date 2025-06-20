
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface OnboardingStep {
  title: string;
  description: string;
  image: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    title: "Добро пожаловать в Plady!",
    description: "Твой персональный тренажёр для развития навыков общения с девушками",
    image: "💕"
  },
  {
    title: "Практикуйся в безопасной среде",
    description: "Отрабатывай реплики и стратегии общения без страха быть отвергнутым",
    image: "🎭"
  },
  {
    title: "Получай обратную связь",
    description: "ИИ-помощник анализирует твои ответы и даёт персональные рекомендации",
    image: "🧠"
  },
  {
    title: "Повышай уровень уверенности",
    description: "С каждой тренировкой ты становишься более уверенным в общении",
    image: "💪"
  },
  {
    title: "Готов начать?",
    description: "Создай аккаунт и начни своё путешествие к мастерству общения",
    image: "🚀"
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-plady-pink via-plady-purple to-plady-dark flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl animate-fade-in">
        {/* Progress indicator */}
        <div className="flex justify-center mb-8">
          {onboardingSteps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full mx-1 transition-colors duration-300 ${
                index <= currentStep ? 'bg-plady-pink' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-6 animate-slide-up">
            {step.image}
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4 animate-slide-up">
            {step.title}
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed animate-slide-up">
            {step.description}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={prevStep}
            className={`${currentStep === 0 ? 'invisible' : ''}`}
          >
            Назад
          </Button>
          
          <Button
            onClick={nextStep}
            className="bg-gradient-to-r from-plady-pink to-plady-purple text-white px-8 py-2 rounded-full hover:shadow-lg transition-all duration-300"
          >
            {currentStep === onboardingSteps.length - 1 ? 'Начать' : 'Далее'}
          </Button>
        </div>

        {/* Skip option */}
        {currentStep < onboardingSteps.length - 1 && (
          <div className="text-center mt-4">
            <button
              onClick={onComplete}
              className="text-gray-500 text-sm hover:text-gray-700 transition-colors"
            >
              Пропустить
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
