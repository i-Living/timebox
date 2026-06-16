
/**
 * Google Calendar integration via OAuth 2.0 PKCE (client-side only).
 *
 * Setup:
 * 1. Create a Google Cloud Project at https://console.cloud.google.com
 * 2. Enable Calendar API
 * 3. Create OAuth 2.0 Client ID (Web application)
 * 4. Add authorized JS origins: http://localhost:5173 (dev) + your prod URL
 * 5. Set VITE_GOOGLE_CLIENT_ID in .env or enter in settings
 */

const TOKEN_KEY = 'gcal_token';
const SCRIPT_URL = 'https://accounts.google.com/gsi/client';
const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';
const CALENDAR_API = 'https://www.googleapis.com/calendar/v3';

interface TokenData {
  access_token: string;
  refresh_token?: string;
  expires_at: number;
  email?: string;
}

// ─── PKCE helpers ───

function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64url(array);
}

function base64url(buffer: Uint8Array): string {
  return btoa(String.fromCharCode(...buffer))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// ─── Script loader ───

let gisLoaded = false;

function loadGisScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (gisLoaded) resolve();
    if (document.querySelector('script[src="' + SCRIPT_URL + '"]')) {
      const check = setInterval(function() {
        if (typeof (window as any).google?.accounts?.oauth2 !== 'undefined') {
          clearInterval(check);
          gisLoaded = true;
          resolve();
        }
      }, 100);
      return;
    }
    const script = document.createElement('script');
    script.src = SCRIPT_URL;
    script.async = true;
    script.onload = function() { gisLoaded = true; resolve(); };
    script.onerror = function() { reject(new Error('Failed to load Google GIS script')); };
    document.head.appendChild(script);
  });
}

// ─── Token storage ───

export function getStoredToken(): TokenData | null {
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
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

// ─── OAuth flow ───

export async function connectGoogleCalendar(clientId: string): Promise<TokenData> {
  await loadGisScript();

  const codeVerifier = generateCodeVerifier();
  sessionStorage.setItem('gcal_code_verifier', codeVerifier);

  return new Promise((resolve, reject) => {
    const google = (window as any).google;
    if (!google?.accounts?.oauth2) {
      reject(new Error('Google GIS not loaded'));
      return;
    }

    const codeClient = google.accounts.oauth2.initCodeClient({
      client_id: clientId,
      scope: 'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.readonly',
      ux_mode: 'popup',
      callback: async (response: any) => {
        if (response.error) {
          reject(new Error(response.error_description || response.error));
          return;
        }

        try {
          const token = await exchangeCodeForTokens(
            clientId,
            response.code,
            codeVerifier,
          );
          resolve(token);
        } catch (e) {
          reject(e);
        }
      },
    });

    codeClient.requestCode();
  });
}

async function exchangeCodeForTokens(
  clientId: string,
  code: string,
  codeVerifier: string,
): Promise<TokenData> {
  const resp = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      redirect_uri: window.location.origin,
      grant_type: 'authorization_code',
      code_verifier: codeVerifier,
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error('Token exchange failed: ' + err);
  }

  const data = await resp.json();
  const token: TokenData = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Date.now() + (data.expires_in || 3600) * 1000,
  };

  // Fetch user email
  try {
    const userResp = await fetch(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      { headers: { Authorization: 'Bearer ' + token.access_token } },
    );
    if (userResp.ok) {
      const userData = await userResp.json();
      token.email = userData.email;
    }
  } catch {
    // Non-critical
  }

  saveToken(token);
  sessionStorage.removeItem('gcal_code_verifier');
  return token;
}

// ─── Token refresh ───

export async function getAccessToken(clientId: string): Promise<string> {
  const token = getStoredToken();
  if (!token) throw new Error('Not connected to Google Calendar');

  if (token.expires_at > Date.now() + 60000) {
    return token.access_token;
  }

  if (!token.refresh_token) {
    clearToken();
    throw new Error('Token expired. Please reconnect Google Calendar.');
  }

  const resp = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'refresh_token',
      refresh_token: token.refresh_token,
    }),
  });

  if (!resp.ok) {
    clearToken();
    throw new Error('Token refresh failed. Please reconnect Google Calendar.');
  }

  const data = await resp.json();
  token.access_token = data.access_token;
  token.expires_at = Date.now() + (data.expires_in || 3600) * 1000;
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

  if (event.description) {
    body.description = event.description;
  }

  const url = CALENDAR_API + '/calendars/primary/events';
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + accessToken,
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
      'Authorization': 'Bearer ' + accessToken,
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
  const busy = data.calendars?.primary?.busy || [];
  return busy;
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
