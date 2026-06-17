
/**
 * Google Calendar integration via Google Identity Services (GIS) token client.
 *
 * This is the canonical client-side OAuth flow for SPAs with no backend:
 *   - GIS handles the entire auth-code → access_token exchange inside its popup
 *   - No PKCE, no client_secret, no refresh_token
 *   - Access token lives ~1 hour; when it expires we call requestAccessToken()
 *     again — since consent is already granted, the popup opens and closes
 *     silently (instant re-consent)
 *
 * Setup (one-time, in Google Cloud Console):
 * 1. Create / select a project: https://console.cloud.google.com
 * 2. Enable Google Calendar API in API Library
 * 3. Create OAuth 2.0 Client ID — Application type: "Web application"
 * 4. Authorized JavaScript origins (scheme + host + port, NO path):
 *      http://localhost:5173                (dev)
 *      https://timeboxcalendar.ru           (prod)
 * 5. Put the Client ID into VITE_GOOGLE_CLIENT_ID in .env
 *
 * NOTE: never put a client_secret in a VITE_ env var — it would be bundled
 * into client JS and become public. The token-client flow does not need one.
 */

const TOKEN_KEY = 'gcal_token';
const SCRIPT_URL = 'https://accounts.google.com/gsi/client';
const CALENDAR_API = 'https://www.googleapis.com/calendar/v3';
const USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';

const SCOPES =
  'https://www.googleapis.com/auth/calendar.events ' +
  'https://www.googleapis.com/auth/calendar.readonly';

interface TokenData {
  access_token: string;
  expires_at: number; // Date.now() + expires_in*1000
  email?: string;
}

// ─── GIS script loader ───

let gisLoaded = false;
let gisLoadPromise: Promise<void> | null = null;

function loadGisScript(): Promise<void> {
  if (gisLoaded) return Promise.resolve();
  if (gisLoadPromise) return gisLoadPromise;

  gisLoadPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(
      'script[src="' + SCRIPT_URL + '"]',
    ) as HTMLScriptElement | null;
    if (existing) {
      // Tag already present — wait for window.google to become available
      const check = setInterval(() => {
        if (typeof (window as any).google?.accounts?.oauth2 !== 'undefined') {
          clearInterval(check);
          gisLoaded = true;
          resolve();
        }
      }, 50);
      return;
    }
    const script = document.createElement('script');
    script.src = SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      gisLoaded = true;
      resolve();
    };
    script.onerror = () =>
      reject(new Error('Failed to load Google Identity Services script'));
    document.head.appendChild(script);
  });
  return gisLoadPromise;
}

// ─── Token storage ───

export function getStoredToken(): TokenData | null {
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    const t = JSON.parse(raw) as TokenData;
    if (!t.access_token || !t.expires_at) return null;
    return t;
  } catch {
    return null;
  }
}

function saveToken(token: TokenData): void {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// ─── Core: request an access token via GIS token client ───

interface TokenResponse {
  access_token: string;
  expires_in: number;
}

/**
 * Open the GIS popup and resolve with a fresh access_token + expires_in.
 * On first call this shows the Google consent screen.
 * On subsequent calls (consent already granted) the popup opens and closes
 * silently — the user sees at most a brief flash.
 */
function requestAccessToken(clientId: string): Promise<TokenResponse> {
  return new Promise<TokenResponse>((resolve, reject) => {
    const google = (window as any).google;
    if (!google?.accounts?.oauth2) {
      reject(new Error('Google Identity Services not loaded'));
      return;
    }

    const tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: SCOPES,
      callback: (resp: any) => {
        if (resp.error) {
          reject(new Error(resp.error_description || resp.error || 'OAuth error'));
          return;
        }
        if (!resp.access_token) {
          reject(new Error('No access_token in GIS response'));
          return;
        }
        resolve({
          access_token: resp.access_token as string,
          expires_in: (resp.expires_in as number) || 3600,
        });
      },
      error_callback: (err: any) => {
        // Fires when popup is blocked, closed by user, network failure, etc.
        reject(new Error(err?.message || err?.type || 'GIS popup failed'));
      },
    });

    tokenClient.requestAccessToken();
  });
}

// ─── Public: connect (initial consent) ───

export async function connectGoogleCalendar(clientId: string): Promise<TokenData> {
  await loadGisScript();

  const resp = await requestAccessToken(clientId);
  const token: TokenData = {
    access_token: resp.access_token,
    expires_at: Date.now() + resp.expires_in * 1000,
  };

  // Best-effort: fetch user email for the UI badge
  try {
    const userResp = await fetch(USERINFO_URL, {
      headers: { Authorization: 'Bearer ' + token.access_token },
    });
    if (userResp.ok) {
      token.email = (await userResp.json()).email;
    }
  } catch {
    // Non-critical
  }

  saveToken(token);
  return token;
}

// ─── Public: get a valid access token (silent refresh if expired) ───

export async function getAccessToken(clientId: string): Promise<string> {
  const token = getStoredToken();
  if (!token) throw new Error('Not connected to Google Calendar');

  // Still valid (60s safety margin)
  if (token.expires_at > Date.now() + 60000) {
    return token.access_token;
  }

  // Expired — request a new one (silent re-consent since already authorized)
  await loadGisScript();
  const fresh = await requestAccessToken(clientId);
  token.access_token = fresh.access_token;
  token.expires_at = Date.now() + fresh.expires_in * 1000;
  saveToken(token);
  return token.access_token;
}

// ─── Calendar API ───

export interface GCalEvent {
  summary: string;
  start: string;
  end: string;
  description?: string;
  timezone?: string;
}

export async function createCalendarEvent(
  clientId: string,
  event: GCalEvent,
): Promise<string> {
  const accessToken = await getAccessToken(clientId);

  const tz = event.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const body: any = {
    summary: event.summary,
    start: { dateTime: event.start, timeZone: tz },
    end: { dateTime: event.end, timeZone: tz },
  };
  if (event.description) body.description = event.description;

  const url = CALENDAR_API + '/calendars/primary/events';
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error('Failed to create event: ' + err);
  }
  const data = await resp.json();
  return data.id as string;
}

export async function getFreeBusy(
  clientId: string,
  timeMin: string,
  timeMax: string,
): Promise<Array<{ start: string; end: string }>> {
  const accessToken = await getAccessToken(clientId);

  const url = CALENDAR_API + '/freeBusy';
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      timeMin,
      timeMax,
      items: [{ id: 'primary' }],
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error('Failed to get free/busy: ' + err);
  }
  const data = await resp.json();
  return data.calendars?.primary?.busy || [];
}

/**
 * Build a calendar event from a slot + confirmed bookings.
 */
export function slotToEvent(
  slot: { date: string; start: string; end: string },
  organizerName: string,
  clientNames: string[],
  notes?: string,
  timezone?: string,
): GCalEvent {
  const tz = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  const y = slot.date.slice(0, 4);
  const m = slot.date.slice(5, 7);
  const d = slot.date.slice(8, 10);
  const sh = slot.start.slice(0, 2);
  const sm = slot.start.slice(3, 5);
  const eh = slot.end.slice(0, 2);
  const em = slot.end.slice(3, 5);

  const localStart = y + '-' + m + '-' + d + 'T' + sh + ':' + sm + ':00';
  const localEnd = y + '-' + m + '-' + d + 'T' + eh + ':' + em + ':00';

  const descParts: string[] = [];
  if (clientNames.length > 0) {
    descParts.push('Клиенты: ' + clientNames.join(', '));
  }
  if (notes) {
    descParts.push('Заметки: ' + notes);
  }
  descParts.push('Создано через TimeBox');

  const summaryName = organizerName || 'TimeBox';
  const summaryClients = clientNames.join(', ') || 'Свободное окно';

  return {
    summary: summaryName + ': ' + summaryClients,
    start: localStart,
    end: localEnd,
    description: descParts.join('\n'),
    timezone: tz,
  };
}
