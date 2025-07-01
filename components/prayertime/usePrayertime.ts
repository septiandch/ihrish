import { PrayerLabel, PrayTimes } from "@/components/prayertime/types";
import { usePrayerStore } from "@/components/prayertime/usePrayerStore";
import { PrayTimes as PrayTimesLib } from "@/lib/utils";
import { adjustMin, toSec, toTimeSec, toTimeStr } from "@/lib/utils/time";
import PrayTimesType from "@/types/praytimes";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const COUNT_START_MIN = 5 * 60; //5 minutes

const PT = new (PrayTimesLib as unknown as typeof PrayTimesType)("Indonesia");

function getPrayerCountdown(prayTimes: PrayTimes) {
  const now = dayjs().format("HH:mm:ss");
  let nextPrayer: PrayerLabel = "Imsyak";
  let currentPrayer: PrayerLabel = "Isya";
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
        Syuruq: adjustMin(times.sunrise, adjustments.sunrise + 15),
        Dzuhur: adjustMin(times.dhuhr, adjustments.dhuhr),
        Ashar: adjustMin(times.asr, adjustments.asr),
        Maghrib: adjustMin(times.maghrib, adjustments.maghrib),
        Isya: adjustMin(times.isha, adjustments.isha),
      };

      setPrayTimes(adjustedTimes);
    };

    updateTimes(); // run immediately

    const now = new Date();
    const millisUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();

    const timeout = setTimeout(() => {
      updateTimes();

      interval = setInterval(updateTimes, 24 * 60 * 60 * 1000);
    }, millisUntilMidnight);

    // 👇 move interval outside so we can clear it
    let interval: NodeJS.Timeout;

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [coordinates, timezone, adjustments]);

  return prayTimes;
}

type PrayerCountdown = {
  currentPrayer: PrayerLabel | undefined;
  nextPrayer: PrayerLabel;
  timeLeft: string;
};

export function usePrayCountdown(prayTimes: PrayTimes) {
  const { countMode, setCountMode } = usePrayerStore();
  const [countdown, setCountdown] = useState<PrayerCountdown>(() => getPrayerCountdown(prayTimes));

  // Update countdown every second
  useEffect(() => {
    const update = () => setCountdown(getPrayerCountdown(prayTimes));
    update(); // initial call

    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [JSON.stringify(prayTimes)]); // Use stringify to detect structural changes only

  // Trigger count mode if within 5 minutes
  useEffect(() => {
    const timeLeftSec = toTimeSec(countdown.timeLeft);
    const nextTimeSec = toTimeSec(prayTimes[countdown.nextPrayer]);

    const isValid = nextTimeSec > 0 && timeLeftSec > 0 && timeLeftSec < COUNT_START_MIN;

    if (!countMode && isValid) {
      setCountMode(true);
    }
  }, [countdown.timeLeft, countdown.nextPrayer, countMode]);

  return countdown;
}

export default function usePrayertime() {
  const times = usePrayTimes();
  const countdown = usePrayCountdown(times);

  const isValidTimeLeft = toTimeSec(countdown.timeLeft) <= COUNT_START_MIN;

  return { times, ...countdown, isValidTimeLeft };
}
