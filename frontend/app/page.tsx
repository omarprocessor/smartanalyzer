'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AcademicInfo from '@/components/AcademicInfo';
import PersonalityTest from '@/components/PersonalityTest';
import Results from '@/components/Results';

type ProfileData = {
  subjects: string[];
  grades: Record<string, string>;
  favorite_subjects: string[];
  hobbies: string[];
  interests: string[];
  personality_type: string;
  personality_scores: Record<string, number>;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as any,
    },
  },
};

export default function Home() {
  const [step, setStep] = useState(1);
  const [profileData, setProfileData] = useState<Partial<ProfileData>>({});
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [backendStatus, setBackendStatus] = useState<string | null>(null);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/health/');
        if (response.ok) {
          const data = await response.json();
          setBackendStatus(`Backend connected - OpenAI: ${data.openai_configured ? 'Configured' : 'Not configured'}`);
        } else {
          setBackendStatus('Backend not responding');
        }
      } catch (error) {
        setBackendStatus('Cannot connect to backend - make sure Django server is running on port 8000');
      }
    };
    checkBackend();
  }, []);

  const handleAcademicSubmit = (data: {
    subjects: string[];
    grades: Record<string, string>;
    favorite_subjects: string[];
    hobbies: string[];
    interests: string[];
  }) => {
    setProfileData({ ...profileData, ...data });
    setStep(2);
  };

  const handlePersonalitySubmit = (data: {
    personality_type: string;
    personality_scores: Record<string, number>;
  }) => {
    const finalData = { ...profileData, ...data };
    setProfileData(finalData);
    classifyUser(finalData as ProfileData);
  };

  const classifyUser = async (data: ProfileData) => {
    setLoading(true);
    setError(null);
    
    console.log('Sending data to API:', JSON.stringify(data, null, 2));
    
    try {
      const response = await fetch('http://localhost:8000/api/classify/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseText = await response.text();

      if (!response.ok) {
        let errorData: any = {};
        let errorMessage = `Server error: ${response.status} ${response.statusText}`;
        
        if (responseText && responseText.trim().length > 0) {
          try {
            errorData = JSON.parse(responseText);
            if (errorData.error) {
              errorMessage = errorData.error;
            } else if (errorData.detail) {
              errorMessage = errorData.detail;
            } else if (typeof errorData === 'object' && Object.keys(errorData).length > 0) {
              const errorParts = Object.entries(errorData).map(([key, value]) => 
                `${key}: ${Array.isArray(value) ? value.join(', ') : value}`
              );
              errorMessage = `Validation errors: ${errorParts.join('; ')}`;
            }
          } catch (parseError) {
            errorMessage = `Server error (${response.status}): ${responseText.substring(0, 200)}`;
          }
        } else {
          errorMessage = `Server returned empty response (${response.status}). Check if the backend is running.`;
        }
        
        throw new Error(errorMessage);
      }

      let result: any = {};
      if (responseText && responseText.trim().length > 0) {
        try {
          result = JSON.parse(responseText);
        } catch (parseError) {
          throw new Error('Invalid response format from server');
        }
      } else {
        throw new Error('Server returned empty response');
      }
      
      setRecommendations(result.recommendations || []);
      setStep(3);
    } catch (error: any) {
      let errorMessage = 'Failed to get recommendations. ';
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage += 'Cannot connect to backend. Make sure the Django server is running on http://localhost:8000';
      } else if (error.message) {
        errorMessage = error.message;
      } else {
        errorMessage += 'Please check your connection and try again.';
      }
      
      setError(errorMessage);
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, label: 'Academic Info', icon: '📚' },
    { number: 2, label: 'Personality', icon: '🧠' },
    { number: 3, label: 'Results', icon: '✨' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7c3aed] opacity-10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#22d3ee] opacity-10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <motion.div
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.header
          className="text-center mb-12 sm:mb-16"
          variants={itemVariants}
        >
          <motion.h1
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold mb-4 bg-gradient-to-r from-[#7c3aed] via-[#a78bfa] to-[#22d3ee] bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            Smart Analyzer
          </motion.h1>
          <motion.p
            className="text-[#8b949e] text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Discover your perfect course match through intelligent analysis of your academic profile, interests, and personality
          </motion.p>
        </motion.header>

        <motion.div
          className="max-w-5xl mx-auto"
          variants={itemVariants}
        >
          <div className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 border border-[#30363d] shadow-2xl">
            {/* Backend Status */}
            <AnimatePresence>
              {backendStatus && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`mb-6 p-4 rounded-xl text-sm border ${
                    backendStatus.includes('connected') && backendStatus.includes('Configured')
                      ? 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30'
                      : backendStatus.includes('connected')
                      ? 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/30'
                      : 'bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/30'
                  }`}
                >
                  <span className="font-mono text-xs">{backendStatus}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Progress Indicator */}
            <motion.div
              className="mb-10 sm:mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-4">
                {steps.map((stepItem, index) => (
                  <div key={stepItem.number} className="flex-1 flex items-center">
                    <div className="flex flex-col items-center flex-1">
                      <motion.div
                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold border-2 transition-all duration-300 ${
                          step >= stepItem.number
                            ? 'bg-[#7c3aed] border-[#7c3aed] text-white shadow-lg glow-primary'
                            : 'bg-[#161b22] border-[#30363d] text-[#6e7681]'
                        }`}
                        whileHover={{ scale: 1.1 }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.1, type: 'spring', stiffness: 200 }}
                      >
                        {stepItem.icon}
                      </motion.div>
                      <span className={`mt-2 text-xs sm:text-sm font-medium ${
                        step >= stepItem.number ? 'text-[#e6edf3]' : 'text-[#6e7681]'
                      }`}>
                        {stepItem.label}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-2 sm:mx-4 transition-all duration-500 ${
                        step > stepItem.number ? 'bg-[#7c3aed]' : 'bg-[#30363d]'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Step Content */}
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  {Object.keys(profileData).length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 bg-[#161b22] border border-[#30363d] rounded-xl"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold text-[#e6edf3]">Current Data Preview</h3>
                        <button
                          onClick={() => setShowDebug(!showDebug)}
                          className="text-xs text-[#7c3aed] hover:text-[#a78bfa] transition-colors font-mono"
                        >
                          {showDebug ? 'Hide' : 'Show'} Details
                        </button>
                      </div>
                      {showDebug && (
                        <pre className="text-xs bg-[#0d1117] p-3 rounded border border-[#30363d] overflow-auto max-h-48 mt-2 font-mono text-[#8b949e]">
                          {JSON.stringify(profileData, null, 2)}
                        </pre>
                      )}
                    </motion.div>
                  )}
                  <AcademicInfo onSubmit={handleAcademicSubmit} />
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 bg-[#ef4444]/10 border-2 border-[#ef4444]/30 rounded-xl"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-[#ef4444] text-xl">⚠</div>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-[#ef4444] mb-1">Error</h3>
                          <p className="text-sm text-[#ef4444]/90">{error}</p>
                          <div className="mt-3 flex gap-2">
                            <button
                              onClick={() => setError(null)}
                              className="text-xs text-[#ef4444] hover:text-[#ef4444]/80 transition-colors"
                            >
                              Dismiss
                            </button>
                            <button
                              onClick={() => setShowDebug(!showDebug)}
                              className="text-xs text-[#ef4444] hover:text-[#ef4444]/80 transition-colors"
                            >
                              {showDebug ? 'Hide' : 'Show'} Debug
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  {showDebug && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mb-6 p-4 bg-[#161b22] border border-[#30363d] rounded-xl"
                    >
                      <pre className="text-xs bg-[#0d1117] p-3 rounded border border-[#30363d] overflow-auto max-h-64 font-mono text-[#8b949e]">
                        {JSON.stringify(profileData, null, 2)}
                      </pre>
                    </motion.div>
                  )}
                  
                  <PersonalityTest
                    onSubmit={handlePersonalitySubmit}
                    onBack={() => {
                      setStep(1);
                      setError(null);
                      setShowDebug(false);
                    }}
                  />
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                >
                  <Results
                    recommendations={recommendations}
                    onRestart={() => {
                      setStep(1);
                      setProfileData({});
                      setRecommendations([]);
                      setError(null);
                    }}
                  />
                </motion.div>
              )}

              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-16"
                >
                  <motion.div
                    className="inline-block w-16 h-16 border-4 border-[#7c3aed] border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  <p className="mt-6 text-[#8b949e] font-medium">Analyzing your profile and generating recommendations...</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
