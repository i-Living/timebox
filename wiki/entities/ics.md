---
title: ics
created: 2026-06-19
updated: 2026-06-19
type: entity
tags:
  - component
  - internal
source: c:\dev\timebox\src\utils\ics.ts
confidence: low
hash: 4a3643610a530d14
---

# ics

> Source: `c:\dev\timebox\src\utils\ics.ts`


> Source: `c:\dev\timebox\src\utils\ics.ts`


> Source: `src\utils\ics.ts`


> Source: `c:\dev\timebox\src\utils\ics.ts`


> Source: `c:\dev\timebox\src\utils\ics.ts`


> Source: `src\utils\ics.ts`


> Source: `src\utils\ics.ts`


> Source: `c:\dev\timebox\src\utils\ics.ts`


> Source: `c:\dev\timebox\src\utils\ics.ts`


> Source: `c:\dev\timebox\src\utils\ics.ts`


> Source: `c:\dev\timebox\src\utils\ics.ts`


> Source: `c:\dev\timebox\src\utils\ics.ts`


## Description

This module provides utility functions for generating and downloading ICS (iCalendar) files from slot data. It handles single and multiple slot exports, including booking information and organizer details, with proper ICS formatting and special character escaping.

## Functions

### `esc(s: string): string`

#### Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `s` | `string` | Input string to escape |

#### Return Value
- **Type:** `string`
- **Description:** The input string with backslashes, semicolons, commas, and newlines escaped for ICS format compliance

#### Algorithm
1. Escapes backslashes, semicolons, and commas by prefixing them with a backslash
2. Replaces newline characters (`\n`) with the ICS escape sequence `\\n`

#### Complexity
- **Time:** O(n) where n is the string length
- **Space:** O(n) for the new string

---

### `fmtDate(d: string, t: string): string`

#### Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `d` | `string` | Date string in YYYY-MM-DD format |
| `t` | `string` | Time string in HH:mm format |

#### Return Value
- **Type:** `string`
- **Description:** ICS-compliant datetime string in YYYYMMDDTHHmmss format

#### Algorithm
1. Removes hyphens from the date string
2. Removes colons from the time string
3. Appends "00" for seconds
4. Concatenates date and time with "T" separator

#### Complexity
- **Time:** O(n) where n is the combined length of input strings
- **Space:** O(n) for the formatted string

---

### `generateSlotICS(slot: Slot, organizerName: string): string`

#### Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `slot` | `Slot` | Single slot object containing date, start, end, bookings, and optional notes |
| `organizerName` | `string` | Name of the organizer/calendar owner |

#### Return Value
- **Type:** `string`
- **Description:** Complete ICS file content as a string with `\r\n` line endings

#### Algorithm
1. Creates VCALENDAR wrapper with VERSION and PRODID
2. Creates VEVENT with DTSTART and DTEND from slot data
3. Sets SUMMARY to organizer name (or "TimeBox" as fallback)
4. If confirmed bookings exist, adds DESCRIPTION with client names
5. If slot notes exist, adds DESCRIPTION with notes content
6. Sets STATUS to CONFIRMED
7. Closes VEVENT and VCALENDAR blocks
8. Joins all lines with `\r\n`

#### Complexity
- **Time:** O(b + n) where b is number of bookings and n is notes length
- **Space:** O(k) where k is the total output size

---

### `generateSlotsICS(slots: Slot[], organizerName: string): string`

#### Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `slots` | `Slot[]` | Array of slot objects to include in the calendar |
| `organizerName` | `string` | Name of the organizer/calendar owner |

#### Return Value
- **Type:** `string`
- **Description:** Complete ICS file content with multiple VEVENT entries

#### Algorithm
1. Creates VCALENDAR wrapper
2. For each slot:
   - Creates VEVENT with DTSTART and DTEND
   - If confirmed bookings exist: sets SUMMARY with organizer name and client names, adds DESCRIPTION
   - If no bookings: sets SUMMARY with "Свободное окно" (free window) and adds TRANSP:TRANSPARENT
   - Appends slot notes if present
   - Sets STATUS to CONFIRMED
3. Closes VCALENDAR
4. Joins all lines with `\r\n`

#### Complexity
- **Time:** O(s * (b + n)) where s is number of slots, b is average bookings per slot, n is average notes length
- **Space:** O(k) where k is the total output size

---

### `downloadICS(ics: string, filename: string): void`

#### Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `ics` | `string` | ICS file content to download |
| `filename` | `string` | Desired filename for the downloaded file |

#### Return Value
- **Type:** `void`
- **Description:** Triggers a browser download with no return value

#### Algorithm
1. Creates a Blob from the ICS string with MIME type `text/calendar;charset=utf-8`
2. Generates an object URL from the Blob
3. Creates a temporary anchor element
4. Sets the anchor's href to the object URL and download attribute to the filename
5. Appends the anchor to the document body
6. Programmatically clicks the anchor to trigger download
7. Removes the anchor from the DOM
8. Revokes the object URL to free memory

#### Complexity
- **Time:** O(1) (Blob creation is O(n) but download trigger is constant)
- **Space:** O(n) for the Blob in memory

## Limitations

- **Browser-only:** `downloadICS` requires a browser environment with DOM and Blob API support; will fail in Node.js
- **Single date events:** All events are generated as single-day events; multi-day events are not supported
- **No timezone handling:** Datetimes are generated without timezone information (floating time)
- **No recurrence rules:** Recurring events are not supported
- **Hardcoded descriptions:** Some descriptions contain Russian text ("Записан(ы)", "Клиенти", "Свободное окно") which may not be suitable for all locales
- **No UID generation:** Events lack unique identifiers (UID), which may cause issues with some calendar applications
- **No alarm/reminder support:** Alarm components are not included in generated ICS files
- **Line length:** ICS specification recommends maximum line length of 75 octets; this implementation does not enforce line folding
