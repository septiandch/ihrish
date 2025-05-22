interface PrayTimesOutput {
  imsak: string;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  sunset: string;
  maghrib: string;
  isha: string;
}

interface PrayTimesConstructor {
  new (method: string): {
    getTimes(date: Date, coordinates: [number, number], timezone: number): PrayTimesOutput;
  };
}

declare const PrayTimes: PrayTimesConstructor;

export default PrayTimes;
