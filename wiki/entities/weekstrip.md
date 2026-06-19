---
title: WeekStrip
created: 2026-06-19
updated: 2026-06-19
type: entity
tags:
  - component
  - exported
source: c:\dev\timebox\src\components\WeekStrip.tsx
confidence: high
hash: 1d8ca015a7d78d91
---

# WeekStrip

> Source: `c:\dev\timebox\src\components\WeekStrip.tsx`

## Used in

- [[OrganizerView]]

> Source: `c:\dev\timebox\src\components\WeekStrip.tsx`

## Used in

- [[OrganizerView]]

> Source: `src\components\WeekStrip.tsx`

## Used in

- [[OrganizerView]]

> Source: `c:\dev\timebox\src\components\WeekStrip.tsx`

## Used in

- [[OrganizerView]]

> Source: `c:\dev\timebox\src\components\WeekStrip.tsx`

## Used in

- [[OrganizerView]]

> Source: `src\components\WeekStrip.tsx`

## Used in

- [[OrganizerView]]

> Source: `src\components\WeekStrip.tsx`

## Used in

- [[OrganizerView]]

> Source: `c:\dev\timebox\src\components\WeekStrip.tsx`

## Used in

- [[OrganizerView]]

## Description

The `WeekStrip` component displays a horizontal strip of days for a given week, allowing users to select a date, navigate between weeks, and swipe to change weeks via touch interactions. It integrates with a calendar system that provides slot data per date.

## Props

| Prop | Type | Description |
|------|------|-------------|
| `weekStart` | `string` | ISO date string representing the first day of the displayed week |
| `selectedDate` | `string` | ISO date string of the currently selected date |
| `slotsByDate` | `Record` | Object mapping date strings to slot data for each day |
| `onSelectDate` | `function` | Callback invoked when a day is clicked; receives the date string |
| `onPrevWeek` | `function` | Callback invoked to navigate to the previous week |
| `onNextWeek` | `function` | Callback invoked to navigate to the next week |

## State

No `useState` hooks are present in this component.

## Effects

No `useEffect` hooks are present in this component.

## Event Handlers

| Handler | Trigger | Description |
|---------|---------|-------------|
| `handleTouchStart` | Touch start event on the strip container | Records the initial touch position for swipe detection |
| `handleTouchEnd` | Touch end event on the strip container | Calculates swipe direction based on touch start position and triggers `onPrevWeek` or `onNextWeek` if the swipe distance exceeds a threshold |

## Logic

- The component renders a row of day cells for the current week, derived from the `weekStart` prop.
- Each day cell displays the day name and date, and is visually highlighted if it matches the `selectedDate`.
- Slot availability from `slotsByDate` is indicated per day (e.g., via styling or badges).
- Clicking a day cell calls `onSelectDate` with that day's date string.
- Navigation buttons (`<button>`) trigger `onPrevWeek` and `onNextWeek` for week-level navigation.
- Touch swipe gestures on the strip trigger week navigation: left swipe calls `onNextWeek`, right swipe calls `onPrevWeek`.

## Key Features

- **Touch-enabled swipe navigation** for intuitive week switching on mobile devices
- **Visual date selection** with clear indication of the currently selected day
- **Slot availability display** per day, enabling users to see available time slots at a glance
- **Week-level navigation** via both buttons and swipe gestures
- **Responsive day strip** layout using `<div>`, `<button>`, and `<span>` elements
