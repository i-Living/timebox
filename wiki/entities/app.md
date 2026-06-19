---
title: App
created: 2026-06-19
updated: 2026-06-19
type: entity
tags:
  - component
  - exported
source: c:\dev\timebox\src\app.tsx
confidence: medium
hash: ebbf78210ba9cb38
---

# App

> Source: `c:\dev\timebox\src\app.tsx`

## Uses

- [[OnboardingView]]
- [[OrganizerView]]

> Source: `c:\dev\timebox\src\app.tsx`

## Uses

- [[OnboardingView]]
- [[OrganizerView]]

> Source: `src\app.tsx`

## Uses

- [[OnboardingView]]
- [[OrganizerView]]

> Source: `c:\dev\timebox\src\app.tsx`

## Uses

- [[OnboardingView]]
- [[OrganizerView]]

> Source: `c:\dev\timebox\src\app.tsx`

## Uses

- [[OnboardingView]]
- [[OrganizerView]]

> Source: `src\app.tsx`

## Uses

- [[OnboardingView]]
- [[OrganizerView]]

> Source: `src\app.tsx`

## Uses

- [[OnboardingView]]
- [[OrganizerView]]

> Source: `c:\dev\timebox\src\app.tsx`

## Uses

- [[OnboardingView]]
- [[OrganizerView]]

## Description
Root-level component that manages the onboarding flow for the application. Conditionally renders either the onboarding view or the main organizer view based on the user's onboarding status.

## State
| Variable | Type | Description |
|----------|------|-------------|
| `onboarded` | `boolean` | Tracks whether the user has completed the onboarding process |

## Event Handlers
| Handler | Description |
|---------|-------------|
| `handleDone` | Sets `onboarded` to `true`, transitioning from onboarding to the organizer view |

## Logic
The component maintains a single boolean state (`onboarded`) that controls which view is rendered. Initially `false`, it displays the `OnboardingView` component. When the onboarding is completed, the `handleDone` callback is invoked, updating the state to `true` and causing the component to render the `OrganizerView` instead.

## Key Features
- **Conditional rendering** based on onboarding completion status
- **Simple state management** with a single boolean flag
- **Clear separation** between onboarding and main application views
