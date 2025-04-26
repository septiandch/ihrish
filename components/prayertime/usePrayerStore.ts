import { OriginalPrayerLabel } from "@/components/prayertime/types";
import { create } from "zustand";

interface Coordinates {
  lat: number;
  long: number;
}

type Adjustments = {
  [key in OriginalPrayerLabel]: number;
};

type PrayerState = {
  //State
  coordinates: Coordinates;
  adjustments: Adjustments;
  nextPrayer: OriginalPrayerLabel | undefined;
  hijriDateOffset: number;

  // Dispatch
  setAdjustments: (adj: Adjustments) => void;
  setCoordinates: (coords: Coordinates) => void;
  setNextPrayer: (prayer: OriginalPrayerLabel | undefined) => void;
  setHijriDateOffset: (offset: number) => void;
};

export const usePrayerStore = create<PrayerState>((set, get) => ({
  //State
  coordinates: {
    // Default to Jakarta coordinates
    lat: -6.2,
    long: 106.82,
  },
  adjustments: {
    fajr: 3,
    sunrise: -3,
    dhuhr: 3,
    asr: 3,
    maghrib: 3,
    isha: 2,
  },
  nextPrayer: undefined,
  hijriDateOffset: -1,

  // Dispatch
  setAdjustments: (adj) => set({ adjustments: { ...adj, ...get().adjustments } }),
  setCoordinates: (coords) => set({ coordinates: coords }),
  setNextPrayer: (nextPrayer) => set({ nextPrayer }),
  setHijriDateOffset: (hijriDateOffset) => set({ hijriDateOffset }),
}));
