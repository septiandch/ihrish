import { PrayerId, PrayTimes } from "@/components/prayertime/types";
import { create } from "zustand";

interface Coordinates {
  lat: number;
  long: number;
}

type Adjustments = {
  [key in PrayerId]: number;
};

const initPrayTimes: PrayTimes = {
  Imsyak: "00:00",
  Subuh: "00:00",
  Terbit: "00:00",
  Dzuhur: "00:00",
  Ashar: "00:00",
  Maghrib: "00:00",
  Isya: "00:00",
};

type PrayerState = {
  //State
  prayTimes: PrayTimes;
  coordinates: Coordinates;
  adjustments: Adjustments;
  hijriDateOffset: number;
  timezone: number;

  // Dispatch
  setPrayTimes: (prayTimes: PrayTimes) => void;
  setAdjustments: (adj: Adjustments) => void;
  setCoordinates: (coords: Coordinates) => void;
  setHijriDateOffset: (offset: number) => void;
  setTimezone: (tzone: number) => void;
};

export const usePrayerStore = create<PrayerState>((set, get) => ({
  //State
  prayTimes: initPrayTimes,
  coordinates: {
    // Default to Jakarta coordinates
    lat: -6.2,
    long: 106.82,
  },
  adjustments: {
    imsak: 0,
    fajr: 1,
    sunrise: -4,
    dhuhr: 3,
    asr: 1,
    maghrib: 1,
    isha: 1,
  },
  hijriDateOffset: -1,
  timezone: 7,

  // Dispatch
  setPrayTimes: (prayTimes) => set({ prayTimes }),
  setAdjustments: (adj) => set({ adjustments: { ...adj, ...get().adjustments } }),
  setCoordinates: (coords) => set({ coordinates: coords }),
  setHijriDateOffset: (hijriDateOffset) => set({ hijriDateOffset }),
  setTimezone: (timezone) => set({ timezone }),
}));
