export interface CoupleInfo {
  nickName: string;
  fullName: string;
  fatherName: string;
  motherName: string;
  instagram: string;
  image: string;
}

export interface WeddingData {
  groom: CoupleInfo;
  bride: CoupleInfo;
  date: Date; // e.g. 2026-10-18T09:00:00
  guests?: string[];
  heroImage?: string;
  detailImage?: string;
  galleryImages?: { url: string; caption: string }[];
  akad: {
    time: string;
    dateText: string;
    place: string;
    address: string;
    mapIframe?: string;
    mapUrl: string;
  };
  resepsi: {
    time: string;
    dateText: string;
    place: string;
    address: string;
    mapIframe?: string;
    mapUrl: string;
  };
  loveStory: {
    year: string;
    title: string;
    story: string;
    image?: string;
  }[];
  accounts: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
    qrCode?: string;
  }[];
  giftAddress: {
    recipient: string;
    phone: string;
    address: string;
  };
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;
}

export interface RSVP {
  id: string;
  name: string;
  attendance: "hadir" | "ragu" | "tidak";
  guestsCount: number;
}

export interface GuestWish {
  id: string;
  name: string;
  wish: string;
  attendance: "hadir" | "ragu" | "tidak";
  timestamp: string;
}
