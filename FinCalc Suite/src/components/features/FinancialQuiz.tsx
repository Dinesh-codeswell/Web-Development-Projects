import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, RefreshCw, Timer, Volume2, VolumeX, Share2, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import useSound from 'use-sound';
import Card from '../ui/Card';
import Button from '../ui/Button';

// Import all 40 questions from the provided list
const allQuestions = [
  {
    id: 1,
    category: "Basic Financial Literacy",
    question: "What does APR stand for in financial terms?",
    options: [
      "Annual Percentage Rate",
      "Adjusted Payment Reduction",
      "Asset Protection Reserve",
      "Annualized Profit Ratio"
    ],
    correctAnswer: 0,
    difficulty: 'easy',
    explanation: "APR (Annual Percentage Rate) represents the yearly cost of borrowing, including fees and interest charges."
  },
  // ... Add all 40 questions here
];

interface CategoryProgress {
  total: number;
  correct: number;
  percentage: number;
}

const FinancialQuiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [categoryProgress, setCategoryProgress] = useState<Record<string, CategoryProgress>>({});
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Sound effects
  const [playCorrect] = useSound('/sounds/correct.mp3', { volume: 0.5 });
  const [playIncorrect] = useSound('/sounds/incorrect.mp3', { volume: 0.5 });
  const [playTick] = useSound('/sounds/tick.mp3', { volume: 0.2 });

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleAnswer = (selectedOption: number) => {
    setSelectedAnswer(selectedOption);
    
    if (isSoundEnabled) {
      if (selectedOption === allQuestions[currentQuestion].correctAnswer) {
        playCorrect();
        triggerConfetti();
      } else {
        playIncorrect();
      }
    }

    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedOption;
    setAnswers(newAnswers);

    if (selectedOption === allQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    setShowExplanation(true);
    setTimeout(() => {
      setShowExplanation(false);
      setSelectedAnswer(null);
      if (currentQuestion < allQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setTimeLeft(30);
      } else {
        setShowResults(true);
        calculateCategoryProgress();
      }
    }, 2000);
  };

  const calculateCategoryProgress = () => {
    const progress: Record<string, CategoryProgress> = {};
    
    allQuestions.forEach((question, index) => {
      if (!progress[question.category]) {
        progress[question.category] = {
          total: 0,
          correct: 0,
          percentage: 0
        };
      }
      
      progress[question.category].total++;
      if (answers[index] === question.correctAnswer) {
        progress[question.category].correct++;
      }
    });

    // Calculate percentages
    Object.keys(progress).forEach(category => {
      progress[category].percentage = 
        (progress[category].correct / progress[category].total) * 100;
    });

    setCategoryProgress(progress);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);
    setAnswers([]);
    setTimeLeft(30);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!showResults && !showExplanation && timeLeft > 0) {
      timer = setInterval(() => {
        if (isSoundEnabled && timeLeft <= 5) {
          playTick();
        }
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleAnswer(-1); // Auto-submit on timeout
    }
    return () => clearInterval(timer);
  }, [timeLeft, showResults, showExplanation]);

  const getTimerColor = () => {
    if (timeLeft > 10) return 'text-green-500';
    if (timeLeft > 5) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreColor = () => {
    const percentage = (score / allQuestions.length) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
          Financial Knowledge Quiz
        </h1>
        <p className="text-gray-600 mt-2">
          Test your understanding of financial concepts and learn as you go.
        </p>
      </div>

      <Card className="max-w-4xl mx-auto backdrop-blur-sm bg-white/90">
        <div className="absolute top-4 right-4 flex items-center space-x-4">
          <button
            onClick={() => setIsSoundEnabled(!isSoundEnabled)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            {isSoundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
        </div>

        {!showResults ? (
          <div>
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Question {currentQuestion + 1} of {allQuestions.length}
                </span>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-indigo-600">
                    Score: {score}
                  </span>
                  <div className={`flex items-center ${getTimerColor()}`}>
                    <Timer size={16} className="mr-1" />
                    <span className="font-mono">{timeLeft}s</span>
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / allQuestions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="mb-8">
              <div className="text-sm text-indigo-600 mb-2">
                {allQuestions[currentQuestion].category}
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {allQuestions[currentQuestion].question}
              </h2>
              <div className="grid gap-3">
                {allQuestions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => !showExplanation && handleAnswer(index)}
                    className={`
                      w-full text-left p-6 rounded-xl border-2 transition-all duration-300
                      transform hover:scale-[1.02] hover:shadow-lg
                      ${showExplanation
                        ? index === allQuestions[currentQuestion].correctAnswer
                          ? 'border-green-500 bg-green-50'
                          : index === selectedAnswer
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200'
                        : 'border-gray-200 hover:border-indigo-500 hover:bg-indigo-50'
                      }
                    `}
                    disabled={showExplanation}
                  >
                    <div className="flex items-center">
                      <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3 font-medium">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="flex-grow">{option}</span>
                      {showExplanation && index === allQuestions[currentQuestion].correctAnswer && (
                        <CheckCircle className="text-green-500 ml-2" size={20} />
                      )}
                      {showExplanation && index === selectedAnswer && index !== allQuestions[currentQuestion].correctAnswer && (
                        <XCircle className="text-red-500 ml-2" size={20} />
                      )}
                    </div>
                  </button>
                ))}
              </div>
              
              {showExplanation && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-800">
                    {allQuestions[currentQuestion].explanation}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <Trophy size={64} className="mx-auto text-yellow-500 mb-4" />
            <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
            <div className={`text-4xl font-bold mb-6 ${getScoreColor()}`}>
              {score} / {allQuestions.length}
            </div>
            <p className="text-gray-600 mb-8">
              You answered {((score / allQuestions.length) * 100).toFixed(0)}% of questions correctly.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {Object.entries(categoryProgress).map(([category, progress]) => (
                <div key={category} className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">{category}</h3>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${progress.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {progress.correct} of {progress.total} correct
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-center space-x-4">
              <Button
                onClick={resetQuiz}
                icon={<RefreshCw size={16} />}
                color="indigo"
              >
                Try Again
              </Button>
              <Button
                variant="outline"
                icon={<Share2 size={16} />}
                color="indigo"
                onClick={() => {
                  // Share functionality
                }}
              >
                Share Results
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default FinancialQuiz;