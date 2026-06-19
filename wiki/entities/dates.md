---
title: dates
created: 2026-06-19
updated: 2026-06-19
type: entity
tags:
  - component
  - internal
source: c:\dev\timebox\src\utils\dates.ts
confidence: low
hash: ebef04109d47be6d
---

# dates

> Source: `c:\dev\timebox\src\utils\dates.ts`


> Source: `c:\dev\timebox\src\utils\dates.ts`


> Source: `src\utils\dates.ts`


> Source: `c:\dev\timebox\src\utils\dates.ts`


> Source: `c:\dev\timebox\src\utils\dates.ts`


> Source: `src\utils\dates.ts`


> Source: `src\utils\dates.ts`


> Source: `c:\dev\timebox\src\utils\dates.ts`


> Source: `c:\dev\timebox\src\utils\dates.ts`


> Source: `c:\dev\timebox\src\utils\dates.ts`


> Source: `c:\dev\timebox\src\utils\dates.ts`


> Source: `c:\dev\timebox\src\utils\dates.ts`


## Description
A collection of date utility functions providing formatting, week calculations, date comparisons, and day extraction. All functions operate on date strings in `YYYY-MM-DD` format and use Russian locale for month and weekday names.

---

## `today()`

### Return Value
- **Type:** `string`
- **Description:** Today's date formatted as `YYYY-MM-DD`.

### Algorithm
Creates a new `Date` object, converts to ISO string, and extracts the first 10 characters (date portion).

### Complexity
- **Time:** O(1)
- **Space:** O(1)

### Limitations
- Uses the system's local time zone for the current date.

---

## `formatDate(d)`

### Parameters
| Parameter | Type     | Description                          |
|-----------|----------|--------------------------------------|
| `d`       | `string` | Date string in `YYYY-MM-DD` format. |

### Return Value
- **Type:** `string`
- **Description:** Short Russian date format (e.g., `"5 мар"`).

### Algorithm
1. Splits the input string by `-` to extract month and day.
2. Parses the day as integer (removes leading zero).
3. Maps the month index (1-based) to a Russian month abbreviation array.
4. Returns `"{day} {monthAbbreviation}"`.

### Complexity
- **Time:** O(1)
- **Space:** O(1)

### Limitations
- Assumes input is a valid `YYYY-MM-DD` string.
- Month abbreviations are hardcoded for Russian locale only.

---

## `formatDateFull(d)`

### Parameters
| Parameter | Type     | Description                          |
|-----------|----------|--------------------------------------|
| `d`       | `string` | Date string in `YYYY-MM-DD` format. |

### Return Value
- **Type:** `string`
- **Description:** Full Russian date with weekday (e.g., `"пн 5 марта"`).

### Algorithm
1. Splits the input and converts parts to numbers.
2. Creates a `Date` object from year, month (0-based), and day.
3. Retrieves the day of week (0-6) and maps to Russian weekday abbreviations.
4. Maps the month index to Russian genitive month names.
5. Returns `"{weekday} {day} {monthName}"`.

### Complexity
- **Time:** O(1)
- **Space:** O(1)

### Limitations
- Month names are in genitive case (e.g., "марта" not "март").
- Weekday names are abbreviations (3 characters).

---

## `getWeekStart(d)`

### Parameters
| Parameter | Type     | Description                          |
|-----------|----------|--------------------------------------|
| `d`       | `string` | Date string in `YYYY-MM-DD` format. |

### Return Value
- **Type:** `string`
- **Description:** Date of the Monday of the week containing the given date.

### Algorithm
1. Creates a `Date` object from the input string.
2. Calculates the difference to the previous Monday:
   - If Sunday (day 0), subtract 6 days.
   - Otherwise, subtract `(dayOfWeek - 1)` days.
3. Sets the date and returns the ISO date string.

### Complexity
- **Time:** O(1)
- **Space:** O(1)

### Limitations
- Week starts on Monday (ISO standard). Sunday is considered the last day of the week.

---

## `getWeekEnd(d)`

### Parameters
| Parameter | Type     | Description                          |
|-----------|----------|--------------------------------------|
| `d`       | `string` | Date string in `YYYY-MM-DD` format. |

### Return Value
- **Type:** `string`
- **Description:** Date of the Sunday of the week containing the given date.

### Algorithm
1. Calls `getWeekStart(d)` to get the Monday of the week.
2. Adds 6 days to that Monday to get Sunday.
3. Returns the ISO date string.

### Complexity
- **Time:** O(1)
- **Space:** O(1)

### Limitations
- Relies on `getWeekStart`; same Monday-start week assumption.

---

## `getWeekDays(startDate)`

### Parameters
| Parameter   | Type     | Description                                |
|-------------|----------|--------------------------------------------|
| `startDate` | `string` | Starting date in `YYYY-MM-DD` format. |

### Return Value
- **Type:** `string[]`
- **Description:** Array of 7 consecutive date strings starting from `startDate`.

### Algorithm
1. Creates a cursor `Date` object from `startDate`.
2. Loops 7 times, each iteration:
   - Pushes the current cursor date as ISO string.
   - Increments the cursor by 1 day.
3. Returns the array of 7 date strings.

### Complexity
- **Time:** O(1) (fixed 7 iterations)
- **Space:** O(1) (fixed array of 7 elements)

### Limitations
- Always returns exactly 7 days; does not validate that `startDate` is a Monday.

---

## `addDays(d, n)`

### Parameters
| Parameter | Type     | Description                                    |
|-----------|----------|------------------------------------------------|
| `d`       | `string` | Date string in `YYYY-MM-DD` format.            |
| `n`       | `number` | Number of days to add (can be negative).       |

### Return Value
- **Type:** `string`
- **Description:** Resulting date string after adding `n` days.

### Algorithm
1. Creates a `Date` object from the input string.
2. Adds `n` days using `setDate(getDate() + n)`.
3. Returns the ISO date string.

### Complexity
- **Time:** O(1)
- **Space:** O(1)

### Limitations
- Handles month/year boundaries correctly via JavaScript's `Date` auto-correction.
- Negative values subtract days.

---

## `isToday(d)`

### Parameters
| Parameter | Type     | Description                          |
|-----------|----------|--------------------------------------|
| `d`       | `string` | Date string in `YYYY-MM-DD` format. |

### Return Value
- **Type:** `boolean`
- **Description:** `true` if the date string matches today's date.

### Algorithm
Compares the input string directly with the result of `today()`.

### Complexity
- **Time:** O(1)
- **Space:** O(1)

### Limitations
- String comparison only; timezone differences may cause edge cases near midnight.

---

## `dayName(d)`

### Parameters
| Parameter | Type     | Description                          |
|-----------|----------|--------------------------------------|
| `d`       | `string` | Date string in `YYYY-MM-DD` format. |

### Return Value
- **Type:** `string`
- **Description:** Russian weekday abbreviation (e.g., `"пн"`, `"вт"`).

### Algorithm
1. Creates a `Date` object from the input string.
2. Gets the day of week (0-6) using `getDay()`.
3. Maps to a hardcoded array of Russian weekday abbreviations.

### Complexity
- **Time:** O(1)
- **Space:** O(1)

### Limitations
- Returns abbreviations only (2 characters).
- Sunday is index 0 (Russian: `"вс"`).

---

## `dayOfMonth(d)`

### Parameters
| Parameter | Type     | Description                          |
|-----------|----------|--------------------------------------|
| `d`       | `string` | Date string in `YYYY-MM-DD` format. |

### Return Value
- **Type:** `number`
- **Description:** Day of month as an integer (1-31).

### Algorithm
1. Splits the input string by `-`.
2. Parses the third element (day) as an integer.
3. Returns the integer value.

### Complexity
- **Time:** O(1)
- **Space:** O(1)

### Limitations
- No validation that the day is within valid range for the given month/year.
