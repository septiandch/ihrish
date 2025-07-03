import { PrayerId, PrayerLabel, PrayTimes } from "@/components/prayertime/types";
import { create } from "zustand";

interface Coordinates {
  lat: number;
  long: number;
}

type Adjustments = {
  [key in PrayerId]: number;
};

type CountdownLabel = Exclude<PrayerLabel, "Imsyak" | "Syuruq">;

type Countdown = {
  [key in CountdownLabel]: number;
};

const initPrayTimes: PrayTimes = {
  Imsyak: "00:00",
  Subuh: "00:00",
  Syuruq: "00:00",
  Dzuhur: "00:00",
  Ashar: "00:00",
  Maghrib: "00:00",
  Isya: "00:00",
};

type PrayerState = {
  prayTimes: PrayTimes;
  coordinates: Coordinates;
  adjustments: Adjustments;
  hijriDateOffset: number;
  timezone: number;
  countMode: boolean;
  adhan: Countdown;
  iqamah: Countdown;

  initialized: boolean;
  initializing: boolean;
  error: string | null;

  // Dispatch
  setPrayTimes: (prayTimes: PrayTimes) => void;
  setAdjustments: (adj: Adjustments) => void;
  setCoordinates: (coords: Coordinates) => void;
  setHijriDateOffset: (offset: number) => void;
  setTimezone: (tzone: number) => void;
  setCountMode: (countMode: boolean) => void;
  setAdhan: (adhan: Countdown) => void;
  setIqamah: (iqamah: Countdown) => void;

  // Actions
  getAdhan: (prayer: PrayerLabel) => number;
  getIqamah: (prayer: PrayerLabel) => number;

  // API initializer
  initialize: () => Promise<void>;
  save: () => Promise<void>;
};

export const usePrayerStore = create<PrayerState>((set, get) => ({
  prayTimes: initPrayTimes,
  coordinates: {
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
  adhan: {
    Subuh: 6,
    Dzuhur: 6,
    Ashar: 6,
    Maghrib: 6,
    Isya: 6,
  },
  iqamah: {
    Subuh: 8,
    Dzuhur: 6,
    Ashar: 6,
    Maghrib: 6,
    Isya: 6,
  },
  hijriDateOffset: 0,
  timezone: 7,
  countMode: false,

  initialized: false,
  initializing: false,
  error: null,

  setPrayTimes: (prayTimes) => set({ prayTimes }),
  setAdjustments: (adj) => set({ adjustments: { ...get().adjustments, ...adj } }),
  setCoordinates: (coords) => set({ coordinates: coords }),
  setHijriDateOffset: (hijriDateOffset) => set({ hijriDateOffset }),
  setTimezone: (timezone) => set({ timezone }),
  setCountMode: (countMode) => set({ countMode }),
  setIqamah: (iqamah) => set({ iqamah: { ...get().iqamah, ...iqamah } }),
  setAdhan: (adhan) => set({ adhan: { ...get().adhan, ...adhan } }),

  getAdhan: (prayer) => {
    const { adhan } = get();
    if (prayer in adhan) {
      return adhan[prayer as CountdownLabel] * 60;
    }
    return 0;
  },
  getIqamah: (prayer) => {
    const { iqamah } = get();
    if (prayer in iqamah) {
      return iqamah[prayer as CountdownLabel] * 60;
    }
    return 0;
  },

  initialize: async () => {
    set({ initializing: true, error: null });
    try {
      const res = await fetch("/api/settings");
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();

      set({
        prayTimes: data.prayTimes ?? initPrayTimes,
        coordinates: data.coordinates ?? { lat: -6.2, long: 106.82 },
        adjustments: data.adjustments ?? get().adjustments,
        hijriDateOffset: data.hijriDateOffset ?? 0,
        timezone: data.timezone ?? 7,
        countMode: data.countMode ?? false,
        adhan: data.adhan ?? get().adhan,
        iqamah: data.iqamah ?? get().iqamah,
        initialized: true,
        initializing: false,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Failed to load settings:", err);
        set({
          error: err.message,
          initializing: false,
        });
      } else {
        console.error("Unknown error:", err);
        set({
          error: "An unknown error occurred",
          initializing: false,
        });
      }
    }
  },

  save: async () => {
    const state = get();
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prayTimes: state.prayTimes,
          coordinates: state.coordinates,
          adjustments: state.adjustments,
          hijriDateOffset: state.hijriDateOffset,
          timezone: state.timezone,
          countMode: state.countMode,
          adhan: state.adhan,
          iqamah: state.iqamah,
        }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      console.log("Settings saved successfully");
    } catch (err) {
      console.error("Failed to save settings:", err);
    }
  },
}));
