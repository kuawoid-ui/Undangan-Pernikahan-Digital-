import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Music } from "lucide-react";
import { Song } from "../types";
import { useWedding } from "../context/WeddingDataContext";

interface AudioPlayerProps {
  autoPlayTriggered: boolean;
  visible?: boolean;
  audioRef?: React.RefObject<HTMLAudioElement | null>;
}

export default function AudioPlayer({ autoPlayTriggered, visible = false, audioRef }: AudioPlayerProps) {
  const { songs, activeSongIndex } = useWedding();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(activeSongIndex);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [showMixer, setShowMixer] = useState(false);
  const [errorCount, setErrorCount] = useState(0);

  const internalAudioRef = useRef<HTMLAudioElement | null>(null);
  const activeAudioRef = audioRef || internalAudioRef;

  // Sync activeSongIndex from admin panel
  useEffect(() => {
    if (activeSongIndex >= 0 && activeSongIndex < songs.length) {
      setCurrentSongIndex(activeSongIndex);
    }
  }, [activeSongIndex, songs.length]);

  const currentSong: Song = songs[currentSongIndex] || songs[0] || {
    id: "chopin_nocturne",
    title: "Chopin - Nocturne No. 2 in E-flat Major",
    artist: "Florence Robineau (Piano Solo)",
    url: "/chopin.mp3"
  };

  // Sync source and load state
  useEffect(() => {
    const audio = activeAudioRef.current;
    if (audio && currentSong?.url) {
      const wasPlaying = isPlaying;
      
      // Update src
      audio.src = currentSong.url;
      audio.load();
      audio.volume = isMuted ? 0 : volume;

      if (wasPlaying || autoPlayTriggered) {
        audio.play()
          .then(() => setIsPlaying(true))
          .catch(err => {
            console.log("Playback src transition failed/blocked:", err);
            // Don't set isPlaying false if we already started playing or intent was active
          });
      }
    }
  }, [currentSongIndex, currentSong?.url]);

  // Sync autoPlayTriggered from Cover unlock
  useEffect(() => {
    const audio = activeAudioRef.current;
    if (autoPlayTriggered && audio) {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.log("Autoplay failed/blocked by browser policy, waiting for user click:", err);
        });
    }
  }, [autoPlayTriggered]);

  // Sync volume state to audio element
  useEffect(() => {
    const audio = activeAudioRef.current;
    if (audio) {
      audio.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    const audio = activeAudioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.log("Play trigger failed:", err);
        });
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleAudioError = () => {
    console.warn(`Audio playback issue with track: ${currentSong.title}`);
    
    // Attempt fallback to next song in list to survive CORS / network block of specific track
    if (errorCount < songs.length) {
      setErrorCount(prev => prev + 1);
      const nextIndex = (currentSongIndex + 1) % songs.length;
      console.log(`Playing fallback index: ${nextIndex}`);
      setCurrentSongIndex(nextIndex);
    } else {
      // Hard fallback to highly available local URL as absolute last resort
      const audio = activeAudioRef.current;
      if (audio) {
        console.log("Playing absolute resilient fallback");
        audio.src = "/sunset.mp3";
        audio.load();
        audio.play()
          .then(() => setIsPlaying(true))
          .catch(err => console.warn("Resilient fallback blocked or failed:", err));
      }
    }
  };

  return (
    <>
      <audio
        ref={activeAudioRef}
        src={currentSong.url}
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={handleAudioError}
      />

      {visible && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
          {/* Background Song Details Bubble */}
          {showMixer && (
            <div className="bg-[#160f0f]/95 backdrop-blur-xl p-4 rounded-[24px] shadow-2xl border border-white/10 flex flex-col gap-3 w-64 text-white transition-all duration-300 animate-fade-in-up">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-sans text-[9px] text-[#ebd8b7] font-bold uppercase tracking-wider">
                    Sedang Diputar
                  </p>
                  <h4 className="font-serif text-sm font-light text-white truncate max-w-[180px] mt-0.5">
                    {currentSong.title}
                  </h4>
                  <p className="font-sans text-[11px] text-stone-400 truncate max-w-[180px]">
                    {currentSong.artist}
                  </p>
                </div>
                <Music className="text-[#ebd8b7] animate-pulse" size={15} />
              </div>

              {/* Volume Control */}
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={toggleMute}
                  className="text-stone-400 hover:text-white p-1 rounded-md transition-colors"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted || volume === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    if (isMuted) setIsMuted(false);
                  }}
                  className="w-full h-1 bg-white/10 accent-[#d4af37] rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Song selection pills */}
              <div className="flex flex-col gap-1.5 mt-1 border-t border-white/10 pt-2.5">
                <p className="font-sans text-[9px] text-stone-500 uppercase tracking-widest">
                  Ganti Lagu
                </p>
                <div className="flex flex-col gap-1 max-h-24 overflow-y-auto w-full">
                  {songs.map((song, idx) => (
                    <button
                      key={song.id}
                      onClick={() => {
                        setErrorCount(0); // Reset error count on user intentional select
                        setCurrentSongIndex(idx);
                      }}
                      className={`text-left font-sans text-xs px-2 py-1.5 rounded transition-colors text-stone-300 hover:bg-white/[0.04] hover:text-white truncate w-full ${
                        currentSongIndex === idx
                          ? "bg-[#d4af37]/10 text-[#ebd8b7] font-semibold border-l-2 border-[#d4af37]"
                          : ""
                      }`}
                    >
                      {idx + 1}. {song.title.split(" (")[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Primary Floating Action Row */}
          <div className="flex items-center gap-2">
            {/* Toggle mixer display */}
            <button
              onClick={() => setShowMixer(!showMixer)}
              id="music-mixer-toggle"
              className="bg-white/[0.04] backdrop-blur-md text-white border border-white/10 hover:border-[#d4af37]/30 px-3 py-2 rounded-full shadow-2xl text-xs font-sans tracking-wide transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Music size={12} className={isPlaying ? "animate-spin" : ""} />
              <span className="hidden md:inline font-medium">Bilik Musik</span>
            </button>

            {/* Floating Play Control Button */}
            <button
              onClick={togglePlay}
              id="music-play-btn"
              className="bg-[#d4af37] hover:bg-[#ebd8b7] text-black p-3.5 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer relative flex items-center justify-center border border-white/10"
            >
              {/* Circular progress rotate element */}
              <div
                className={`absolute inset-0 rounded-full border-2 border-black/10 border-t-black ${
                  isPlaying ? "animate-spin-slow" : ""
                }`}
              />
              {isPlaying ? <Pause size={18} fill="currentColor" className="stroke-[1.5]" /> : <Play size={18} fill="currentColor" className="stroke-[1.5]" />}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
