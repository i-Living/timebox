---
title: SlotEditor
created: 2026-06-19
updated: 2026-06-19
type: entity
tags:
  - component
  - exported
source: c:\dev\timebox\src\components\SlotEditor.tsx
confidence: high
hash: 61e26df219024020
---

# SlotEditor

> Source: `c:\dev\timebox\src\components\SlotEditor.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[Button]]
- [[X]]
- [[Button]]
- [[Check]]
- [[Button]]
- [[Button]]
- [[Button]]
- [[Button]]
- [[Button]]

> Source: `c:\dev\timebox\src\components\SlotEditor.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[Button]]
- [[X]]
- [[Button]]
- [[Check]]
- [[Button]]
- [[Button]]
- [[Button]]
- [[Button]]
- [[Button]]

> Source: `src\components\SlotEditor.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[Button]]
- [[X]]
- [[Button]]
- [[Check]]
- [[Button]]
- [[Button]]
- [[Button]]
- [[Button]]
- [[Button]]

> Source: `c:\dev\timebox\src\components\SlotEditor.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[Button]]
- [[X]]
- [[Button]]
- [[Check]]
- [[Button]]
- [[Button]]
- [[Button]]
- [[Button]]
- [[Button]]

> Source: `c:\dev\timebox\src\components\SlotEditor.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[Button]]
- [[X]]
- [[Button]]
- [[Check]]
- [[Button]]
- [[Button]]
- [[Button]]
- [[Button]]
- [[Button]]

> Source: `src\components\SlotEditor.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[Button]]
- [[X]]
- [[Button]]
- [[Check]]
- [[Button]]
- [[Button]]
- [[Button]]
- [[Button]]
- [[Button]]

> Source: `src\components\SlotEditor.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[Button]]
- [[X]]
- [[Button]]
- [[Check]]
- [[Button]]
- [[Button]]
- [[Button]]
- [[Button]]
- [[Button]]

> Source: `c:\dev\timebox\src\components\SlotEditor.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[Button]]
- [[X]]
- [[Button]]
- [[Check]]
- [[Button]]
- [[Button]]
- [[Button]]
- [[Button]]
- [[Button]]

## Description

A modal form component for creating and editing appointment time slots. Supports recurring slots, client management with autocomplete, and booking tracking. Used for scheduling appointments in a calendar-like interface.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `slot` | `Slot` (optional) | `undefined` | Existing slot data for editing; `undefined` creates a new slot |
| `defaultDuration` | `number` (optional) | — | Default slot duration in minutes; used to auto-calculate end time |
| `knownClients` | `string[]` (optional) | — | Array of client names for autocomplete suggestions |
| `onSave` | `(slot: Slot) => void` | — | Callback invoked with the saved/updated slot data |
| `onDelete` | `(id: string) => void` (optional) | — | Callback invoked with slot ID when deleting an existing slot |
| `onClose` | `() => void` | — | Callback to close the modal without saving |

## State

| State Variable | Type | Initial Value | Description |
|----------------|------|---------------|-------------|
| `date` | `string` | `slot?.date \|\| today()` | Selected date for the slot |
| `start` | `string` | `slot?.start \|\| '09:00'` | Start time in HH:MM format |
| `end` | `string` | `slot?.end \|\| defaultEnd` | End time in HH:MM format |
| `capacity` | `number` | `slot?.capacity \|\| 1` | Maximum number of clients for the slot |
| `repeat` | `boolean` | `slot?.repeat !== undefined` | Whether the slot repeats |
| `repeatFreq` | `'daily' \| 'weekly' \| 'biweekly'` | `slot?.repeat?.freq \|\| 'weekly'` | Frequency of repetition |
| `repeatUntil` | `string` | `slot?.repeat?.until \|\| ''` | End date for repetition (inclusive) |
| `notes` | `string` | `slot?.notes \|\| ''` | Notes or diary entry for the slot |
| `bookings` | `Booking[]` | `slot?.bookings \|\| []` | Array of client bookings |
| `showAddClient` | `boolean` | `false` | Toggle for the add-client form |
| `clientName` | `string` | `''` | Input value for new client name |
| `clientContact` | `string` | `''` | Input value for new client contact |
| `showSuggestions` | `boolean` | `false` | Toggle for autocomplete dropdown visibility |

## Effects

| Effect | Dependencies | Description |
|--------|--------------|-------------|
| Auto-adjust end time | `[start, defaultDuration, end]` | When start time changes and end time is less than or equal to start, recalculates end time using `defaultDuration` (or 60 minutes fallback) |
| Keyboard escape handler | `[onClose]` | Registers a `keydown` listener that calls `onClose` when Escape key is pressed; cleans up listener on unmount |

## Event Handlers

| Handler | Description |
|---------|-------------|
| `handleSave` | Constructs a `Slot` object from current state (generates new ID if creating), calls `onSave`, then calls `onClose` |
| `handleDelete` | Calls `onDelete` with the existing slot's ID, then calls `onClose` |
| `handleAddClient` | Creates a new `Booking` from `clientName` and `clientContact`, appends to `bookings` array, resets client input fields, and hides the add-client form |

## Logic

1. **Initialization**: When editing an existing slot (`slot` prop provided), all form fields are pre-populated from the slot data. When creating new, defaults are applied (today's date, 09:00 start, end calculated from `defaultDuration`).
2. **End time auto-correction**: If the user sets a start time that equals or exceeds the current end time, the end time is automatically recalculated based on `defaultDuration` (or 60 minutes).
3. **Client autocomplete**: Filters `knownClients` array based on `clientName` input. Suggestions appear when input has focus and matches exist. Selection via mouse or keyboard is supported.
4. **Booking management**: Only confirmed bookings are displayed. Each booking shows the client name and optional contact, with a remove button. New bookings are added with `confirmed` status and current timestamp.
5. **Recurring slots**: When repeat is enabled, the user selects frequency (daily/weekly/biweekly) and an end date. The repeat configuration is stored in the slot's `repeat` property.
6. **Modal behavior**: Clicking the overlay calls `onClose`. The Escape key also triggers close. Inner click events are stopped from propagating to prevent accidental closure.

## Key Features

- **Dual mode**: Supports both creation and editing of slots based on presence of `slot` prop
- **Recurring slots**: Configurable daily, weekly, or biweekly repetition with end date
- **Client autocomplete**: Real-time filtering of known clients with dropdown suggestions
- **Inline client management**: Add and remove clients directly within the editor
- **Automatic end time adjustment**: Prevents invalid time ranges by recalculating end time when start changes
- **Keyboard shortcuts**: Escape to close modal, Enter to confirm client addition
- **Capacity control**: Numeric input for slot capacity (1 = individual session)
- **Notes field**: Optional diary/notes textarea for session planning
