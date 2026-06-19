---
title: DiaryView
created: 2026-06-19
updated: 2026-06-19
type: entity
tags:
  - component
  - exported
source: c:\dev\timebox\src\components\DiaryView.tsx
confidence: high
hash: 9eb02303a17d13b3
---

# DiaryView

> Source: `c:\dev\timebox\src\components\DiaryView.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[BookOpen]]
- [[Button]]
- [[Check]]
- [[Button]]
- [[Clock]]
- [[Button]]
- [[X]]
- [[Button]]
- [[Button]]
- [[Button]]
- [[Pencil]]
- [[Plus]]

> Source: `c:\dev\timebox\src\components\DiaryView.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[BookOpen]]
- [[Button]]
- [[Check]]
- [[Button]]
- [[Clock]]
- [[Button]]
- [[X]]
- [[Button]]
- [[Button]]
- [[Button]]
- [[Pencil]]
- [[Plus]]

> Source: `src\components\DiaryView.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[BookOpen]]
- [[Button]]
- [[Check]]
- [[Button]]
- [[Clock]]
- [[Button]]
- [[X]]
- [[Button]]
- [[Button]]
- [[Button]]
- [[Pencil]]
- [[Plus]]

> Source: `c:\dev\timebox\src\components\DiaryView.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[BookOpen]]
- [[Button]]
- [[Check]]
- [[Button]]
- [[Clock]]
- [[Button]]
- [[X]]
- [[Button]]
- [[Button]]
- [[Button]]
- [[Pencil]]
- [[Plus]]

> Source: `c:\dev\timebox\src\components\DiaryView.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[BookOpen]]
- [[Button]]
- [[Check]]
- [[Button]]
- [[Clock]]
- [[Button]]
- [[X]]
- [[Button]]
- [[Button]]
- [[Button]]
- [[Pencil]]
- [[Plus]]

> Source: `src\components\DiaryView.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[BookOpen]]
- [[Button]]
- [[Check]]
- [[Button]]
- [[Clock]]
- [[Button]]
- [[X]]
- [[Button]]
- [[Button]]
- [[Button]]
- [[Pencil]]
- [[Plus]]

> Source: `src\components\DiaryView.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[BookOpen]]
- [[Button]]
- [[Check]]
- [[Button]]
- [[Clock]]
- [[Button]]
- [[X]]
- [[Button]]
- [[Button]]
- [[Button]]
- [[Pencil]]
- [[Plus]]

> Source: `c:\dev\timebox\src\components\DiaryView.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[BookOpen]]
- [[Button]]
- [[Check]]
- [[Button]]
- [[Clock]]
- [[Button]]
- [[X]]
- [[Button]]
- [[Button]]
- [[Button]]
- [[Pencil]]
- [[Plus]]

## Description

The `DiaryView` component displays a chronological list of past and future lesson slots with attendance tracking and notes editing capabilities. It provides an interface for managing student attendance (present, late, no-show) and adding/editing lesson notes.

## Props

| Prop | Type | Description |
|------|------|-------------|
| `slots` | `Slot[]` | Array of time slots to display in the diary view |
| `onChange` | `(data: OrganizerData) => void` (optional) | Callback invoked when attendance or notes data is modified |

## State

| State Variable | Type | Description |
|---------------|------|-------------|
| `editingNotes` | `string \| null` | ID of the slot currently being edited for notes, or `null` if no notes are being edited |
| `notesText` | `string` | Current text content of the notes textarea being edited |

## Event Handlers

### `setAttendance(slotId, bookingIdx, value)`
Updates the attendance status for a specific booking within a slot. Reads current data from `localStorage`, modifies the attendance field of the specified booking, and triggers the `onChange` callback with the updated data.

**Parameters:**
- `slotId` — ID of the slot containing the booking
- `bookingIdx` — Index of the booking within the slot's bookings array
- `value` — New attendance status: `'present'`, `'late'`, or `'no-show'`

### `saveNotes(slotId)`
Saves the current `notesText` value to the specified slot. Reads current data from `localStorage`, updates the notes field, triggers the `onChange` callback, and resets the editing state.

**Parameters:**
- `slotId` — ID of the slot to save notes for

## Logic

1. **Slot Filtering and Sorting**: The component separates slots into two groups:
   - **Past slots**: Slots with a date before today, or slots on today's date that have bookings. Sorted in descending chronological order (most recent first).
   - **Future slots**: Slots with a date after today that have notes. Sorted in ascending chronological order.
   - Both groups are concatenated into `allSlots` for rendering.

2. **Empty State**: If no slots match the filtering criteria, a placeholder message with a `BookOpen` icon is displayed.

3. **Attendance Buttons**: For each confirmed booking in a slot, three attendance buttons are rendered (present, late, no-show). The active button uses the `'primary'` variant, while inactive buttons use `'outline'`.

4. **Notes Editing**: Clicking the notes text or the edit/add button opens a textarea for editing. The save action persists the notes to `localStorage` via the `onChange` callback. Cancel resets the editing state without saving.

## Key Features

- **Dual-mode display**: Shows past slots with attendance tracking and future slots with notes
- **Attendance tracking**: Three-state attendance buttons (present, late, no-show) with visual feedback
- **Inline notes editing**: Click-to-edit textarea with save/cancel controls
- **Persistent data**: All changes are saved to `localStorage` and propagated via the `onChange` callback
- **Cancelled slot indication**: Displays "Отменено" (Cancelled) label for cancelled slots
- **Empty state handling**: Shows a friendly message when no diary entries exist
