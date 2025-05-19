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
  //State
  prayTimes: PrayTimes;
  coordinates: Coordinates;
  adjustments: Adjustments;
  hijriDateOffset: number;
  timezone: number;
  countMode: boolean;
  adhan: Countdown;
  iqamah: Countdown;

  // Dispatch
  setPrayTimes: (prayTimes: PrayTimes) => void;
  setAdjustments: (adj: Adjustments) => void;
  setCoordinates: (coords: Coordinates) => void;
  setHijriDateOffset: (offset: number) => void;
  setTimezone: (tzone: number) => void;
  setCountMode: (countMode: boolean) => void;
  setAdhan: (adhan: Countdown) => void;
  setIqamah: (iqamah: Countdown) => void;

  // Action
  getAdhan: (prayer: PrayerLabel) => number;
  getIqamah: (prayer: PrayerLabel) => number;
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
  adhan: {
    Subuh: 5,
    Dzuhur: 5,
    Ashar: 5,
    Maghrib: 5,
    Isya: 1,
  },
  iqamah: {
    Subuh: 7,
    Dzuhur: 5,
    Ashar: 5,
    Maghrib: 5,
    Isya: 1,
  },
  hijriDateOffset: -1,
  timezone: 7,
  countMode: false,

  // Dispatch
  setPrayTimes: (prayTimes) => set({ prayTimes }),
  setAdjustments: (adj) => set({ adjustments: { ...get().adjustments, ...adj } }),
  setCoordinates: (coords) => set({ coordinates: coords }),
  setHijriDateOffset: (hijriDateOffset) => set({ hijriDateOffset }),
  setTimezone: (timezone) => set({ timezone }),
  setCountMode: (countMode) => set({ countMode }),
  setIqamah: (iqamah) => set({ iqamah: { ...get().iqamah, ...iqamah } }),
  setAdhan: (adhan) => set({ adhan: { ...get().adhan, ...adhan } }),

  // Action
  getAdhan: (prayer) => {
    const { adhan } = get();

    // Check if prayer is a valid iqamah key
    if (prayer in adhan) {
      return adhan[prayer as CountdownLabel] * 60;
    }

    return 0;
  },
  getIqamah: (prayer) => {
    const { iqamah } = get();

    // Check if prayer is a valid iqamah key
    if (prayer in iqamah) {
      return iqamah[prayer as CountdownLabel] * 60;
    }

    return 0;
  },
}));
