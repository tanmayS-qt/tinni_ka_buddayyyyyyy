import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Pic1 from "./img/pic1.jpg";
import Pic2 from "./img/pic2.jpg";
import Pic3 from "./img/pic3.jpg";

// Import local playlist music files
import songA from "./music/Fitoor.mp3";
import songB from "./music/spaulo.mp3";
import songC from "./music/ranjhana.mp3";

interface Photo {
  url: string;
  caption: string;
}

const photos: Photo[] = [
  {
    url: Pic1,
    caption:
      "Happy Birthday to the one who knows all my secrets and still chooses to stay! Here's to another year of laughter, chaos, and making memories.",
  },
  {
    url: Pic2,
    caption:
      "To my partner-in-crime, my sister, and my biggest cheerleader—happy birthday, princess! The world shines brighter with you in it. 👑✨",
  },
  {
    url: Pic3,
    caption:
      "Cheers to you on your special day! Life’s an adventure, and I’m glad I get to navigate it with you by my side. 🥂💖",
  },
];

// Playlist song names
const playlist = ["Yeh Fitoor Mera", "Sao Paulo", "Raanjhanaa"];
// Corresponding local music files
const songFiles = [songA, songB, songC];

interface PhotoGalleryProps {
  onComplete: () => void;
  stopBgMusic: () => void;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ onComplete, stopBgMusic }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
    }, 4000);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  // Cleanup any playing audio when the component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleSongClick = (index: number) => {
    // Stop any currently playing playlist music
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    // Ensure the background music is stopped
    stopBgMusic();
    setCurrentSongIndex(index);
    // Create a new Audio instance and play the selected song
    const newAudio = new Audio(songFiles[index]);
    audioRef.current = newAudio;
    newAudio.play().catch(error => console.log("Playlist audio playback failed:", error));
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Centered Header */}
      <h2 className="text-4xl text-center font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 mb-12">
        Our Memories Together ✨
      </h2>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Photo Slider */}
        <div className="relative aspect-[3/4] w-full max-w-lg mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-3xl opacity-20 transform -rotate-6"></div>
          <AnimatePresence mode="wait">
            {photos.map((photo, index) =>
              index === currentIndex && (
                <motion.div
                  key={index}
                  className="relative w-full h-full rounded-2xl overflow-hidden"
                  initial={{ opacity: 0, rotateY: 90 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  exit={{ opacity: 0, rotateY: -90 }}
                  transition={{
                    duration: 0.8,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                >
                  <img
                    src={photo.url}
                    alt={`Memory ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                    <p className="text-white text-lg font-medium leading-relaxed">
                      {photo.caption}
                    </p>
                  </div>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>

        {/* Right Column - Playlist and Button */}
        <div className="flex flex-col justify-center space-y-8">
          {/* Modern Playlist */}
          <div className="backdrop-blur-md bg-white/30 rounded-2xl p-6 shadow-xl">
            <h3 className="text-2xl font-semibold text-purple-800 mb-4 flex items-center">
              <span className="mr-2">🎵</span> Our Playlist
            </h3>
            <div className="space-y-3">
              {playlist.map((song, i) => (
                <motion.div
                  key={i}
                  onClick={() => handleSongClick(i)}
                  className={`flex items-center p-3 rounded-xl transition-all cursor-pointer ${currentSongIndex === i ? 'bg-white/40' : 'hover:bg-white/40'}`}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white mr-3">
                    {i + 1}
                  </div>
                  <span className="text-gray-800">{song}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Button with Glow Effect */}
          <div className="relative mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl opacity-20"></div>
            <motion.button
              className="relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-xl font-medium text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onComplete}
            >
              I wrote something special for you, Madam Jii❤️
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
