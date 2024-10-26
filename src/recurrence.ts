// src/recurrence.ts

import { Event, RecurrenceRule } from "./types";

export function applyRecurrence(
  baseEvent: Event,
  rule: RecurrenceRule
): Event[] {
  const occurrences: Event[] = [];
  const { frequency, count, until } = rule;
  let currentStart = new Date(baseEvent.startDate);
  let currentEnd = new Date(baseEvent.endDate);

  while (true) {
    // Stop if we have reached the count limit
    if (count && occurrences.length >= count) break;

    // Stop if the current start date goes beyond the until date
    if (until && currentStart > until) break;

    // Add current occurrence
    occurrences.push({
      ...baseEvent,
      startDate: new Date(currentStart),
      endDate: new Date(currentEnd),
    });

    // Move to the next occurrence based on frequency
    switch (frequency) {
      case "daily":
        currentStart.setDate(currentStart.getDate() + 1);
        currentEnd.setDate(currentEnd.getDate() + 1);
        break;
      case "weekly":
        currentStart.setDate(currentStart.getDate() + 7);
        currentEnd.setDate(currentEnd.getDate() + 7);
        break;
      case "monthly":
        currentStart.setMonth(currentStart.getMonth() + 1);
        currentEnd.setMonth(currentEnd.getMonth() + 1);
        break;
      default:
        throw new Error(`Unsupported frequency: ${frequency}`);
    }

    // Stop if the next start date would exceed the until date
    if (until && currentStart > until) break;
  }

  return occurrences;
}
