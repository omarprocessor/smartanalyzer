'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type PersonalityTestProps = {
  onSubmit: (data: {
    personality_type: string;
    personality_scores: Record<string, number>;
  }) => void;
  onBack: () => void;
};

const QUESTIONS = [
  { id: 'E/I-1', text: 'You prefer spending time with others rather than alone', dimension: 'E/I', value: 1 },
  { id: 'E/I-2', text: 'You feel energized after social gatherings', dimension: 'E/I', value: 1 },
  { id: 'E/I-3', text: 'You think out loud and process ideas by talking', dimension: 'E/I', value: 1 },
  { id: 'S/N-1', text: 'You focus on facts and concrete details', dimension: 'S/N', value: 1 },
  { id: 'S/N-2', text: 'You enjoy thinking about possibilities and future potential', dimension: 'S/N', value: -1 },
  { id: 'S/N-3', text: 'You prefer practical, hands-on approaches', dimension: 'S/N', value: 1 },
  { id: 'T/F-1', text: 'You make decisions based on logic and objective analysis', dimension: 'T/F', value: 1 },
  { id: 'T/F-2', text: 'You prioritize harmony and consider others\' feelings in decisions', dimension: 'T/F', value: -1 },
  { id: 'T/F-3', text: 'You value fairness and consistency over personal considerations', dimension: 'T/F', value: 1 },
  { id: 'J/P-1', text: 'You prefer structure and planning over spontaneity', dimension: 'J/P', value: 1 },
  { id: 'J/P-2', text: 'You like to keep your options open and adapt as you go', dimension: 'J/P', value: -1 },
  { id: 'J/P-3', text: 'You work better with deadlines and clear schedules', dimension: 'J/P', value: 1 },
];

const answerOptions = [
  { value: 2, label: 'Strongly Agree', color: 'from-[#7c3aed] to-[#a78bfa]' },
  { value: 1, label: 'Agree', color: 'from-[#8b5cf6] to-[#c4b5fd]' },
  { value: -1, label: 'Disagree', color: 'from-[#484f58] to-[#6e7681]' },
  { value: -2, label: 'Strongly Disagree', color: 'from-[#30363d] to-[#484f58]' },
];

export default function PersonalityTest({ onSubmit, onBack }: PersonalityTestProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleAnswer = (value: number) => {
    const question = QUESTIONS[currentQuestion];
    const newAnswers = { ...answers };
    
    const answerValue = value * question.value;
    newAnswers[question.id] = answerValue;
    
    setAnswers(newAnswers);
    
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculatePersonality(newAnswers);
    }
  };

  const calculatePersonality = (allAnswers: Record<string, number>) => {
    const scores: Record<string, number> = {
      'E': 0, 'I': 0,
      'S': 0, 'N': 0,
      'T': 0, 'F': 0,
      'J': 0, 'P': 0,
    };

    QUESTIONS.forEach(q => {
      const answer = allAnswers[q.id] || 0;
      if (q.dimension === 'E/I') {
        scores[answer > 0 ? 'E' : 'I'] += Math.abs(answer);
      } else if (q.dimension === 'S/N') {
        scores[answer > 0 ? 'S' : 'N'] += Math.abs(answer);
      } else if (q.dimension === 'T/F') {
        scores[answer > 0 ? 'T' : 'F'] += Math.abs(answer);
      } else if (q.dimension === 'J/P') {
        scores[answer > 0 ? 'J' : 'P'] += Math.abs(answer);
      }
    });

    const personalityType = 
      (scores.E >= scores.I ? 'E' : 'I') +
      (scores.S >= scores.N ? 'S' : 'N') +
      (scores.T >= scores.F ? 'T' : 'F') +
      (scores.J >= scores.P ? 'J' : 'P');

    onSubmit({
      personality_type: personalityType,
      personality_scores: scores,
    });
  };

  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;
  const question = QUESTIONS[currentQuestion];

  return (
    <motion.div
      className="space-y-6 sm:space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#e6edf3] mb-2">Personality Test</h2>
        <p className="text-[#8b949e] text-sm sm:text-base">
          Answer these questions to help us understand your personality and working style.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-[#8b949e] mb-3 font-mono">
          <span>Question {currentQuestion + 1} of {QUESTIONS.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-[#161b22] rounded-full overflow-hidden border border-[#30363d]">
          <motion.div
            className="h-full bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 sm:p-8 mb-6 hover:border-[#7c3aed]/50 transition-all"
        >
          <h3 className="text-xl sm:text-2xl font-semibold text-[#e6edf3] mb-6 leading-relaxed">
            {question.text}
          </h3>
          
          <div className="space-y-3">
            {answerOptions.map((option, index) => (
              <motion.button
                key={option.value}
                type="button"
                onClick={() => handleAnswer(option.value)}
                className={`w-full px-6 py-4 rounded-xl font-medium text-left transition-all bg-gradient-to-r ${option.color} text-white shadow-lg hover:shadow-xl`}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {option.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between pt-4">
        <motion.button
          type="button"
          onClick={onBack}
          className="px-6 py-3 bg-[#161b22] text-[#8b949e] rounded-lg hover:bg-[#1c2128] hover:text-[#e6edf3] transition-all border border-[#30363d] font-medium"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ← Back
        </motion.button>
        {currentQuestion > 0 && (
          <motion.button
            type="button"
            onClick={() => setCurrentQuestion(currentQuestion - 1)}
            className="px-6 py-3 bg-[#161b22] text-[#8b949e] rounded-lg hover:bg-[#1c2128] hover:text-[#e6edf3] transition-all border border-[#30363d] font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Previous Question
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
