# Calendar Domain API

The Calendar Domain API is a TypeScript library for managing calendar events, including functionalities for creating, updating, deleting, and applying recurrence rules to events. This library is designed to help you easily manage events in a calendar application.

## Features

- **Create Events**: Add events to the calendar.
- **Update Events**: Modify existing events.
- **Delete Events**: Remove events from the calendar.
- **Recurrence**: Automatically generate recurring events based on specified rules.

## Installation

To use this package in your project, follow these steps:

npm install <br>
npm run build -> build the package <br>
npm run test -> run tests and coverage <br>

1. **Install the package**

If you are developing this package locally and want to test it in another project:

Navigate to calendar-domain: cd path/to/calendar-domain <br>
Run in calendar-domain directory: npm link <br>

Navigate to your project: cd path/to/your/project <br>
Run in your project: npm link calendar-domain<br>

Importing the Package <br>
import { Calendar, createEvent, applyRecurrence, RecurrenceRule } from 'calendar-domain';

2.  **Example Usage**

import {
Calendar,
createEvent,
applyRecurrence,
RecurrenceRule,
} from "calendar-domain";

// Initialize a new Calendar instance
const calendar = new Calendar();

// Create three events
const event1 = createEvent("Team Meeting", new Date(), { hours: 1 });
const event2 = createEvent(
"Project Update",
new Date(Date.now() + 24 _ 60 _ 60 _ 1000),
{ hours: 2 }
); // Tomorrow
const event3 = createEvent(
"Client Call",
new Date(Date.now() + 2 _ 24 _ 60 _ 60 \* 1000),
{ hours: 1 }
); // Day after tomorrow

// Add events to the calendar
calendar.addEvent(event1);
calendar.addEvent(event2);
calendar.addEvent(event3);

console.log("Initial Events:");
calendar
.listEvents({
start: new Date(),
end: new Date(Date.now() + 1000 _ 60 _ 60 _ 24 _ 30),
})
.forEach((event) => {
console.log(`- ${event.title} from ${event.startDate} to ${event.endDate}`);
});

// Update the date of the first event (Team Meeting)
const newDateForEvent1 = new Date(Date.now() + 3 _ 24 _ 60 _ 60 _ 1000); // 3 days later
calendar.updateEvent(event1.id, { startDate: newDateForEvent1 });
console.log(`\nUpdated '${event1.title}' to new date: ${newDateForEvent1}`);

// Create a recurrence rule for the second event (make it weekly)
const recurrenceRule: RecurrenceRule = {
frequency: "weekly", // Must be one of the specified literals
count: 5, // Generate 5 occurrences
};

// Apply recurrence to generate events for the second event
const occurrences = applyRecurrence(event2, recurrenceRule);
occurrences.forEach((occurrence) => {
calendar.addEvent(occurrence);
console.log(
`Added recurring event: ${occurrence.title} on ${occurrence.startDate}`
);
});

// Delete the third event (Client Call)
calendar.deleteEvent(event3.id);
console.log(`\nDeleted event: '${event3.title}'`);

// List all events after updates and deletion
console.log("\nEvents After Updates and Deletion:");
calendar
.listEvents({
start: new Date(),
end: new Date(Date.now() + 1000 _ 60 _ 60 _ 24 _ 30),
})
.forEach((event) => {
console.log(`- ${event.title} from ${event.startDate} to ${event.endDate}`);
});

3. **Run Example**
   npx ts-node example.ts
