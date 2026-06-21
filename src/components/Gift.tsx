import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Gift as GiftIcon, CreditCard, Copy, Check, MapPin, Sparkles } from "lucide-react";
import { useWedding } from "../context/WeddingDataContext";

export default function Gift() {
  const { weddingData } = useWedding();
  const { accounts, giftAddress } = weddingData;
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [showGiftDetails, setShowGiftDetails] = useState(false);

  const copyNumber = (num: string, idx: number) => {
    navigator.clipboard.writeText(num);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const copyFullAddress = () => {
    navigator.clipboard.writeText(`${giftAddress.recipient}, ${giftAddress.phone}, ${giftAddress.address}`);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  return (
    <section className="py-24 px-4 bg-[#0a0505] relative overflow-hidden" id="section-gift">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#3a1510]/15 blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        
        {/* Header */}
        <div className="mb-12">
          <p className="font-sans text-[10px] tracking-[0.4em] text-[#ebd8b7] uppercase font-bold mb-3 ml-1">
            Kado Digital
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-light text-white tracking-tight">
            Kirim Tanda Kasih
          </h2>
          <div className="w-16 h-[1px] bg-white/20 mx-auto mt-6" />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-sans text-xs md:text-sm text-stone-400 max-w-lg mx-auto leading-relaxed mb-10 px-4"
        >
          Doa restu Anda merupakan karunia terindah bagi kami. Namun, apabila Anda ingin memberikan tanda kasih secara digital maupun fisik, kami menyediakan sarana di bawah ini:
        </motion.p>

        {/* Toggle open button */}
        {!showGiftDetails ? (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowGiftDetails(true)}
            id="btn-show-gift"
            className="inline-flex items-center gap-2.5 px-10 py-4 bg-white hover:bg-white/90 text-black font-sans font-bold text-xs tracking-[0.2em] uppercase rounded-full shadow-2xl transition-all cursor-pointer"
          >
            <GiftIcon size={13} className="text-stone-900 animate-pulse stroke-[2.5]" />
            Buka Amplop Digital
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-10 px-4"
          >
            {/* Account Bank Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto w-full">
              {accounts.map((acc, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                  className="bg-gradient-to-tr from-[#160f0f] to-[#2c1a12] p-6 rounded-[24px] shadow-2xl text-left text-white border border-[#d4af37]/35 relative overflow-hidden flex flex-col justify-between aspect-[1.6/1]"
                >
                  {/* Card shiny circles background */}
                  <div className="absolute right-[-10%] bottom-[-10%] w-40 h-40 rounded-full bg-amber-500/5 blur-2xl" />
                  
                  <div>
                    {/* Header: Bank Name */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-serif text-lg font-light tracking-widest italic text-white">
                        {acc.bankName}
                      </span>
                      <CreditCard className="text-[#ebd8b7]" size={20} />
                    </div>

                    {/* Account Number */}
                    <p className="font-mono text-lg md:text-xl font-medium tracking-widest text-[#f5ebd6]">
                      {acc.accountNumber.replace(/(\d{4})/g, "$1 ").trim()}
                    </p>
                  </div>

                  {/* Account Holder Name & Copy action */}
                  <div className="flex items-end justify-between border-t border-white/5 pt-4 mt-4">
                    <div>
                      <p className="font-sans text-[9px] text-[#ebd8b7] uppercase tracking-[0.15em] opacity-60">
                        Atas Nama
                      </p>
                      <p className="font-serif text-sm font-light text-stone-100 uppercase tracking-widest truncate max-w-[170px]">
                        {acc.accountHolder}
                      </p>
                    </div>

                    <button
                      onClick={() => copyNumber(acc.accountNumber, idx)}
                      className="p-2 py-1.5 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/5 text-[#ebd8b7] hover:text-white transition-all cursor-pointer hover:scale-105 active:scale-95 flex items-center gap-1.5 text-xs font-sans font-bold"
                      title="Salin No. Rekening"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check size={13} className="text-emerald-400" />
                          <span>Disalin</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Salin</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Physical Gift / Parcel Section */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="w-full max-w-2xl mx-auto bg-white/[0.02] border border-white/10 p-6 md:p-8 rounded-[32px] text-left shadow-2xl"
            >
              <div className="flex items-center gap-2.5 mb-4 text-[#ebd8b7]">
                <MapPin size={18} />
                <h4 className="font-serif text-sm font-light uppercase tracking-widest text-white">Alamat Pengiriman Kado Fisik</h4>
              </div>

              <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
                <div>
                  <p className="font-serif text-sm font-light text-stone-300">Penerima: {giftAddress.recipient}</p>
                  <p className="font-sans text-[11px] text-[#c3b091] mt-1 font-semibold">Telepon: {giftAddress.phone}</p>
                  <p className="font-sans text-xs md:text-sm text-stone-400 mt-2 leading-relaxed">
                    {giftAddress.address}
                  </p>
                </div>

                <button
                  onClick={copyFullAddress}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-white/90 text-black font-sans font-bold text-xs rounded-xl tracking-wider uppercase transition-all cursor-pointer shrink-0"
                >
                  {copiedAddress ? (
                    <>
                      <Check size={13} className="text-emerald-600" />
                      Disalin!
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      Salin Alamat
                    </>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Close section button */}
            <div className="mt-4">
              <button
                onClick={() => setShowGiftDetails(false)}
                className="font-sans text-xs text-stone-400 hover:text-white transition-colors underline tracking-wider cursor-pointer"
              >
                Tutup Amplop Digital
              </button>
            </div>
          </motion.div>
        )}

      </div>
    </section>
  );
}
