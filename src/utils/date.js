// src/utils/date.js

/**
 * Format a Date to a local YYYY-MM-DD string (no timezone/UTC conversion).
 * This uses the local date components (getFullYear/getMonth/getDate).
 */
export function formatLocalDate(date) {
  const d = new Date(date); // copy to be safe
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Return a new Date object offset by n days (n can be negative). */
export function addDays(date, n) {
  const d = new Date(date); // copy
  d.setDate(d.getDate() + n);
  return d;
}
