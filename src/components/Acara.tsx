import { useState } from "react";
import { motion } from "motion/react";
import { Calendar, Clock, MapPin, ExternalLink, CalendarPlus, Check, Copy } from "lucide-react";
import { useWedding } from "../context/WeddingDataContext";

export default function Acara() {
  const { weddingData } = useWedding();
  const { akad, resepsi } = weddingData;
  const [copiedVenue, setCopiedVenue] = useState<"akad" | "resepsi" | null>(null);

  const copyAddress = (text: string, type: "akad" | "resepsi") => {
    navigator.clipboard.writeText(text);
    setCopiedVenue(type);
    setTimeout(() => setCopiedVenue(null), 2500);
  };

  // Google Calendar Link generator helpers
  const generateGoogleCalendarLink = (title: string, details: string, location: string, startDate: string, endDate: string) => {
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}&sf=true&output=xml`;
  };

  // Wedding details for Calendar
  // 18 Oct 2026. UTC conversion: 08:00 WIB is 01:00 UTC, 14:00 WIB is 07:00 UTC.
  const calTitle = "Pernikahan Aris & Amalia";
  const calDetails = "Dengan penuh kebahagiaan kami mengundang bapak/ibu/saudara/i dalam hari besar kami, Akad & Resepsi Pernikahan Aris & Amalia.";
  const calLocation = "Grand Ballroom Hotel Majestic, Semarang";
  const startDate = "20261018T010000Z"; 
  const endDate = "20261018T070000Z";

  return (
    <section className="py-24 px-4 bg-[#0a0505] relative overflow-hidden" id="section-acara">
      {/* Decorative background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[10%] w-[60%] h-[60%] rounded-full bg-[#3a1510]/15 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#1a2a3a]/15 blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Heading */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-sans text-[10px] tracking-[0.4em] text-[#ebd8b7] uppercase font-bold mb-3 ml-1"
          >
            Rencana Acara
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-serif text-3xl md:text-5xl font-light text-white tracking-tight"
          >
            Waktu & Tempat Acara
          </motion.h2>
          <div className="w-16 h-[1px] bg-white/20 mx-auto mt-6" />
        </div>

        {/* Schedule grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 px-2 md:px-6">
          
          {/* Akad Card */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white/[0.02] backdrop-blur-xl rounded-[32px] p-6 md:p-8 border border-white/10 shadow-2xl flex flex-col justify-between"
          >
            <div>
              {/* Badge */}
              <div className="inline-block px-4 py-1.5 rounded-full bg-white/[0.04] border border-[#d4af37]/30 text-[#ebd8b7] font-sans text-[10px] font-bold tracking-[0.2em] uppercase mb-8">
                Akad Nikah
              </div>

              {/* Date & Time */}
              <div className="flex flex-col gap-5 mb-8">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 shrink-0">
                    <Calendar className="text-[#ebd8b7]" size={16} />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-light text-stone-400">Hari & Tanggal</h4>
                    <p className="font-sans text-sm text-white font-medium mt-1">{akad.dateText}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 shrink-0">
                    <Clock className="text-[#ebd8b7]" size={16} />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-light text-stone-400">Waktu</h4>
                    <p className="font-sans text-sm text-white font-medium mt-1">{akad.time}</p>
                  </div>
                </div>
              </div>

              {/* Venue details */}
              <div className="flex items-start gap-4 mb-8">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 shrink-0">
                  <MapPin className="text-[#ebd8b7]" size={16} />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-light text-stone-400">Tempat Kediaman</h4>
                  <p className="font-sans text-sm font-bold text-white mt-1">{akad.place}</p>
                  <p className="font-sans text-xs text-stone-400 mt-1.5 leading-relaxed">{akad.address}</p>
                </div>
              </div>
            </div>

            {/* Actions for Akad */}
            <div>
              {akad.mapIframe && (
                <div className="w-full h-44 rounded-2xl overflow-hidden mb-6 border border-white/10 p-0.5 bg-white/[0.01]">
                  <iframe
                    src={akad.mapIframe}
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) opacity(85%)" }}
                    allowFullScreen
                    loading="lazy"
                    title="Akad Map"
                  />
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={akad.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-white/90 text-black font-sans font-bold text-xs tracking-[0.1em] rounded-xl uppercase transition-all"
                >
                  <ExternalLink size={13} strokeWidth={2.5} />
                  Petunjuk Google Maps
                </a>
                <button
                  onClick={() => copyAddress(`${akad.place}, ${akad.address}`, "akad")}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-stone-300 font-sans text-xs rounded-xl transition-all cursor-pointer"
                >
                  {copiedVenue === "akad" ? (
                    <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <Check size={13} strokeWidth={2.5} /> Disalin!
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <Copy size={13} /> Salin Alamat
                    </span>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Resepsi Card */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="bg-white/[0.02] backdrop-blur-xl rounded-[32px] p-6 md:p-8 border border-white/10 shadow-2xl flex flex-col justify-between"
          >
            <div>
              {/* Badge */}
              <div className="inline-block px-4 py-1.5 rounded-full bg-white/[0.04] border border-[#d4af37]/30 text-[#ebd8b7] font-sans text-[10px] font-bold tracking-[0.2em] uppercase mb-8">
                Resepsi Pernikahan
              </div>

              {/* Date & Time */}
              <div className="flex flex-col gap-5 mb-8">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 shrink-0">
                    <Calendar className="text-[#ebd8b7]" size={16} />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-light text-stone-400">Hari & Tanggal</h4>
                    <p className="font-sans text-sm text-white font-medium mt-1">{resepsi.dateText}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 shrink-0">
                    <Clock className="text-[#ebd8b7]" size={16} />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-light text-stone-400">Waktu</h4>
                    <p className="font-sans text-sm text-white font-medium mt-1">{resepsi.time}</p>
                  </div>
                </div>
              </div>

              {/* Venue details */}
              <div className="flex items-start gap-4 mb-8">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 shrink-0">
                  <MapPin className="text-[#ebd8b7]" size={16} />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-light text-stone-400">Tempat Undangan</h4>
                  <p className="font-sans text-sm font-bold text-white mt-1">{resepsi.place}</p>
                  <p className="font-sans text-xs text-stone-400 mt-1.5 leading-relaxed">{resepsi.address}</p>
                </div>
              </div>
            </div>

            {/* Actions for Resepsi */}
            <div>
              {resepsi.mapIframe && (
                <div className="w-full h-44 rounded-2xl overflow-hidden mb-6 border border-white/10 p-0.5 bg-white/[0.01]">
                  <iframe
                    src={resepsi.mapIframe}
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) opacity(85%)" }}
                    allowFullScreen
                    loading="lazy"
                    title="Resepsi Map"
                  />
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={resepsi.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-white/90 text-black font-sans font-bold text-xs tracking-[0.1em] rounded-xl uppercase transition-all"
                >
                  <ExternalLink size={13} strokeWidth={2.5} />
                  Petunjuk Google Maps
                </a>
                <button
                  onClick={() => copyAddress(`${resepsi.place}, ${resepsi.address}`, "resepsi")}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-stone-300 font-sans text-xs rounded-xl transition-all cursor-pointer"
                >
                  {copiedVenue === "resepsi" ? (
                    <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <Check size={13} strokeWidth={2.5} /> Disalin!
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <Copy size={13} /> Salin Alamat
                    </span>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Global Calendar sync bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 max-w-xl mx-auto bg-white/[0.02] border border-white/10 rounded-[24px] p-6 text-center flex flex-col sm:flex-row items-center justify-between gap-6 mx-4"
        >
          <div className="text-left">
            <h5 className="font-serif text-base font-light text-white">Simpan Tanggal Bahagia</h5>
            <p className="font-sans text-xs text-stone-400 mt-1">Ingat tanggal pernikahan kami di kalender pintar Anda.</p>
          </div>
          <a
            href={generateGoogleCalendarLink(calTitle, calDetails, calLocation, startDate, endDate)}
            target="_blank"
            rel="noopener noreferrer"
            id="btn-add-calendar"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-white/90 text-black font-sans font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer shrink-0 uppercase tracking-widest leading-none"
          >
            <CalendarPlus size={12} strokeWidth={2.5} />
            Ingatkan Saya
          </a>
        </motion.div>

      </div>
    </section>
  );
}
