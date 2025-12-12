'use client';

import { motion } from 'framer-motion';

type Recommendation = {
  name: string;
  description: string;
  fit_reason: string;
  career_paths: string | string[];
};

type ResultsProps = {
  recommendations: Recommendation[];
  onRestart: () => void;
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

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function Results({ recommendations, onRestart }: ResultsProps) {
  const getCareerPaths = (paths: string | string[]): string[] => {
    if (typeof paths === 'string') {
      return paths.split(',').map(p => p.trim()).filter(p => p);
    }
    return paths;
  };

  const accentColors = [
    'from-[#7c3aed] to-[#a78bfa]',
    'from-[#22d3ee] to-[#7c3aed]',
    'from-[#ec4899] to-[#7c3aed]',
    'from-[#10b981] to-[#22d3ee]',
    'from-[#f59e0b] to-[#ec4899]',
  ];

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="text-center mb-10" variants={cardVariants}>
        <motion.h2
          className="font-display text-4xl sm:text-5xl font-bold text-[#e6edf3] mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Your Course Recommendations
        </motion.h2>
        <motion.p
          className="text-[#8b949e] text-lg sm:text-xl max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Based on your academic profile, interests, and personality, here are courses that might be a perfect fit for you!
        </motion.p>
      </motion.div>

      {recommendations.length === 0 ? (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-[#8b949e] text-lg">No recommendations available. Please try again.</p>
        </motion.div>
      ) : (
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
          {recommendations.map((rec, index) => {
            const colorClass = accentColors[index % accentColors.length];
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 rounded-2xl"
                  style={{
                    background: index % 2 === 0 
                      ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.3), rgba(34, 211, 238, 0.3))'
                      : 'linear-gradient(135deg, rgba(236, 72, 153, 0.3), rgba(124, 58, 237, 0.3))'
                  }}
                />
                <div className="relative bg-[#161b22] border border-[#30363d] rounded-2xl p-6 sm:p-8 hover:border-[#7c3aed]/50 transition-all h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#e6edf3] flex-1 pr-4">
                      {rec.name}
                    </h3>
                    <motion.span
                      className={`px-4 py-2 bg-gradient-to-r ${colorClass} text-white rounded-full text-sm font-bold font-mono shrink-0`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      #{index + 1}
                    </motion.span>
                  </div>
                  
                  <p className="text-[#8b949e] mb-6 leading-relaxed flex-grow">
                    {rec.description}
                  </p>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-[#e6edf3] mb-3 flex items-center gap-2">
                      <span className="w-1 h-6 bg-gradient-to-b from-[#7c3aed] to-[#22d3ee] rounded-full"></span>
                      Why it's a good fit
                    </h4>
                    <p className="text-[#8b949e] text-sm leading-relaxed">
                      {rec.fit_reason}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-[#e6edf3] mb-3 flex items-center gap-2">
                      <span className="w-1 h-6 bg-gradient-to-b from-[#22d3ee] to-[#ec4899] rounded-full"></span>
                      Potential Career Paths
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {getCareerPaths(rec.career_paths).map((path, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                          className="px-3 py-1.5 bg-[#0d1117] text-[#22d3ee] rounded-full text-xs sm:text-sm border border-[#22d3ee]/30 font-mono"
                        >
                          {path}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <motion.div
        className="flex justify-center mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <motion.button
          onClick={onRestart}
          className="px-8 py-4 bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] text-white rounded-lg font-semibold text-base shadow-lg glow-primary hover:from-[#8b5cf6] hover:to-[#c4b5fd] transition-all"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Over
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
