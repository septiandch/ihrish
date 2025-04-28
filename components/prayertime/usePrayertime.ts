import { PrayerLabel, PrayTimes } from "@/components/prayertime/types";
import { usePrayerStore } from "@/components/prayertime/usePrayerStore";
import { PrayTimes as PrayTimesLib } from "@/lib/utils";
import dayjs from "dayjs";
import { useEffect } from "react";

const PT = new (PrayTimesLib as any)("Indonesia");

export function toDayjs(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return dayjs().set("hour", hours).set("minute", minutes).set("second", 0).millisecond(0);
}

function adjustMin(time: string, minutesToAdd: number) {
  const updatedTime = toDayjs(time).add(minutesToAdd, "minute");
  return updatedTime.format("HH:mm");
}

function prayerCountdown(prayTimes: PrayTimes) {
  const now = dayjs().format("HH:mm");
  let nextPrayer: PrayerLabel = "Imsyak";
  let currentPrayer: PrayerLabel | undefined = undefined;
  let diff = Infinity;
  let initDiff = Infinity;

  const [hours, minutes] = now.split(":").map(Number);
  const nTime = hours * 60 + minutes;

  Object.entries(prayTimes).forEach(([label, time], index) => {
    const [pHours, pMinutes] = time.split(":").map(Number);
    const pTime = pHours * 60 + pMinutes;

    const pDiff = pTime - nTime;

    if (pDiff >= 0 && pDiff < diff) {
      nextPrayer = label as PrayerLabel;
      diff = pDiff;
    }

    if (index === 0) {
      // Set initial value if closest today's prayer time not found
      const nToMidnight = 24 * 60 - nTime;
      // Set for closest tomorrow prayer time
      initDiff = nToMidnight + pTime;
    }

    if (pDiff < 0) {
      // Set current prayer time label
      currentPrayer = label as PrayerLabel;
    }
  });

  if (diff === Infinity) {
    diff = initDiff;
    //Invalidate current prayer
    currentPrayer = undefined;
  }

  // Calculate duration for next prayer time
  const hourLeft = Math.round(diff / 60);
  const minLeft = diff - hourLeft * 60;

  const timeLeft = `${hourLeft > 0 ? `${hourLeft} Jam, ` : ""}${minLeft} menit lagi`;

  return { currentPrayer, nextPrayer, timeLeft };
}

function usePrayTimes() {
  const { coordinates, timezone, adjustments, prayTimes, setPrayTimes } = usePrayerStore();

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      const times = PT.getTimes(now, [coordinates.lat, coordinates.long], timezone);

      const adjustedTimes = {
        Imsyak: adjustMin(times.imsak, adjustments.imsak),
        Subuh: adjustMin(times.fajr, adjustments.fajr),
        Terbit: adjustMin(times.sunrise, adjustments.sunrise),
        Dzuhur: adjustMin(times.dhuhr, adjustments.dhuhr),
        Ashar: adjustMin(times.asr, adjustments.asr),
        Maghrib: adjustMin(times.maghrib, adjustments.maghrib),
        Isya: adjustMin(times.isha, adjustments.isha),
      };

      setPrayTimes(adjustedTimes);
    };

    updateTimes(); // first call immediately

    const now = new Date();
    const millisUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();

    const timeout = setTimeout(() => {
      updateTimes();

      // after midnight update, set interval every 24h
      setInterval(updateTimes, 24 * 60 * 60 * 1000);
    }, millisUntilMidnight);

    return () => clearTimeout(timeout); // clear on unmount
  }, [coordinates, timezone, adjustments]);

  return prayTimes;
}

export default function usePrayertime() {
  const times = usePrayTimes();

  const { currentPrayer, nextPrayer, timeLeft } = prayerCountdown(times);

  return { times, currentPrayer, nextPrayer, timeLeft };
}
