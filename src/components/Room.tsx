// import React, { useRef, useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import { Heart, Star, Gift, Sparkles, Trash2, Music } from 'lucide-react';

// const DecorationType = {
//   HEART: 0,
//   STAR: 1,
//   GIFT: 2
// };

// const COLORS = {
//   [DecorationType.HEART]: ['text-pink-500', 'text-red-500', 'text-purple-500'],
//   [DecorationType.STAR]: ['text-yellow-400', 'text-purple-500', 'text-blue-400'],
//   [DecorationType.GIFT]: ['text-red-500', 'text-green-500', 'text-blue-500']
// };

// // Musical notes for each decoration type
// const NOTES = {
//   [DecorationType.HEART]: ['C4', 'E4', 'G4'],
//   [DecorationType.STAR]: ['D4', 'F4', 'A4'],
//   [DecorationType.GIFT]: ['E4', 'G4', 'B4']
// };

// interface Decoration {
//   id: string;
//   x: number;
//   y: number;
//   type: number;
//   size: number;
//   color: string;
//   rotation: number;
//   note: string;
// }

// interface RoomProps {
//   onComplete: () => void;
//   isLightOn: boolean;
// }

// export const Room: React.FC<RoomProps> = ({ onComplete, isLightOn }) => {
//   const [decorations, setDecorations] = useState<Decoration[]>([]);
//   const [selectedTool, setSelectedTool] = useState(DecorationType.HEART);
//   const [selectedDecoration, setSelectedDecoration] = useState<string | null>(null);
//   const [isErasing, setIsErasing] = useState(false);
//   const [isMuted, setIsMuted] = useState(false);
//   const audioContext = useRef<AudioContext | null>(null);
//   const oscillator = useRef<OscillatorNode | null>(null);

//   useEffect(() => {
//     // Initialize AudioContext
//     audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
//     return () => {
//       if (audioContext.current) {
//         audioContext.current.close();
//       }
//     };
//   }, []);

//   const playNote = (note: string) => {
//     if (isMuted || !audioContext.current) return;

//     // Convert note name to frequency
//     const noteToFreq: { [key: string]: number } = {
//       'C4': 261.63, 'D4': 293.66, 'E4': 329.63,
//       'F4': 349.23, 'G4': 392.00, 'A4': 440.00,
//       'B4': 493.88
//     };

//     const frequency = noteToFreq[note];
    
//     // Create and configure oscillator
//     const osc = audioContext.current.createOscillator();
//     const gainNode = audioContext.current.createGain();
    
//     osc.type = 'sine';
//     osc.frequency.setValueAtTime(frequency, audioContext.current.currentTime);
    
//     gainNode.gain.setValueAtTime(0.5, audioContext.current.currentTime);
//     gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.current.currentTime + 0.5);
    
//     osc.connect(gainNode);
//     gainNode.connect(audioContext.current.destination);
    
//     osc.start();
//     osc.stop(audioContext.current.currentTime + 0.5);
//   };

//   const addDecoration = (x: number, y: number) => {
//     if (isErasing) return;
    
//     const note = NOTES[selectedTool][Math.floor(Math.random() * NOTES[selectedTool].length)];
//     playNote(note);
    
//     const newDecoration: Decoration = {
//       id: `dec-${Date.now()}`,
//       x,
//       y,
//       type: selectedTool,
//       size: Math.random() * 16 + 24,
//       color: COLORS[selectedTool][Math.floor(Math.random() * COLORS[selectedTool].length)],
//       rotation: Math.random() * 360,
//       note
//     };
//     setDecorations([...decorations, newDecoration]);
//   };

//   const handleDecorationClick = (e: React.MouseEvent, decoration: Decoration) => {
//     e.stopPropagation();
//     if (isErasing) {
//       setDecorations(decorations.filter(d => d.id !== decoration.id));
//       playNote(decoration.note); // Play note when removing
//     } else {
//       setSelectedDecoration(selectedDecoration === decoration.id ? null : decoration.id);
//       playNote(decoration.note); // Play note when selecting
//     }
//   };

//   const renderDecoration = (decoration: Decoration) => {
//     const isSelected = selectedDecoration === decoration.id;
//     const props = {
//       size: decoration.size,
//       className: `${decoration.color} ${isSelected ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`,
//       style: { 
//         transform: `rotate(${decoration.rotation}deg)`,
//         animation: 'sparkle 1.5s infinite'
//       }
//     };

//     switch (decoration.type) {
//       case DecorationType.HEART:
//         return <Heart {...props} />;
//       case DecorationType.STAR:
//         return <Star {...props} />;
//       case DecorationType.GIFT:
//         return <Gift {...props} />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <motion.div
//       className={`w-full h-screen relative transition-all duration-1000 ${
//         isLightOn ? 'bg-pink-50' : 'bg-gray-900'
//       } ${isErasing ? 'cursor-not-allowed' : 'cursor-crosshair'}`}
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       onClick={(e) => {
//         const rect = e.currentTarget.getBoundingClientRect();
//         addDecoration(e.clientX - rect.left, e.clientY - rect.top);
//       }}
//     >
//       {isLightOn && (
//         <>
//           {/* Toolbar */}
//           <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg p-2 flex gap-2">
//             {Object.values(DecorationType).map((type) => (
//               <motion.button
//                 key={type}
//                 className={`p-2 rounded-full ${
//                   selectedTool === type ? 'bg-pink-100' : 'hover:bg-gray-100'
//                 }`}
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setSelectedTool(type);
//                   setIsErasing(false);
//                 }}
//               >
//                 {type === DecorationType.HEART && <Heart className="text-pink-500" />}
//                 {type === DecorationType.STAR && <Star className="text-yellow-400" />}
//                 {type === DecorationType.GIFT && <Gift className="text-red-500" />}
//               </motion.button>
//             ))}
//             <motion.button
//               className={`p-2 rounded-full ${
//                 isErasing ? 'bg-red-100' : 'hover:bg-gray-100'
//               }`}
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setIsErasing(!isErasing);
//               }}
//             >
//               <Trash2 className="text-red-500" />
//             </motion.button>
//             <motion.button
//               className={`p-2 rounded-full ${
//                 isMuted ? 'bg-gray-200' : 'hover:bg-gray-100'
//               }`}
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setIsMuted(!isMuted);
//               }}
//             >
//               <Music className={isMuted ? 'text-gray-400' : 'text-blue-500'} />
//             </motion.button>
//           </div>

//           {/* Decorations */}
//           {decorations.map((decoration) => (
//             <motion.div
//               key={decoration.id}
//               className="absolute"
//               initial={{ scale: 0, opacity: 0 }}
//               animate={{ 
//                 scale: 1, 
//                 opacity: 1,
//                 x: decoration.x - decoration.size / 2,
//                 y: decoration.y - decoration.size / 2
//               }}
//               whileHover={{ scale: 1.1 }}
//               drag={!isErasing}
//               dragMomentum={false}
//               onDragEnd={(_, info) => {
//                 const updatedDecorations = decorations.map(d => {
//                   if (d.id === decoration.id) {
//                     return {
//                       ...d,
//                       x: d.x + info.offset.x,
//                       y: d.y + info.offset.y
//                     };
//                   }
//                   return d;
//                 });
//                 setDecorations(updatedDecorations);
//                 playNote(decoration.note); // Play note when finishing drag
//               }}
//               onClick={(e) => handleDecorationClick(e, decoration)}
//             >
//               {renderDecoration(decoration)}
//             </motion.div>
//           ))}

//           {/* Continue Button */}
//           {decorations.length >= 6 && (
//             <motion.button
//               className="fixed bottom-8 right-8 bg-pink-500 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-pink-600 flex items-center gap-2"
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={onComplete}
//             >
//               <Sparkles className="w-5 h-5" />
//               Continue to Cake Ceremony →
//             </motion.button>
//           )}

//           <style jsx>{`
//             @keyframes sparkle {
//               0%, 100% { transform: scale(1) rotate(0deg); }
//               50% { transform: scale(1.1) rotate(5deg); }
//             }
//           `}</style>
//         </>
//       )}
//     </motion.div>
//   );
// };

// export default Room;





// Ballons

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import BurstS from './burst.mp3'

interface Balloon {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  sway: number; // Swaying motion for realism
}

interface RoomProps {
  onComplete: () => void;
}

export const Room: React.FC<RoomProps> = ({ onComplete }) => {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [burstCount, setBurstCount] = useState(0);
  const audioContext = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Initialize AudioContext
    audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);

  useEffect(() => {
    // Continuously generate new balloons
    const balloonInterval = setInterval(() => {
      const newBalloon: Balloon = {
        id: `balloon-${Date.now()}`,
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + 100, // Start below the screen
        size: Math.random() * 40 + 60,
        color: `hsl(${Math.random() * 360}, 100%, 75%)`,
        rotation: Math.random() * 360,
        sway: Math.random() * 20 - 10, // Random sway for natural movement
      };
      setBalloons((prevBalloons) => [...prevBalloons, newBalloon]);
    }, 1000); // Add a new balloon every second

    return () => clearInterval(balloonInterval);
  }, []);

  useEffect(() => {
    // Animate balloons flying upwards and swaying
    const interval = setInterval(() => {
      setBalloons((prevBalloons) =>
        prevBalloons
          .map((balloon) => ({
            ...balloon,
            y: balloon.y - 2, // Move upwards
            x: balloon.x + Math.sin(balloon.sway) * 0.5, // Sway side-to-side
            sway: balloon.sway + 0.05, // Increment sway for smooth motion
          }))
          .filter((balloon) => balloon.y > -100) // Remove balloons that go off-screen
      );
    }, 16); // ~60 FPS

    return () => clearInterval(interval);
  }, []);

  const playBurstSound = () => {
    if (!audioContext.current) return;

    const burstSound = new Audio(BurstS);
    burstSound.play();
  };

  const handleBalloonClick = (id: string) => {
    playBurstSound();
    setBalloons((prevBalloons) => prevBalloons.filter((balloon) => balloon.id !== id));
    setBurstCount((prevCount) => prevCount + 1);
  };

  return (
    <motion.div
      className="w-full h-screen relative bg-pink-50 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Heading */}
      <h1 className="text-4xl font-bold text-center mt-8 text-pink-600">Let's blast some balloons!</h1>

      {/* Balloons */}
      {balloons.map((balloon) => (
        <motion.div
          key={balloon.id}
          className="absolute cursor-pointer"
          style={{
            left: balloon.x,
            top: balloon.y,
            width: balloon.size,
            height: balloon.size * 1.2, // Make it more oval-shaped
            transform: `rotate(${balloon.rotation}deg)`,
            backgroundColor: balloon.color,
            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', // Realistic balloon shape
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => handleBalloonClick(balloon.id)}
        >
          {/* Balloon string */}
          <div
            style={{
              position: 'absolute',
              bottom: '-50%',
              left: '50%',
              width: '2px',
              height: '50%',
              backgroundColor: '#666',
              transform: 'translateX(-50%)',
            }}
          />
        </motion.div>
      ))}

      {/* Continue Button */}
      {burstCount >= 6 && (
        <motion.button
          className="fixed bottom-8 right-8 bg-pink-500 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-pink-600 flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onComplete}
        >
          <Sparkles className="w-5 h-5" />
          Continue to Cake Ceremony →
        </motion.button>
      )}
    </motion.div>
  );
};

export default Room;