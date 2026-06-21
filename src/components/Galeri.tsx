import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { IMAGES } from "../constants";
import { useWedding } from "../context/WeddingDataContext";

export default function Galeri() {
  const { weddingData } = useWedding();
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  // Collect a list of beautiful high-quality images for the wedding album
  const GALLERY_IMAGES = weddingData.galleryImages && weddingData.galleryImages.length > 0
    ? weddingData.galleryImages
    : [
        {
          url: weddingData.groom.image,
          caption: "Momen Kebersamaan Kasih",
        },
        {
          url: IMAGES.detail,
          caption: "Simbol Ikatan Suci Abadi",
        },
        {
          url: IMAGES.hero,
          caption: "Janji Suci di Mata Semesta",
        },
        {
          url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
          caption: "Dekorasi Pelaminan Indah Klasik",
        },
        {
          url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800",
          caption: "Kebahagiaan yang Sempurna",
        },
        {
          url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800",
          caption: "Saling Menatap Penuh Cinta",
        },
      ];

  const openLightbox = (idx: number) => {
    setActiveIdx(idx);
  };

  const closeLightbox = () => {
    setActiveIdx(null);
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activeIdx !== null) {
      setActiveIdx((activeIdx + 1) % GALLERY_IMAGES.length);
    }
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activeIdx !== null) {
      setActiveIdx((activeIdx - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
    }
  };

  return (
    <section className="py-24 px-4 bg-[#0a0505] relative overflow-hidden" id="section-galeri">
      {/* Ambient backgrounds */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-[20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#3a1510]/15 blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-sans text-[10px] tracking-[0.4em] text-[#ebd8b7] uppercase font-bold mb-3 ml-1">
            Galeri Foto
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-light text-white tracking-tight">
            Momen Bahagia Kami
          </h2>
          <div className="w-16 h-[1px] bg-white/20 mx-auto mt-6" />
        </div>

        {/* Polaroid / Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4">
          {GALLERY_IMAGES.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              onClick={() => openLightbox(idx)}
              className="bg-white/[0.02] backdrop-blur-xl p-4 pb-6 rounded-3xl shadow-2xl border border-white/5 hover:border-[#d4af37]/35 transition-all duration-300 cursor-pointer group"
            >
              {/* Photo Frame */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black/40 mb-4 border border-white/5">
                <img
                  src={img.url}
                  alt={img.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale-[15%] group-hover:grayscale-0"
                  referrerPolicy="no-referrer"
                />
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white shadow-xl">
                    <ZoomIn size={18} />
                  </span>
                </div>
              </div>

              {/* Caption */}
              <p className="font-serif text-xs md:text-sm font-light text-stone-300 text-center tracking-wide italic mt-1 group-hover:text-[#ebd8b7] transition-all">
                {img.caption}
              </p>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 select-none"
          >
            {/* Upper tools bar */}
            <div className="absolute top-6 right-6 flex items-center gap-4 text-white">
              <span className="font-sans text-xs tracking-widest uppercase text-stone-400">
                {activeIdx + 1} / {GALLERY_IMAGES.length}
              </span>
              <button
                onClick={closeLightbox}
                className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-stone-300 hover:text-white"
                title="Tutup"
              >
                <X size={24} />
              </button>
            </div>

            {/* Left navigation arrow */}
            <button
              onClick={prevImage}
              className="absolute left-6 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all text-white cursor-pointer hover:scale-105 active:scale-95 shadow-lg hidden sm:block"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Central focused image */}
            <motion.div
              layoutId={`gallery-lightbox-${activeIdx}`}
              className="max-w-4xl max-h-[80vh] flex flex-col items-center gap-4 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={GALLERY_IMAGES[activeIdx].url}
                alt={GALLERY_IMAGES[activeIdx].caption}
                className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-2xl border border-white/15"
                referrerPolicy="no-referrer"
              />
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-serif text-lg text-[#fbf8f3] text-center drop-shadow-md italic"
              >
                {GALLERY_IMAGES[activeIdx].caption}
              </motion.p>
            </motion.div>

            {/* Right navigation arrow */}
            <button
              onClick={nextImage}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all text-white cursor-pointer hover:scale-105 active:scale-95 shadow-lg hidden sm:block"
            >
              <ChevronRight size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
