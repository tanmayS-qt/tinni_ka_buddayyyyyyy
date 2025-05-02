import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface CakeCeremonyProps {
  onComplete: () => void;
}

export const CakeCeremony: React.FC<CakeCeremonyProps> = ({ onComplete }) => {
  const [isCut, setIsCut] = React.useState(false);
  const [knifePosition, setKnifePosition] = React.useState({ x: 0, y: 0 });
  const [confetti, setConfetti] = React.useState<{ x: number; y: number }[]>([]);
  const [sliceOffset, setSliceOffset] = React.useState(0);
  const [candlesLit, setCandlesLit] = React.useState<boolean[]>(Array(3).fill(false));
  const [isDragging, setIsDragging] = React.useState(false);
  const [startPosition, setStartPosition] = React.useState({ x: 0, y: 0 });
  const lastTimeRef = React.useRef(Date.now());
  const lastPositionRef = React.useRef({ y: 0 });
  
  // New refs for throttling mouse movement updates
  const animationFrameRef = React.useRef<number | null>(null);
  const pendingMousePos = React.useRef<{ clientX: number; clientY: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isCut && candlesLit.every((lit) => lit)) {
      setIsDragging(true);
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      setStartPosition({ x: clientX, y: clientY });
      lastTimeRef.current = Date.now();
      lastPositionRef.current = { y: clientY };
    }
  };

  // Extracted processing of mouse movement
  const processMouseMove = (clientX: number, clientY: number) => {
    const deltaX = clientX - startPosition.x;
    const deltaY = clientY - startPosition.y;
    setKnifePosition({ x: deltaX, y: deltaY });

    if (deltaY > 100) {
      setSliceOffset(Math.min(100, deltaY - 100));
    }

    const currentTime = Date.now();
    const deltaTime = currentTime - lastTimeRef.current;
    if (deltaTime > 0) {
      const velocity = (clientY - lastPositionRef.current.y) / deltaTime;
      if (deltaY > 200 && velocity > 0.5) {
        setIsCut(true);
        createConfetti();
        setTimeout(onComplete, 3000);
      }
    }

    lastTimeRef.current = currentTime;
    lastPositionRef.current = { y: clientY };
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (isDragging && !isCut) {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      pendingMousePos.current = { clientX, clientY };
      if (animationFrameRef.current === null) {
        animationFrameRef.current = requestAnimationFrame(() => {
          if (pendingMousePos.current) {
            processMouseMove(pendingMousePos.current.clientX, pendingMousePos.current.clientY);
            pendingMousePos.current = null;
          }
          animationFrameRef.current = null;
        });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
      pendingMousePos.current = null;
    }
  };

  const createConfetti = () => {
    const newConfetti = Array.from({ length: 50 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
    }));
    setConfetti(newConfetti);
  };

  const lightCandle = (index: number) => {
    if (!candlesLit[index]) {
      const newCandlesLit = [...candlesLit];
      newCandlesLit[index] = true;
      setCandlesLit(newCandlesLit);
    }
  };

  return (
    <motion.div
      className="w-full h-screen bg-pink-50 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="text-3xl mb-8 text-pink-600 font-semibold text-center">
        {!isCut ? (
          <span>✨ Light the candles by clicking on them and drag down to cut the cake! ✨</span>
        ) : (
          <span>🎉 Happy Birthday TINNI Jii! 🎉</span>
        )}
      </div>

      <div 
        className="relative w-80 h-80" 
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
        style={{ touchAction: 'none' }}
      >
        {/* Cake Base */}
        <motion.div
          className="absolute bottom-0 w-full h-48 bg-gradient-to-b from-pink-200 to-pink-300 rounded-lg shadow-lg"
          style={{
            transformOrigin: 'center bottom',
            transform: isCut ? 'scale(1.05)' : 'scale(1)',
          }}
        >
          {/* Cake Layers */}
          <div className="absolute bottom-0 w-full">
            <div className="h-32 bg-gradient-to-b from-pink-300 to-pink-400 rounded-t-lg">
              {/* Frosting drips */}
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-0 w-6 h-8 bg-pink-200"
                  style={{
                    left: `${i * 14.28}%`,
                    borderRadius: '0 0 12px 12px',
                  }}
                  initial={{ y: -8 }}
                  animate={{ y: [-8, -6, -8] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </div>

          {/* Cake Slice (appears when cutting) */}
          {sliceOffset > 0 && (
            <motion.div
              className="absolute w-full"
              style={{
                height: `${sliceOffset}%`,
                bottom: 0,
                clipPath: 'polygon(45% 0%, 55% 0%, 100% 100%, 0% 100%)',
                background: 'linear-gradient(to bottom, #f9a8d4 0%, #f472b6 100%)',
                transformOrigin: 'bottom center',
              }}
              animate={isCut ? { y: 20, opacity: 0 } : {}}
            />
          )}

          {/* Enhanced Candles */}
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute bottom-full cursor-pointer"
              style={{
                left: `${30 + i * 20}%`,
                width: '12px',
                height: '40px',
                background: 'linear-gradient(to bottom, #fcd34d 30%, #fbbf24 70%, #d97706 100%)',
                borderRadius: '2px',
                transformOrigin: 'bottom center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
              animate={isCut ? { scaleY: 0 } : {
                rotate: [0, 2, -2, 0],
              }}
              transition={{ duration: 1, repeat: Infinity }}
              onClick={() => lightCandle(i)}
            >
              {/* Candle Wick */}
              <div
                className="absolute top-0 left-1/2 w-1 h-3 bg-gray-800"
                style={{
                  transform: 'translateX(-50%)',
                }}
              />
              {/* Enhanced Larger Flame */}
              {candlesLit[i] && (
                <>
                  {/* Inner Flame */}
                  <motion.div
                    className="absolute top-0 left-1/2"
                    style={{
                      width: '14px', // Increased from 8px
                      height: '24px', // Increased from 16px
                      transform: 'translate(-50%, -100%)',
                      background: 'radial-gradient(circle at bottom, #fff 0%, #fef08a 40%, #fbbf24 70%, #ea580c 100%)',
                      borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                      filter: 'blur(0.5px)',
                    }}
                    animate={{
                      scale: [1, 1.2, 0.9, 1],
                      rotate: [-2, 2, -1, 1, -2],
                    }}
                    transition={{ 
                      duration: 0.8, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  {/* Outer Glow */}
                  <motion.div
                    className="absolute top-0 left-1/2"
                    style={{
                      width: '24px', // Increased from 16px
                      height: '32px', // Increased from 24px
                      transform: 'translate(-50%, -95%)',
                      background: 'radial-gradient(circle at bottom, rgba(254, 240, 138, 0.4) 0%, rgba(251, 191, 36, 0.2) 40%, rgba(234, 88, 12, 0) 70%)',
                      borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                      filter: 'blur(1px)',
                    }}
                    animate={{
                      scale: [1, 1.3, 0.95, 1],
                      rotate: [-1, 1, -2, 2, -1],
                    }}
                    transition={{ 
                      duration: 1,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  {/* Additional Glow Effect */}
                  <motion.div
                    className="absolute top-0 left-1/2"
                    style={{
                      width: '32px', // New largest glow
                      height: '40px',
                      transform: 'translate(-50%, -90%)',
                      background: 'radial-gradient(circle at bottom, rgba(254, 240, 138, 0.15) 0%, rgba(251, 191, 36, 0.1) 30%, rgba(234, 88, 12, 0) 60%)',
                      borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                      filter: 'blur(2px)',
                    }}
                    animate={{
                      scale: [1, 1.2, 0.9, 1],
                      rotate: [1, -1, 2, -2, 1],
                    }}
                    transition={{ 
                      duration: 1.2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Knife */}
        {!isCut && candlesLit.every((lit) => lit) && (
          <motion.div
            className="absolute cursor-grab active:cursor-grabbing"
            style={{
              width: 40,
              height: 160,
              x: knifePosition.x,
              y: knifePosition.y,
              rotate: Math.min(45, Math.max(-45, knifePosition.x * 0.2)),
            }}
          >
            {/* Knife Blade */}
            <div 
              className="w-full h-24"
              style={{
                background: 'linear-gradient(90deg, #e5e7eb 0%, #f3f4f6 50%, #d1d5db 100%)',
                borderRadius: '4px 4px 2px 2px',
                boxShadow: '2px 2px 4px rgba(0,0,0,0.1), -1px -1px 2px rgba(255,255,255,0.5)',
              }}
            >
              {/* Knife Edge */}
              <div 
                className="absolute bottom-0 w-full h-1"
                style={{
                  background: 'linear-gradient(to right, #9ca3af, #d1d5db, #9ca3af)',
                }}
              />
            </div>
            {/* Handle */}
            <div 
              className="w-6 h-48 mx-auto"
              style={{
                background: 'linear-gradient(90deg, #4b5563 0%, #6b7280 50%, #4b5563 100%)',
                borderRadius: '0 0 8px 8px',
                boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.2), inset -2px -2px 4px rgba(255,255,255,0.1)',
              }}
            >
              {/* Handle Detail */}
              <div className="w-full h-full flex flex-col justify-around px-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-full h-1 bg-gray-500 rounded-full"
                    style={{
                      boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)',
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Confetti */}
        {isCut && confetti.map((pos, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ x: pos.x, y: pos.y, scale: 0 }}
            animate={{
              y: [pos.y, pos.y - 200],
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            <Sparkles className="text-yellow-500" size={24} />
          </motion.div>
        ))}
      </div>

      {isCut && (
        <motion.div
          className="mt-8 text-2xl text-pink-600 font-semibold"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Make a wish! ⭐️
        </motion.div>
      )}
    </motion.div>
  );
};

export default CakeCeremony;