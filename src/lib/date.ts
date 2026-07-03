import { formatDistanceToNowStrict } from "date-fns";
import { sv } from "date-fns/locale";

// Intl handles the Europe/Stockholm CET/CEST switch natively - no need for
// date-fns-tz just to render a wall-clock time correctly.
export function formatDrawDate(iso: string): string {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Stockholm",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatDrawCountdown(iso: string): string {
  return formatDistanceToNowStrict(new Date(iso), {
    addSuffix: true,
    locale: sv,
  });
}

// For <input type="datetime-local">, which both reads and writes in the
// browser's local timezone. Admins are assumed to be browsing from Sweden,
// so the browser-local wall clock lines up with Europe/Stockholm.
export function toDatetimeLocalValue(iso: string): string {
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
