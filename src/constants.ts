import { WeddingData, Song } from "./types";

// Direct file paths for Vite serving
const weddingHeroImg = "/src/assets/images/wedding_hero_1782012540204.jpg";
const brideGroomImg = "/src/assets/images/bride_groom_portrait_1782012555876.jpg";
const weddingDetailImg = "/src/assets/images/wedding_detail_1782012572990.jpg";

export const WEDDING_DATA: WeddingData = {
  groom: {
    nickName: "Aris",
    fullName: "Pratama Aris Munandar, S.T.",
    fatherName: "Bpk. Sugeng Munandar",
    motherName: "Ibu Ratna Setyowati",
    instagram: "@aris_munandar",
    image: brideGroomImg, // We can reuse or split if needed, using the gorgeous generated couple photo is extremely premium!
  },
  bride: {
    nickName: "Amalia",
    fullName: "Amalia Putri Lestari, S.Psi.",
    fatherName: "Bpk. H. Ahmad Lestari",
    motherName: "Ibu Hajah Siti Aminah",
    instagram: "@amalia_lestari",
    image: brideGroomImg, // Combining into a beautiful joint greeting makes it look super harmonic!
  },
  // Wedding Date set to October 18, 2026
  date: new Date("2026-10-18T09:00:00"),
  guests: [
    "Bapak Joko Widodo",
    "Ibu Hj. Megawati Soekarnoputri",
    "Keluarga John Doe",
    "Sahabat Karib Aris",
    "Sahabat Karib Amalia",
    "Seseorang Spesial"
  ],
  heroImage: weddingHeroImg,
  detailImage: weddingDetailImg,
  galleryImages: [
    {
      url: brideGroomImg,
      caption: "Momen Kebersamaan Kasih",
    },
    {
      url: weddingDetailImg,
      caption: "Simbol Ikatan Suci Abadi",
    },
    {
      url: weddingHeroImg,
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
  ],
  akad: {
    time: "08:00 - 10:00 WIB",
    dateText: "Minggu, 18 Oktober 2026",
    place: "Masjid Agung Baiturrahman",
    address: "Jl. Pemuda No. 123, Kel. Sekayu, Kec. Semarang Tengah, Kota Semarang",
    mapUrl: "https://maps.google.com/?q=Masjid+Agung+Baiturrahman+Semarang",
    mapIframe: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.231268393521!2d110.4182963!3d-6.9820197!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e708b5be9d332bf%3A0xe5f9fe318625ec19!2sMasjid%20Agung%20Baiturrahman%20Semarang!5e0!3m2!1sid!2sid!4v1718919241512!5m2!1sid!2sid",
  },
  resepsi: {
    time: "11:00 - 14:00 WIB",
    dateText: "Minggu, 18 Oktober 2026",
    place: "Grand Ballroom Hotel Majestic",
    address: "Jl. Pandanaran No. 45, Kel. Mugassari, Kec. Semarang Selatan, Kota Semarang",
    mapUrl: "https://maps.google.com/?q=Grand+Ballroom+Hotel+Majestic+Semarang",
    mapIframe: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.224155163!3d-6.9839441!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSemarang!5e0!3m2!1sid!2sid!4v1718919241512!5m2!1sid!2sid",
  },
  loveStory: [
    {
      year: "2021",
      title: "Pertemuan Pertama",
      story: "Kami pertama kali bertemu di sebuah festival buku universitas. Percakapan singkat tentang buku favorit menumbuhkan rasa ketertarikan yang tak terduga antara seorang mahasiswa Teknik dan mahasiswi Psikologi.",
    },
    {
      year: "2023",
      title: "Menjalin Komitmen",
      story: "Setelah sekian lama berkomunikasi dan saling mendukung impian masing-masing, kami sepakat untuk melangkah ke jenjang berkomitmen yang lebih serius, saling bertumbuh dewasa bersama.",
    },
    {
      year: "2025",
      title: "Hari Lamaran",
      story: "Dengan restu kedua belah pihak keluarga, Aris melamar Amalia dalam sebuah acara khidmat yang dihadiri oleh keluarga dekat. Momen indah ini memperkuat tekad kami untuk bersatu selamanya.",
    },
  ],
  accounts: [
    {
      bankName: "BCA",
      accountNumber: "1234567890",
      accountHolder: "Pratama Aris Munandar",
    },
    {
      bankName: "Mandiri",
      accountNumber: "9876543210123",
      accountHolder: "Amalia Putri Lestari",
    },
  ],
  giftAddress: {
    recipient: "Pernikahan Aris & Amalia",
    phone: "0812-3456-7890",
    address: "Rumah Kediaman Mempelai Wanita, Perumahan Bunga Indah Blok C-12, Semarang Selatan, Kota Semarang, Jawa Tengah 50241",
  },
};

export const SONGS: Song[] = [
  {
    id: "chopin_nocturne",
    title: "Chopin - Nocturne No. 2 in E-flat Major",
    artist: "Florence Robineau (Piano Solo)",
    url: "/chopin.mp3",
  },
  {
    id: "bach_prelude",
    title: "Bach - Prelude in C Major (BWV 846)",
    artist: "Kimiko Ishizaka (Classic Piano)",
    url: "/bach.mp3",
  },
  {
    id: "ambient_theme",
    title: "Ambient Sunset Melodies",
    artist: "SoundHelix Instrumental",
    url: "/sunset.mp3",
  },
];

export const IMAGES = {
  hero: weddingHeroImg,
  detail: weddingDetailImg,
};
