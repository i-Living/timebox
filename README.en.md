# TimeBox

A minimal PWA for booking free time slots — no server, no registration.

## How it works

1. **Organizer** creates available slots in the calendar and clicks "Share"
2. A link is generated with all slots encoded in the URL (no server needed)
3. **Client** opens the link, picks a time, and books it
4. Organizer confirms the booking — the slot is marked as taken

## Features

- Create slots with group capacity (capacity > 1)
- Share via link — all data in the URL, no backend
- Confirm / decline bookings
- Google Calendar sync (OAuth PKCE, creates an event on confirmation)
- ICS export for Apple / Outlook / Yandex calendars
- PWA: install to home screen, works offline
- All data in localStorage — stays on your device only

## Stack

- **Preact** + **TypeScript**
- **Vite** + vite-plugin-pwa
- Serverless, hosted on GitHub Pages

## Development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

### Environment variables

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

`VITE_GOOGLE_CLIENT_ID` — OAuth Client ID for Google Calendar API (optional, the app works without it).

## License

MIT
