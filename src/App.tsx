import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Music2, Sparkles, Heart, Stars, Gift, Cake, PartyPopper } from 'lucide-react';
import { Room } from './components/Room';
import { CakeCeremony } from './components/CakeCeremony';
import { FinalMessage } from './components/FinalMessage';
import bgMusic from './components/music/findingher.mp3';
import { PhotoGallery } from './components/PhotoGallery';

// Animated background cycling through gradients that include #5E2BFF
function AnimatedBackground() {
  return (
    <motion.div
      className="absolute inset-0 z-0"
      animate={{
        background: [
          "linear-gradient(45deg, #5E2BFF, #8A6DFF)",
          "linear-gradient(45deg, #5E2BFF, #FF66CC)",
          "linear-gradient(45deg, #5E2BFF, #66CCFF)"
        ]
      }}
      transition={{
        duration: 15,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  );
}

function BgMusic({ isPlaying }: { isPlaying: boolean }) {
  const audioRef = useRef(new Audio(bgMusic));

  useEffect(() => {
    audioRef.current.loop = true;
    return () => {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => console.log('Audio playback failed:', error));
      }
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  return null;
}

function FloatingIcon({ Icon, delay }: { Icon: any; delay: number }) {
  return (
    <motion.div
      initial={{ y: -15, opacity: 0 }}
      animate={{
        y: [0, 15, 0],
        opacity: [0, 0.9, 0],
        scale: [0.8, 1.2, 0.8]
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`
      }}
    >
      <Icon className="text-[#5E2BFF]" size={28} />
    </motion.div>
  );
}

function App() {
  const [stage, setStage] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [showButtons, setShowButtons] = useState(false);
  const [showSongMessage, setShowSongMessage] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [isLightOn, setIsLightOn] = useState(false);

  const initializeMusic = () => {
    if (!isMusicPlaying) setIsMusicPlaying(true);
  };

  useEffect(() => {
    const messageTimer = setTimeout(() => {
      if (currentMessageIndex < messages.length - 1) {
        setCurrentMessageIndex(prev => prev + 1);
        if (currentMessageIndex === messages.length - 2) setShowButtons(true);
      }
    }, 2500);

    return () => clearTimeout(messageTimer);
  }, [currentMessageIndex]);

  const handleButtonClick = () => setShowSongMessage(true);

  const handleSongChoice = () => {
    initializeMusic();
    setShowSongMessage(false);
    setShowFinalMessage(true);
    setTimeout(() => {
      setStage(1);
      setIsLightOn(true);
    }, 2000);
  };

  const toggleMusic = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMusicPlaying(prev => !prev);
  };

  const messages = [
    "Hey TINNI✨ It's your day to shine!",
    "I’ve set up something super vibrant just for you...",
    "Remember, you light up every room you enter!"
  ];

  const messageVariants = {
    initial: { opacity: 0, y: 30, scale: 0.95, filter: 'blur(8px)' },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1], scale: { type: "spring", damping: 15, stiffness: 100 } }
    },
    exit: { opacity: 0, y: -20, scale: 0.9, filter: 'blur(6px)', transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } }
  };

  const floatingIcons = [Stars, Gift, Cake, PartyPopper, Heart];

  const renderStage = () => {
    switch (stage) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen relative overflow-hidden"
          >
            {/* Animated vibrant background without blur */}
            <AnimatedBackground />

            {/* Floating animated icons */}
            <div className="absolute inset-0 z-10">
              {floatingIcons.map((Icon, index) =>
                Array.from({ length: 3 }).map((_, i) => (
                  <FloatingIcon key={`${index}-${i}`} Icon={Icon} delay={index * 0.3 + i} />
                ))
              )}
            </div>

            <div className="relative z-20 flex items-center justify-center min-h-screen px-4">
              <AnimatePresence mode="wait">
                {!showSongMessage && !showFinalMessage ? (
                  <motion.div
                    key="message"
                    variants={messageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="bg-white/20 backdrop-blur-xl p-10 rounded-xl shadow-2xl border border-white/40 max-w-lg w-full text-center"
                  >
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                      className="mb-6 flex justify-center"
                    >
                      <Sparkles className="text-yellow-400" size={44} />
                    </motion.div>
                    <motion.p className="text-xl md:text-2xl font-semibold text-white mb-8">
                      {messages[currentMessageIndex]}
                    </motion.p>
                    {showButtons && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex justify-center space-x-4"
                      >
                        {['Yes, please!', 'Show me!'].map((text, index) => (
                          <motion.button
                            key={text}
                            onClick={handleButtonClick}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-6 py-3 rounded-full font-medium transition transform
                              ${index === 0
                                ? 'bg-gradient-to-r from-[#5E2BFF] to-[#8A6DFF]'
                                : 'bg-gradient-to-r from-[#7A4BFF] to-[#A15CFF]'
                              } text-white shadow-lg`}
                          >
                            {text}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </motion.div>
                ) : showSongMessage ? (
                  <motion.div
                    key="song-message"
                    variants={messageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="bg-white/20 backdrop-blur-xl p-10 rounded-xl shadow-2xl border border-white/40 max-w-lg w-full text-center"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="mb-6 flex justify-center"
                    >
                      <Music2 className="text-[#5E2BFF]" size={44} />
                    </motion.div>
                    <p className="text-xl md:text-2xl font-semibold text-white mb-8">
                      I've curated a special song just for you. Ready to listen?
                    </p>
                    <motion.div 
                      className="flex justify-center space-x-4" 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      transition={{ duration: 0.6 }}
                    >
                      {['Yes, play it!', 'Absolutely!'].map((text, index) => (
                        <motion.button
                          key={text}
                          onClick={handleSongChoice}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-6 py-3 rounded-full font-medium transition transform
                            ${index === 0
                              ? 'bg-gradient-to-r from-[#5E2BFF] to-[#8A6DFF]'
                              : 'bg-gradient-to-r from-[#7A4BFF] to-[#A15CFF]'
                            } text-white shadow-lg`}
                        >
                          {text}
                        </motion.button>
                      ))}
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="final"
                    variants={messageVariants}
                    initial="initial"
                    animate="animate"
                    className="bg-white/20 backdrop-blur-xl p-10 rounded-xl shadow-2xl border border-white/40 max-w-lg w-full text-center"
                  >
                    <motion.p
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="text-xl md:text-2xl font-semibold text-white"
                    >
                      Let's get this party started!
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );

      case 1:
        return <Room isLightOn={isLightOn} onComplete={() => setStage(2)} />;
      case 2:
        return <CakeCeremony onComplete={() => setStage(3)} />;
      case 3:
        return (
          // Pass the new stopBgMusic prop so that the PhotoGallery can stop bg music
          <PhotoGallery 
            onComplete={() => setStage(4)} 
            stopBgMusic={() => setIsMusicPlaying(false)}
          />
        );
      case 4:
        return <FinalMessage />;
      default:
        return null;
    }
  };

  return (
    <div className="relative">
      <motion.button
        className="fixed top-5 right-5 z-50 bg-white/30 backdrop-blur p-3 rounded-full shadow-lg hover:shadow-xl border border-white/40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleMusic}
      >
        {isMusicPlaying ? (
          <Music2 size={24} className="text-[#5E2BFF]" />
        ) : (
          <Music size={24} className="text-white" />
        )}
      </motion.button>

      <BgMusic isPlaying={isMusicPlaying} />

      <AnimatePresence mode="wait">{renderStage()}</AnimatePresence>
    </div>
  );
}

export default App;
