export type CoordinateType = {
  long: number;
  lat: number;
};

export type PrayerId = "imsak" | "fajr" | "sunrise" | "dhuhr" | "asr" | "maghrib" | "isha";
export type PrayerLabel = "Imsyak" | "Subuh" | "Terbit" | "Dzuhur" | "Ashar" | "Maghrib" | "Isya";
export type PrayTimes = { [key in PrayerLabel]: string };
