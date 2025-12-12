'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type AcademicInfoProps = {
  onSubmit: (data: {
    subjects: string[];
    grades: Record<string, string>;
    favorite_subjects: string[];
    hobbies: string[];
    interests: string[];
  }) => void;
};

const COMMON_SUBJECTS = [
  'Mathematics', 'English', 'Science', 'History', 'Geography',
  'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Art',
  'Music', 'Physical Education', 'Foreign Language', 'Economics',
  'Psychology', 'Literature', 'Philosophy', 'Statistics'
];

const GRADE_OPTIONS = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export default function AcademicInfo({ onSubmit }: AcademicInfoProps) {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [grades, setGrades] = useState<Record<string, string>>({});
  const [favoriteSubjects, setFavoriteSubjects] = useState<string[]>([]);
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [customSubject, setCustomSubject] = useState('');
  const [customHobby, setCustomHobby] = useState('');
  const [customInterest, setCustomInterest] = useState('');

  const addSubject = (subject: string) => {
    if (!subjects.includes(subject)) {
      setSubjects([...subjects, subject]);
      if (!grades[subject]) {
        setGrades({ ...grades, [subject]: 'B' });
      }
    }
  };

  const removeSubject = (subject: string) => {
    setSubjects(subjects.filter(s => s !== subject));
    const newGrades = { ...grades };
    delete newGrades[subject];
    setGrades(newGrades);
    setFavoriteSubjects(favoriteSubjects.filter(s => s !== subject));
  };

  const toggleFavorite = (subject: string) => {
    if (favoriteSubjects.includes(subject)) {
      setFavoriteSubjects(favoriteSubjects.filter(s => s !== subject));
    } else {
      setFavoriteSubjects([...favoriteSubjects, subject]);
    }
  };

  const addCustomSubject = () => {
    if (customSubject.trim() && !subjects.includes(customSubject.trim())) {
      addSubject(customSubject.trim());
      setCustomSubject('');
    }
  };

  const addHobby = (hobby: string) => {
    if (hobby.trim() && !hobbies.includes(hobby.trim())) {
      setHobbies([...hobbies, hobby.trim()]);
    }
  };

  const removeHobby = (hobby: string) => {
    setHobbies(hobbies.filter(h => h !== hobby));
  };

  const addInterest = (interest: string) => {
    if (interest.trim() && !interests.includes(interest.trim())) {
      setInterests([...interests, interest.trim()]);
    }
  };

  const removeInterest = (interest: string) => {
    setInterests(interests.filter(i => i !== interest));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subjects.length === 0) {
      alert('Please add at least one subject');
      return;
    }
    onSubmit({
      subjects,
      grades,
      favorite_subjects: favoriteSubjects,
      hobbies,
      interests,
    });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-8 sm:space-y-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#e6edf3] mb-2">Academic Information</h2>
        <p className="text-[#8b949e] text-sm sm:text-base">Tell us about your academic journey</p>
      </motion.div>
      
      {/* Subjects */}
      <motion.div className="space-y-4" variants={itemVariants}>
        <label className="block text-sm font-semibold text-[#e6edf3] mb-3">
          High School Subjects <span className="text-[#ef4444]">*</span>
        </label>
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
          {COMMON_SUBJECTS.map((subject, index) => (
            <motion.button
              key={subject}
              type="button"
              onClick={() => addSubject(subject)}
              disabled={subjects.includes(subject)}
              className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg text-sm font-medium transition-all duration-300 font-mono ${
                subjects.includes(subject)
                  ? 'bg-[#7c3aed] text-white cursor-not-allowed shadow-lg glow-primary'
                  : 'bg-[#161b22] text-[#8b949e] hover:bg-[#1c2128] hover:text-[#e6edf3] border border-[#30363d] hover:border-[#7c3aed]/50'
              }`}
              whileHover={!subjects.includes(subject) ? { scale: 1.05, y: -2 } : {}}
              whileTap={!subjects.includes(subject) ? { scale: 0.95 } : {}}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02 }}
            >
              {subject}
            </motion.button>
          ))}
        </div>
        <div className="flex gap-2 sm:gap-3">
          <input
            type="text"
            value={customSubject}
            onChange={(e) => setCustomSubject(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSubject())}
            placeholder="Add custom subject"
            className="flex-1 px-4 py-3 text-base bg-[#161b22] border-2 border-[#30363d] rounded-lg text-[#e6edf3] placeholder-[#6e7681] focus:border-[#7c3aed] focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 transition-all"
          />
          <motion.button
            type="button"
            onClick={addCustomSubject}
            className="px-6 py-3 bg-[#30363d] text-[#e6edf3] rounded-lg hover:bg-[#484f58] transition-colors font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add
          </motion.button>
        </div>
        
        {/* Selected Subjects with Grades */}
        <AnimatePresence>
          {subjects.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 space-y-3"
            >
              <p className="text-sm font-semibold text-[#8b949e] mb-3">Selected Subjects & Grades</p>
              {subjects.map((subject, index) => (
                <motion.div
                  key={subject}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 bg-[#161b22] border border-[#30363d] rounded-xl hover:border-[#7c3aed]/50 transition-all group"
                >
                  <span className="flex-1 font-semibold text-base text-[#e6edf3]">{subject}</span>
                  <label className="flex items-center gap-2 cursor-pointer group-hover:text-[#7c3aed] transition-colors">
                    <input
                      type="checkbox"
                      checked={favoriteSubjects.includes(subject)}
                      onChange={() => toggleFavorite(subject)}
                      className="w-5 h-5 rounded border-2 border-[#30363d] bg-[#0d1117] text-[#7c3aed] focus:ring-2 focus:ring-[#7c3aed]/20 cursor-pointer"
                    />
                    <span className="text-sm font-medium text-[#8b949e] group-hover:text-[#e6edf3]">Favorite</span>
                  </label>
                  <select
                    value={grades[subject] || 'B'}
                    onChange={(e) => setGrades({ ...grades, [subject]: e.target.value })}
                    className="px-4 py-2 text-base border-2 border-[#30363d] rounded-lg bg-[#0d1117] text-[#e6edf3] focus:border-[#7c3aed] focus:outline-none font-mono font-semibold cursor-pointer"
                  >
                    {GRADE_OPTIONS.map(grade => (
                      <option key={grade} value={grade} className="bg-[#0d1117]">{grade}</option>
                    ))}
                  </select>
                  <motion.button
                    type="button"
                    onClick={() => removeSubject(subject)}
                    className="text-[#ef4444] hover:text-[#ef4444]/80 text-2xl font-bold transition-colors"
                    whileHover={{ scale: 1.2, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ×
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Hobbies */}
      <motion.div className="space-y-4" variants={itemVariants}>
        <label className="block text-sm font-semibold text-[#e6edf3] mb-3">
          Hobbies & Extracurricular Activities
        </label>
        <div className="flex gap-2 sm:gap-3">
          <input
            type="text"
            value={customHobby}
            onChange={(e) => setCustomHobby(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHobby(customHobby))}
            placeholder="e.g., Photography, Sports, Reading"
            className="flex-1 px-4 py-3 text-base bg-[#161b22] border-2 border-[#30363d] rounded-lg text-[#e6edf3] placeholder-[#6e7681] focus:border-[#22d3ee] focus:outline-none focus:ring-2 focus:ring-[#22d3ee]/20 transition-all"
          />
          <motion.button
            type="button"
            onClick={() => addHobby(customHobby)}
            className="px-6 py-3 bg-[#30363d] text-[#e6edf3] rounded-lg hover:bg-[#484f58] transition-colors font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add
          </motion.button>
        </div>
        <AnimatePresence>
          {hobbies.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-2 sm:gap-3"
            >
              {hobbies.map((hobby, index) => (
                <motion.span
                  key={hobby}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.05 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#22d3ee]/20 to-[#7c3aed]/20 text-[#22d3ee] rounded-full text-sm font-medium border border-[#22d3ee]/30"
                >
                  {hobby}
                  <button
                    type="button"
                    onClick={() => removeHobby(hobby)}
                    className="text-[#22d3ee] hover:text-[#22d3ee]/80 font-bold"
                  >
                    ×
                  </button>
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Interests */}
      <motion.div className="space-y-4" variants={itemVariants}>
        <label className="block text-sm font-semibold text-[#e6edf3] mb-3">
          Areas of Interest
        </label>
        <div className="flex gap-2 sm:gap-3">
          <input
            type="text"
            value={customInterest}
            onChange={(e) => setCustomInterest(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest(customInterest))}
            placeholder="e.g., Technology, Art, Medicine, Business"
            className="flex-1 px-4 py-3 text-base bg-[#161b22] border-2 border-[#30363d] rounded-lg text-[#e6edf3] placeholder-[#6e7681] focus:border-[#ec4899] focus:outline-none focus:ring-2 focus:ring-[#ec4899]/20 transition-all"
          />
          <motion.button
            type="button"
            onClick={() => addInterest(customInterest)}
            className="px-6 py-3 bg-[#30363d] text-[#e6edf3] rounded-lg hover:bg-[#484f58] transition-colors font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add
          </motion.button>
        </div>
        <AnimatePresence>
          {interests.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-2 sm:gap-3"
            >
              {interests.map((interest, index) => (
                <motion.span
                  key={interest}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.05 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#ec4899]/20 to-[#7c3aed]/20 text-[#ec4899] rounded-full text-sm font-medium border border-[#ec4899]/30"
                >
                  {interest}
                  <button
                    type="button"
                    onClick={() => removeInterest(interest)}
                    className="text-[#ec4899] hover:text-[#ec4899]/80 font-bold"
                  >
                    ×
                  </button>
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div className="flex justify-end pt-4" variants={itemVariants}>
        <motion.button
          type="submit"
          className="px-8 py-4 bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] text-white rounded-lg font-semibold text-base shadow-lg glow-primary hover:from-[#8b5cf6] hover:to-[#c4b5fd] transition-all"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          Continue to Personality Test →
        </motion.button>
      </motion.div>
    </motion.form>
  );
}
