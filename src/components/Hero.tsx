import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Calendar, Clock } from "lucide-react";
import { IMAGES } from "../constants";
import { useWedding } from "../context/WeddingDataContext";

export default function Hero() {
  const { weddingData } = useWedding();
  const weddingTime = new Date(weddingData.date).getTime();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = weddingTime - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [weddingTime]);

  return (
    <section className="relative overflow-hidden py-28 px-4 bg-[#0a0505] flex flex-col items-center text-center justify-center min-h-[90vh]">
      {/* Immersive Background glow elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#3a1510] blur-[100px] opacity-25"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#1a2a3a] blur-[100px] opacity-20"></div>
      </div>
      
      {/* Decorative leaf sketch backgrounds or vector hints */}
      <div className="absolute right-0 top-12 opacity-5 pointer-events-none max-w-[200px] md:max-w-xs">
        <img src={weddingData.detailImage || IMAGES.detail} alt="" className="rounded-full w-40 h-40 object-cover grayscale brightness-50" referrerPolicy="no-referrer" />
      </div>
      <div className="absolute left-0 bottom-12 opacity-5 pointer-events-none max-w-[200px] md:max-w-xs">
        <img src={weddingData.detailImage || IMAGES.detail} alt="" className="rounded-full w-40 h-40 object-cover grayscale brightness-50" referrerPolicy="no-referrer" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
        {/* Wedding Ring Detail Miniature Circle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="w-20 h-20 rounded-full border-2 border-[#d4af37]/30 p-1 mb-8 shadow-2xl"
        >
          <img
            src={weddingData.detailImage || IMAGES.detail}
            alt="Wedding Rings"
            className="w-full h-full rounded-full object-cover grayscale-[20%]"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        <motion.span
          initial={{ opacity: 0, letterSpacing: "0.1em" }}
          whileInView={{ opacity: 1, letterSpacing: "0.4em" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-sans text-[10px] md:text-xs font-semibold text-[#c3b091] uppercase tracking-[0.4em] mb-4"
        >
          Selamat Datang di Undangan Pernikahan
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 1 }}
          className="font-serif text-5xl md:text-7xl font-light text-white tracking-tight my-2"
        >
          {weddingData.groom.nickName} <span className="font-light italic opacity-45">&amp;</span> {weddingData.bride.nickName}
        </motion.h2>

        {/* Divider lines */}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "80px" }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="h-[1px] bg-white/20 my-6"
        />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="font-serif text-sm italic text-stone-300 max-w-lg mb-12 leading-relaxed font-light"
        >
          &ldquo;Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.&rdquo;
          <span className="block mt-3 font-sans font-bold text-[10px] not-italic text-stone-400 tracking-[0.2em]">
            ( QS. AR-RUM: 21 )
          </span>
        </motion.p>

        {/* Countdown Box styled in signature Immersive Glassmorphism */}
        <div className="w-full max-w-lg bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[40px] p-8 md:p-10 shadow-2xl flex flex-col items-center">
          <p className="font-sans text-[10px] text-[#c3b091] tracking-[0.3em] uppercase font-bold mb-6 flex items-center gap-1.5 justify-center">
            <Clock size={12} className="text-amber-500 animate-pulse" /> MENYAMBUT HARI BAHAGIA
          </p>

          <div className="grid grid-cols-4 gap-3 md:gap-6 w-full text-center">
            {/* Days block */}
            <div className="flex flex-col items-center">
              <span className="font-serif text-3xl md:text-5xl font-light text-white block">
                {String(timeLeft.days).padStart(2, "0")}
              </span>
              <span className="font-sans text-[9px] md:text-xs text-stone-400 uppercase tracking-[0.2em] mt-2">
                Hari
              </span>
            </div>

            {/* Hours block */}
            <div className="flex flex-col items-center border-l border-white/10">
              <span className="font-serif text-3xl md:text-5xl font-light text-white block">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
              <span className="font-sans text-[9px] md:text-xs text-stone-400 uppercase tracking-[0.2em] mt-2">
                Jam
              </span>
            </div>

            {/* Minutes block */}
            <div className="flex flex-col items-center border-l border-white/10">
              <span className="font-serif text-3xl md:text-5xl font-light text-white block">
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
              <span className="font-sans text-[9px] md:text-xs text-stone-400 uppercase tracking-[0.2em] mt-2">
                Menit
              </span>
            </div>

            {/* Seconds block */}
            <div className="flex flex-col items-center border-l border-white/10">
              <span className="font-serif text-3xl md:text-5xl font-light text-amber-500 block">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
              <span className="font-sans text-[9px] md:text-xs text-[#c3b091] uppercase tracking-[0.2em] mt-2 font-bold">
                Detik
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
