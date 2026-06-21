import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Users, CheckCircle, HelpCircle, XCircle, MessageSquare, Trash2 } from "lucide-react";
import { GuestWish } from "../types";

// Pre-seeded heartwarming default wishes
const DEFAULT_WISHES: GuestWish[] = [
  {
    id: "seed-1",
    name: "Budi Raharjo",
    wish: "Selamat ya Aris dan Amalia! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Sangat senang melihat perjalanan kalian bertumbuh dari zaman kuliah sampai pelaminan. Aamiin!",
    attendance: "hadir",
    timestamp: "2026-06-18 14:32",
  },
  {
    id: "seed-2",
    name: "Siti Rahma, S.Psi.",
    wish: "Lancar sampai hari-H Amalia sayang! Bahagia selalu selamanya ya kalian berdua. Tidak sabar hadir di resepsi nanti melihat kalian bersanding di pelaminan!",
    attendance: "hadir",
    timestamp: "2026-06-19 09:15",
  },
  {
    id: "seed-3",
    name: "Hendra Wijaya",
    wish: "Selamat menempuh hidup baru bro Aris! Selamat memikul tanggung jawab baru sebagai kepala rumah tangga. Mohon maaf mungkin saya agak terlambat hadir karena flight pendaratan.",
    attendance: "ragu",
    timestamp: "2026-06-20 18:40",
  },
];

export default function RsvpWishes() {
  const [wishes, setWishes] = useState<GuestWish[]>([]);
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState<"hadir" | "ragu" | "tidak">("hadir");
  const [guestsCount, setGuestsCount] = useState(1);
  const [wishText, setWishText] = useState("");
  const [showNotification, setShowNotification] = useState(false);

  // Load from URL query `to` and LocalStorage
  useEffect(() => {
    // Fill name if query `to` or `recipient` is present
    const params = new URLSearchParams(window.location.search);
    const toParam = params.get("to") || params.get("recipient");
    if (toParam) {
      setName(toParam);
    }

    // Load LocalStorage wishes
    const stored = localStorage.getItem("wedding_wishes");
    if (stored) {
      try {
        setWishes(JSON.parse(stored));
      } catch (err) {
        setWishes(DEFAULT_WISHES);
      }
    } else {
      setWishes(DEFAULT_WISHES);
      localStorage.setItem("wedding_wishes", JSON.stringify(DEFAULT_WISHES));
    }
  }, []);

  const saveWishes = (updated: GuestWish[]) => {
    setWishes(updated);
    localStorage.setItem("wedding_wishes", JSON.stringify(updated));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !wishText.trim()) return;

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    const dateFormatted = new Date()
      .toLocaleString("id-ID", options)
      .replace(/\//g, "-")
      .replace(",", "");

    const newWish: GuestWish = {
      id: "wish-" + Date.now(),
      name: name.trim(),
      attendance,
      wish: wishText.trim(),
      timestamp: dateFormatted,
    };

    const updated = [newWish, ...wishes];
    saveWishes(updated);
    
    // Clear wish textarea but leave name (for convenience)
    setWishText("");
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const deleteWish = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus ucapan ini?")) {
      const updated = wishes.filter((w) => w.id !== id);
      saveWishes(updated);
    }
  };

  // Stats calculation
  const totalWishes = wishes.length;
  const countHadir = wishes.filter((w) => w.attendance === "hadir").length;
  const countRagu = wishes.filter((w) => w.attendance === "ragu").length;
  const countTidak = wishes.filter((w) => w.attendance === "tidak").length;

  return (
    <section className="py-24 px-4 bg-[#0a0505] relative overflow-hidden" id="section-rsvp">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[30%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#1s2a3a]/15 blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-sans text-[10px] tracking-[0.4em] text-[#ebd8b7] uppercase font-bold mb-3 ml-1">
            Rsvp & Buku Tamu
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-light text-white tracking-tight">
            Kehadiran & Doa Restu
          </h2>
          <div className="w-16 h-[1px] bg-white/20 mx-auto mt-6" />
        </div>

        {/* Dashboard Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 px-2 md:px-6">
          
          {/* Form RSVP Column */}
          <div className="lg:col-span-15 flex flex-col gap-6 lg:w-[110%] xl:w-full">
            <div className="bg-white/[0.02] backdrop-blur-xl rounded-[32px] p-6 md:p-8 shadow-2xl border border-white/5">
              <h3 className="font-serif text-lg font-light text-white mb-6 flex items-center gap-2.5">
                <MessageSquare className="text-[#ebd8b7]" size={18} />
                Konfirmasi Kehadiran
              </h3>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Guest Name input */}
                <div>
                  <label className="block text-stone-400 font-sans text-xs font-semibold uppercase tracking-wider mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    id="input-rsvp-name"
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 focus:border-[#d4af37]/50 focus:outline-none focus:ring-1 focus:ring-[#d4af37]/30 text-white text-sm font-sans placeholder-stone-500 bg-white/[0.02] transition-all"
                  />
                </div>

                {/* Confirm attendance radio cards */}
                <div>
                  <label className="block text-stone-400 font-sans text-xs font-semibold uppercase tracking-wider mb-2">
                    Konfirmasi Kehadiran
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] md:text-xs">
                    {/* Attending */}
                    <button
                      type="button"
                      onClick={() => setAttendance("hadir")}
                      className={`py-3 px-1.5 rounded-xl border font-sans font-medium flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        attendance === "hadir"
                          ? "bg-green-500/10 border-green-500/40 text-green-300 font-bold ring-2 ring-green-950/40 shadow-lg shadow-green-950/20"
                          : "bg-white/[0.02] border-white/5 text-stone-400 hover:bg-white/[0.05]"
                      }`}
                    >
                      <CheckCircle size={15} />
                      Akan Hadir
                    </button>

                    {/* Tentative/Ragu */}
                    <button
                      type="button"
                      onClick={() => setAttendance("ragu")}
                      className={`py-3 px-1.5 rounded-xl border font-sans font-medium flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        attendance === "ragu"
                          ? "bg-amber-500/10 border-amber-500/40 text-amber-300 font-bold ring-2 ring-amber-950/40 shadow-lg shadow-amber-950/20"
                          : "bg-white/[0.02] border-white/5 text-stone-400 hover:bg-white/[0.05]"
                      }`}
                    >
                      <HelpCircle size={15} />
                      Masih Ragu
                    </button>

                    {/* Absent */}
                    <button
                      type="button"
                      onClick={() => setAttendance("tidak")}
                      className={`py-3 px-1.5 rounded-xl border font-sans font-medium flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        attendance === "tidak"
                          ? "bg-red-500/10 border-red-500/40 text-red-300 font-bold ring-2 ring-red-950/40 shadow-lg shadow-red-950/20"
                          : "bg-white/[0.02] border-white/5 text-stone-400 hover:bg-white/[0.05]"
                      }`}
                    >
                      <XCircle size={15} />
                      Tidak Hadir
                    </button>
                  </div>
                </div>

                {/* Sizing box: guests quantity selector */}
                {attendance === "hadir" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="overflow-hidden"
                  >
                    <label className="block text-stone-400 font-sans text-xs font-semibold uppercase tracking-wider mb-2">
                       Jumlah Tamu (Pax)
                    </label>
                    <select
                      value={guestsCount}
                      onChange={(e) => setGuestsCount(parseInt(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 focus:border-[#d4af37]/50 focus:outline-none focus:ring-1 focus:ring-[#d4af37]/30 text-white text-sm font-sans bg-[#0c0707] transition-all"
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num} className="bg-[#0c0707] text-white">
                          {num} Orang
                        </option>
                      ))}
                    </select>
                  </motion.div>
                )}

                {/* Wishes textarea input */}
                <div>
                  <label className="block text-stone-400 font-sans text-xs font-semibold uppercase tracking-wider mb-2">
                    Ucapan & Doa Restu
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={wishText}
                    onChange={(e) => setWishText(e.target.value)}
                    placeholder="Tulis ucapan selamat dan doa restu Anda di sini..."
                    id="input-rsvp-wish"
                    className="w-full px-4 py-3 rounded-xl border border-white/10 focus:border-[#d4af37]/50 focus:outline-none focus:ring-1 focus:ring-[#d4af37]/30 text-white text-sm font-sans placeholder-stone-500 bg-white/[0.02] leading-relaxed resize-none transition-all"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  id="btn-rsvp-submit"
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-[#d4af37] hover:bg-[#ebd8b7] text-black font-sans font-bold text-xs tracking-[0.15em] uppercase rounded-full shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] mt-2 cursor-pointer"
                >
                  <Send size={12} className="stroke-[2.5]" />
                  Kirim Doa Restu
                </button>
              </form>
            </div>

            {/* Attendance Status Statistics Panel */}
            <div className="bg-white/[0.02] backdrop-blur-xl rounded-3xl p-5 border border-white/5 shadow-2xl">
              <h4 className="font-serif text-sm font-light text-white mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
                <Users size={14} className="text-[#ebd8b7]" /> Statistik Respon Tamu
              </h4>
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="bg-green-500/5 p-3 rounded-2xl border border-green-500/15">
                  <p className="font-sans text-[9px] text-green-400 uppercase tracking-widest font-bold opacity-80">Hadir</p>
                  <p className="font-serif text-2xl font-light text-green-200 mt-1">{countHadir}</p>
                </div>
                <div className="bg-amber-500/5 p-3 rounded-2xl border border-amber-500/15">
                  <p className="font-sans text-[9px] text-amber-400 uppercase tracking-widest font-bold opacity-80">Ragu</p>
                  <p className="font-serif text-2xl font-light text-amber-200 mt-1">{countRagu}</p>
                </div>
                <div className="bg-red-500/5 p-3 rounded-2xl border border-red-500/15">
                  <p className="font-sans text-[9px] text-red-400 uppercase tracking-widest font-bold opacity-80">Absen</p>
                  <p className="font-serif text-2xl font-light text-red-200 mt-1">{countTidak}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Wishes List Column */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="bg-white/[0.02] backdrop-blur-xl rounded-[32px] p-6 md:p-8 shadow-2xl border border-white/5 flex-1 flex flex-col max-h-[660px]">
              <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                <h3 className="font-serif text-lg font-light text-white flex items-center gap-2.5">
                  <MessageSquare className="text-[#ebd8b7]" size={18} />
                  Buku Tamu ({totalWishes})
                </h3>
                {totalWishes > 0 && (
                  <button
                    onClick={() => {
                      if (window.confirm("Buka kembali bawaan ucapan? Ini menghapus ucapan buatan Anda.")) {
                        saveWishes(DEFAULT_WISHES);
                      }
                    }}
                    className="font-sans text-[10px] text-stone-500 hover:text-red-400 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    Reset Buku
                  </button>
                )}
              </div>

              {/* Infinite Wishes Scrolling Block */}
              <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[500px]">
                <AnimatePresence initial={false}>
                  {wishes.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-20 text-stone-500 font-sans text-xs"
                    >
                      Belum ada ucapan. Jadilah yang pertama mengirimkan ucapan!
                    </motion.div>
                  ) : (
                    wishes.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.4 }}
                        className="p-4 bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-2xl relative group transition-all duration-300"
                      >
                        {/* Header: Name & Designation badge */}
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-serif text-sm font-light text-white truncate max-w-[170px] md:max-w-[260px]">
                              {item.name}
                            </span>
                            
                            {/* Attendance Pill */}
                            {item.attendance === "hadir" ? (
                              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-green-500/10 text-green-300 font-sans text-[9px] font-bold tracking-wider border border-green-500/20">
                                <CheckCircle size={9} /> Hadir
                              </span>
                            ) : item.attendance === "ragu" ? (
                              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-sans text-[9px] font-bold tracking-wider border border-amber-500/20">
                                <HelpCircle size={9} /> Ragu
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-red-500/10 text-red-300 font-sans text-[9px] font-bold tracking-wider border border-red-500/20">
                                <XCircle size={9} /> Absen
                              </span>
                            )}
                          </div>

                          {/* Delete capability for individual entries */}
                          <button
                            onClick={() => deleteWish(item.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-stone-500 hover:text-red-400 rounded transition-opacity cursor-pointer absolute right-3 top-3"
                            title="Hapus Ucapan"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>

                        {/* Speech content */}
                        <p className="font-sans text-stone-300 text-xs leading-relaxed break-words font-light">
                          {item.wish}
                        </p>

                        {/* Timestamp footer indicator */}
                        <p className="font-sans text-[9px] text-stone-500 mt-2.5 tracking-wider text-right">
                          {item.timestamp}
                        </p>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Success registration toast notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#160f0f] text-[#ebd8b7] border border-[#d4af37]/35 px-6 py-3 rounded-full flex items-center gap-2 shadow-2xl backdrop-blur-md"
          >
            <CheckCircle size={14} className="text-green-400" />
            <span className="font-sans text-xs font-semibold tracking-wider uppercase">Doa Restu Sukses Dikirim!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
