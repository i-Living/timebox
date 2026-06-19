---
title: gcal
created: 2026-06-19
updated: 2026-06-19
type: entity
tags:
  - component
  - internal
source: c:\dev\timebox\src\utils\gcal.ts
confidence: low
hash: 713fa8c45f7b0ba1
---

# gcal

> Source: `c:\dev\timebox\src\utils\gcal.ts`


> Source: `c:\dev\timebox\src\utils\gcal.ts`


> Source: `src\utils\gcal.ts`


> Source: `c:\dev\timebox\src\utils\gcal.ts`


> Source: `c:\dev\timebox\src\utils\gcal.ts`


> Source: `src\utils\gcal.ts`


> Source: `src\utils\gcal.ts`


> Source: `c:\dev\timebox\src\utils\gcal.ts`


> Source: `c:\dev\timebox\src\utils\gcal.ts`


> Source: `c:\dev\timebox\src\utils\gcal.ts`


> Source: `c:\dev\timebox\src\utils\gcal.ts`


> Source: `c:\dev\timebox\src\utils\gcal.ts`


## Description

This module provides Google Calendar integration via Google Identity Services (GIS) token client. It handles OAuth 2.0 token management and Calendar API operations for the TimeBox application. The module implements a client-side OAuth flow suitable for SPAs with no backend, using GIS to handle the auth-code to access_token exchange.

## Functions

### `loadGisScript()`

#### Description
Dynamically loads the Google Identity Services JavaScript library from Google's CDN. Ensures the GIS script is loaded only once and provides a promise-based interface for waiting until the library is ready.

#### Return Value
- **Type:** `Promise<void>`
- Resolves when the GIS library is fully loaded and `window.google.accounts.oauth2` is available.

#### Algorithm
1. Checks if GIS is already loaded (`gisLoaded` flag) — returns resolved promise if true
2. Checks if a load is already in progress (`gisLoadPromise`) — returns existing promise if true
3. Checks for an existing script tag with the same source URL
   - If found, polls every 50ms until `window.google.accounts.oauth2` becomes available
4. Creates a new `<script>` element with `async` and `defer` attributes
5. Appends it to `<head>` and resolves/rejects based on load/error events

#### Complexity
- **Time:** O(1) for cached loads, O(script download time) for initial load
- **Space:** O(1)

#### Limitations
- Requires browser environment with `document` API
- Polling approach for existing scripts may cause slight delay

---

### `getStoredToken()`

#### Description
Retrieves previously saved OAuth token data from localStorage.

#### Return Value
- **Type:** `TokenData | null`
- Returns `TokenData` object if valid token exists, `null` otherwise

#### Algorithm
1. Reads raw JSON string from localStorage using key `'gcal_token'`
2. Parses JSON into `TokenData` object
3. Validates presence of `access_token` and `expires_at` fields
4. Returns parsed object if valid, `null` on any error or missing data

#### Complexity
- **Time:** O(1)
- **Space:** O(1)

#### Limitations
- Depends on browser localStorage API
- No encryption — token stored in plain text

---

### `clearToken()`

#### Description
Removes the stored OAuth token from localStorage.

#### Return Value
- **Type:** `void`

#### Algorithm
- Calls `localStorage.removeItem('gcal_token')`

#### Complexity
- **Time:** O(1)
- **Space:** O(1)

---

### `requestAccessToken(clientId)`

#### Description
Opens the GIS OAuth popup and resolves with a fresh access token. On first call, this shows the Google consent screen. On subsequent calls (with consent already granted), the popup opens and closes silently.

#### Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `clientId` | `string` | Google OAuth client ID from Google Cloud Console |

#### Return Value
- **Type:** `Promise<TokenResponse>`
- Resolves with `{ access_token: string, expires_in: number }`

#### Algorithm
1. Verifies GIS library is loaded (`window.google.accounts.oauth2`)
2. Initializes a token client via `google.accounts.oauth2.initTokenClient()` with:
   - `client_id`: provided client ID
   - `scope`: calendar events and calendar readonly scopes
   - `callback`: handles successful response, extracts `access_token` and `expires_in`
   - `error_callback`: handles popup failures (blocked, closed by user, network errors)
3. Calls `tokenClient.requestAccessToken()` to trigger the OAuth popup

#### Complexity
- **Time:** O(1) setup, O(user interaction time) for popup
- **Space:** O(1)

#### Limitations
- Requires user interaction — popup may be blocked by browser
- No refresh token mechanism — relies on silent re-consent
- Error callback may not fire in all failure scenarios

---

### `connectGoogleCalendar(clientId)`

#### Description
Initiates the full Google Calendar connection flow, including OAuth consent and user email retrieval.

#### Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `clientId` | `string` | Google OAuth client ID |

#### Return Value
- **Type:** `Promise<TokenData>`
- Returns `{ access_token: string, expires_at: number, email?: string }`

#### Algorithm
1. Loads GIS script via `loadGisScript()`
2. Requests access token via `requestAccessToken(clientId)`
3. Calculates expiration timestamp: `Date.now() + expires_in * 1000`
4. Best-effort: fetches user email from Google UserInfo API (`https://www.googleapis.com/oauth2/v2/userinfo`)
5. Saves token data to localStorage via `saveToken()`
6. Returns complete `TokenData` object

#### Complexity
- **Time:** O(1) + network requests (GIS script, OAuth popup, UserInfo API)
- **Space:** O(1)

#### Limitations
- Email retrieval is best-effort — failures are silently ignored
- Requires popup to be allowed by browser

---

### `getAccessToken(clientId)`

#### Description
Retrieves a valid access token, automatically refreshing if the stored token is expired or about to expire.

#### Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `clientId` | `string` | Google OAuth client ID |

#### Return Value
- **Type:** `Promise<string>`
- Returns a valid access token string

#### Algorithm
1. Retrieves stored token via `getStoredToken()`
2. Throws error if no token exists (not connected)
3. Checks if token is still valid with 60-second safety margin (`expires_at > Date.now() + 60000`)
   - If valid, returns existing `access_token`
4. If expired, loads GIS script and requests fresh token via `requestAccessToken(clientId)`
5. Updates stored token with new `access_token` and `expires_at`
6. Returns new access token

#### Complexity
- **Time:** O(1) for valid token, O(popup time) for refresh
- **Space:** O(1)

#### Limitations
- Throws error if user has never connected
- Refresh requires popup (silent if consent already granted)

---

### `createCalendarEvent(clientId, event)`

#### Description
Creates a new event in the user's primary Google Calendar.

#### Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `clientId` | `string` | Google OAuth client ID |
| `event` | `GCalEvent` | Event details: `{ summary, start, end, description?, timezone? }` |

#### Return Value
- **Type:** `Promise<string>`
- Returns the ID of the created event

#### Algorithm
1. Gets valid access token via `getAccessToken(clientId)`
2. Determines timezone (provided or local browser timezone)
3. Constructs request body with `summary`, `start` (dateTime + timeZone), `end` (dateTime + timeZone), optional `description`
4. Sends POST request to `https://www.googleapis.com/calendar/v3/calendars/primary/events`
5. Parses response JSON and returns event `id`

#### Complexity
- **Time:** O(1) + network request
- **Space:** O(1)

#### Limitations
- Creates events only in primary calendar
- No support for attendees, reminders, or other advanced features

---

### `updateCalendarEvent(clientId, eventId, event)`

#### Description
Updates an existing calendar event with new details.

#### Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `clientId` | `string` | Google OAuth client ID |
| `eventId` | `string` | ID of the event to update |
| `event` | `GCalEvent` | Updated event details |

#### Return Value
- **Type:** `Promise<void>`

#### Algorithm
1. Gets valid access token via `getAccessToken(clientId)`
2. Constructs request body with updated event data
3. Sends PUT request to `https://www.googleapis.com/calendar/v3/calendars/primary/events/{eventId}`
4. Throws error if response is not OK

#### Complexity
- **Time:** O(1) + network request
- **Space:** O(1)

#### Limitations
- Replaces entire event — partial updates not supported
- No validation that event exists before update

---

### `deleteCalendarEvent(clientId, eventId)`

#### Description
Deletes a calendar event by its ID.

#### Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `clientId` | `string` | Google OAuth client ID |
| `eventId` | `string` | ID of the event to delete |

#### Return Value
- **Type:** `Promise<void>`

#### Algorithm
1. Gets valid access token via `getAccessToken(clientId)`
2. Sends DELETE request to `https://www.googleapis.com/calendar/v3/calendars/primary/events/{eventId}`
3. Treats 404 responses as success (event already deleted)
4. Throws error for other non-OK responses

#### Complexity
- **Time:** O(1) + network request
- **Space:** O(1)

#### Limitations
- 404 is silently accepted — cannot distinguish between "already deleted" and "never existed"

---

### `findEventForSlot(clientId, slot)`

#### Description
Searches for an existing TimeBox event at a specific time slot. Used to re-use orphan events created before `gcalEventId` was tracked.

#### Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `clientId` | `string` | Google OAuth client ID |
| `slot` | `{ date: string, start: string, end: string }` | Time slot to search for |

#### Return Value
- **Type:** `Promise<string | null>`
- Returns event ID if matching event found, `null` otherwise

#### Algorithm
1. Gets valid access token via `getAccessToken(clientId)`
2. Constructs time range for the entire day of the slot (00:00 to 23:59 UTC)
3. Fetches all events for that day with `orderBy=startTime&singleEvents=true`
4. Iterates through events, comparing start/end times (truncated to minute precision)
5. For matching time slots, checks if description contains `'Создано через TimeBox'`
6. Returns first matching event ID, or `null` if none found

#### Complexity
- **Time:** O(n) where n is number of events on that day
- **Space:** O(n) for response data

#### Limitations
- Only searches within a single day
- Time comparison is string-based with minute precision
- Relies on Russian-language marker in description
- Returns first match only — may miss duplicates

---

### `getFreeBusy(clientId, timeMin, timeMax)`

#### Description
Retrieves busy time slots from the primary calendar within a specified time range.

#### Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `clientId` | `string` | Google OAuth client ID |
| `timeMin` | `string` | Start of time range (ISO 8601 string) |
| `timeMax` | `string` | End of time range (ISO 8601 string) |

#### Return Value
- **Type:** `Promise<Array<{ start: string, end: string }>>`
- Returns array of busy time slots with start and end times

#### Algorithm
1. Gets valid access token via `getAccessToken(clientId)`
2. Sends POST request to `https://www.googleapis.com/calendar/v3/freeBusy`
3. Request body includes `timeMin`, `timeMax`, and items array with `{ id: 'primary' }`
4. Parses response and returns `calendars.primary.busy` array (empty array if none)

#### Complexity
- **Time:** O(1) + network request
- **Space:** O(n) where n is number of busy slots

#### Limitations
- Only queries primary calendar
- Returns busy time blocks, not event details

---

### `slotToEvent(slot, organizerName, clientNames, notes?, timezone?)`

#### Description
Builds a `GCalEvent` object from a time slot and booking information, ready for API submission.

#### Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `slot` | `{ date: string, start: string, end: string }` | Time slot with date and time components |
| `organizerName` | `string` | Name of the event organizer |
| `clientNames` | `string[]` | Array of client names |
| `notes` | `string` (optional) | Additional notes for the event description |
| `timezone` | `string` (optional) | Timezone string (defaults to browser local timezone) |

#### Return Value
- **Type:** `GCalEvent`
- Returns `{ summary, start, end, description, timezone }`

#### Algorithm
1. Determines timezone (provided or browser local)
2. Constructs ISO-like datetime strings for start and end:
   - Format: `YYYY-MM-DDTHH:MM:00`
3. Builds description from parts:
   - Client names (if any): `"Клиенты: name1, name2"`
   - Notes (if any): `"Заметки: notes"`
   - Footer: `"Создано через TimeBox"`
4. Constructs summary as: `"{organizerName}: {clientNames}"` or `"{organizerName}: Свободное окно"` if no clients

#### Complexity
- **Time:** O(1)
- **Space:** O(1)

#### Limitations
- Description uses Russian language markers
- No validation of date/time format
- Summary format is fixed and may not suit all use cases
