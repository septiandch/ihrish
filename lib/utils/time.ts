import dayjs from "dayjs";

export function getTime(format: string = "HH:mm") {
  const now = new Date();
  return dayjs(now).format(format);
}

export function toDayjs(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return dayjs().set("hour", hours).set("minute", minutes).set("second", 0).millisecond(0);
}

export function adjustMin(time: string, minutesToAdd: number) {
  const updatedTime = toDayjs(time).add(minutesToAdd, "minute");
  return updatedTime.format("HH:mm");
}

export function toTimeStr(n1: number, n2: number, n3?: number) {
  const isMmSs = n3 !== undefined;

  const n1Str = n1.toString().padStart(2, "0");
  const n2Str = n2.toString().padStart(2, "0");
  const n3Str = n3?.toString().padStart(2, "0");

  return `${n1Str}:${n2Str}${isMmSs ? ":" + n3Str : ""}`;
}

export function toSec(num: number, from: "hour" | "minute") {
  let result: number = 0;

  switch (from) {
    case "hour":
      result = num * 60 * 60;
      break;
    case "minute":
      result = num * 60;
      break;
  }

  return result;
}

export function toTimeSec(timeStr: string) {
  let result = 0;

  const time = timeStr.split(":").map(Number);

  if (time.length === 3) {
    result = toSec(time[0], "hour") + toSec(time[1], "minute") + time[2];
  } else {
    result = toSec(time[0], "minute") + time[1];
  }

  return result;
}
