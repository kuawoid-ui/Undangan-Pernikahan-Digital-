import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

// We want to persist data to a local file database
const DATA_DIR = path.join(process.cwd(), "data");
const WEDDING_DATA_FILE = path.join(DATA_DIR, "wedding_data.json");
const SONGS_FILE = path.join(DATA_DIR, "songs.json");
const SONG_INDEX_FILE = path.join(DATA_DIR, "active_song_index.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial default fallback data in case JSON files aren't created yet.
// These are matched with src/constants.ts values
const DEFAULT_WEDDING_DATA = {
  groom: {
    nickName: "Aris",
    fullName: "Pratama Aris Munandar, S.T.",
    fatherName: "Bpk. Sugeng Munandar",
    motherName: "Ibu Ratna Setyowati",
    instagram: "@aris_munandar",
    image: "/src/assets/images/bride_groom_portrait_1782012555876.jpg"
  },
  bride: {
    nickName: "Amalia",
    fullName: "Amalia Putri Lestari, S.Psi.",
    fatherName: "Bpk. H. Ahmad Lestari",
    motherName: "Ibu Hajah Siti Aminah",
    instagram: "@amalia_lestari",
    image: "/src/assets/images/bride_groom_portrait_1782012555876.jpg"
  },
  date: "2026-10-18T09:00:00.000Z",
  guests: [
    "Bapak Joko Widodo",
    "Ibu Hj. Megawati Soekarnoputri",
    "Keluarga John Doe",
    "Sahabat Karib Aris",
    "Sahabat Karib Amalia",
    "Seseorang Spesial"
  ],
  heroImage: "/src/assets/images/wedding_hero_1782012540204.jpg",
  detailImage: "/src/assets/images/wedding_detail_1782012572990.jpg",
  galleryImages: [
    {
      url: "/src/assets/images/bride_groom_portrait_1782012555876.jpg",
      caption: "Momen Kebersamaan Kasih"
    },
    {
      url: "/src/assets/images/wedding_detail_1782012572990.jpg",
      caption: "Simbol Ikatan Suci Abadi"
    },
    {
      url: "/src/assets/images/wedding_hero_1782012540204.jpg",
      caption: "Janji Suci di Mata Semesta"
    },
    {
      url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
      caption: "Dekorasi Pelaminan Indah Klasik"
    },
    {
      url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800",
      caption: "Kebahagiaan yang Sempurna"
    },
    {
      url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800",
      caption: "Saling Menatap Penuh Cinta"
    }
  ],
  akad: {
    time: "08:00 - 10:00 WIB",
    dateText: "Minggu, 18 Oktober 2026",
    place: "Masjid Agung Baiturrahman",
    address: "Jl. Pemuda No. 123, Kel. Sekayu, Kec. Semarang Tengah, Kota Semarang",
    mapUrl: "https://maps.google.com/?q=Masjid+Agung+Baiturrahman+Semarang",
    mapIframe: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.231268393521!2d110.4182963!3d-6.9820197!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e708b5be9d332bf%3A0xe5f9fe318625ec19!2sMasjid%20Agung%20Baiturrahman%20Semarang!5e0!3m2!1sid!2sid!4v1718919241512!5m2!1sid!2sid"
  },
  resepsi: {
    time: "11:00 - 14:00 WIB",
    dateText: "Minggu, 18 Oktober 2026",
    place: "Grand Ballroom Hotel Majestic",
    address: "Jl. Pandanaran No. 45, Kel. Mugassari, Kec. Semarang Selatan, Kota Semarang",
    mapUrl: "https://maps.google.com/?q=Grand+Ballroom+Hotel+Majestic+Semarang",
    mapIframe: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.224155163!3d-6.9839441!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSemarang!5e0!3m2!1sid!2sid!4v1718919241512!5m2!1sid!2sid"
  },
  loveStory: [
    {
      year: "2021",
      title: "Pertemuan Pertama",
      story: "Kami pertama kali bertemu di sebuah festival buku universitas. Percakapan singkat tentang buku favorit menumbuhkan rasa ketertarikan yang tak terduga antara seorang mahasiswa Teknik dan mahasiswi Psikologi."
    },
    {
      year: "2023",
      title: "Menjalin Komitmen",
      story: "Setelah sekian lama berkomunikasi dan saling mendukung impian masing-masing, kami sepakat untuk melangkah ke jenjang berkomitmen yang lebih serius, saling bertumbuh dewasa bersama."
    },
    {
      year: "2025",
      title: "Hari Lamaran",
      story: "Dengan restu kedua belah pihak keluarga, Aris melamar Amalia dalam sebuah acara khidmat yang dihadiri oleh keluarga dekat. Momen indah ini memperkuat tekad kami untuk bersatu selamanya."
    }
  ],
  accounts: [
    {
      bankName: "BCA",
      accountNumber: "1234567890",
      accountHolder: "Pratama Aris Munandar"
    },
    {
      bankName: "Mandiri",
      accountNumber: "9876543210123",
      accountHolder: "Amalia Putri Lestari"
    }
  ],
  giftAddress: {
    recipient: "Pernikahan Aris & Amalia",
    phone: "0812-3456-7890",
    address: "Rumah Kediaman Mempelai Wanita, Perumahan Bunga Indah Blok C-12, Semarang Selatan, Kota Semarang, Jawa Tengah 50241"
  }
};

const DEFAULT_SONGS = [
  {
    id: "gending_jawa",
    title: "Kebo Giro - Gending Jawa Klasik",
    artist: "Tradisional Jawa (Premium Sinden)",
    url: "/sunset.mp3"
  },
  {
    id: "sunset_piano",
    title: "Karnaval Kehidupan Cinta",
    artist: "Chopin Piano Nocturne Op. 9 No. 2",
    url: "/chopin.mp3"
  },
  {
    id: "classic_bach",
    title: "Air on the G String - Resonansi Suci",
    artist: "Johann Sebastian Bach (Orchestral)",
    url: "/bach.mp3"
  }
];

// Seed initial files if they do not exist
if (!fs.existsSync(WEDDING_DATA_FILE)) {
  fs.writeFileSync(WEDDING_DATA_FILE, JSON.stringify(DEFAULT_WEDDING_DATA, null, 2));
}
if (!fs.existsSync(SONGS_FILE)) {
  fs.writeFileSync(SONGS_FILE, JSON.stringify(DEFAULT_SONGS, null, 2));
}
if (!fs.existsSync(SONG_INDEX_FILE)) {
  fs.writeFileSync(SONG_INDEX_FILE, JSON.stringify({ index: 0 }, null, 2));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "15mb" }));

  // API - Get Wedding Data
  app.get("/api/wedding-data", (req, res) => {
    try {
      if (fs.existsSync(WEDDING_DATA_FILE)) {
        const data = fs.readFileSync(WEDDING_DATA_FILE, "utf-8");
        return res.json(JSON.parse(data));
      }
      return res.json(DEFAULT_WEDDING_DATA);
    } catch (e) {
      console.error("Error reading wedding data:", e);
      return res.json(DEFAULT_WEDDING_DATA);
    }
  });

  // API - Save Wedding Data
  app.post("/api/save-wedding-data", (req, res) => {
    try {
      const data = req.body;
      fs.writeFileSync(WEDDING_DATA_FILE, JSON.stringify(data, null, 2));
      console.log("Wedding data updated successfully via API");
      return res.json({ success: true, data });
    } catch (e: any) {
      console.error("Error saving wedding data:", e);
      return res.status(500).json({ success: false, error: e.message });
    }
  });

  // API - Get Songs List
  app.get("/api/songs", (req, res) => {
    try {
      if (fs.existsSync(SONGS_FILE)) {
        const data = fs.readFileSync(SONGS_FILE, "utf-8");
        return res.json(JSON.parse(data));
      }
      return res.json(DEFAULT_SONGS);
    } catch (e) {
      console.error("Error reading songs list:", e);
      return res.json(DEFAULT_SONGS);
    }
  });

  // API - Save Songs List
  app.post("/api/save-songs", (req, res) => {
    try {
      const songs = req.body;
      fs.writeFileSync(SONGS_FILE, JSON.stringify(songs, null, 2));
      console.log("Songs playlist updated successfully via API");
      return res.json({ success: true, songs });
    } catch (e: any) {
      console.error("Error saving songs list:", e);
      return res.status(500).json({ success: false, error: e.message });
    }
  });

  // API - Get Active Song Index
  app.get("/api/active-song-index", (req, res) => {
    try {
      if (fs.existsSync(SONG_INDEX_FILE)) {
        const val = fs.readFileSync(SONG_INDEX_FILE, "utf-8");
        return res.json(JSON.parse(val));
      }
      return res.json({ index: 0 });
    } catch (e) {
      return res.json({ index: 0 });
    }
  });

  // API - Save Active Song Index
  app.post("/api/save-active-song-index", (req, res) => {
    try {
      const { index } = req.body;
      fs.writeFileSync(SONG_INDEX_FILE, JSON.stringify({ index: Number(index) }, null, 2));
      console.log("Active song index updated via API to:", index);
      return res.json({ success: true, index });
    } catch (e: any) {
      return res.status(500).json({ success: false, error: e.message });
    }
  });

  // Serve static dist folder in production, or mount Vite dev server in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Full-stack server successfully running on http://localhost:${PORT}`);
  });
}

startServer();
