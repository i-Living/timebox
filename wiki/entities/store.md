---
title: store
created: 2026-06-19
updated: 2026-06-19
type: entity
tags:
  - component
  - internal
source: c:\dev\timebox\src\store.ts
confidence: low
hash: df5ba5c970d78b41
---

# store

> Source: `c:\dev\timebox\src\store.ts`


> Source: `c:\dev\timebox\src\store.ts`


> Source: `src\store.ts`


> Source: `c:\dev\timebox\src\store.ts`


> Source: `c:\dev\timebox\src\store.ts`


> Source: `src\store.ts`


> Source: `src\store.ts`


> Source: `c:\dev\timebox\src\store.ts`


> Source: `c:\dev\timebox\src\store.ts`


> Source: `c:\dev\timebox\src\store.ts`


> Source: `c:\dev\timebox\src\store.ts`


> Source: `c:\dev\timebox\src\store.ts`


## Description

This module provides utility functions for managing timebox scheduling data in localStorage. It supports CRUD operations for slots and bookings, recurring slot expansion with override handling, and data persistence. The module works with `OrganizerData`, `Slot`, and `Booking` types.

## Functions

### `load()`

#### Description
Loads organizer data from localStorage. Falls back to default values if data is missing, corrupted, or an error occurs during retrieval.

#### Return Value
- **Type:** `OrganizerData`
- **Description:** Merged data object combining defaults with stored values. Defaults include: version 1, empty organizer name, browser timezone, empty slots array, 60-minute default slot duration, working hours 08:00–20:00, and working days Monday–Friday.

#### Complexity
- **Time:** O(1)
- **Space:** O(n) where n is the size of the stored data

#### Limitations
- Silently falls back to defaults on any error, potentially hiding data corruption issues.
- No validation of stored data structure against the `OrganizerData` type.

---

### `save(d)`

#### Description
Persists organizer data to localStorage as a JSON string.

#### Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `d` | `OrganizerData` | The organizer data object to save |

#### Return Value
- **Type:** `void`

#### Complexity
- **Time:** O(n) where n is the size of the data object
- **Space:** O(n) for the JSON string representation

#### Limitations
- No error handling for localStorage quota exceeded or storage unavailability.
- Overwrites existing data without merging.

---

### `expandSlots(slots, from, to)`

#### Description
Expands recurring slot templates into concrete instances for a specified date range. Handles override slots (individual instances that modify a recurring slot) and respects cancellation status.

#### Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `slots` | `Slot[]` | All slots, including recurring templates and override instances |
| `from` | `string` | Start date in YYYY-MM-DD format |
| `to` | `string` | End date in YYYY-MM-DD format |

#### Return Value
- **Type:** `Slot[]`
- **Description:** Expanded and sorted array of slot instances, sorted by date then start time.

#### Algorithm
1. Iterate through all slots, skipping cancelled slots.
2. For non-recurring slots: include if within date range and not a recurring override (overrides are handled during expansion).
3. For recurring slots:
   - Determine the end date (minimum of `repeat.until` and `to`).
   - Calculate frequency in days: daily=1, weekly=7, biweekly=14.
   - Iterate from start date to end date, generating instance IDs as `{baseId}_{YYYY-MM-DD}`.
   - For each generated date, check if an override slot exists with the same ID; if so, use the override; otherwise, create a copy with `repeat` set to `undefined`.
4. Sort results by date (ascending), then by start time (ascending).

#### Complexity
- **Time:** O(n × m) where n is the number of slots and m is the number of recurrence instances
- **Space:** O(n × m) for the expanded result array

#### Limitations
- Only supports daily, weekly, and biweekly frequencies.
- Does not handle exceptions for specific dates within a recurring series (only full-day overrides).
- Override detection relies on ID pattern matching (`{baseId}_{YYYY-MM-DD}`), which may conflict with manually created slots using similar ID patterns.

---

### `addSlot(slots, slot)`

#### Description
Adds a new slot to the slots array.

#### Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `slots` | `Slot[]` | Current array of slots |
| `slot` | `Slot` | New slot to add |

#### Return Value
- **Type:** `Slot[]`
- **Description:** New array with the slot appended.

#### Complexity
- **Time:** O(1) (spread operator creates a shallow copy)
- **Space:** O(n) where n is the new array length

#### Limitations
- No duplicate ID checking.
- No validation of slot data integrity.

---

### `updateSlot(slots, updated)`

#### Description
Updates an existing slot by matching its ID.

#### Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `slots` | `Slot[]` | Current array of slots |
| `updated` | `Slot` | Slot object with updated data (must contain the ID of the slot to update) |

#### Return Value
- **Type:** `Slot[]`
- **Description:** New array with the matching slot replaced, or unchanged if no match found.

#### Complexity
- **Time:** O(n)
- **Space:** O(n)

#### Limitations
- No error or warning if the slot ID does not exist in the array.

---

### `deleteSlot(slots, id)`

#### Description
Deletes a slot by its ID.

#### Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `slots` | `Slot[]` | Current array of slots |
| `id` | `string` | ID of the slot to delete |

#### Return Value
- **Type:** `Slot[]`
- **Description:** New array with the matching slot removed.

#### Complexity
- **Time:** O(n)
- **Space:** O(n)

#### Limitations
- Does not handle cascading deletion of related override slots.

---

### `addBooking(slots, slotId, booking)`

#### Description
Adds a booking to a specific slot identified by its ID.

#### Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `slots` | `Slot[]` | Current array of slots |
| `slotId` | `string` | ID of the target slot |
| `booking` | `Booking` | Booking object to add |

#### Return Value
- **Type:** `Slot[]`
- **Description:** New array with the booking appended to the matching slot's bookings array.

#### Complexity
- **Time:** O(n)
- **Space:** O(n)

#### Limitations
- No capacity validation (does not check if slot is already full).
- No duplicate booking detection.
- No validation of booking data.

---

### `confirmBooking(slots, slotId, bookingIdx)`

#### Description
Confirms a booking at a specific index within a slot by setting its status to `'confirmed'`.

#### Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `slots` | `Slot[]` | Current array of slots |
| `slotId` | `string` | ID of the slot containing the booking |
| `bookingIdx` | `number` | Index of the booking to confirm |

#### Return Value
- **Type:** `Slot[]`
- **Description:** New array with the booking status updated.

#### Complexity
- **Time:** O(n + m) where n is the number of slots and m is the number of bookings in the target slot
- **Space:** O(n)

#### Limitations
- No bounds checking on `bookingIdx`; out-of-range index will leave the array unchanged.
- Does not prevent confirming an already confirmed or cancelled booking.

---

### `cancelBooking(slots, slotId, bookingIdx)`

#### Description
Cancels a booking at a specific index within a slot by setting its status to `'cancelled'`.

#### Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `slots` | `Slot[]` | Current array of slots |
| `slotId` | `string` | ID of the slot containing the booking |
| `bookingIdx` | `number` | Index of the booking to cancel |

#### Return Value
- **Type:** `Slot[]`
- **Description:** New array with the booking status updated.

#### Complexity
- **Time:** O(n + m)
- **Space:** O(n)

#### Limitations
- Same limitations as `confirmBooking` regarding bounds checking and status validation.

---

### `getFreeSlots(slots, from, to)`

#### Description
Returns slots with available capacity (not fully booked) within a date range. Expands recurring slots before filtering.

#### Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `slots` | `Slot[]` | All slots (including recurring templates) |
| `from` | `string` | Start date in YYYY-MM-DD format |
| `to` | `string` | End date in YYYY-MM-DD format |

#### Return Value
- **Type:** `Slot[]`
- **Description:** Expanded slots where the number of confirmed bookings is less than the slot's capacity.

#### Algorithm
1. Call `expandSlots(slots, from, to)` to get all concrete instances.
2. Filter the expanded slots: keep only those where `confirmed bookings count < capacity`.

#### Complexity
- **Time:** O(n × m) (dominated by `expandSlots`)
- **Space:** O(n × m)

#### Limitations
- Does not account for pending (unconfirmed) bookings when calculating availability.
- Capacity is compared against confirmed bookings only.

---

### `getBookedCount(slot)`

#### Description
Counts the number of confirmed bookings for a given slot.

#### Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `slot` | `Slot` | The slot to check |

#### Return Value
- **Type:** `number`
- **Description:** Count of bookings with status `'confirmed'`.

#### Complexity
- **Time:** O(m) where m is the number of bookings in the slot
- **Space:** O(1)

#### Limitations
- Only counts confirmed bookings; pending and cancelled bookings are ignored.
