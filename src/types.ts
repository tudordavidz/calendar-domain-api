// src/types.ts

export interface Duration {
  hours: number; // Hours component of the duration
  minutes?: number; // Optional minutes component of the duration
}

export interface Event {
  id: string; // Unique identifier for the event
  title: string; // Title of the event
  startDate: Date; // Start date and time of the event
  duration: Duration; // Duration of the event
  endDate: Date; // End date and time of the event (computed from startDate and duration)
  isRecurring?: boolean; // Flag indicating if the event is recurring
  recurrenceRule?: RecurrenceRule; // Optional recurrence rule for recurring events
}

export interface RecurrenceRule {
  frequency: "daily" | "weekly" | "monthly"; // Frequency of recurrence
  count?: number; // Maximum number of occurrences
  until?: Date; // Date until which the event recurs
}

export interface DateRange {
  start: Date; // Start date of the range
  end: Date; // End date of the range
}
