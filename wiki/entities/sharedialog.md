---
title: ShareDialog
created: 2026-06-19
updated: 2026-06-19
type: entity
tags:
  - component
  - exported
source: c:\dev\timebox\src\components\ShareDialog.tsx
confidence: high
hash: 4c48d330a13f5148
---

# ShareDialog

> Source: `c:\dev\timebox\src\components\ShareDialog.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[Button]]
- [[Clipboard]]
- [[Button]]
- [[Button]]
- [[Share2]]
- [[Button]]
- [[RefreshCw]]
- [[Button]]

> Source: `c:\dev\timebox\src\components\ShareDialog.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[Button]]
- [[Clipboard]]
- [[Button]]
- [[Button]]
- [[Share2]]
- [[Button]]
- [[RefreshCw]]
- [[Button]]

> Source: `src\components\ShareDialog.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[Button]]
- [[Clipboard]]
- [[Button]]
- [[Button]]
- [[Share2]]
- [[Button]]
- [[RefreshCw]]
- [[Button]]

> Source: `c:\dev\timebox\src\components\ShareDialog.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[Button]]
- [[Clipboard]]
- [[Button]]
- [[Button]]
- [[Share2]]
- [[Button]]
- [[RefreshCw]]
- [[Button]]

> Source: `c:\dev\timebox\src\components\ShareDialog.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[Button]]
- [[Clipboard]]
- [[Button]]
- [[Button]]
- [[Share2]]
- [[Button]]
- [[RefreshCw]]
- [[Button]]

> Source: `src\components\ShareDialog.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[Button]]
- [[Clipboard]]
- [[Button]]
- [[Button]]
- [[Share2]]
- [[Button]]
- [[RefreshCw]]
- [[Button]]

> Source: `src\components\ShareDialog.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[Button]]
- [[Clipboard]]
- [[Button]]
- [[Button]]
- [[Share2]]
- [[Button]]
- [[RefreshCw]]
- [[Button]]

> Source: `c:\dev\timebox\src\components\ShareDialog.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[Button]]
- [[Clipboard]]
- [[Button]]
- [[Button]]
- [[Share2]]
- [[Button]]
- [[RefreshCw]]
- [[Button]]

## Description

A modal dialog component that allows users to select a date range, generate a formatted text summary of free appointment slots, and copy or share that summary via the native Share API or clipboard.

## Props

| Prop | Type | Description |
|------|------|-------------|
| `slots` | `Slot[]` | Array of all available slots to filter and summarize |
| `onClose` | `() => void` | Callback invoked when the user clicks the overlay or close button |

## State

| State Variable | Initial Value | Description |
|----------------|---------------|-------------|
| `fromDate` | `today()` | Start date for the date range filter |
| `toDate` | `addDays(today(), 7)` | End date for the date range filter (defaults to 7 days from today) |
| `shareText` | `''` | Generated text summary of free slots |
| `copied` | `false` | Boolean flag indicating whether the text was recently copied to clipboard |

## Event Handlers

| Handler | Description |
|---------|-------------|
| `generateText` | Iterates through free slots, groups them by date, and builds a formatted text string with date headers, time ranges, and remaining capacity information. Sets the result to `shareText`. |
| `copyText` | Copies the current `shareText` to the clipboard using `navigator.clipboard.writeText()`, sets `copied` to `true`, and resets it to `false` after 2 seconds. |
| `handleShare` | Attempts to use the native Web Share API (`navigator.share`) if available; otherwise falls back to `copyText`. |

## Logic

1. **Date Range Filtering**: The component uses `getFreeSlots(slots, fromDate, toDate)` to filter the provided slots based on the user-selected date range.
2. **Two-Phase UI**: The dialog displays either a slot preview with a "Generate text" button (when `shareText` is empty) or the generated text with copy/share actions (when `shareText` is populated).
3. **Text Generation**: Groups free slots by date, formats each slot with time range and remaining capacity (for multi-capacity slots), and handles the empty state with a fallback message.
4. **Share Fallback**: Checks for `navigator.share` support; if unavailable, silently falls back to clipboard copy.

## Key Features

- **Date Range Selection**: Users can pick custom start and end dates via native date inputs
- **Slot Preview**: Shows a scrollable list of free slots with remaining capacity before generating text
- **Formatted Text Generation**: Produces a human-readable, date-grouped summary with Russian localization for capacity labels
- **Clipboard Copy**: One-click copy with visual feedback (temporary "✓ Copied!" state)
- **Native Share Integration**: Uses the Web Share API when available for mobile sharing
- **Regenerate Capability**: Users can reset the generated text and start over
- **Empty State Handling**: Displays appropriate messages when no free slots exist in the selected range
- **Modal Behavior**: Clicking the overlay background closes the dialog; inner clicks are stopped from propagation
