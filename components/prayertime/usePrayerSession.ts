import { usePrayerStore } from "@/components/prayertime/usePrayerStore";
import usePrayertime from "@/components/prayertime/usePrayertime";
import { useSound } from "@/lib/hooks/useSound";
import { toSec, toTimeSec, toTimeStr } from "@/lib/utils/time";
import { useCallback, useEffect, useMemo, useState } from "react";

const FOCUS_MODE = {
  NONE: 0,
  IQAMAH: 1,
  ADHAN: 2,
  PRAYING: 3,
  NOTIFY: 4,
};

function getTimeStr(timeLeft: string) {
  // Next pray time string
  const [, min, sec] = timeLeft.split(":").map(Number);

  return toTimeStr(min, sec);
}

function getCountStr(countDown: number) {
  // Iqamah countdown time string
  const iMin = Math.floor(countDown / 60);
  const iSec = countDown - iMin * 60;

  return toTimeStr(iMin, iSec);
}

export default function usePrayerSession() {
  const { nextPrayer, timeLeft, isValidTimeLeft } = usePrayertime();
  const { countMode, setCountMode, getIqamah, getAdhan } = usePrayerStore();
  const { play: playBeep } = useSound("/media/beep.mp3");

  const [focusMode, setFocusMode] = useState(FOCUS_MODE.NONE);
  const [countDown, setCountDown] = useState(0);
  const praySession = useMemo(() => nextPrayer, [countMode]);

  // Prayer time session check entry
  useEffect(() => {
    if (!countMode) return;

    // Only apply when focus mode is NONE
    if (focusMode === FOCUS_MODE.NONE) {
      const isPrayTime = toTimeSec(timeLeft) === 0;

      if (isPrayTime) {
        switch (praySession) {
          case "Imsyak":
          case "Syuruq":
            setFocusMode(FOCUS_MODE.NOTIFY);
            break;
          default:
            playBeep();
            setFocusMode(FOCUS_MODE.ADHAN);
        }
      } else if (isValidTimeLeft) {
        // Reset state on invalid timeLeft
        setCountDown(0);
      }
    }
  }, [countMode, timeLeft, focusMode]);

  // Count down during focus mode
  useEffect(() => {
    const isFocusMode = focusMode !== FOCUS_MODE.NONE;

    if (!isFocusMode) return;

    if (countDown > 0) {
      const nextCountDown = countDown - 1;
      setCountDown(nextCountDown);
    } else {
      switch (focusMode) {
        case FOCUS_MODE.ADHAN:
          setCountDown(getAdhan(praySession));
          break;
        case FOCUS_MODE.IQAMAH:
          setCountDown(getIqamah(praySession));
          break;
        case FOCUS_MODE.PRAYING:
          // Set for 10 minutes
          setCountDown(toSec(10, "minute"));
          break;
        case FOCUS_MODE.NOTIFY:
          // Set for 30 sec
          setCountDown(30);
          break;
      }
    }
  }, [timeLeft, focusMode]);

  // Change mode on count down finished
  useEffect(() => {
    if (countDown === 0) {
      switch (focusMode) {
        case FOCUS_MODE.ADHAN:
          setFocusMode(FOCUS_MODE.IQAMAH);
          break;
        case FOCUS_MODE.IQAMAH:
          playBeep();
          setFocusMode(FOCUS_MODE.PRAYING);
          break;
        case FOCUS_MODE.PRAYING:
          setCountMode(false);
          setFocusMode(FOCUS_MODE.NONE);
          break;
        case FOCUS_MODE.NOTIFY:
        default:
          setCountMode(false);
          setFocusMode(FOCUS_MODE.NONE);
      }
    }
  }, [countDown]);

  const getLabel = useCallback(() => {
    let main = "";
    let sub: string | undefined;
    let count: string | undefined;

    switch (focusMode) {
      case FOCUS_MODE.NONE:
        main = `Menjelang waktu ${praySession}`;
        count = getTimeStr(timeLeft);
        break;
      case FOCUS_MODE.ADHAN:
        main = `Adzan ${praySession}`;
        sub =
          "Ucapkanlah sebagaimana disebutkan oleh muadzin. Lalu jika sudah selesai kumandang azan, berdoalah, maka akan diijabahi (dikabulkan).\nHR. Abu Daud no. 524 dan Ahmad 2: 172";
        break;
      case FOCUS_MODE.IQAMAH:
        main = "Menuju Iqamah";
        count = getCountStr(countDown);
        break;
      case FOCUS_MODE.PRAYING:
        main =
          "Luruskanlah shaf-shaf kalian,\nkarena lurusnya shaf termasuk\ndari kesempurnaan shalat.";
        sub = "HR. Bukhari, no. 723 dan Muslim, no. 433";
        break;
      case FOCUS_MODE.NOTIFY:
        main = `Memasuki waktu ${praySession}`;
        break;
    }

    return { main, sub, count };
  }, [focusMode, timeLeft, countDown]);

  const label = useMemo(() => getLabel(), [getLabel]);
  const isAdhan = focusMode === FOCUS_MODE.ADHAN;
  const isPraying = focusMode === FOCUS_MODE.PRAYING;

  return { countMode, label, isAdhan, isPraying };
}
