import React, { useState } from "react";
import { useWedding } from "../context/WeddingDataContext";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, Lock, Unlock, Mail, Save, Trash2, Plus, 
  Calendar, Music, MapPin, CreditCard, RefreshCw, 
  LogOut, Check, ChevronRight, User, Heart,
  Search, Copy, Share2, Image, Menu
} from "lucide-react";
import { Song, WeddingData } from "../types";

export default function AdminEditor() {
  const { 
    weddingData, 
    updateWeddingData, 
    songs, 
    updateSongs, 
    activeSongIndex, 
    setActiveSongIndex,
    isAdmin, 
    adminEmail,
    loginAsAdmin, 
    logout, 
    resetToDefault 
  } = useWedding();

  const [isOpen, setIsOpen] = useState(false);
  
  // Check if guest personalized invitation (e.g. ?to=Guest Name is in the URL)
  const isGuestView = typeof window !== "undefined" && !!new URLSearchParams(window.location.search).get("to");
  
  // Login Form States
  const [email, setEmail] = useState("");
  const [passcode, setPasscode] = useState("");
  const [loginError, setLoginError] = useState("");

  // Editor Panel Active Tab
  const [activeTab, setActiveTab] = useState<"mempelai" | "acara" | "cerita" | "kado" | "lagu" | "tamu" | "foto">("mempelai");
  const [toastMessage, setToastMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleSelectTab = (tab: "mempelai" | "acara" | "cerita" | "kado" | "lagu" | "tamu" | "foto") => {
    setActiveTab(tab);
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  // Local state copy of wedding data for draft editing
  const [draftData, setDraftData] = useState<WeddingData | null>(null);
  const [draftSongs, setDraftSongs] = useState<Song[] | null>(null);

  // New Song form states
  const [newSongTitle, setNewSongTitle] = useState("");
  const [newSongArtist, setNewSongArtist] = useState("");
  const [newSongUrl, setNewSongUrl] = useState("");

  // Guest list states
  const [newGuestName, setNewGuestName] = useState("");
  const [bulkGuestNames, setBulkGuestNames] = useState("");
  const [searchGuest, setSearchGuest] = useState("");
  const [editingGuestIndex, setEditingGuestIndex] = useState<number | null>(null);
  const [editingGuestName, setEditingGuestName] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleOpenEditor = () => {
    // Reset drafts
    setDraftData(JSON.parse(JSON.stringify(weddingData)));
    setDraftSongs([...songs]);
    setIsOpen(true);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    
    const result = loginAsAdmin(email, passcode);
    if (result.success) {
      showToast("Berhasil masuk sebagai Admin!");
      setDraftData(JSON.parse(JSON.stringify(weddingData)));
      setDraftSongs([...songs]);
    } else {
      setLoginError(result.error || "Gagal masuk.");
    }
  };

  const handleSaveData = () => {
    if (!draftData) return;
    updateWeddingData(draftData);
    showToast("Data pernikahan berhasil disimpan!");
  };

  const handleSaveSongs = () => {
    if (!draftSongs) return;
    updateSongs(draftSongs);
    showToast("Playlist musik berhasil diperbarui!");
  };

  const handleAddSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftSongs) return;
    if (!newSongTitle || !newSongUrl) {
      showToast("Judul lagu dan URL audio wajib diisi.");
      return;
    }

    const newSong: Song = {
      id: "custom_" + Date.now(),
      title: newSongTitle,
      artist: newSongArtist || "Artis tidak dikenal",
      url: newSongUrl,
    };

    const updated = [...draftSongs, newSong];
    setDraftSongs(updated);
    updateSongs(updated);
    
    // reset form
    setNewSongTitle("");
    setNewSongArtist("");
    setNewSongUrl("");
    showToast("Lagu baru berhasil ditambahkan!");
  };

  const handleDeleteSong = (id: string, idx: number) => {
    if (!draftSongs) return;
    if (draftSongs.length <= 1) {
      showToast("Harus menyisakan minimal 1 lagu pengiring.");
      return;
    }

    const updated = draftSongs.filter(s => s.id !== id);
    setDraftSongs(updated);
    updateSongs(updated);

    // Adjuest active index if necessary
    if (activeSongIndex >= updated.length) {
      setActiveSongIndex(Math.max(0, updated.length - 1));
    }
    showToast("Lagu berhasil dihapus.");
  };

  const handleReset = () => {
    if (window.confirm("Apakah Anda yakin ingin memulihkan semua data undangan & lagu ke setelan default pabrik?")) {
      resetToDefault();
      setDraftData(JSON.parse(JSON.stringify(WEDDING_DATA)));
      setDraftSongs([...SONGS]);
      showToast("Seluruh pengaturan berhasil dipulihkan!");
    }
  };

  // Helper change handlers
  const updateDraftDataField = (section: string, field: string, value: any, index?: number) => {
    if (!draftData) return;
    const cloned = { ...draftData };

    if (section === "groom" || section === "bride") {
      cloned[section] = { ...cloned[section], [field]: value };
    } else if (section === "akad" || section === "resepsi") {
      cloned[section] = { ...cloned[section], [field]: value };
    } else if (section === "giftAddress") {
      cloned[section] = { ...cloned[section], [field]: value };
    } else if (section === "date") {
      cloned.date = new Date(value);
    } else if (section === "loveStory" && index !== undefined) {
      cloned.loveStory[index] = { ...cloned.loveStory[index], [field]: value };
    } else if (section === "accounts" && index !== undefined) {
      cloned.accounts[index] = { ...cloned.accounts[index], [field]: value };
    }

    setDraftData(cloned);
  };

  const handleAddStory = () => {
    if (!draftData) return;
    const cloned = { ...draftData };
    cloned.loveStory.push({
      year: new Date().getFullYear().toString(),
      title: "Judul Kisah Baru",
      story: "Tuliskan cerita cinta indah Anda di sini...",
    });
    setDraftData(cloned);
  };

  const handleDeleteStory = (idx: number) => {
    if (!draftData) return;
    const cloned = { ...draftData };
    cloned.loveStory = cloned.loveStory.filter((_, i) => i !== idx);
    setDraftData(cloned);
  };

  const handleAddAccount = () => {
    if (!draftData) return;
    const cloned = { ...draftData };
    cloned.accounts.push({
      bankName: "BCA",
      accountNumber: "",
      accountHolder: "",
    });
    setDraftData(cloned);
  };

  const handleDeleteAccount = (idx: number) => {
    if (!draftData) return;
    const cloned = { ...draftData };
    cloned.accounts = cloned.accounts.filter((_, i) => i !== idx);
    setDraftData(cloned);
  };

  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftData) return;
    const name = newGuestName.trim();
    if (!name) {
      showToast("Nama tamu tidak boleh kosong.");
      return;
    }
    const currentGuests = draftData.guests || [];
    if (currentGuests.includes(name)) {
      showToast("Nama tamu sudah ada di daftar.");
      return;
    }
    const updatedGuests = [...currentGuests, name];
    const updatedData = { ...draftData, guests: updatedGuests };
    setDraftData(updatedData);
    updateWeddingData(updatedData);
    setNewGuestName("");
    showToast("Tamu baru berhasil ditambahkan!");
  };

  const handleBulkAddGuests = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftData) return;
    const lines = bulkGuestNames.split("\n");
    const nameList = lines.map(l => l.trim()).filter(l => l.length > 0);
    if (nameList.length === 0) {
      showToast("Silakan masukkan minimal 1 nama tamu (1 per baris).");
      return;
    }
    const currentGuests = draftData.guests || [];
    const uniqueNews = nameList.filter(n => !currentGuests.includes(n));
    if (uniqueNews.length === 0) {
      showToast("Semua tamu ini sudah terdaftar.");
      return;
    }
    const updatedGuests = [...currentGuests, ...uniqueNews];
    const updatedData = { ...draftData, guests: updatedGuests };
    setDraftData(updatedData);
    updateWeddingData(updatedData);
    setBulkGuestNames("");
    showToast(`${uniqueNews.length} tamu berhasil diimpor!`);
  };

  const handleDeleteGuest = (idx: number) => {
    if (!draftData) return;
    const currentGuests = draftData.guests || [];
    const updatedGuests = currentGuests.filter((_, i) => i !== idx);
    const updatedData = { ...draftData, guests: updatedGuests };
    setDraftData(updatedData);
    updateWeddingData(updatedData);
    showToast("Tamu berhasil dihapus.");
  };

  const handleStartEditGuest = (idx: number, name: string) => {
    setEditingGuestIndex(idx);
    setEditingGuestName(name);
  };

  const handleSaveEditGuest = (idx: number) => {
    if (!draftData) return;
    const name = editingGuestName.trim();
    if (!name) return;
    const currentGuests = draftData.guests || [];
    const updatedGuests = [...currentGuests];
    updatedGuests[idx] = name;
    const updatedData = { ...draftData, guests: updatedGuests };
    setDraftData(updatedData);
    updateWeddingData(updatedData);
    setEditingGuestIndex(null);
    showToast("Nama tamu berhasil disimpan!");
  };

  const handleCopyLink = (name: string, index: number) => {
    const url = `${window.location.origin}${window.location.pathname}?to=${encodeURIComponent(name)}`;
    try {
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(url)
          .then(() => {
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 2000);
            showToast("Tautan disalin!");
          })
          .catch(() => fallbackCopy(url, index));
      } else {
        fallbackCopy(url, index);
      }
    } catch {
      fallbackCopy(url, index);
    }
  };

  const fallbackCopy = (text: string, index: number) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
      showToast("Tautan disalin!");
    } catch {
      showToast("Gagal menyalin tautan.");
    }
    document.body.removeChild(textArea);
  };

  return (
    <>
      {/* Subtle bottom footer trigger */}
      {!isGuestView && (
        <div className="flex items-center justify-center py-4 bg-[#050303] border-t border-white/[0.03]">
          <button
            onClick={handleOpenEditor}
            className="inline-flex items-center gap-1.5 text-[10px] text-stone-500 hover:text-[#ebd8b7] tracking-[0.2em] uppercase transition-colors cursor-pointer"
          >
            <Lock size={10} />
            {isAdmin ? "Panel Admin Kuawo" : "Admin Entrance"}
          </button>
        </div>
      )}

      {/* Floating Administrative Toggle Trigger (Always visible, extremely premium expanding button) */}
      {!isGuestView && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleOpenEditor}
          id="btn-floating-admin"
          className="fixed top-24 right-4 z-40 bg-[#d4af37] text-black hover:bg-[#ebd8b7] p-3 rounded-full shadow-2xl transition-all border border-black/10 cursor-pointer flex items-center justify-center gap-1 group"
          title="Buka Panel Admin Kuawo"
        >
          <Lock size={14} className="group-hover:rotate-12 transition-transform" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-[100px] transition-all duration-300 ease-in-out whitespace-nowrap text-[9px] font-sans font-bold uppercase tracking-widest pl-0 group-hover:pl-1.5">Admin</span>
        </motion.button>
      )}

      {/* Floating Panel Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md overflow-y-auto flex items-center justify-center p-4 md:p-8"
          >
            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#0e0a0a] border border-white/10 rounded-[32px] w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-6 md:p-8 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-transparent via-[#3a1510]/10 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#d4af37]/10 rounded-xl text-[#d4af37]">
                    <Heart size={20} fill="currentColor" />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl md:text-2xl font-light text-white tracking-wide">
                      {isAdmin ? "Kuawo.id Admin Dashboard" : "Masuk Area Admin"}
                    </h2>
                    <p className="font-sans text-[11px] text-stone-400">
                      {isAdmin ? `Mengedit sebagai admin: ${adminEmail}` : "Hanya untuk admin kuawo.id@gmail.com"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full text-stone-400 hover:text-white transition-colors cursor-pointer"
                  title="Tutup Panel"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Toast Notification inside dialog */}
              <AnimatePresence>
                {toastMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-[#d4af37] text-black text-center font-sans font-bold text-xs py-3 px-4 flex items-center justify-center gap-1.5"
                  >
                    <Check size={14} strokeWidth={3} /> {toastMessage}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Content Body */}
              {!isAdmin ? (
                /* LOGIN SCREEN */
                <div className="flex-1 overflow-y-auto p-8 flex flex-col justify-center items-center max-w-md mx-auto w-full text-center py-16">
                  <Unlock size={44} className="text-[#d4af37] mb-6" />
                  <p className="font-serif text-lg font-light text-white mb-6">
                    Masuk Menggunakan Email Admin
                  </p>

                  <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" size={16} />
                      <input
                        type="email"
                        required
                        placeholder="Email Admin (kuawo.id@gmail.com)"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#d4af37]/60"
                      />
                    </div>

                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" size={16} />
                      <input
                        type="password"
                        required
                        placeholder="Kata Sandi Admin"
                        value={passcode}
                        onChange={(e) => setPasscode(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#d4af37]/60"
                      />
                    </div>

                    {loginError && (
                      <p className="text-red-400 font-sans text-xs text-left px-1 mt-1">
                        ⚠️ {loginError}
                      </p>
                    )}

                    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3.5 text-left text-[11px] text-[#ebd8b7]/80 leading-relaxed mt-2">
                      <p className="font-bold uppercase tracking-wider text-[#ebd8b7] mb-1">💡 INFO LOGIN DEMO</p>
                      Masukkan email <strong className="text-white">kuawo.id@gmail.com</strong> dengan sandi <strong className="text-white">kuawo2026</strong> atau <strong className="text-white">admin</strong> untuk menguji fungsionalitas pengeditan.
                    </div>

                    <button
                      type="submit"
                      className="mt-4 bg-[#d4af37] hover:bg-[#ebd8b7] text-black font-sans font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xl"
                    >
                      <Lock size={14} strokeWidth={2.5} /> Hubungkan Kunci Admin
                    </button>
                  </form>
                </div>
              ) : (
                /* EDITOR VIEW */
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Top Bar holding Hamburger Menu and Current Selected Tab */}
                  <div className="bg-[#140e0e] border-b border-white/10 px-6 py-4 flex items-center justify-between text-white select-none shrink-0">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 bg-[#d4af37]/10 hover:bg-[#d4af37]/20 border border-[#d4af37]/30 rounded-xl text-[#ebd8b7] hover:text-white transition-all cursor-pointer flex items-center gap-2 group text-xs font-sans tracking-wider"
                      >
                        <Menu size={16} className="group-hover:rotate-180 transition-transform duration-500" />
                        <span className="font-semibold uppercase tracking-widest text-[10px]">Kumpulan Menu</span>
                      </button>
                      <div className="h-5 w-[1px] bg-white/10"></div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-stone-500 uppercase tracking-widest font-sans font-bold hidden sm:inline">Aktif:</span>
                        <div className="font-sans text-[11px] font-bold text-[#ebd8b7] px-3 py-1 bg-white/[0.03] border border-white/10 rounded-full flex items-center gap-1.5 animate-pulse">
                          {activeTab === "mempelai" && <span>💍 Mempelai</span>}
                          {activeTab === "acara" && <span>⏰ Detail Acara</span>}
                          {activeTab === "cerita" && <span>📖 Kisah Cinta</span>}
                          {activeTab === "kado" && <span>💳 Kado & Alamat</span>}
                          {activeTab === "lagu" && <span>🎵 Edit & Pilih Lagu</span>}
                          {activeTab === "tamu" && <span>👥 Tamu Undangan</span>}
                          {activeTab === "foto" && <span>🖼️ Edit Foto Website</span>}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
                    {/* Collapsible Sidebar Selection Tabs */}
                    <AnimatePresence initial={false}>
                      {isSidebarOpen && (
                        <motion.div
                          key="sidebar-menu"
                          initial={{ width: 0, opacity: 0 }}
                          animate={{ 
                            width: typeof window !== "undefined" && window.innerWidth < 768 ? "100%" : 250, 
                            opacity: 1 
                          }}
                          exit={{ width: 0, opacity: 0 }}
                          transition={{ type: "tween", duration: 0.2, ease: "easeInOut" }}
                          className="bg-[#140e0e] border-b md:border-b-0 md:border-r border-white/10 shrink-0 overflow-y-auto block z-30 absolute md:relative inset-y-0 left-0 w-full md:w-[250px]"
                        >
                          {/* Inside mobile container, add an explicit Close panel header to exit the hamburger menu easily */}
                          <div className="flex md:hidden items-center justify-between p-4 border-b border-white/10 bg-[#0c0808]">
                            <span className="font-serif text-sm tracking-widest text-[#ebd8b7] font-semibold">PILIH MENU EDIT</span>
                            <button
                              type="button"
                              onClick={() => setIsSidebarOpen(false)}
                              className="p-1.5 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10"
                            >
                              <X size={14} />
                            </button>
                          </div>

                          <div className="flex flex-col p-3 md:p-0">
                            <button
                              onClick={() => handleSelectTab("mempelai")}
                              className={`text-left font-sans text-xs uppercase tracking-widest px-6 py-4.5 border-b border-white/5 transition-all outline-none flex items-center justify-between group cursor-pointer ${
                                activeTab === "mempelai"
                                  ? "bg-[#d4af37]/15 text-[#ebd8b7] border-l-4 border-l-[#d4af37]"
                                  : "text-stone-400 hover:text-white hover:bg-white/[0.02]"
                              }`}
                            >
                              <span>💍 Mempelai</span>
                            </button>
                            <button
                              onClick={() => handleSelectTab("acara")}
                              className={`text-left font-sans text-xs uppercase tracking-widest px-6 py-4.5 border-b border-white/5 transition-all outline-none flex items-center justify-between group cursor-pointer ${
                                activeTab === "acara"
                                  ? "bg-[#d4af37]/15 text-[#ebd8b7] border-l-4 border-l-[#d4af37]"
                                  : "text-stone-400 hover:text-white hover:bg-white/[0.02]"
                              }`}
                            >
                              <span>⏰ Detail Acara</span>
                            </button>
                            <button
                              onClick={() => handleSelectTab("cerita")}
                              className={`text-left font-sans text-xs uppercase tracking-widest px-6 py-4.5 border-b border-white/5 transition-all outline-none flex items-center justify-between group cursor-pointer ${
                                activeTab === "cerita"
                                  ? "bg-[#d4af37]/15 text-[#ebd8b7] border-l-4 border-l-[#d4af37]"
                                  : "text-stone-400 hover:text-white hover:bg-white/[0.02]"
                              }`}
                            >
                              <span>📖 Kisah Cinta</span>
                            </button>
                            <button
                              onClick={() => handleSelectTab("kado")}
                              className={`text-left font-sans text-xs uppercase tracking-widest px-6 py-4.5 border-b border-white/5 transition-all outline-none flex items-center justify-between group cursor-pointer ${
                                activeTab === "kado"
                                  ? "bg-[#d4af37]/15 text-[#ebd8b7] border-l-4 border-l-[#d4af37]"
                                  : "text-stone-400 hover:text-white hover:bg-white/[0.02]"
                              }`}
                            >
                              <span>💳 Kado & Alamat</span>
                            </button>
                            <button
                              onClick={() => handleSelectTab("lagu")}
                              className={`text-left font-sans text-xs uppercase tracking-widest px-6 py-4.5 border-b border-white/5 transition-all outline-none flex items-center justify-between group cursor-pointer ${
                                activeTab === "lagu"
                                  ? "bg-[#d4af37]/15 text-[#ebd8b7] border-l-4 border-l-[#d4af37]"
                                  : "text-stone-400 hover:text-white hover:bg-white/[0.02]"
                              }`}
                            >
                              <span>🎵 Edit & Pilih Lagu</span>
                            </button>
                            <button
                              onClick={() => handleSelectTab("tamu")}
                              className={`text-left font-sans text-xs uppercase tracking-widest px-6 py-4.5 border-b border-white/5 transition-all outline-none flex items-center justify-between group cursor-pointer ${
                                activeTab === "tamu"
                                  ? "bg-[#d4af37]/15 text-[#ebd8b7] border-l-4 border-l-[#d4af37]"
                                  : "text-stone-400 hover:text-white hover:bg-white/[0.02]"
                              }`}
                            >
                              <span>👥 Tamu Undangan</span>
                            </button>
                            <button
                              onClick={() => handleSelectTab("foto")}
                              className={`text-left font-sans text-xs uppercase tracking-widest px-6 py-4.5 border-b border-white/5 transition-all outline-none flex items-center justify-between group cursor-pointer ${
                                activeTab === "foto"
                                  ? "bg-[#d4af37]/15 text-[#ebd8b7] border-l-4 border-l-[#d4af37]"
                                  : "text-stone-400 hover:text-white hover:bg-white/[0.02]"
                              }`}
                            >
                              <span>🖼️ Edit Foto Website</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
 
                   {/* Right Form Editor Box */}
                   <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col bg-[#0b0808]">
                    
                    {/* TAB MEMPELAI */}
                    {activeTab === "mempelai" && draftData && (
                      <div className="flex flex-col gap-6">
                        <div className="border-b border-white/10 pb-4 mb-2">
                          <h3 className="font-serif text-lg text-white font-light">Set Calon Mempelai</h3>
                          <p className="font-sans text-xs text-stone-400 mt-1">Sesuaikan Nama, Panggilan, dan akun Sosial Orang Tua</p>
                        </div>

                        {/* Groom (Pria) details block */}
                        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex flex-col gap-4">
                          <p className="font-sans text-xs font-bold uppercase tracking-wider text-[#ebd8b7]">🤵 Mempelai Pria (Pengantin)</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] text-stone-400 uppercase tracking-wider mb-1.5">Nama Panggilan</label>
                              <input
                                type="text"
                                value={draftData.groom.nickName}
                                onChange={(e) => updateDraftDataField("groom", "nickName", e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-stone-400 uppercase tracking-wider mb-1.5">Nama Lengkap & Gelar</label>
                              <input
                                type="text"
                                value={draftData.groom.fullName}
                                onChange={(e) => updateDraftDataField("groom", "fullName", e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-stone-400 uppercase tracking-wider mb-1.5">Nama Ayah</label>
                              <input
                                type="text"
                                value={draftData.groom.fatherName}
                                onChange={(e) => updateDraftDataField("groom", "fatherName", e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-stone-400 uppercase tracking-wider mb-1.5">Nama Ibu</label>
                              <input
                                type="text"
                                value={draftData.groom.motherName}
                                onChange={(e) => updateDraftDataField("groom", "motherName", e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-[10px] text-stone-400 uppercase tracking-wider mb-1.5">Instagram</label>
                              <input
                                type="text"
                                value={draftData.groom.instagram}
                                onChange={(e) => updateDraftDataField("groom", "instagram", e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Bride (Wanita) details block */}
                        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex flex-col gap-4">
                          <p className="font-sans text-xs font-bold uppercase tracking-wider text-[#ebd8b7]">👰 Mempelai Wanita (Pengantin)</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] text-stone-400 uppercase tracking-wider mb-1.5">Nama Panggilan</label>
                              <input
                                type="text"
                                value={draftData.bride.nickName}
                                onChange={(e) => updateDraftDataField("bride", "nickName", e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-stone-400 uppercase tracking-wider mb-1.5">Nama Lengkap & Gelar</label>
                              <input
                                type="text"
                                value={draftData.bride.fullName}
                                onChange={(e) => updateDraftDataField("bride", "fullName", e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-stone-400 uppercase tracking-wider mb-1.5">Nama Ayah</label>
                              <input
                                type="text"
                                value={draftData.bride.fatherName}
                                onChange={(e) => updateDraftDataField("bride", "fatherName", e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-stone-400 uppercase tracking-wider mb-1.5">Nama Ibu</label>
                              <input
                                type="text"
                                value={draftData.bride.motherName}
                                onChange={(e) => updateDraftDataField("bride", "motherName", e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-[10px] text-stone-400 uppercase tracking-wider mb-1.5">Instagram</label>
                              <input
                                type="text"
                                value={draftData.bride.instagram}
                                onChange={(e) => updateDraftDataField("bride", "instagram", e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex gap-4">
                          <button
                            onClick={handleSaveData}
                            className="bg-[#d4af37] text-black font-sans font-bold text-xs uppercase px-6 py-3 rounded-xl hover:bg-[#ebd8b7] transition-all cursor-pointer flex items-center justify-center gap-1.5 flex-1"
                          >
                            <Save size={14} /> Simpan Profil Pengantin
                          </button>
                        </div>
                      </div>
                    )}


                    {/* TAB DETAIL ACARA */}
                    {activeTab === "acara" && draftData && (
                      <div className="flex flex-col gap-6">
                        <div className="border-b border-white/10 pb-4 mb-2">
                          <h3 className="font-serif text-lg text-white font-light">Lokasi & Tanggal Resepsi</h3>
                          <p className="font-sans text-xs text-stone-400 mt-1">Konfigurasikan Target Waktu hitung mundur & Informasi Lokasi</p>
                        </div>

                        {/* General Countdown date */}
                        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex flex-col gap-4">
                          <p className="font-sans text-xs font-bold uppercase tracking-wider text-[#ebd8b7]">⏳ Countdown Target Date (Waktu Pernikahan)</p>
                          <div>
                            <label className="block text-[10px] text-stone-400 uppercase tracking-wider mb-1.5">Waktu Kalender (ISO format untuk hitung mundur)</label>
                            <input
                              type="datetime-local"
                              // format current draft Date to local string representation
                              value={(() => {
                                const d = new Date(draftData.date);
                                return isNaN(d.getTime()) ? "" : new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
                              })()}
                              onChange={(e) => updateDraftDataField("date", "date", e.target.value)}
                              className="w-full bg-white/[0.03] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                            />
                            <p className="text-[10px] text-stone-500 mt-1">Sesuaikan ini untuk mengatur target sisa jam dan hari di bagian hitung mundur utama.</p>
                          </div>
                        </div>

                        {/* Akad details block */}
                        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex flex-col gap-4">
                          <p className="font-sans text-xs font-bold uppercase tracking-wider text-[#ebd8b7]">🕌 Sesi Akad Nikah</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] text-stone-400 uppercase tracking-wider mb-1.5">Waktu / Pukul</label>
                              <input
                                type="text"
                                value={draftData.akad.time}
                                onChange={(e) => updateDraftDataField("akad", "time", e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-stone-400 uppercase tracking-wider mb-1.5 font-sans">Hari & Tanggal Literasi</label>
                              <input
                                type="text"
                                value={draftData.akad.dateText}
                                onChange={(e) => updateDraftDataField("akad", "dateText", e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-[10px] text-stone-400 uppercase tracking-wider mb-1.5">Nama Tempat</label>
                              <input
                                type="text"
                                value={draftData.akad.place}
                                onChange={(e) => updateDraftDataField("akad", "place", e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-[10px] text-stone-400 uppercase tracking-wider mb-1.5">Alamat Jalan</label>
                              <textarea
                                value={draftData.akad.address}
                                rows={2}
                                onChange={(e) => updateDraftDataField("akad", "address", e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-[10px] text-stone-400 uppercase tracking-wider mb-1.5">Link Google Maps</label>
                              <input
                                type="text"
                                value={draftData.akad.mapUrl}
                                onChange={(e) => updateDraftDataField("akad", "mapUrl", e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-[10px] text-stone-400 uppercase tracking-wider mb-1.5">Google Maps Embed IFrame URL</label>
                              <input
                                type="text"
                                value={draftData.akad.mapIframe || ""}
                                onChange={(e) => updateDraftDataField("akad", "mapIframe", e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Resepsi details block */}
                        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex flex-col gap-4">
                          <p className="font-sans text-xs font-bold uppercase tracking-wider text-[#ebd8b7]">🎉 Sesi Resepsi Pernikahan</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] text-stone-400 uppercase tracking-wider mb-1.5">Waktu / Pukul</label>
                              <input
                                type="text"
                                value={draftData.resepsi.time}
                                onChange={(e) => updateDraftDataField("resepsi", "time", e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-stone-400 uppercase tracking-wider mb-1.5">Hari & Tanggal Literasi</label>
                              <input
                                type="text"
                                value={draftData.resepsi.dateText}
                                onChange={(e) => updateDraftDataField("resepsi", "dateText", e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-[10px] text-stone-400 uppercase tracking-wider mb-1.5">Nama Tempat</label>
                              <input
                                type="text"
                                value={draftData.resepsi.place}
                                onChange={(e) => updateDraftDataField("resepsi", "place", e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-[10px] text-stone-400 uppercase tracking-wider mb-1.5">Alamat Jalan</label>
                              <textarea
                                value={draftData.resepsi.address}
                                rows={2}
                                onChange={(e) => updateDraftDataField("resepsi", "address", e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-[10px] text-stone-400 uppercase tracking-wider mb-1.5">Link Google Maps</label>
                              <input
                                type="text"
                                value={draftData.resepsi.mapUrl}
                                onChange={(e) => updateDraftDataField("resepsi", "mapUrl", e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-[10px] text-stone-400 uppercase tracking-wider mb-1.5">Google Maps Embed IFrame URL</label>
                              <input
                                type="text"
                                value={draftData.resepsi.mapIframe || ""}
                                onChange={(e) => updateDraftDataField("resepsi", "mapIframe", e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          <button
                            onClick={handleSaveData}
                            className="w-full bg-[#d4af37] text-black font-sans font-bold text-xs uppercase px-6 py-3.5 rounded-xl hover:bg-[#ebd8b7] transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xl"
                          >
                            <Save size={14} /> Simpan Data Jadwal & Lokasi
                          </button>
                        </div>
                      </div>
                    )}


                    {/* TAB KISAH CINTA */}
                    {activeTab === "cerita" && draftData && (
                      <div className="flex flex-col gap-6">
                        <div className="border-b border-white/10 pb-4 mb-2 flex items-center justify-between">
                          <div>
                            <h3 className="font-serif text-lg text-white font-light">Linimasa Kisah Cinta</h3>
                            <p className="font-sans text-xs text-stone-400 mt-1">Ubah atau urutkan tonggak sejarah kisah asmara perjalanan Anda</p>
                          </div>
                          <button
                            onClick={handleAddStory}
                            className="bg-white/10 hover:bg-white/15 text-white font-sans text-[11px] font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1 border border-white/10 shadow"
                          >
                            <Plus size={12} strokeWidth={2.5} /> Tambah Kisah
                          </button>
                        </div>

                        <div className="flex flex-col gap-4">
                          {draftData.loveStory.map((story, idx) => (
                            <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex flex-col gap-3 relative group">
                              <button
                                onClick={() => handleDeleteStory(idx)}
                                className="absolute top-4 right-4 p-2 bg-red-950/40 text-red-400 hover:bg-red-950 hover:text-red-200 rounded-xl transition-all border border-red-500/20 cursor-pointer opacity-85 hover:opacity-100"
                                title="Hapus cerita"
                              >
                                <Trash2 size={13} />
                              </button>
                              
                              <p className="font-sans text-[10px] font-bold text-[#d4af37] uppercase tracking-widest">Kisah #{idx + 1}</p>
                              
                              <div className="grid grid-cols-4 gap-3 mt-1.5">
                                <div className="col-span-1">
                                  <label className="block text-[9px] text-stone-400 uppercase mb-1">Tahun</label>
                                  <input
                                    type="text"
                                    value={story.year}
                                    onChange={(e) => updateDraftDataField("loveStory", "year", e.target.value, idx)}
                                    className="w-full bg-white/[0.03] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                                  />
                                </div>
                                <div className="col-span-3">
                                  <label className="block text-[9px] text-stone-400 uppercase mb-1">Judul Babak</label>
                                  <input
                                    type="text"
                                    value={story.title}
                                    onChange={(e) => updateDraftDataField("loveStory", "title", e.target.value, idx)}
                                    className="w-full bg-white/[0.03] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                                  />
                                </div>
                                <div className="col-span-4">
                                  <label className="block text-[9px] text-stone-400 uppercase mb-1">Rincian Narasi Kisah</label>
                                  <textarea
                                    value={story.story}
                                    rows={3}
                                    onChange={(e) => updateDraftDataField("loveStory", "story", e.target.value, idx)}
                                    className="w-full bg-white/[0.03] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none leading-relaxed"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}

                          {draftData.loveStory.length === 0 && (
                            <div className="text-center py-12 text-stone-500 font-sans text-xs">
                              Tidak ada cerita cinta yang ditampilkan. Klik tombol "Tambah Kisah" untuk menulis cerita Anda!
                            </div>
                          )}
                        </div>

                        <div className="mt-4 flex gap-4">
                          <button
                            onClick={handleSaveData}
                            className="bg-[#d4af37] text-black font-sans font-bold text-xs uppercase px-6 py-3.5 rounded-xl hover:bg-[#ebd8b7] transition-all cursor-pointer flex items-center justify-center gap-1.5 flex-1 shadow-xl"
                          >
                            <Save size={14} /> Simpan Perubahan Kisah Cinta
                          </button>
                        </div>
                      </div>
                    )}


                    {/* TAB KADO DIGITAL & ALAMAT */}
                    {activeTab === "kado" && draftData && (
                      <div className="flex flex-col gap-6">
                        <div className="border-b border-white/10 pb-4 mb-2 flex items-center justify-between">
                          <div>
                            <h3 className="font-serif text-lg text-white font-light">Kado Digital & Pengiriman</h3>
                            <p className="font-sans text-xs text-stone-400 mt-1">Edit rekening bank transfer online dan alamat kado fisik</p>
                          </div>
                          <button
                            onClick={handleAddAccount}
                            className="bg-white/10 hover:bg-white/15 text-white font-sans text-[11px] font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1 border border-white/10 shadow"
                          >
                            <Plus size={12} strokeWidth={2.5} /> Tambah Rekening
                          </button>
                        </div>

                        {/* Accounts Bank transfers */}
                        <div className="flex flex-col gap-4">
                          <p className="font-sans text-xs font-bold uppercase tracking-wider text-[#ebd8b7]">💳 Daftar Rekening Pembayaran</p>
                          {draftData.accounts.map((acc, idx) => (
                            <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex flex-col gap-3 relative group">
                              <button
                                onClick={() => handleDeleteAccount(idx)}
                                className="absolute top-4 right-4 p-2 bg-red-950/40 text-red-400 hover:bg-red-950 hover:text-red-200 rounded-xl transition-all border border-red-500/20 cursor-pointer"
                                title="Hapus rekening"
                              >
                                <Trash2 size={13} />
                              </button>
                              
                              <p className="font-sans text-[10px] font-bold text-[#d4af37] uppercase tracking-widest">Rekening #{idx + 1}</p>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                  <label className="block text-[9px] text-stone-400 uppercase mb-1">Nama Bank / Dompet DIgital</label>
                                  <input
                                    type="text"
                                    placeholder="Contoh: BCA, Mandiri, OVO"
                                    value={acc.bankName}
                                    onChange={(e) => updateDraftDataField("accounts", "bankName", e.target.value, idx)}
                                    className="w-full bg-white/[0.03] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[9px] text-stone-400 uppercase mb-1">Nomor Rekening</label>
                                  <input
                                    type="text"
                                    placeholder="Nomor kartu / akun"
                                    value={acc.accountNumber}
                                    onChange={(e) => updateDraftDataField("accounts", "accountNumber", e.target.value, idx)}
                                    className="w-full bg-white/[0.03] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[9px] text-stone-400 uppercase mb-1">Atas Nama (Pemilik)</label>
                                  <input
                                    type="text"
                                    placeholder="Nama Penerima"
                                    value={acc.accountHolder}
                                    onChange={(e) => updateDraftDataField("accounts", "accountHolder", e.target.value, idx)}
                                    className="w-full bg-white/[0.03] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}

                          {draftData.accounts.length === 0 && (
                            <div className="text-center py-6 text-stone-500 font-sans text-xs">
                              Belum ada rekening pembayaran yang ditambahkan.
                            </div>
                          )}
                        </div>

                        {/* Physical address */}
                        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex flex-col gap-4 mt-2">
                          <p className="font-sans text-xs font-bold uppercase tracking-wider text-[#ebd8b7]">🎁 Alamat Kiriman Kado Fisik</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] text-stone-400 uppercase tracking-wider mb-1.5">Nama Penerima</label>
                              <input
                                type="text"
                                value={draftData.giftAddress.recipient}
                                onChange={(e) => updateDraftDataField("giftAddress", "recipient", e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-stone-400 uppercase tracking-wider mb-1.5 font-sans">No. Telepon / HP</label>
                              <input
                                type="text"
                                value={draftData.giftAddress.phone}
                                onChange={(e) => updateDraftDataField("giftAddress", "phone", e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-[10px] text-stone-400 uppercase tracking-wider mb-1.5">Alamat Pengiriman Lengkap</label>
                              <textarea
                                value={draftData.giftAddress.address}
                                rows={3}
                                onChange={(e) => updateDraftDataField("giftAddress", "address", e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none leading-relaxed"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex gap-4">
                          <button
                            onClick={handleSaveData}
                            className="bg-[#d4af37] text-black font-sans font-bold text-xs uppercase px-6 py-3.5 rounded-xl hover:bg-[#ebd8b7] transition-all cursor-pointer flex items-center justify-center gap-1.5 flex-1 shadow-xl"
                          >
                            <Save size={14} /> Simpan Data Transaksi & Kado
                          </button>
                        </div>
                      </div>
                    )}


                    {/* TAB PLAYLIST & LAGU */}
                    {activeTab === "lagu" && draftSongs && (
                      <div className="flex flex-col gap-6">
                        <div className="border-b border-white/10 pb-4 mb-2">
                          <h3 className="font-serif text-lg text-white font-light">Pilihan & Daftar Lagu</h3>
                          <p className="font-sans text-xs text-stone-400 mt-1">Ganti lagu default pembuka, hapus, atau tambahkan lagu MP3 pilihan Anda sendiri!</p>
                        </div>

                        {/* Default song selection list */}
                        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex flex-col gap-4">
                          <p className="font-sans text-xs font-bold uppercase tracking-wider text-[#ebd8b7]">🎵 Pilih Lagu Pembuka Utama (Default Play on Enter)</p>
                          <div className="flex flex-col gap-2">
                            {draftSongs.map((song, idx) => (
                              <div
                                key={song.id}
                                className={`border rounded-2xl p-4 bg-white/[0.01] transition-all flex flex-col gap-4 ${
                                  activeSongIndex === idx
                                    ? "border-[#d4af37]/60 bg-[#d4af37]/5 text-white"
                                    : "border-white/5 text-stone-300"
                                }`}
                              >
                                {/* Song header and selection trigger */}
                                <div className="flex items-center justify-between">
                                  <div 
                                    onClick={() => setActiveSongIndex(idx)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" || e.key === " ") {
                                        setActiveSongIndex(idx);
                                      }
                                    }}
                                    className="flex-1 cursor-pointer select-none"
                                  >
                                    <span className="font-sans text-[9px] text-stone-500 font-bold tracking-wider block">ID LAGU #{idx + 1}</span>
                                    <span className="font-serif text-sm font-semibold text-[#ebd8b7] block mt-0.5">{song.title || "Lagu Tanpa Judul"}</span>
                                    <span className="font-sans text-xs text-stone-400 mt-0.5 block">{song.artist || "Artis Tidak Dikenal"}</span>
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => setActiveSongIndex(idx)}
                                      className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded-full transition-all cursor-pointer border ${
                                        activeSongIndex === idx
                                          ? "bg-[#d4af37] text-black border-[#d4af37]"
                                          : "bg-white/5 text-stone-300 border-white/10 hover:bg-white/10"
                                      }`}
                                    >
                                      {activeSongIndex === idx ? "Dipilih Utama" : "Set Utama"}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteSong(song.id, idx);
                                      }}
                                      className="p-1.5 hover:bg-red-950/50 hover:text-red-400 text-stone-500 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-red-500/20"
                                      title="Hapus Lagu"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                </div>

                                {/* Custom Inline Inputs for changing fields directly */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-white/5">
                                  <div>
                                    <label className="block text-[9px] text-stone-400 uppercase tracking-wider mb-1 font-sans">Judul Lagu</label>
                                    <input
                                      type="text"
                                      value={song.title}
                                      onChange={(e) => {
                                        const updated = [...draftSongs];
                                        updated[idx] = { ...updated[idx], title: e.target.value };
                                        setDraftSongs(updated);
                                        updateSongs(updated);
                                      }}
                                      placeholder="Masukkan judul lagu..."
                                      className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#d4af37]/60 font-sans"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[9px] text-stone-400 uppercase tracking-wider mb-1 font-sans">Artis / Penyanyi</label>
                                    <input
                                      type="text"
                                      value={song.artist}
                                      onChange={(e) => {
                                        const updated = [...draftSongs];
                                        updated[idx] = { ...updated[idx], artist: e.target.value };
                                        setDraftSongs(updated);
                                        updateSongs(updated);
                                      }}
                                      placeholder="Nama penyanyi..."
                                      className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#d4af37]/60 font-sans"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[9px] text-stone-400 uppercase tracking-wider mb-1 font-sans">URL Fail Audio (.mp3)</label>
                                    <input
                                      type="text"
                                      value={song.url}
                                      onChange={(e) => {
                                        const updated = [...draftSongs];
                                        updated[idx] = { ...updated[idx], url: e.target.value };
                                        setDraftSongs(updated);
                                        updateSongs(updated);
                                      }}
                                      placeholder="URL MP3..."
                                      className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#d4af37]/60 font-mono"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Add Custom Song */}
                        <form onSubmit={handleAddSong} className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex flex-col gap-4">
                          <p className="font-sans text-xs font-bold uppercase tracking-wider text-[#ebd8b7] flex items-center gap-1"><Plus size={12} strokeWidth={2.5} /> Tambahkan Lagu MP3 Kustom Baru</p>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] text-stone-400 uppercase tracking-wider mb-1.5">Judul Lagu</label>
                              <input
                                type="text"
                                required
                                placeholder="Contoh: Janji Suci"
                                value={newSongTitle}
                                onChange={(e) => setNewSongTitle(e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37]/60"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-stone-400 uppercase tracking-wider mb-1.5">Artis / Penyanyi</label>
                              <input
                                type="text"
                                placeholder="Contoh: Yovie & Nuno"
                                value={newSongArtist}
                                onChange={(e) => setNewSongArtist(e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37]/60"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-[10px] text-stone-400 uppercase tracking-wider mb-1.5">URL Sumber File Audio (.mp3)</label>
                              <input
                                type="text"
                                required
                                placeholder="https://domain.com/path-ke-lagu.mp3"
                                value={newSongUrl}
                                onChange={(e) => setNewSongUrl(e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37]/60"
                              />
                              <p className="text-[10px] text-stone-500 mt-1.5">Wajib mencantumkan direct link audio MP3 yang valid agar pemutar audio dapat memainkan lagu dengan lancar.</p>
                            </div>
                          </div>

                          <div>
                            <button
                              type="submit"
                              className="bg-white/10 hover:bg-white/15 text-white font-sans text-xs font-bold uppercase tracking-wider py-2.5 px-5 rounded-xl transition-all cursor-pointer border border-white/10 shadow"
                            >
                              Simpan & Masukkan Lagu Ke Daftar
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {activeTab === "tamu" && draftData && (
                      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
                        {/* Tab header */}
                        <div className="border-b border-white/10 pb-4 mb-4">
                          <h3 className="font-serif text-lg text-white font-light flex items-center gap-2">
                             <User size={18} className="text-[#ebd8b7]" /> Kelola Tamu Undangan
                          </h3>
                          <p className="font-sans text-xs text-stone-400 mt-1">
                            Kelola daftar nama tamu, salin tautan undangan dengan personalisasi query secara instan.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                          {/* Left Inputs Side: Add Single Guest & Bulk Import */}
                          <div className="lg:col-span-5 space-y-5">
                            
                            {/* Single Adder */}
                            <form onSubmit={handleAddGuest} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-3">
                              <p className="font-sans text-xs font-bold uppercase tracking-wider text-[#ebd8b7] flex items-center gap-1.5">
                                <Plus size={13} strokeWidth={2.5} /> Tambah Tamu Tunggal
                              </p>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="Contoh: Bapak Joko Widodo"
                                  value={newGuestName}
                                  onChange={(e) => setNewGuestName(e.target.value)}
                                  className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]/60 font-sans"
                                />
                                <button
                                  type="submit"
                                  className="bg-[#d4af37] hover:bg-[#ebd8b7] text-black font-sans font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap"
                                >
                                  Tambah
                                </button>
                              </div>
                            </form>

                            {/* Bulk Import */}
                            <form onSubmit={handleBulkAddGuests} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-3">
                              <p className="font-sans text-xs font-bold uppercase tracking-wider text-[#ebd8b7] flex items-center gap-1.5">
                                <Plus size={13} strokeWidth={2.5} /> Impor Banyak Tamu Sekaligus
                              </p>
                              <div>
                                <textarea
                                  rows={4}
                                  placeholder="Tulis list nama tamu, pisahkan satu nama per baris.&#10;Contoh:&#10;Bapak Megawati&#10;Keluarga John Doe&#10;Sahabat Karib"
                                  value={bulkGuestNames}
                                  onChange={(e) => setBulkGuestNames(e.target.value)}
                                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#d4af37]/60 font-sans leading-relaxed"
                                />
                              </div>
                              <button
                                type="submit"
                                className="w-full bg-white/10 hover:bg-white/15 text-white border border-white/10 font-sans font-bold text-xs py-2 rounded-xl transition-all cursor-pointer block text-center"
                              >
                                Impor Nama Masuk Daftar
                              </button>
                            </form>

                            {/* Search Filter input */}
                            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-2">
                              <label className="block font-sans text-xs font-bold uppercase tracking-wider text-[#ebd8b7] flex items-center gap-1.5">
                                <Search size={12} /> Cari Tamu
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  placeholder="Ketik nama tamu untuk mencari..."
                                  value={searchGuest}
                                  onChange={(e) => setSearchGuest(e.target.value)}
                                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]/60 font-sans"
                                />
                                <Search size={14} className="absolute left-3 top-2.5 text-stone-500 pointer-events-none" />
                              </div>
                            </div>
                          </div>

                          {/* Right Interactive List Side */}
                          <div className="lg:col-span-7 space-y-3 border-l-0 lg:border-l lg:border-white/5 lg:pl-6">
                            <p className="font-sans text-xs font-bold uppercase tracking-wider text-stone-400 flex justify-between items-center px-1">
                              <span>Daftar Nama Tamu ({(draftData.guests || []).length} Tamu)</span>
                              {searchGuest && <span className="text-amber-400 font-normal lowercase italic text-[10px]">Cari: "{searchGuest}"</span>}
                            </p>
                            
                            <div className="flex flex-col gap-2 max-h-[420px] overflow-y-auto pr-1">
                              {(draftData.guests || [])
                                .map((guest, originalIdx) => ({ name: guest, originalIdx }))
                                .filter(item => item.name.toLowerCase().includes(searchGuest.toLowerCase()))
                                .map((item, displayIdx) => {
                                  const isEditing = editingGuestIndex === item.originalIdx;
                                  const isCopied = copiedIndex === item.originalIdx;
                                  const guestLink = `${window.location.origin}${window.location.pathname}?to=${encodeURIComponent(item.name)}`;

                                  return (
                                    <div 
                                      key={item.originalIdx}
                                      className="group bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 rounded-xl p-3.5 flex flex-col gap-2 transition-all"
                                    >
                                      {/* Header of guest row */}
                                      <div className="flex items-center justify-between gap-4">
                                        <div className="flex-1 min-w-0 flex items-center gap-2">
                                          <span className="font-mono text-stone-600 text-xs font-bold">#{item.originalIdx + 1}</span>
                                          {isEditing ? (
                                            <input
                                              type="text"
                                              value={editingGuestName}
                                              onChange={(e) => setEditingGuestName(e.target.value)}
                                              className="bg-white/10 border border-[#d4af37]/40 rounded-lg px-2 py-0.5 text-xs text-white font-sans focus:outline-none focus:border-[#d4af37]"
                                              autoFocus
                                              onKeyDown={(e) => {
                                                if (e.key === "Enter") handleSaveEditGuest(item.originalIdx);
                                                if (e.key === "Escape") setEditingGuestIndex(null);
                                              }}
                                            />
                                          ) : (
                                            <span className="font-serif text-sm font-medium text-white truncate">{item.name}</span>
                                          )}
                                        </div>

                                        <div className="flex items-center gap-1 shrink-0">
                                          {isEditing ? (
                                            <>
                                              <button
                                                onClick={() => handleSaveEditGuest(item.originalIdx)}
                                                className="p-1 text-green-400 hover:bg-green-950/40 rounded transition-colors"
                                                title="Simpan Nama"
                                              >
                                                <Check size={14} />
                                              </button>
                                              <button
                                                onClick={() => setEditingGuestIndex(null)}
                                                className="p-1 text-stone-500 hover:bg-white/10 rounded transition-colors"
                                                title="Batal"
                                              >
                                                <X size={14} />
                                              </button>
                                            </>
                                          ) : (
                                            <>
                                              <button
                                                onClick={() => handleStartEditGuest(item.originalIdx, item.name)}
                                                className="p-1 text-stone-500 hover:text-[#ebd8b7] hover:bg-white/5 rounded transition-all"
                                                title="Ubah Nama"
                                              >
                                                <ChevronRight size={14} />
                                              </button>
                                              <button
                                                onClick={() => handleDeleteGuest(item.originalIdx)}
                                                className="p-1 text-stone-500 hover:text-red-400 hover:bg-red-950/30 rounded transition-all"
                                                title="Hapus"
                                              >
                                                <Trash2 size={13} />
                                              </button>
                                            </>
                                          )}
                                        </div>
                                      </div>

                                      {/* Link Utilities row */}
                                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pt-1.5 border-t border-white/[0.03]">
                                        <span className="font-sans text-[9px] text-stone-500 truncate block max-w-[220px] sm:max-w-[250px]" title={guestLink}>
                                          {guestLink}
                                        </span>
                                        <div className="flex gap-2">
                                          <a
                                            href={`?to=${encodeURIComponent(item.name)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[10px] text-[#ebd8b7]/70 hover:text-[#ebd8b7] font-sans font-medium hover:underline flex items-center gap-0.5"
                                          >
                                            Pratinjau
                                          </a>
                                          <button
                                            onClick={() => handleCopyLink(item.name, item.originalIdx)}
                                            className={`text-[10px] flex items-center gap-1 font-sans font-medium px-2 py-0.5 rounded transition-all cursor-pointer ${
                                              isCopied 
                                                ? "bg-green-950/50 text-green-400 border border-green-500/10" 
                                                : "bg-[#d4af37]/10 text-[#ebd8b7] hover:bg-[#d4af37]/20 border border-[#d4af37]/10"
                                            }`}
                                          >
                                            {isCopied ? <Check size={10} /> : <Copy size={10} />}
                                            {isCopied ? "Disalin!" : "Salin Link"}
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}

                              {(draftData.guests || []).length === 0 && (
                                <div className="text-center py-12 text-stone-500 font-sans text-xs bg-white/[0.01] border border-dashed border-white/10 rounded-2xl">
                                  Belum ada daftar tamu undangan kustom.
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "foto" && draftData && (
                      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
                        {/* Tab header */}
                        <div className="border-b border-white/10 pb-4 mb-4">
                          <h3 className="font-serif text-lg text-white font-light flex items-center gap-2">
                             <Image size={18} className="text-[#ebd8b7]" /> Edit Foto Website
                          </h3>
                          <p className="font-sans text-xs text-stone-400 mt-1">
                            Semua foto di website ini dapat diedit menggunakan URL gambar eksternal (misal. dari Unsplash, Imgur, Pinterest, dll).
                          </p>
                        </div>

                        {/* SECTION 1: MAIN PHOTOS */}
                        <div className="space-y-4">
                          <h4 className="font-serif text-md text-[#ebd8b7] font-light border-b border-white/5 pb-2">
                            1. Foto Utama & Pengantin
                          </h4>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            
                            {/* Photo 1: Hero Background */}
                            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex gap-4 items-center">
                              <div className="w-16 h-20 rounded-xl overflow-hidden bg-black/40 border border-white/10 shrink-0">
                                <img 
                                  src={draftData.heroImage || WEDDING_DATA.heroImage} 
                                  alt="Hero" 
                                  className="w-full h-full object-cover"
                                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519741497674-611481863552?w=100'; }}
                                />
                              </div>
                              <div className="flex-1 space-y-2">
                                <label className="block font-sans text-xs font-bold uppercase tracking-wider text-stone-300">
                                  Foto Pembuka (Background Hero / Cover)
                                </label>
                                <input
                                  type="text"
                                  value={draftData.heroImage || ""}
                                  onChange={(e) => setDraftData({ ...draftData, heroImage: e.target.value })}
                                  placeholder="Masukkan URL foto..."
                                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#d4af37]/60 font-sans"
                                />
                              </div>
                            </div>

                            {/* Photo 2: Detail Circle */}
                            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex gap-4 items-center">
                              <div className="w-16 h-16 rounded-full overflow-hidden bg-black/40 border border-white/10 shrink-0">
                                <img 
                                  src={draftData.detailImage || WEDDING_DATA.detailImage} 
                                  alt="Detail" 
                                  className="w-full h-full object-cover"
                                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=100'; }}
                                />
                              </div>
                              <div className="flex-1 space-y-2">
                                <label className="block font-sans text-xs font-bold uppercase tracking-wider text-stone-300">
                                  Foto Detail Cincin / Ornamen Bulat
                                </label>
                                <input
                                  type="text"
                                  value={draftData.detailImage || ""}
                                  onChange={(e) => setDraftData({ ...draftData, detailImage: e.target.value })}
                                  placeholder="Masukkan URL foto..."
                                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#d4af37]/60 font-sans"
                                />
                              </div>
                            </div>

                            {/* Photo 3: Groom */}
                            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex gap-4 items-center">
                              <div className="w-16 h-16 rounded-full overflow-hidden bg-black/40 border border-white/10 shrink-0">
                                <img 
                                  src={draftData.groom.image || WEDDING_DATA.groom.image} 
                                  alt="Groom" 
                                  className="w-full h-full object-cover"
                                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519741497674-611481863552?w=100'; }}
                                />
                              </div>
                              <div className="flex-1 space-y-2">
                                <label className="block font-sans text-xs font-bold uppercase tracking-wider text-stone-300">
                                  Foto Pengantin Pria
                                </label>
                                <input
                                  type="text"
                                  value={draftData.groom.image || ""}
                                  onChange={(e) => setDraftData({
                                    ...draftData,
                                    groom: { ...draftData.groom, image: e.target.value }
                                  })}
                                  placeholder="Masukkan URL foto..."
                                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#d4af37]/60 font-sans"
                                />
                              </div>
                            </div>

                            {/* Photo 4: Bride */}
                            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex gap-4 items-center">
                              <div className="w-16 h-16 rounded-full overflow-hidden bg-black/40 border border-white/10 shrink-0">
                                <img 
                                  src={draftData.bride.image || WEDDING_DATA.bride.image} 
                                  alt="Bride" 
                                  className="w-full h-full object-cover"
                                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519741497674-611481863552?w=100'; }}
                                />
                              </div>
                              <div className="flex-1 space-y-2">
                                <label className="block font-sans text-xs font-bold uppercase tracking-wider text-stone-300">
                                  Foto Pengantin Wanita
                                </label>
                                <input
                                  type="text"
                                  value={draftData.bride.image || ""}
                                  onChange={(e) => setDraftData({
                                    ...draftData,
                                    bride: { ...draftData.bride, image: e.target.value }
                                  })}
                                  placeholder="Masukkan URL foto..."
                                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#d4af37]/60 font-sans"
                                />
                              </div>
                            </div>

                          </div>
                        </div>

                        {/* SECTION 2: GALLERY PHOTOS */}
                        <div className="space-y-4 pt-4 border-t border-white/10">
                          <h4 className="font-serif text-md text-[#ebd8b7] font-light border-b border-white/5 pb-2">
                            2. Foto Album Galeri (6 Foto Utama)
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 6 }).map((_, idx) => {
                              const currentGallery = draftData.galleryImages || [];
                              const currentPic = currentGallery[idx] || { url: "", caption: "" };
                              
                              return (
                                <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-black/40 border border-white/10 shrink-0">
                                      <img 
                                        src={currentPic.url || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=100'} 
                                        alt={`Galeri ${idx + 1}`} 
                                        className="w-full h-full object-cover"
                                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519741497674-611481863552?w=100'; }}
                                      />
                                    </div>
                                    <div>
                                      <p className="font-sans text-xs font-bold uppercase tracking-wider text-[#ebd8b7]">
                                        Foto Galeri #{idx + 1}
                                      </p>
                                      <span className="font-sans text-[10px] text-stone-500">
                                        Slot Album Posisi {idx + 1}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <div>
                                      <label className="block font-sans text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-1">URL Gambar</label>
                                      <input
                                        type="text"
                                        value={currentPic.url}
                                        onChange={(e) => {
                                          const newGallery = [...currentGallery];
                                          while(newGallery.length <= idx) {
                                            newGallery.push({ url: "", caption: "" });
                                          }
                                          newGallery[idx] = { ...newGallery[idx], url: e.target.value };
                                          setDraftData({ ...draftData, galleryImages: newGallery });
                                        }}
                                        placeholder="Masukkan URL Gambar..."
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#d4af37]/60 font-sans"
                                      />
                                    </div>

                                    <div>
                                      <label className="block font-sans text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-1">Keterangan / Caption</label>
                                      <input
                                        type="text"
                                        value={currentPic.caption}
                                        onChange={(e) => {
                                          const newGallery = [...currentGallery];
                                          while(newGallery.length <= idx) {
                                            newGallery.push({ url: "", caption: "" });
                                          }
                                          newGallery[idx] = { ...newGallery[idx], caption: e.target.value };
                                          setDraftData({ ...draftData, galleryImages: newGallery });
                                        }}
                                        placeholder="Keterangan foto..."
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#d4af37]/60 font-sans"
                                      />
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Save Action Banner */}
                        <div className="bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                          <div className="text-center sm:text-left">
                            <h5 className="font-sans text-xs font-bold uppercase tracking-wider text-[#ebd8b7]">Simpan Foto Terpilih</h5>
                            <p className="font-sans text-[10px] text-stone-400 mt-0.5">Konfirmasi perombakan foto di atas untuk diletakkan di website.</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              updateWeddingData({ ...draftData });
                              showToast("📸 Semua foto website berhasil diperbarui!");
                            }}
                            className="bg-[#d4af37] hover:bg-[#ebd8b7] text-black font-sans font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-xl transition-all cursor-pointer shadow-md"
                          >
                            Terapkan & Simpan Foto
                          </button>
                        </div>

                      </div>
                    )}
                    
                  </div>
                </div>
              </div>
            )}

              {/* Bottom Actions Bar */}
              <div className="p-6 border-t border-white/10 bg-black/40 flex items-center justify-between">
                {isAdmin ? (
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    <RefreshCw size={12} /> Revert ke Klasik
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex gap-3">
                  {isAdmin && (
                    <button
                      onClick={logout}
                      className="inline-flex items-center gap-1.5 bg-red-950/40 hover:bg-red-950 border border-red-500/25 text-red-300 font-sans text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
                    >
                      <LogOut size={13} /> Keluar (Logout)
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="bg-white/10 hover:bg-white/15 text-white border border-white/10 font-sans text-xs font-bold px-5 py-2 rounded-xl transition-all cursor-pointer"
                  >
                    Selesai
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Ensure the helper constants are imported correctly
import { WEDDING_DATA as CONST_DATA, SONGS as CONST_SONGS } from "../constants";
const WEDDING_DATA = CONST_DATA;
const SONGS = CONST_SONGS;
