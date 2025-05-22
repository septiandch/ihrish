import { PrayerLabel, PrayTimes } from "@/components/prayertime/types";
import { usePrayerStore } from "@/components/prayertime/usePrayerStore";
import { PrayTimes as PrayTimesLib } from "@/lib/utils";
import { adjustMin, toSec, toTimeSec, toTimeStr } from "@/lib/utils/time";
import PrayTimesType from "@/types/praytimes";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const COUNT_START_MIN = 5 * 60; //5 minutes

const PT = new (PrayTimesLib as unknown as typeof PrayTimesType)("Indonesia");

function prayerCountdown(prayTimes: PrayTimes) {
  const now = dayjs().format("HH:mm:ss");
  let nextPrayer: PrayerLabel = "Imsyak";
  let currentPrayer: PrayerLabel | undefined = undefined;
  let diff = Infinity;
  let initDiff = Infinity;

  const [hours, minutes, seconds] = now.split(":").map(Number);
  const nTime = toSec(hours, "hour") + toSec(minutes, "minute") + seconds;

  Object.entries(prayTimes).forEach(([label, time], index) => {
    const [pHours, pMinutes] = time.split(":").map(Number);
    const pTime = toSec(pHours, "hour") + toSec(pMinutes, "minute");

    const pDiff = pTime - nTime;

    if (pDiff >= 0 && pDiff < diff) {
      nextPrayer = label as PrayerLabel;
      diff = pDiff;
    }

    if (index === 0) {
      // Set initial value if closest today's prayer time not found
      const nToMidnight = 24 * 60 * 60 - nTime;
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
  const hourLeft = Math.floor(diff / (60 * 60) || 0);
  const minLeft = Math.floor((diff - toSec(hourLeft, "hour")) / 60 || 0);
  const secLeft = diff - (toSec(hourLeft, "hour") + toSec(minLeft, "minute"));

  const timeLeft = toTimeStr(hourLeft, minLeft, secLeft);

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
        Syuruq: adjustMin(times.sunrise, adjustments.sunrise + 15), // 15 minutes after sunrise
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
      const interval = setInterval(updateTimes, 24 * 60 * 60 * 1000);

      // Return cleanup function that clears both timeout and interval
      return () => {
        clearTimeout(timeout);
        clearInterval(interval);
      };
    }, millisUntilMidnight);

    return () => clearTimeout(timeout);
  }, [coordinates, timezone, adjustments]);

  return prayTimes;
}

type PrayerCountdown = {
  currentPrayer: PrayerLabel | undefined;
  nextPrayer: PrayerLabel;
  timeLeft: string;
};

function usePrayCountdown(prayTimes: PrayTimes) {
  const { countMode, setCountMode } = usePrayerStore();
  const [countdown, setCountdown] = useState<PrayerCountdown>({
    currentPrayer: "Imsyak",
    nextPrayer: "Subuh",
    timeLeft: "00:00:00",
  });

  // Update countdown whenever prayTimes change
  useEffect(() => {
    setCountdown(prayerCountdown(prayTimes));
  }, [prayTimes]);

  // Interval effect that aligns with minute changes
  useEffect(() => {
    // Wait for the next second to start the interval
    const timeout = setTimeout(() => {
      setCountdown(prayerCountdown(prayTimes));

      // Start interval exactly on second change
      const interval = setInterval(() => {
        setCountdown(prayerCountdown(prayTimes));
      }, 1000);

      return () => clearInterval(interval);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [prayTimes]);

  useEffect(() => {
    const timeLeft = toTimeSec(countdown.timeLeft);

    if (!countMode && timeLeft > 0 && timeLeft < COUNT_START_MIN) {
      setCountMode(true);
    }
  }, [countdown]);

  return countdown;
}

export default function usePrayertime() {
  const times = usePrayTimes();
  const countdown = usePrayCountdown(times);

  return { times, ...countdown };
}
