---
title: ClientsView
created: 2026-06-19
updated: 2026-06-19
type: entity
tags:
  - component
  - exported
source: c:\dev\timebox\src\components\ClientsView.tsx
confidence: high
hash: 926537dd81bfeb3a
---

# ClientsView

> Source: `c:\dev\timebox\src\components\ClientsView.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[Users]]
- [[Button]]
- [[X]]
- [[Check]]
- [[Clock]]
- [[X]]

> Source: `c:\dev\timebox\src\components\ClientsView.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[Users]]
- [[Button]]
- [[X]]
- [[Check]]
- [[Clock]]
- [[X]]

> Source: `src\components\ClientsView.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[Users]]
- [[Button]]
- [[X]]
- [[Check]]
- [[Clock]]
- [[X]]

> Source: `c:\dev\timebox\src\components\ClientsView.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[Users]]
- [[Button]]
- [[X]]
- [[Check]]
- [[Clock]]
- [[X]]

> Source: `c:\dev\timebox\src\components\ClientsView.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[Users]]
- [[Button]]
- [[X]]
- [[Check]]
- [[Clock]]
- [[X]]

> Source: `src\components\ClientsView.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[Users]]
- [[Button]]
- [[X]]
- [[Check]]
- [[Clock]]
- [[X]]

> Source: `src\components\ClientsView.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[Users]]
- [[Button]]
- [[X]]
- [[Check]]
- [[Clock]]
- [[X]]

> Source: `c:\dev\timebox\src\components\ClientsView.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[Users]]
- [[Button]]
- [[X]]
- [[Check]]
- [[Clock]]
- [[X]]

## Description

Aggregates and displays client data from time slots with search, sort, and delete functionality. Provides undo support for client deletions and shows attendance statistics.

## Props

| Prop | Type | Description |
|------|------|-------------|
| `slots` | `Slot[]` | Array of time slots containing booking data to aggregate |
| `onChange` | `(data: OrganizerData) => void` | Callback fired when client data is modified (delete/undo) |
| `onSlotsChanged` | `(changedSlots: Slot[]) => void` | Callback fired with updated slots after modifications |

## State

| State Variable | Type | Initial Value | Description |
|----------------|------|---------------|-------------|
| `search` | `string` | `''` | Current search query for filtering clients by name or contact |
| `sortBy` | `'name' \| 'visits' \| 'last'` | `'visits'` | Current sort criterion for client list |
| `undoClient` | `{ name: string; slots: Slot[] } \| null` | `null` | Stores deleted client data for undo functionality (auto-clears after 4 seconds) |

## Event Handlers

| Handler | Description |
|---------|-------------|
| `handleDeleteClient(clientName)` | Removes all confirmed bookings for a client across all slots. Saves deleted data to `undoClient` state. Triggers `onChange` and `onSlotsChanged` callbacks. Auto-clears undo state after 4 seconds. |
| `handleUndoDelete()` | Restores previously deleted client bookings by merging them back into their original slots. Triggers `onChange` and `onSlotsChanged` callbacks. Clears undo state. |
| `sortClients(list)` | Sorts the client list based on current `sortBy` value: by name (alphabetical), by last visit date (descending), or by total visits (descending). |

## Logic

1. **Data Aggregation**: Iterates through all non-cancelled slots and confirmed bookings to build a `Map<string, ClientSummary>`. Each client is uniquely identified by lowercase name + contact combination. Tracks total visits, last visit date, and attendance breakdown (present/late/no-show).

2. **Filtering & Sorting**: Applies search filter (case-insensitive match on name or contact) and sorts the aggregated client list according to the selected criterion.

3. **Statistics Calculation**: Computes total number of unique clients and total confirmed lessons across all slots.

4. **Delete Flow**: Reads current data from `localStorage`, removes all confirmed bookings matching the client name, updates state via `onChange`, and stores deleted bookings for potential undo.

5. **Undo Flow**: Restores deleted bookings by merging them back into their original slots based on slot ID matching.

## Key Features

- **Client Aggregation**: Consolidates booking data from multiple slots into per-client summaries
- **Search & Sort**: Real-time filtering by name/contact with three sort modes (visits, name, last visit)
- **Attendance Tracking**: Displays present/late/no-show counts for each client
- **Delete with Undo**: Removes all client bookings with a 4-second undo window
- **Empty States**: Shows contextual messages when no clients exist or search yields no results
- **Statistics Header**: Displays total client count and total lesson count with Russian pluralization
- **LocalStorage Integration**: Reads/writes data through `localStorage` for persistence
