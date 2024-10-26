// tests/recurrence.test.ts

import { applyRecurrence } from "../src/recurrence";
import { Event, RecurrenceRule } from "../src/types";

describe("applyRecurrence", () => {
  const baseEvent: Event = {
    id: "test-id",
    title: "Recurring Event",
    startDate: new Date(), // current date as the base start date
    endDate: new Date(Date.now() + 60 * 60 * 1000), // 1-hour duration
    isRecurring: true,
    duration: {
      hours: 0,
      minutes: undefined,
    },
  };

  it("should generate weekly recurring events until a specified date", () => {
    // Set the "until" date to exactly three weeks after the base event's start date
    const untilDate = new Date(baseEvent.startDate);
    untilDate.setDate(untilDate.getDate() + 21); // 3 weeks later

    const rule: RecurrenceRule = { frequency: "weekly", until: untilDate };
    const occurrences = applyRecurrence(baseEvent, rule);

    // Expect 4 occurrences: start date + 0 weeks, +1 week, +2 weeks, +3 weeks
    expect(occurrences.length).toBe(4);

    occurrences.forEach((occurrence, index) => {
      const expectedDate = new Date(baseEvent.startDate);
      expectedDate.setDate(baseEvent.startDate.getDate() + 7 * index);

      // Check each occurrence's start date to ensure it's spaced weekly
      expect(occurrence.startDate.toDateString()).toBe(
        expectedDate.toDateString()
      );
    });
  });

  it("should generate daily recurring events with a count limit", () => {
    const rule: RecurrenceRule = { frequency: "daily", count: 5 };
    const occurrences = applyRecurrence(baseEvent, rule);

    // Expect 5 occurrences (base date + 4 additional daily occurrences)
    expect(occurrences.length).toBe(5);

    occurrences.forEach((occurrence, index) => {
      const expectedDate = new Date(baseEvent.startDate);
      expectedDate.setDate(baseEvent.startDate.getDate() + index);

      // Check each occurrence's start date for daily spacing
      expect(occurrence.startDate.toDateString()).toBe(
        expectedDate.toDateString()
      );
    });
  });

  it("should generate monthly recurring events until a specified date", () => {
    // Set "until" date 3 months from the base event's start date
    const untilDate = new Date(baseEvent.startDate);
    untilDate.setMonth(untilDate.getMonth() + 3);

    const rule: RecurrenceRule = { frequency: "monthly", until: untilDate };
    const occurrences = applyRecurrence(baseEvent, rule);

    // Expect 4 occurrences: start date + 0 months, +1 month, +2 months, +3 months
    expect(occurrences.length).toBe(4);

    occurrences.forEach((occurrence, index) => {
      const expectedDate = new Date(baseEvent.startDate);
      expectedDate.setMonth(baseEvent.startDate.getMonth() + index);

      // Check each occurrence's start date for monthly spacing
      expect(occurrence.startDate.toDateString()).toBe(
        expectedDate.toDateString()
      );
    });
  });

  it("should stop generating events once the until date is reached", () => {
    // Set the until date only 5 days from the start date with daily frequency
    const untilDate = new Date(baseEvent.startDate);
    untilDate.setDate(untilDate.getDate() + 5);

    const rule: RecurrenceRule = { frequency: "daily", until: untilDate };
    const occurrences = applyRecurrence(baseEvent, rule);

    // Expect 6 occurrences: base date + 0 days, +1 day, ..., +5 days
    expect(occurrences.length).toBe(6);

    occurrences.forEach((occurrence, index) => {
      const expectedDate = new Date(baseEvent.startDate);
      expectedDate.setDate(baseEvent.startDate.getDate() + index);

      // Verify daily spacing until the until date
      expect(occurrence.startDate.toDateString()).toBe(
        expectedDate.toDateString()
      );
    });
  });

  it("should not generate any events if the until date is before the start date", () => {
    // Set "until" date to 1 day before the start date
    const untilDate = new Date(baseEvent.startDate);
    untilDate.setDate(untilDate.getDate() - 1);

    const rule: RecurrenceRule = { frequency: "daily", until: untilDate };
    const occurrences = applyRecurrence(baseEvent, rule);

    // Expect no occurrences since the until date is in the past
    expect(occurrences.length).toBe(0);
  });
});
