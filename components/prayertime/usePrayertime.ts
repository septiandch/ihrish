import { OriginalPrayerLabel, PrayerLabel } from "@/components/prayertime/types";
import { usePrayerStore } from "@/components/prayertime/usePrayerStore";
import calendarSystems from "@calidy/dayjs-calendarsystems";
import { CalculationMethod, CalculationParameters, Coordinates, PrayerTimes } from "adhan";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useEffect, useState } from "react";

type PrayerTimeType = { [prayer in PrayerLabel]: string };

dayjs.extend(duration);
dayjs.extend(calendarSystems);

const prayerLabel: { [key in OriginalPrayerLabel | "none"]: string } = {
  none: "None",
  sunrise: "Terbit",
  fajr: "Subuh",
  dhuhr: "Dzuhur",
  asr: "Ashar",
  maghrib: "Maghrib",
  isha: "Isya",
};

export function useCurrentTime() {
  const [time, setTime] = useState(() => dayjs());

  useEffect(() => {
    // Create interval
    const interval = setInterval(() => {
      setTime(dayjs());
    }, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []); // Empty dependency array since we don't need to recreate interval

  return time;
}

export default function usePrayertime() {
  const { coordinates, adjustments, nextPrayer: nextPrayerId } = usePrayerStore();

  const time = useCurrentTime();
  const [times, setTimes] = useState<PrayerTimeType>();

  const date = time.date();
  const nextPrayer = prayerLabel[nextPrayerId || "none"];

  useEffect(() => {
    const coords = new Coordinates(coordinates.lat, coordinates.long); //-6.2, 106.82); // contoh Jakarta
    const params = new CalculationParameters("MuslimWorldLeague", 20, 18); // Fajr: 20°, Isha: 18°
    params.madhab = "shafi";
    params.adjustments = adjustments;

    const now = new Date();
    const prayerTimes = new PrayerTimes(coords, now, params);

    setTimes({
      Imsyak: new Date(prayerTimes.fajr.getTime() - 10 * 60000).toLocaleTimeString(), // 10 minutes before Fajr
      Subuh: prayerTimes.fajr.toLocaleTimeString(),
      Terbit: prayerTimes.sunrise.toLocaleTimeString(),
      Dzuhur: prayerTimes.dhuhr.toLocaleTimeString(),
      Ashar: prayerTimes.asr.toLocaleTimeString(),
      Maghrib: prayerTimes.maghrib.toLocaleTimeString(),
      Isya: prayerTimes.isha.toLocaleTimeString(),
    });
  }, [date]);

  return { times, nextPrayer };
}

export function usePrayerCountdown() {
  const { coordinates, nextPrayer, setNextPrayer } = usePrayerStore();
  const time = useCurrentTime();

  const [countdown, setCountdown] = useState<{ label: string; time: string }>({
    label: "None",
    time: "00:00:00",
  });

  const coords = new Coordinates(coordinates.lat, coordinates.long); //-6.2, 106.82); // contoh Jakarta
  const params = CalculationMethod.MuslimWorldLeague();

  // Only run clock after component mounts
  useEffect(() => {
    // Get today next prayer time
    const todayPrayerTimes = new PrayerTimes(coords, time.toDate(), params);

    let nextPrayerId = todayPrayerTimes.nextPrayer();
    let nextPrayerTime = todayPrayerTimes.timeForPrayer(nextPrayerId) || dayjs().toDate();

    if (nextPrayerId === "none") {
      // If target time has passed today, set it for tomorrow fajr
      const tomorrowPrayerTimes = new PrayerTimes(coords, time.add(1, "day").toDate(), params);

      nextPrayerId = "fajr";
      nextPrayerTime = tomorrowPrayerTimes.fajr;
    }

    // Calculate duration for next prayer time
    const diff = dayjs(nextPrayerTime).diff(time);
    const duration = dayjs.duration(diff);

    const formattedDuration = `${String(duration.hours()).padStart(2, "0")}:${String(
      duration.minutes()
    ).padStart(2, "0")}:${String(duration.seconds()).padStart(2, "0")}`;

    setNextPrayer(nextPrayerId);
    setCountdown({ label: prayerLabel[nextPrayerId], time: formattedDuration });
  }, [time]);

  return { nextPrayer, countdown };
}
