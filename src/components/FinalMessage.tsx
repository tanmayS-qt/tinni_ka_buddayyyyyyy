import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export const FinalMessage: React.FC = () => {
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="max-w-2xl bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex justify-center mb-6"
        >
          <Heart className="text-pink-500" size={48} fill="currentColor" />
        </motion.div>

        <h1 className="text-4xl font-bold text-center text-pink-600 mb-6">
          Happy Birthday TINNI Jii!!
        </h1>

        <p className="text-lg text-gray-700 leading-relaxed font-semibold text-center">
        For My Tinni
        This little corner of the internet isn’t just a website—it’s a universe I built with every beat of my heart, just for you, Tinni. Because you're not just someone who walked into my life—you’re someone who stayed, who mattered, and who became a piece of my soul stitched into the shape of a sister. Every color here, every word and whisper across these pages holds a piece of how much you mean to me. You’ve seen me in ways no one else has, and with your presence, you’ve made even the ordinary moments feel like poetry. I made this space to remind you—whenever the world gets heavy or your smile feels dim—how deeply, unshakably, and warmly you are loved. You are magic wrapped in warmth, chaos wrapped in care, and strength wrapped in softness. And if this world ever forgets to treat you right, may this page forever remind you: someone out here built a whole world just to say—"you matter to me, more than you’ll ever know." 
        </p>

        <div className="text-center mt-8 text-2xl">
          I LOVE YOU SO SO MUCH BHENJIIII !!!!
        </div>
      </motion.div>
    </motion.div>
  );
};