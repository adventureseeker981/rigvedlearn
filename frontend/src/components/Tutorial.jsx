import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Check } from 'lucide-react';
import { Button } from './ui/button';

const tutorialSteps = [
  {
    title: "Welcome to Rigveda Learning!",
    description: "Learn ancient wisdom through bite-sized, gamified lessons. Let's take a quick tour!",
    target: null,
    position: "center"
  },
  {
    title: "Your Progress Wheel",
    description: "Track your journey through Mandala 1. Complete hymns to fill the wheel!",
    target: "progress-wheel",
    position: "bottom"
  },
  {
    title: "Daily Streak",
    description: "Build consistency! Your streak grows each day you practice. Don't break the chain!",
    target: "streak-counter",
    position: "bottom"
  },
  {
    title: "Experience Points",
    description: "Earn XP by completing lessons, maintaining streaks, and finishing challenges. Level up to unlock advanced content!",
    target: "xp-bar",
    position: "bottom"
  },
  {
    title: "Start Learning",
    description: "Click 'Today's Lesson' to begin your daily practice. Each lesson takes 5-7 minutes!",
    target: "today-lesson-btn",
    position: "top"
  },
  {
    title: "Practice Mode",
    description: "Review what you've learned with spaced repetition to strengthen your memory.",
    target: "practice-btn",
    position: "top"
  },
  {
    title: "Achievements & Badges",
    description: "Unlock badges like 'Rita Keeper' and 'Agni Initiator' as you master different aspects!",
    target: "achievements-btn",
    position: "top"
  }
];

const Tutorial = ({ isOpen, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightedElement, setHighlightedElement] = useState(null);

  useEffect(() => {
    if (isOpen && tutorialSteps[currentStep].target) {
      const element = document.getElementById(tutorialSteps[currentStep].target);
      if (element) {
        setHighlightedElement(element);
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentStep, isOpen]);

  if (!isOpen) return null;

  const currentStepData = tutorialSteps[currentStep];
  const isLastStep = currentStep === tutorialSteps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      sessionStorage.setItem('rigveda_tutorial_completed', 'true');
      onComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = () => {
    sessionStorage.setItem('rigveda_tutorial_completed', 'true');
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay with spotlight effect */}
      <div className="absolute inset-0 bg-black/70 pointer-events-none" />
      
      {/* Highlight specific element */}
      {highlightedElement && (
        <div
          className="absolute border-4 border-[#FFD700] rounded-lg pointer-events-none transition-all duration-300"
          style={{
            top: `${highlightedElement.offsetTop - 8}px`,
            left: `${highlightedElement.offsetLeft - 8}px`,
            width: `${highlightedElement.offsetWidth + 16}px`,
            height: `${highlightedElement.offsetHeight + 16}px`,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)'
          }}
        />
      )}

      {/* Tutorial card */}
      <div className={`absolute ${
        currentStepData.position === 'center' ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' :
        currentStepData.position === 'bottom' ? 'top-32' :
        'bottom-32'
      } ${currentStepData.position !== 'center' ? 'left-1/2 -translate-x-1/2' : ''} w-full max-w-md p-6 bg-white rounded-2xl shadow-2xl z-10 mx-4`}>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-[#FF9933] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
              {currentStep + 1}
            </div>
            <h3 className="text-xl font-bold text-[#000080]">{currentStepData.title}</h3>
          </div>
          <button
            onClick={handleSkip}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-gray-700 mb-6">{currentStepData.description}</p>

        {/* Progress dots */}
        <div className="flex gap-2 mb-4">
          {tutorialSteps.map((_, index) => (
            <div
              key={index}
              className={`h-2 flex-1 rounded-full transition-colors ${
                index === currentStep ? 'bg-[#FF9933]' :
                index < currentStep ? 'bg-[#FFD700]' :
                'bg-gray-200'
              }`}
            />
          ))}
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleSkip}
            className="flex-1"
          >
            Skip Tutorial
          </Button>
          <Button
            onClick={handleNext}
            className="flex-1 bg-[#FF9933] hover:bg-[#FF9933]/90 text-white"
          >
            {isLastStep ? (
              <>
                <Check size={18} className="mr-2" />
                Get Started
              </>
            ) : (
              <>
                Next
                <ArrowRight size={18} className="ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;