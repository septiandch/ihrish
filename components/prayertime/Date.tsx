"use client";

import { usePrayerStore } from "@/components/prayertime/usePrayerStore";
import { cn } from "@/lib/utils";
import toHijri from "@umalqura/core";
import { ClassValue } from "clsx";
import dayjs from "dayjs";

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

export default function Date({ className }: { className?: ClassValue }) {
  const { hijriDateOffset } = usePrayerStore();
  const time = dayjs();

  // Gregorian date parts
  const day = localizeDay[time.format("dddd")];
  const month = localizeMonth[time.format("MMMM")];
  const date = time.date();
  const year = time.year();
  const currentDate = `${day}, ${date} ${month} ${year}`;

  // Hijri date parts
  const hijriBase = time.add(hijriDateOffset, "day");
  const hijri = toHijri(hijriBase.toDate());

  const hijriDate = `${hijri.hd} ${hijriMonths[hijri.hm - 1]} ${hijri.hy}H`;

  return (
    <div className={cn("flex flex-col items-end w-max text-xl", className)}>
      <span>{currentDate}</span>
      <span>{hijriDate}</span>
    </div>
  );
}
