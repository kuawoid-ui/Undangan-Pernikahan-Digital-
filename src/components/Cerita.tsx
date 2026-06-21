import { motion } from "motion/react";
import { Sparkles, Heart, Footprints } from "lucide-react";
import { useWedding } from "../context/WeddingDataContext";

export default function Cerita() {
  const { weddingData } = useWedding();
  const { loveStory } = weddingData;

  return (
    <section className="py-24 px-4 bg-[#0a0505] relative overflow-hidden" id="section-cerita">
      {/* Decorative background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[40%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#1a2a3a]/15 blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-sans text-[10px] tracking-[0.4em] text-[#ebd8b7] uppercase font-bold mb-3 ml-1"
          >
            Kisah Kami
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-serif text-3xl md:text-5xl font-light text-white tracking-tight"
          >
            Perjalanan Cinta Kita
          </motion.h2>
          <div className="w-16 h-[1px] bg-white/20 mx-auto mt-6" />
        </div>

        {/* Vertical Timeline */}
        <div className="relative border-l-2 border-white/10 md:border-l-0 md:before:absolute md:before:left-1/2 md:before:top-0 md:before:bottom-0 md:before:w-[1px] md:before:bg-white/10 pl-6 md:pl-0">
          
          {loveStory.map((story, index) => {
            const isEven = index % 2 === 0;

            return (
              <div
                key={story.year}
                className={`relative mb-12 md:mb-16 flex flex-col md:flex-row items-start ${
                  isEven ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Timeline center checkpoint dot */}
                <div className="absolute -left-[31px] md:left-1/2 md:-translate-x-1/2 top-1.5 z-10 flex items-center justify-center w-4 h-4 rounded-full bg-[#0a0505] border-2 border-[#d4af37] shadow-xl" />

                {/* Timeline Card */}
                <div className="w-full md:w-[45%]">
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? 30 : -30, y: 15 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="bg-white/[0.02] backdrop-blur-xl border border-white/5 hover:border-white/15 p-6 rounded-[24px] relative shadow-2xl transition-all group"
                  >
                    {/* Timestamp Bubble */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-[#d4af37]/30 text-[#ebd8b7] font-sans text-[10px] font-bold tracking-widest uppercase mb-4">
                      {story.year === "2021" ? <Sparkles size={11} className="text-amber-400" /> : story.year === "2023" ? <Footprints size={11} className="text-amber-400" /> : <Heart size={11} className="text-amber-400" />}
                      {story.year}
                    </div>

                    <h4 className="font-serif text-lg font-light text-white tracking-wide mb-2 group-hover:text-[#ebd8b7] transition-colors">
                      {story.title}
                    </h4>

                    <p className="font-sans text-xs md:text-sm text-stone-400 leading-relaxed font-light">
                      {story.story}
                    </p>

                    {/* Speech bubble pointy arrow (only on desktop) */}
                    <div
                      className={`absolute top-5 h-3 w-3 rotate-45 border-b border-r border-white/5 bg-[#140e0e] group-hover:bg-[#1a1414] hidden md:block ${
                        isEven
                          ? "-left-[7px] border-b-0 border-r-0 border-t border-l"
                          : "-right-[7px] border-t border-r border-b-0 border-l-0"
                      }`}
                    />
                  </motion.div>
                </div>

                {/* Offset holder for desktop balance */}
                <div className="hidden md:block w-[10%]" />
                <div className="hidden md:block w-[45%]" />
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
