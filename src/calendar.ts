import { Event, DateRange } from "./types";

// Define an options type for deleteEvent
interface DeleteEventOptions {
  futureOnly?: boolean; // Optional futureOnly flag
}

export class Calendar {
  private events: Event[] = []; // Store all events

  // Add a new event to the calendar, allowing for overlaps if specified
  addEvent(event: Event, allowOverlap = false): boolean {
    if (!allowOverlap && this.events.some((e) => isOverlapping(e, event))) {
      return false; // Return false if there's an overlap and it's not allowed
    }
    this.events.push(event);
    return true;
  }

  // Update an existing event in the calendar
  updateEvent(
    eventId: string,
    updates: Partial<Event>,
    allowOverlap = false
  ): boolean {
    const eventIndex = this.events.findIndex((e) => e.id === eventId);
    if (eventIndex === -1) return false; // Event not found

    const updatedEvent = { ...this.events[eventIndex], ...updates };

    // Check for overlaps only if allowOverlap is false
    if (
      !allowOverlap &&
      this.events.some(
        (e) => e.id !== eventId && isOverlapping(e, updatedEvent)
      )
    ) {
      return false; // Return false if overlaps are not allowed
    }

    this.events[eventIndex] = updatedEvent; // Update the event
    return true; // Return true if the update was successful
  }

  // Delete an event from the calendar
  deleteEvent(eventId: string, options?: { futureOnly?: boolean }): boolean {
    const initialLength = this.events.length;

    if (options?.futureOnly) {
      // Delete future occurrences of the event
      this.events = this.events.filter((event) => {
        // Check if the event is the same and is in the future
        return !(event.id === eventId && event.startDate > new Date());
      });
    } else {
      // Delete the event normally
      this.events = this.events.filter((event) => event.id !== eventId);
    }

    return this.events.length < initialLength; // Return true if any event was deleted
  }

  // Retrieve an event by its ID
  getEventById(eventId: string): Event | undefined {
    return this.events.find((event) => event.id === eventId);
  }

  // List events within a specified date range
  listEvents(dateRange: DateRange): Event[] {
    return this.events.filter((event) => isWithinRange(event, dateRange)); // Filter events within the date range
  }
}

// Check if two events overlap
function isOverlapping(event1: Event, event2: Event): boolean {
  return event1.startDate < event2.endDate && event2.startDate < event1.endDate;
}

// Check if an event is within a specified date range
function isWithinRange(event: Event, range: DateRange): boolean {
  return event.startDate >= range.start && event.endDate <= range.end;
}
