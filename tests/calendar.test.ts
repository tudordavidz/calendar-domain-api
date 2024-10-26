// tests/calendar.test.ts

import { Calendar } from "../src/calendar";
import { createEvent } from "../src/calendarEvent"; // Ensure this function creates events with unique IDs

describe("Calendar", () => {
  let calendar: Calendar;

  beforeEach(() => {
    calendar = new Calendar();
  });

  describe("addEvent", () => {
    it("should add a new event successfully", () => {
      const event = createEvent("Meeting", new Date(), { hours: 1 });
      expect(calendar.addEvent(event)).toBe(true);
    });

    it("should fail to add an overlapping event", () => {
      const startDate = new Date();
      const event1 = createEvent("Event 1", startDate, { hours: 2 });
      const event2 = createEvent("Event 2", startDate, { hours: 1 });
      calendar.addEvent(event1);
      expect(calendar.addEvent(event2)).toBe(false);
    });

    it("should add overlapping events if explicitly allowed", () => {
      const startDate = new Date();
      const event1 = createEvent("Event 1", startDate, { hours: 2 });
      const event2 = createEvent("Event 2", startDate, { hours: 1 });
      calendar.addEvent(event1);
      expect(calendar.addEvent(event2, true)).toBe(true); // Allow overlap by passing true
    });
  });

  describe("updateEvent", () => {
    it("should fail to update an event if it causes an overlap", () => {
      const startDate = new Date();
      const event1 = createEvent("Event 1", startDate, { hours: 2 });
      const event2 = createEvent(
        "Event 2",
        new Date(startDate.getTime() + 3 * 60 * 60 * 1000),
        { hours: 1 }
      );
      calendar.addEvent(event1);
      calendar.addEvent(event2);

      // Attempt to update event2 to overlap with event1
      expect(calendar.updateEvent(event2.id, { startDate: startDate })).toBe(
        false
      );
    });

    it("should allow updating an event with an overlap if explicitly allowed", () => {
      const startDate = new Date();
      const event1 = createEvent("Event 1", startDate, { hours: 2 });
      const event2 = createEvent(
        "Event 2",
        new Date(startDate.getTime() + 3 * 60 * 60 * 1000),
        { hours: 1 }
      );
      calendar.addEvent(event1);
      calendar.addEvent(event2);

      // Update event2 with overlap allowed
      expect(
        calendar.updateEvent(event2.id, { startDate: startDate }, true)
      ).toBe(true);
    });
  });

  describe("deleteEvent", () => {
    it("should delete an existing event", () => {
      const event = createEvent("Meeting", new Date(), { hours: 1 });
      calendar.addEvent(event);
      expect(calendar.deleteEvent(event.id)).toBe(true); // Event should be deleted
      expect(calendar.getEventById(event.id)).toBeUndefined(); // Should not be found
    });

    it("should not delete a non-existing event", () => {
      const result = calendar.deleteEvent("non-existing-id");
      expect(result).toBe(false); // Deletion should fail
    });

    it("should delete an event without future option", () => {
      const event = createEvent("Weekly Meeting", new Date(), { hours: 1 });
      calendar.addEvent(event);

      // Adding future occurrences
      const futureEvent1 = createEvent(
        event.title,
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        { hours: 1 }
      );
      futureEvent1.id = event.id; // Set the same ID
      calendar.addEvent(futureEvent1);

      // Delete the original event without futureOnly
      expect(calendar.deleteEvent(event.id)).toBe(true);
      expect(calendar.getEventById(event.id)).toBeUndefined(); // Ensure original event is deleted
      expect(
        calendar.listEvents({
          start: new Date(),
          end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        })
      ).not.toContain(futureEvent1); // Future event should also be deleted
    });

    it("should delete an event that has no future occurrences", () => {
      const event = createEvent("Single Meeting", new Date(), { hours: 1 });
      calendar.addEvent(event);
      expect(calendar.deleteEvent(event.id)).toBe(true); // Should delete
      expect(calendar.getEventById(event.id)).toBeUndefined(); // Should not be found
    });

    it("should not delete future occurrences when none exist", () => {
      const event = createEvent("Standup", new Date(), { hours: 1 });
      calendar.addEvent(event);

      // Attempt to delete future occurrences when there are none
      expect(calendar.deleteEvent(event.id, { futureOnly: true })).toBe(false); // Should not delete anything
      expect(calendar.getEventById(event.id)).toBeDefined(); // Ensure the event still exists
    });

    it("should delete multiple events with the same ID correctly", () => {
      const event = createEvent("Conference", new Date(), { hours: 1 });
      calendar.addEvent(event);

      // Adding future occurrences with the same ID
      const futureEvent1 = createEvent(
        event.title,
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        { hours: 1 }
      );
      futureEvent1.id = event.id; // Set the same ID
      calendar.addEvent(futureEvent1);

      const futureEvent2 = createEvent(
        event.title,
        new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        { hours: 1 }
      );
      futureEvent2.id = event.id; // Set the same ID
      calendar.addEvent(futureEvent2);

      // Delete future occurrences
      expect(calendar.deleteEvent(event.id, { futureOnly: true })).toBe(true); // Delete future occurrences
      expect(calendar.getEventById(event.id)).toBeDefined(); // Original event should still exist
    });
  });
});
