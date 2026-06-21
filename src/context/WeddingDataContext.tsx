import React, { createContext, useContext, useState, useEffect } from "react";
import { WeddingData, Song } from "../types";
import { WEDDING_DATA, SONGS } from "../constants";

interface WeddingDataContextType {
  weddingData: WeddingData;
  songs: Song[];
  activeSongIndex: number;
  isAdmin: boolean;
  adminEmail: string | null;
  updateWeddingData: (newData: WeddingData) => void;
  updateSongs: (newSongs: Song[]) => void;
  setActiveSongIndex: (index: number) => void;
  loginAsAdmin: (email: string, passcode: string) => { success: boolean; error?: string };
  logout: () => void;
  resetToDefault: () => void;
}

const WeddingDataContext = createContext<WeddingDataContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_DATA = "kuawo_wedding_data_v1";
const LOCAL_STORAGE_KEY_SONGS = "kuawo_wedding_songs_v1";
const LOCAL_STORAGE_KEY_SONG_INDEX = "kuawo_wedding_song_index_v1";
const LOCAL_STORAGE_KEY_ADMIN = "kuawo_wedding_admin_session_v1";

const mergeWeddingData = (data: any): WeddingData => {
  if (!data) return WEDDING_DATA;
  return {
    ...WEDDING_DATA,
    ...data,
    groom: data.groom ? { ...WEDDING_DATA.groom, ...data.groom } : WEDDING_DATA.groom,
    bride: data.bride ? { ...WEDDING_DATA.bride, ...data.bride } : WEDDING_DATA.bride,
    akad: data.akad ? { ...WEDDING_DATA.akad, ...data.akad } : WEDDING_DATA.akad,
    resepsi: data.resepsi ? { ...WEDDING_DATA.resepsi, ...data.resepsi } : WEDDING_DATA.resepsi,
    loveStory: Array.isArray(data.loveStory) ? data.loveStory : WEDDING_DATA.loveStory,
    accounts: Array.isArray(data.accounts) ? data.accounts : WEDDING_DATA.accounts,
    giftAddress: data.giftAddress ? { ...WEDDING_DATA.giftAddress, ...data.giftAddress } : WEDDING_DATA.giftAddress,
  };
};

export const WeddingDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [weddingData, setWeddingDataInner] = useState<WeddingData>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_DATA);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.date) parsed.date = new Date(parsed.date);
        return mergeWeddingData(parsed);
      } catch (e) {
        console.error("Failed to parse saved wedding data", e);
      }
    }
    return WEDDING_DATA;
  });

  const [songs, setSongsInner] = useState<Song[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_SONGS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved songs", e);
      }
    }
    return SONGS;
  });

  const [activeSongIndex, setActiveSongIndexInner] = useState<number>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_SONG_INDEX);
    if (saved) {
      const idx = parseInt(saved, 10);
      return isNaN(idx) ? 0 : idx;
    }
    return 0;
  });

  const [adminEmail, setAdminEmail] = useState<string | null>(() => {
    return localStorage.getItem(LOCAL_STORAGE_KEY_ADMIN);
  });

  const isAdmin = adminEmail === "kuawo.id@gmail.com";

  // Fetch from persistent backend APIs on mount
  useEffect(() => {
    fetch("/api/wedding-data")
      .then((res) => {
        if (!res.ok) throw new Error("Network response not ok");
        return res.json();
      })
      .then((data) => {
        if (data && data.groom) {
          const merged = mergeWeddingData(data);
          if (merged.date) {
            merged.date = new Date(merged.date);
          }
          setWeddingDataInner(merged);
          localStorage.setItem(LOCAL_STORAGE_KEY_DATA, JSON.stringify(merged));
        }
      })
      .catch((err) => console.log("Skipped live fetch of wedding data:", err));

    fetch("/api/songs")
      .then((res) => {
        if (!res.ok) throw new Error("Network response not ok");
        return res.json();
      })
      .then((songsList) => {
        if (Array.isArray(songsList) && songsList.length > 0) {
          setSongsInner(songsList);
          localStorage.setItem(LOCAL_STORAGE_KEY_SONGS, JSON.stringify(songsList));
        }
      })
      .catch((err) => console.log("Skipped live fetch of songs:", err));

    fetch("/api/active-song-index")
      .then((res) => {
        if (!res.ok) throw new Error("Network response not ok");
        return res.json();
      })
      .then((resJson) => {
        if (resJson && typeof resJson.index === "number") {
          setActiveSongIndexInner(resJson.index);
          localStorage.setItem(LOCAL_STORAGE_KEY_SONG_INDEX, resJson.index.toString());
        }
      })
      .catch((err) => console.log("Skipped live fetch of active song index:", err));
  }, []);

  const updateWeddingData = (newData: WeddingData) => {
    setWeddingDataInner(newData);
    localStorage.setItem(LOCAL_STORAGE_KEY_DATA, JSON.stringify(newData));
    
    // Persist to server API
    fetch("/api/save-wedding-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newData)
    }).catch(err => console.error("Could not sync wedding data to backend:", err));
  };

  const updateSongs = (newSongs: Song[]) => {
    setSongsInner(newSongs);
    localStorage.setItem(LOCAL_STORAGE_KEY_SONGS, JSON.stringify(newSongs));
    
    // Persist to server API
    fetch("/api/save-songs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSongs)
    }).catch(err => console.error("Could not sync songs to backend:", err));
  };

  const setActiveSongIndex = (index: number) => {
    setActiveSongIndexInner(index);
    localStorage.setItem(LOCAL_STORAGE_KEY_SONG_INDEX, index.toString());
    
    // Persist to server API
    fetch("/api/save-active-song-index", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ index })
    }).catch(err => console.error("Could not sync active song index to backend:", err));
  };

  const loginAsAdmin = (email: string, passcode: string) => {
    const cleanEmail = email.trim().toLowerCase();
    
    if (cleanEmail !== "kuawo.id@gmail.com") {
      return { success: false, error: "Hanya email admin kuawo.id@gmail.com yang diperbolehkan." };
    }

    if (passcode !== "kuawo2026" && passcode !== "admin") {
      return { success: false, error: "Kata sandi admin tidak valid." };
    }

    setAdminEmail(cleanEmail);
    localStorage.setItem(LOCAL_STORAGE_KEY_ADMIN, cleanEmail);
    return { success: true };
  };

  const logout = () => {
    setAdminEmail(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY_ADMIN);
  };

  const resetToDefault = () => {
    setWeddingDataInner(WEDDING_DATA);
    setSongsInner(SONGS);
    setActiveSongIndexInner(0);
    localStorage.removeItem(LOCAL_STORAGE_KEY_DATA);
    localStorage.removeItem(LOCAL_STORAGE_KEY_SONGS);
    localStorage.removeItem(LOCAL_STORAGE_KEY_SONG_INDEX);
  };

  return (
    <WeddingDataContext.Provider
      value={{
        weddingData,
        songs,
        activeSongIndex,
        isAdmin,
        adminEmail,
        updateWeddingData,
        updateSongs,
        setActiveSongIndex,
        loginAsAdmin,
        logout,
        resetToDefault,
      }}
    >
      {children}
    </WeddingDataContext.Provider>
  );
};

export const useWedding = () => {
  const context = useContext(WeddingDataContext);
  if (!context) {
    throw new Error("useWedding must be used within a WeddingDataProvider");
  }
  return context;
};
