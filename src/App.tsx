import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "motion/react";
import { Heart, ChevronUp } from "lucide-react";

import Cover from "./components/Cover";
import AudioPlayer from "./components/AudioPlayer";
import Hero from "./components/Hero";
import Mempelai from "./components/Mempelai";
import Acara from "./components/Acara";
import Cerita from "./components/Cerita";
import Galeri from "./components/Galeri";
import Gift from "./components/Gift";
import RsvpWishes from "./components/RsvpWishes";
import AdminEditor from "./components/AdminEditor";
import { useWedding } from "./context/WeddingDataContext";

export default function App() {
  const { weddingData } = useWedding();
  const [isOpened, setIsOpened] = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Scroll detection for "Back to Top" button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleOpenInvitation = () => {
    setIsOpened(true);
    setMusicStarted(true);

    // Play music immediately inside the callstack of the user action
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => {
          console.log("Audio started directly inside click event.");
        })
        .catch((err) => {
          console.log("Autoplay context execution failed:", err);
        });
    }
    
    // Smooth scroll page back to window top to begin beautifully
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Scroll Progress indicator hooks
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="relative min-h-screen select-none font-sans bg-[#0a0505] text-white antialiased overflow-x-hidden">
      
      {/* Personalized Opening Cover Layer */}
      <Cover isOpen={isOpened} onOpen={handleOpenInvitation} />

      {/* Floating Audio Player Widget (Always mounted to ready the audio; visible when opened) */}
      <AudioPlayer autoPlayTriggered={musicStarted} visible={isOpened} audioRef={audioRef} />

      {/* Top level Admin Editor (Always mounted & accessible) */}
      <AdminEditor />

      {/* Main Content Area */}
      {isOpened && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative min-h-screen"
        >
          {/* Scroll Progress Indicator Bar at page top */}
          <motion.div
            className="fixed top-0 left-0 right-0 h-[2px] bg-[#d4af37] origin-left z-50 shadow-sm"
            style={{ scaleX }}
          />

          {/* Core Invitation Sections */}
          <main className="w-full">
            {/* 1. Hero Countdown Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <Hero />
            </motion.div>

            {/* Elegant Floral Scribe Divider (Beautiful horizontal scale draw animation) */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-transparent via-[#d4af37]/20 to-transparent h-[1px] my-4 origin-center"
            />

            {/* 2. Mempelai (Couple Introductions) */}
            <motion.div
              initial={{ opacity: 0, y: 45 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <Mempelai />
            </motion.div>

            {/* 3. Acara (Akad & Resepsi details with interactive maps) */}
            <motion.div
              initial={{ opacity: 0, y: 45 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <Acara />
            </motion.div>

            {/* 4. Cerita (Timeline Love Story) */}
            <motion.div
              initial={{ opacity: 0, y: 45 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <Cerita />
            </motion.div>

            {/* 5. Galeri (Photo gallery with interactive Lightbox) */}
            <motion.div
              initial={{ opacity: 0, y: 45 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <Galeri />
            </motion.div>

            {/* 6. Gift (Cash/Bank wire envelopes) */}
            <motion.div
              initial={{ opacity: 0, y: 45 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <Gift />
            </motion.div>

            {/* 7. RSVP & Wishes guestbook wall (persisted to LocalStorage) */}
            <motion.div
              initial={{ opacity: 0, y: 45 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <RsvpWishes />
            </motion.div>
          </main>

          {/* Heartfelt Closing Footer */}
          <motion.footer
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#050303] text-[#fbf8f3] py-24 px-4 text-center relative overflow-hidden"
          >
            {/* Top gold line */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />

            {/* Ambient glows behind footer */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[70%] rounded-full bg-[#3a1510]/15 blur-[100px]" />
            </div>

            <div className="max-w-2xl mx-auto relative z-10 flex flex-col items-center">
              <Heart className="text-[#ebd8b7] mb-6 animate-pulse" size={28} fill="currentColor" />

              <h2 className="font-script text-5xl md:text-6xl text-[#ebd8b7] mb-8 font-light tracking-wide">
                {weddingData.groom.nickName} &amp; {weddingData.bride.nickName}
              </h2>

              <p className="font-sans text-xs md:text-sm text-stone-300 tracking-wider leading-relaxed max-w-lg mb-12 font-light">
                Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kedua mempelai. Terpaut cinta dan kasih dalam ikatan suci pernikahan kami.
              </p>

              <div className="w-16 h-[1px] bg-white/10 my-4" />

              <p className="font-serif text-xs tracking-[0.25em] text-[#ebd8b7] uppercase mt-4">Kami yang berbahagia</p>
              <p className="font-sans text-xs text-stone-300 mt-2.5 font-light leading-relaxed max-w-md">
                Keluarga Besar {weddingData.groom.fatherName} &amp; Keluarga Besar {weddingData.bride.fatherName}
              </p>

              <p className="font-sans text-[9px] text-[#ebd8b7]/40 tracking-[0.25em] uppercase mt-20">
                © 2026 {weddingData.groom.nickName} &amp; {weddingData.bride.nickName} Wedding. All rights reserved.
              </p>
            </div>
          </motion.footer>

          {/* Floated Back to Top quick button */}
          <AnimatePresence>
            {showScrollTop && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={scrollToTop}
                id="btn-scroll-top"
                className="fixed bottom-6 left-6 z-40 bg-white/[0.04] backdrop-blur-md text-white hover:text-[#d4af37] p-3 rounded-full shadow-2xl border border-white/10 hover:border-[#d4af37]/30 transition-all hover:scale-110 active:scale-95 cursor-pointer"
                title="Kembali ke Atas"
              >
                <ChevronUp size={16} />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
