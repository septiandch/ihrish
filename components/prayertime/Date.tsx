"use client";

import { usePrayerStore } from "@/components/prayertime/usePrayerStore";
import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import dayjs, { Dayjs } from "dayjs";

const localizeDay: { [key: string]: string } = {
  Monday: "Senin",
  Tuesday: "Selasa",
  Wednesday: "Rabu",
  Thursday: "Kamis",
  Friday: "Jumat",
  Saturday: "Sabtu",
  Sunday: "Minggu",
};

const localizeMonth: { [key: string]: string } = {
  January: "Januari",
  February: "Februari",
  March: "Maret",
  April: "April",
  May: "Mei",
  June: "Juni",
  July: "Juli",
  August: "Agustus",
  September: "September",
  October: "Oktober",
  November: "November",
  December: "Desember",
};

const hijriMonths = [
  "Muharram",
  "Safar",
  "Rabiul-Awwal",
  "Rabiul-Akhir",
  "Jumadil-Awwal",
  "Jumadil-Akhir",
  "Rajab",
  "Sya'ban",
  "Ramadhan",
  "Syawal",
  "Dzulqo'dah",
  "Dzulhijjah",
];

const convertToHijri = (datetime: Dayjs, dateOffset = 0) => {
  const gregorianDate = datetime.add(dateOffset, "day").toDate();

  // Julian Date calculation
  const jd = Math.floor(gregorianDate.getTime() / 86400000 + 2440587.5);

  // Chronological Julian Date
  const l = jd - 1948440;
  const n = Math.floor(l / 10631);
  const l1 = l - 10631 * n;
  const j = Math.floor((l1 - Math.floor((l1 + 354) / 354)) / 354);
  const k = l1 - 354 * j;

  // Calculate Hijri components
  const hijriYear = 30 * n + j;
  const hijriMonth = Math.min(12, Math.ceil(k / 29.5));
  const hijriDay = Math.round(k - 29.5 * (hijriMonth - 1));

  // Ensure month index is within bounds (0-11 for array access)
  const monthIndex = Math.max(0, hijriMonth - 1);

  return `${hijriDay} ${hijriMonths[monthIndex]} ${hijriYear}H`;
};

export function Date({ className }: { className?: ClassValue }) {
  const { hijriDateOffset } = usePrayerStore();
  const time = dayjs();

  const day = localizeDay[time.format("dddd")];
  const month = localizeMonth[time.format("MMMM")];
  const date = time.date();
  const year = time.year();
  const currentDate = `${day}, ${date} ${month} ${year}`;
  const hijriDate = convertToHijri(time, hijriDateOffset);

  return (
    <div className={cn("flex flex-col items-end w-max text-xl", className)}>
      <span>{currentDate}</span>
      <span>{hijriDate}</span>
    </div>
  );
}
