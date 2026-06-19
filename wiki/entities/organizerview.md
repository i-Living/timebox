---
title: OrganizerView
created: 2026-06-19
updated: 2026-06-19
type: entity
tags:
  - component
  - exported
source: c:\dev\timebox\src\components\OrganizerView.tsx
confidence: high
hash: 5d9c2d791aa56f81
---

# OrganizerView

> Source: `c:\dev\timebox\src\components\OrganizerView.tsx`

## Used in

- [[App]]

## Uses

- [[Button]]
- [[ChevronLeft]]
- [[Button]]
- [[Button]]
- [[ChevronRight]]
- [[WeekStrip]]
- [[Calendar]]
- [[SlotCard]]
- [[Button]]
- [[Button]]
- [[ExternalLink]]
- [[DiaryView]]
- [[ClientsView]]
- [[SettingsView]]
- [[BottomNav]]
- [[SlotEditor]]
- [[ShareDialog]]

> Source: `c:\dev\timebox\src\components\OrganizerView.tsx`

## Used in

- [[App]]

## Uses

- [[Button]]
- [[ChevronLeft]]
- [[Button]]
- [[Button]]
- [[ChevronRight]]
- [[WeekStrip]]
- [[Calendar]]
- [[SlotCard]]
- [[Button]]
- [[Button]]
- [[ExternalLink]]
- [[DiaryView]]
- [[ClientsView]]
- [[SettingsView]]
- [[BottomNav]]
- [[SlotEditor]]
- [[ShareDialog]]

> Source: `src\components\OrganizerView.tsx`

## Used in

- [[App]]

## Uses

- [[Button]]
- [[ChevronLeft]]
- [[Button]]
- [[Button]]
- [[ChevronRight]]
- [[WeekStrip]]
- [[Calendar]]
- [[SlotCard]]
- [[Button]]
- [[Button]]
- [[ExternalLink]]
- [[DiaryView]]
- [[ClientsView]]
- [[SettingsView]]
- [[BottomNav]]
- [[SlotEditor]]
- [[ShareDialog]]

> Source: `c:\dev\timebox\src\components\OrganizerView.tsx`

## Used in

- [[App]]

## Uses

- [[Button]]
- [[ChevronLeft]]
- [[Button]]
- [[Button]]
- [[ChevronRight]]
- [[WeekStrip]]
- [[Calendar]]
- [[SlotCard]]
- [[Button]]
- [[Button]]
- [[ExternalLink]]
- [[DiaryView]]
- [[ClientsView]]
- [[SettingsView]]
- [[BottomNav]]
- [[SlotEditor]]
- [[ShareDialog]]

> Source: `c:\dev\timebox\src\components\OrganizerView.tsx`

## Used in

- [[App]]

## Uses

- [[Button]]
- [[ChevronLeft]]
- [[Button]]
- [[Button]]
- [[ChevronRight]]
- [[WeekStrip]]
- [[Calendar]]
- [[SlotCard]]
- [[Button]]
- [[Button]]
- [[ExternalLink]]
- [[DiaryView]]
- [[ClientsView]]
- [[SettingsView]]
- [[BottomNav]]
- [[SlotEditor]]
- [[ShareDialog]]

> Source: `src\components\OrganizerView.tsx`

## Used in

- [[App]]

## Uses

- [[Button]]
- [[ChevronLeft]]
- [[Button]]
- [[Button]]
- [[ChevronRight]]
- [[WeekStrip]]
- [[Calendar]]
- [[SlotCard]]
- [[Button]]
- [[Button]]
- [[ExternalLink]]
- [[DiaryView]]
- [[ClientsView]]
- [[SettingsView]]
- [[BottomNav]]
- [[SlotEditor]]
- [[ShareDialog]]

> Source: `src\components\OrganizerView.tsx`

## Used in

- [[App]]

## Uses

- [[Button]]
- [[ChevronLeft]]
- [[Button]]
- [[Button]]
- [[ChevronRight]]
- [[WeekStrip]]
- [[Calendar]]
- [[SlotCard]]
- [[Button]]
- [[Button]]
- [[ExternalLink]]
- [[DiaryView]]
- [[ClientsView]]
- [[SettingsView]]
- [[BottomNav]]
- [[SlotEditor]]
- [[ShareDialog]]

> Source: `c:\dev\timebox\src\components\OrganizerView.tsx`

## Used in

- [[App]]

## Uses

- [[Button]]
- [[ChevronLeft]]
- [[Button]]
- [[Button]]
- [[ChevronRight]]
- [[WeekStrip]]
- [[Calendar]]
- [[SlotCard]]
- [[Button]]
- [[Button]]
- [[ExternalLink]]
- [[DiaryView]]
- [[ClientsView]]
- [[SettingsView]]
- [[BottomNav]]
- [[SlotEditor]]
- [[ShareDialog]]

## Description

Main organizer view that provides a full scheduling interface with calendar, diary, clients, and settings tabs. Manages slot CRUD operations, Google Calendar synchronization, week navigation, and share functionality.

## State

| State Variable | Type | Initial Value | Description |
|---|---|---|---|
| `data` | Object | `load()` | Application data loaded from persistent storage |
| `selectedDate` | string | `today()` | Currently selected date |
| `weekStart` | string | `getWeekStart(today())` | Start date of the currently displayed week |
| `showEditor` | boolean | `false` | Controls visibility of the SlotEditor modal |
| `editingSlot` | Slot \| undefined | `undefined` | Slot being edited, or undefined for new slot creation |
| `showShare` | boolean | `false` | Controls visibility of the ShareDialog modal |
| `tab` | 'calendar' \| 'clients' \| 'diary' \| 'settings' | `'calendar'` | Currently active tab |
| `toast` | string | `''` | Toast notification message |
| `undoSlot` | Slot \| null | `null` | Recently deleted slot available for undo |

## Effects

| Effect | Dependencies | Description |
|---|---|---|
| `useEffect(() => { ... }, [])` | None | Handles Share Target API — reads shared text/URL from query parameters on mount and shows a toast notification |
| `useEffect(() => { save(data); }, [data])` | `[data]` | Persists data to storage whenever it changes |

## Event Handlers

| Handler | Parameters | Description |
|---|---|---|
| `showToast` | `msg: string` | Displays a toast message that auto-hides after 2 seconds |
| `syncSlotToGcal` | `slot: Slot, clientId: string, organizerName: string, knownEventIds: Set<string>` | Syncs a slot to Google Calendar — creates, updates, or adopts orphan events. Returns updated slot with gcalEventId or null |
| `handleSaveSlot` | `slot: Slot` | Saves a slot (new or existing). Syncs to Google Calendar first, then saves locally with the updated gcalEventId |
| `handleDeleteSlot` | `id: string` | Deletes a slot. Supports recurring slot override cancellation by creating a cancelled override for specific dates. Removes Google Calendar event asynchronously |
| `handleUndoDelete` | None | Restores the last deleted slot and recreates its Google Calendar event |
| `handleCopySlot` | `slot: Slot` | Copies a slot to the next day with a new ID, clearing bookings and gcalEventId |
| `handleSlotsChanged` | `changedSlots: Slot[]` | Processes batch slot changes from child components, syncing each to Google Calendar |
| `goToday` | None | Resets selected date and week start to today |
| `handlePrevWeek` | None | Moves week start back by 7 days |
| `handleNextWeek` | None | Moves week start forward by 7 days |

## Logic

1. **Data Loading**: Initializes state by loading persisted data on mount
2. **Week Expansion**: Expands recurring slots for the current week to calculate slot counts per date for the WeekStrip component
3. **Day Filtering**: Filters slots for the selected date to display in the slot list
4. **Google Calendar Sync**: Integrates with Google Calendar API — creates, updates, and deletes events. Handles orphan event adoption by finding unclaimed events at matching times
5. **Recurring Slot Overrides**: Supports cancelling individual instances of recurring slots by creating override slots with `status: 'cancelled'`
6. **Undo Deletion**: Stores the last deleted slot for 4 seconds, allowing restoration with Google Calendar event recreation
7. **Tab Navigation**: Renders different views (Calendar, Diary, Clients, Settings) based on the active tab
8. **Client Autocomplete**: Collects all unique confirmed client names for autocomplete in the SlotEditor

## Key Features

- **Multi-tab Interface**: Calendar, diary, clients, and settings views with bottom navigation
- **Week Navigation**: Previous/next week buttons and "Today" shortcut
- **Slot CRUD**: Create, read, update, and delete time slots with visual indicators on the week strip
- **Google Calendar Sync**: Bidirectional synchronization with Google Calendar events
- **Recurring Slot Support**: Recurring slots with per-instance cancellation overrides
- **Undo Deletion**: 4-second undo window for deleted slots
- **Slot Copying**: One-click copy of slots to the next day
- **Share Functionality**: Share dialog for exporting slot availability
- **Share Target API**: Handles incoming shared text from other applications
- **Toast Notifications**: Non-intrusive feedback for user actions
- **Persistent Storage**: Automatic data saving on every change
