import { motion } from "motion/react";
import { Instagram, Heart } from "lucide-react";
import { useWedding } from "../context/WeddingDataContext";

export default function Mempelai() {
  const { weddingData } = useWedding();
  const { groom, bride } = weddingData;

  return (
    <section className="py-24 px-4 bg-[#0a0505] relative overflow-hidden" id="section-mempelai">
      {/* Background Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[30%] left-[50%] -translate-x-1/2 w-[70%] h-[50%] rounded-full bg-[#3a1510]/20 blur-[130px]" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10 text-center">
        {/* Religious Opening Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20 px-4"
        >
          <h3 className="font-serif text-xl font-light text-white mb-3">
            Assalamu’alaikum Warahmatullahi Wabarakatuh
          </h3>
          <p className="font-sans text-xs md:text-sm text-stone-400 max-w-xl mx-auto leading-relaxed">
            Dengan memohon rahmat dan rida Allah Subhanahu wa Ta'ala, kami bermaksud mengundang Bapak/Ibu/Saudara/i, untuk menghadiri acara pernikahan putra-putri kami:
          </p>
        </motion.div>

        {/* Couples Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center px-4">
          
          {/* Groom Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center bg-white/[0.01] backdrop-blur-md border border-white/5 rounded-[40px] p-8 md:p-10 shadow-xl"
          >
            {/* Elegant Portrait Frame */}
            <div className="relative w-64 h-80 rounded-t-full rounded-b-3xl overflow-hidden border-2 border-[#d4af37]/35 shadow-2xl mb-8 group">
              <img
                src={groom.image}
                alt={groom.fullName}
                className="w-full h-full object-cover grayscale-[20%] hover:scale-105 duration-700 hover:grayscale-0"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            <h3 className="font-script text-5xl text-[#ebd8b7] mb-2">{groom.nickName}</h3>
            <h4 className="font-serif text-lg font-light text-white tracking-wide">{groom.fullName}</h4>
            
            <p className="font-sans text-[10px] text-stone-500 tracking-wider uppercase mt-4">Putra Pertama dari:</p>
            <p className="font-serif text-sm text-stone-300 font-light mt-1">{groom.fatherName}</p>
            <p className="font-serif text-sm text-stone-300 font-light">dan {groom.motherName}</p>

            <a
              href={`https://instagram.com/${groom.instagram.substring(1)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 hover:border-[#d4af37]/40 transition-all text-xs text-stone-300 font-sans tracking-wide"
            >
              <Instagram size={12} className="text-[#ebd8b7]" />
              {groom.instagram}
            </a>
          </motion.div>

          {/* Intersecting Heart Decor */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex flex-col items-center justify-center opacity-10">
            <Heart size={80} className="text-[#ebd8b7] animate-pulse stroke-1" fill="currentColor" />
          </div>

          {/* Bride Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center bg-white/[0.01] backdrop-blur-md border border-white/5 rounded-[40px] p-8 md:p-10 shadow-xl"
          >
            {/* Elegant Portrait Frame */}
            <div className="relative w-64 h-80 rounded-t-full rounded-b-3xl overflow-hidden border-2 border-[#d4af37]/35 shadow-2xl mb-8 group">
              <img
                src={bride.image}
                alt={bride.fullName}
                className="w-full h-full object-cover grayscale-[20%] hover:scale-105 duration-700 hover:grayscale-0"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            <h3 className="font-script text-5xl text-[#ebd8b7] mb-2">{bride.nickName}</h3>
            <h4 className="font-serif text-lg font-light text-white tracking-wide">{bride.fullName}</h4>

            <p className="font-sans text-[10px] text-stone-500 tracking-wider uppercase mt-4">Putri Kedua dari:</p>
            <p className="font-serif text-sm text-stone-300 font-light mt-1">{bride.fatherName}</p>
            <p className="font-serif text-sm text-stone-300 font-light">dan {bride.motherName}</p>

            <a
              href={`https://instagram.com/${bride.instagram.substring(1)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 hover:border-[#d4af37]/40 transition-all text-xs text-stone-300 font-sans tracking-wide"
            >
              <Instagram size={12} className="text-[#ebd8b7]" />
              {bride.instagram}
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
