import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MailOpen, Calendar, MapPin } from "lucide-react";
import { IMAGES } from "../constants";
import { useWedding } from "../context/WeddingDataContext";

interface CoverProps {
  onOpen: () => void;
  isOpen: boolean;
}

export default function Cover({ onOpen, isOpen }: CoverProps) {
  const { weddingData } = useWedding();
  const [guestName, setGuestName] = useState<string>("Tamu Undangan");

  useEffect(() => {
    // Read the query parameters from URL to customize guest name (?to=John+Doe)
    const params = new URLSearchParams(window.location.search);
    const toParam = params.get("to") || params.get("recipient");
    if (toParam) {
      setGuestName(toParam);
    }
  }, []);

  const formatDate = () => {
    if (!weddingData || !weddingData.date) return "18 . 10 . 2026";
    const d = new Date(weddingData.date);
    const pad = (num: number) => num.toString().padStart(2, "0");
    return `${pad(d.getDate())} . ${pad(d.getMonth() + 1)} . ${d.getFullYear()}`;
  };

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: "-100vh" }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-between text-center overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(rgba(10, 5, 5, 0.65), rgba(10, 5, 5, 0.85)), url(${weddingData.heroImage || IMAGES.hero})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Atmospheric Background Glow Elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#3a1510] blur-[120px] opacity-40"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#1a2a3a] blur-[120px] opacity-35"></div>
          </div>

          {/* Top Decorative Border */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#d4af37] via-[#f5ebd6] to-[#d4af37] z-10" />

          {/* Intro Text */}
          <div className="pt-20 px-4 z-10">
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="font-sans text-[10px] tracking-[0.4em] text-white/60 uppercase ml-1"
            >
              The Wedding Celebration of
            </motion.p>
            <div className="h-[1px] w-12 bg-white/20 mx-auto mt-2" />
            
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="font-serif text-5xl md:text-7xl text-white mt-8 mb-2 tracking-tight"
            >
              {weddingData.groom.nickName} <span className="text-xl md:text-2xl italic align-middle mx-2 opacity-50 font-light">&amp;</span> {weddingData.bride.nickName}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="font-sans text-xs tracking-[0.25em] text-[#c3b091] uppercase mt-2"
            >
              {formatDate()}
            </motion.p>
          </div>

          {/* Invitation Target Group */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="w-full max-w-sm mx-auto px-8 py-8 rounded-[32px] bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-2xl mx-4 mb-8 z-10"
          >
            <p className="font-sans text-[10px] text-white/50 tracking-[0.15em] uppercase mb-1">
              Dear Special Guest,
            </p>
            <p className="font-sans text-[11px] text-[#c3b091] tracking-wider uppercase mb-3">
              Kepada Yth. Bapak/Ibu/Saudara/i:
            </p>
            
            <h2 className="font-serif text-2xl font-light text-white tracking-wide truncate px-4 py-2 bg-white/[0.04] rounded-xl inline-block max-w-full my-1 border border-white/5">
              {guestName}
            </h2>

            <p className="font-sans text-[10px] text-stone-400 italic mt-3">
              *Mohon maaf apabila ada kesalahan penulisan nama/gelar
            </p>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpen}
              id="btn-buka-undangan"
              className="mt-8 inline-flex items-center justify-center gap-2 px-10 py-4 bg-white hover:bg-white/90 text-black font-sans font-bold text-xs tracking-[0.2em] uppercase rounded-full shadow-xl transition-all cursor-pointer w-full"
            >
              <MailOpen size={13} strokeWidth={2.5} />
              Buka Undangan
            </motion.button>
          </motion.div>

          {/* Bottom Info / Status Lines (Humbler elements) */}
          <div className="pb-12 text-stone-400 text-[10px] tracking-[0.3em] uppercase z-10">
            <p>Save The Date</p>
          </div>

          {/* Bottom Decorative Border */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#d4af37] via-[#f5ebd6] to-[#d4af37] z-10" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
