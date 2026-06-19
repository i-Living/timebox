---
title: SettingsView
created: 2026-06-19
updated: 2026-06-19
type: entity
tags:
  - component
  - exported
source: c:\dev\timebox\src\components\SettingsView.tsx
confidence: high
hash: 60431316c79bde68
---

# SettingsView

> Source: `c:\dev\timebox\src\components\SettingsView.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[Button]]
- [[Moon]]
- [[Sun]]
- [[Button]]
- [[Button]]
- [[Button]]
- [[Button]]
- [[Link]]
- [[Check]]
- [[Button]]
- [[Button]]
- [[Download]]
- [[Upload]]
- [[Button]]
- [[RefreshCw]]
- [[Trash2]]

> Source: `c:\dev\timebox\src\components\SettingsView.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[Button]]
- [[Moon]]
- [[Sun]]
- [[Button]]
- [[Button]]
- [[Button]]
- [[Button]]
- [[Link]]
- [[Check]]
- [[Button]]
- [[Button]]
- [[Download]]
- [[Upload]]
- [[Button]]
- [[RefreshCw]]
- [[Trash2]]

> Source: `src\components\SettingsView.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[Button]]
- [[Moon]]
- [[Sun]]
- [[Button]]
- [[Button]]
- [[Button]]
- [[Button]]
- [[Link]]
- [[Check]]
- [[Button]]
- [[Button]]
- [[Download]]
- [[Upload]]
- [[Button]]
- [[RefreshCw]]
- [[Trash2]]

> Source: `c:\dev\timebox\src\components\SettingsView.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[Button]]
- [[Moon]]
- [[Sun]]
- [[Button]]
- [[Button]]
- [[Button]]
- [[Button]]
- [[Link]]
- [[Check]]
- [[Button]]
- [[Button]]
- [[Download]]
- [[Upload]]
- [[Button]]
- [[RefreshCw]]
- [[Trash2]]

> Source: `c:\dev\timebox\src\components\SettingsView.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[Button]]
- [[Moon]]
- [[Sun]]
- [[Button]]
- [[Button]]
- [[Button]]
- [[Button]]
- [[Link]]
- [[Check]]
- [[Button]]
- [[Button]]
- [[Download]]
- [[Upload]]
- [[Button]]
- [[RefreshCw]]
- [[Trash2]]

> Source: `src\components\SettingsView.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[Button]]
- [[Moon]]
- [[Sun]]
- [[Button]]
- [[Button]]
- [[Button]]
- [[Button]]
- [[Link]]
- [[Check]]
- [[Button]]
- [[Button]]
- [[Download]]
- [[Upload]]
- [[Button]]
- [[RefreshCw]]
- [[Trash2]]

> Source: `src\components\SettingsView.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[Button]]
- [[Moon]]
- [[Sun]]
- [[Button]]
- [[Button]]
- [[Button]]
- [[Button]]
- [[Link]]
- [[Check]]
- [[Button]]
- [[Button]]
- [[Download]]
- [[Upload]]
- [[Button]]
- [[RefreshCw]]
- [[Trash2]]

> Source: `c:\dev\timebox\src\components\SettingsView.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[Button]]
- [[Moon]]
- [[Sun]]
- [[Button]]
- [[Button]]
- [[Button]]
- [[Button]]
- [[Link]]
- [[Check]]
- [[Button]]
- [[Button]]
- [[Download]]
- [[Upload]]
- [[Button]]
- [[RefreshCw]]
- [[Trash2]]

## Description

The `SettingsView` component provides a comprehensive settings panel for the TimeBox organizer application. It allows users to configure organizer name, theme (light/dark), working hours and days, default slot duration, Google Calendar integration, data export/import, and displays an FAQ section.

## Props

| Prop | Type | Description |
|------|------|-------------|
| `data` | `OrganizerData` | Current organizer settings data containing configuration values |
| `onChange` | `(data: OrganizerData) => void` | Callback function invoked when settings are updated, receives the complete updated data object |

## State

| State Variable | Type | Initial Value | Description |
|----------------|------|---------------|-------------|
| `openFaq` | `number` | `-1` | Index of the currently open FAQ accordion item; `-1` means none are open |
| `theme` | `string` | `'light'` or value from `localStorage` | Current theme mode (`'light'` or `'dark'`) |
| `resetConfirm` | `boolean` | `false` | Confirmation state for the reset action; auto-resets after 3 seconds |
| `gcalConnected` | `boolean` | `false` | Whether Google Calendar is connected |
| `gcalEmail` | `string` | `''` | Email address associated with the connected Google Calendar account |
| `gcalLoading` | `boolean` | `false` | Loading state during Google Calendar connection |
| `gcalError` | `string` | `''` | Error message from Google Calendar connection attempt |

## Effects

| Effect | Dependencies | Description |
|--------|--------------|-------------|
| `useEffect(() => { ... }, [])` | `[]` (empty) | On mount, checks for an existing Google Calendar token in storage and updates `gcalConnected` and `gcalEmail` state accordingly |

## Event Handlers

| Handler | Description |
|---------|-------------|
| `getSavedClientId()` | Retrieves the Google Calendar client ID from `localStorage` or environment variable `VITE_GOOGLE_CLIENT_ID` |
| `update(patch)` | Applies a partial update to the organizer data by merging the patch with current data |
| `toggleDay(day)` | Toggles a working day (0-6) in the `workingDays` array; adds or removes the day and sorts the array |
| `toggleTheme()` | Switches between light and dark themes, persists the choice to `localStorage`, and updates the `data-theme` attribute on the document root |
| `handleExport()` | Exports all TimeBox data from `localStorage` as a JSON file download |
| `handleImport(e)` | Imports a JSON file, validates the structure, saves to `localStorage`, and reloads the page |
| `handleReset()` | On first click, sets a 3-second confirmation state; on second click, clears all TimeBox data from `localStorage` and reloads the page |
| `handleConnect()` | Initiates Google Calendar OAuth flow using the saved client ID; updates connection state or displays an error |
| `handleDisconnect()` | Clears the stored Google Calendar token and resets connection state |

## Logic

The component manages all application settings through a centralized `OrganizerData` object. Changes are propagated via the `onChange` callback using a helper `update` function that merges partial updates.

The theme system persists user preference to `localStorage` and applies it via a CSS custom property on the document root element.

Google Calendar integration checks for an existing OAuth token on mount. The connection flow uses the saved client ID (from `localStorage` or environment variables) to initiate OAuth. Upon successful connection, events are automatically created in the user's Google Calendar when bookings are confirmed.

Data management includes export (downloads a JSON backup), import (validates and loads a JSON file), and full reset (clears all data with a two-click confirmation mechanism).

The FAQ section uses an accordion pattern where only one item can be open at a time, controlled by the `openFaq` state index.

## Key Features

- **Organizer Name Configuration**: Editable text field for the organizer's name or business name
- **Dark/Light Theme Toggle**: Persistent theme preference with visual toggle button
- **Working Hours Configuration**: Start and end time inputs for daily working hours
- **Working Days Selection**: Toggle buttons for each day of the week (Russian locale labels)
- **Default Slot Duration**: Preset buttons (30, 45, 60, 90, 120 minutes) plus custom numeric input
- **FAQ Accordion**: Expandable/collapsible FAQ section with 6 common questions
- **Google Calendar Integration**: OAuth-based connection with automatic event creation on booking confirmation
- **Data Export/Import**: JSON file backup and restore functionality
- **Data Reset**: Two-click confirmation process to clear all application data
- **Offline-First**: All data stored locally in the browser with PWA support
