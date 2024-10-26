// src/calendarEvent.ts

import { Event, Duration } from "./types"; // Import necessary types
import { v4 as uuidv4 } from "uuid"; // To generate unique IDs

export function createEvent(
  title: string,
  startDate: Date,
  duration: Duration
): Event {
  const endDate = new Date(
    startDate.getTime() + duration.hours * 60 * 60 * 1000
  );

  return {
    id: uuidv4(), // Generate a unique ID for the event
    title,
    startDate,
    endDate,
    duration,
  };
}

export function updateEvent(event: Event, updates: Partial<Event>): Event {
  return { ...event, ...updates };
}
