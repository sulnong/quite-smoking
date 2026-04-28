import { addMinutes } from "date-fns";

function parseOffsetMinutes(occurredAtIso: string) {
  const match = occurredAtIso.match(/([+-])(\d{2}):(\d{2})$/);

  if (!match) {
    return 0;
  }

  const [, sign, hours, minutes] = match;
  const offset = Number(hours) * 60 + Number(minutes);

  return sign === "-" ? -offset : offset;
}

function pad(value: number, width = 2) {
  return value.toString().padStart(width, "0");
}

function formatWithOffset(date: Date, offsetMinutes: number) {
  const shifted = new Date(date.getTime() + offsetMinutes * 60 * 1000);
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absoluteOffset = Math.abs(offsetMinutes);
  const offsetHours = Math.floor(absoluteOffset / 60);
  const offsetRemainderMinutes = absoluteOffset % 60;

  return [
    shifted.getUTCFullYear(),
    "-",
    pad(shifted.getUTCMonth() + 1),
    "-",
    pad(shifted.getUTCDate()),
    "T",
    pad(shifted.getUTCHours()),
    ":",
    pad(shifted.getUTCMinutes()),
    ":",
    pad(shifted.getUTCSeconds()),
    ".",
    pad(shifted.getUTCMilliseconds(), 3),
    sign,
    pad(offsetHours),
    ":",
    pad(offsetRemainderMinutes)
  ].join("");
}

export function buildFollowupDueAt(occurredAtIso: string) {
  const occurredAt = new Date(occurredAtIso);
  const dueAt = addMinutes(occurredAt, 10);
  const offsetMinutes = parseOffsetMinutes(occurredAtIso);

  return formatWithOffset(dueAt, offsetMinutes);
}
