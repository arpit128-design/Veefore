import React from 'react';
import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';
import { useLocation } from 'wouter';

export default function TestLanding() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black text-white flex items-center justify-center">
      <div className="text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center mb-8"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
            <Rocket className="w-8 h-8 text-white" />
          </div>
          <span className="text-4xl font-bold text-white">VeeFore</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent"
        >
          Test Landing Page
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-xl text-gray-300 mb-8"
        >
          Testing navigation without API dependencies
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex gap-4 justify-center"
        >
          <button 
            onClick={() => setLocation('/signin')}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            Sign In
          </button>
          <button 
            onClick={() => setLocation('/signup')}
            className="px-8 py-3 bg-transparent border border-purple-500 rounded-lg font-semibold hover:bg-purple-500/10 transition-all"
          >
            Sign Up
          </button>
        </motion.div>
      </div>
    </div>
  );
}