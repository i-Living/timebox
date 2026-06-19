---
title: OnboardingView
created: 2026-06-19
updated: 2026-06-19
type: entity
tags:
  - component
  - exported
source: c:\dev\timebox\src\components\OnboardingView.tsx
confidence: high
hash: 1bbad6414a502ff8
---

# OnboardingView

> Source: `c:\dev\timebox\src\components\OnboardingView.tsx`

## Used in

- [[App]]

## Uses

- [[Clock]]
- [[Calendar]]
- [[ClipboardList]]
- [[Pen]]
- [[Button]]

> Source: `c:\dev\timebox\src\components\OnboardingView.tsx`

## Used in

- [[App]]

## Uses

- [[Clock]]
- [[Calendar]]
- [[ClipboardList]]
- [[Pen]]
- [[Button]]

> Source: `src\components\OnboardingView.tsx`

## Used in

- [[App]]

## Uses

- [[Clock]]
- [[Calendar]]
- [[ClipboardList]]
- [[Pen]]
- [[Button]]

> Source: `c:\dev\timebox\src\components\OnboardingView.tsx`

## Used in

- [[App]]

## Uses

- [[Clock]]
- [[Calendar]]
- [[ClipboardList]]
- [[Pen]]
- [[Button]]

> Source: `c:\dev\timebox\src\components\OnboardingView.tsx`

## Used in

- [[App]]

## Uses

- [[Clock]]
- [[Calendar]]
- [[ClipboardList]]
- [[Pen]]
- [[Button]]

> Source: `src\components\OnboardingView.tsx`

## Used in

- [[App]]

## Uses

- [[Clock]]
- [[Calendar]]
- [[ClipboardList]]
- [[Pen]]
- [[Button]]

> Source: `src\components\OnboardingView.tsx`

## Used in

- [[App]]

## Uses

- [[Clock]]
- [[Calendar]]
- [[ClipboardList]]
- [[Pen]]
- [[Button]]

> Source: `c:\dev\timebox\src\components\OnboardingView.tsx`

## Used in

- [[App]]

## Uses

- [[Clock]]
- [[Calendar]]
- [[ClipboardList]]
- [[Pen]]
- [[Button]]

## Description
A full-screen onboarding wizard component that guides users through a multi-step introduction process. Displays sequential steps with icons, titles, descriptions, and navigation controls, calling a callback when the user completes the final step.

## Props

| Prop | Type | Description |
|------|------|-------------|
| `onDone` | `function` | Callback invoked when the user completes the final onboarding step |

## State
- **Step index** — tracks the current step position within the onboarding sequence (0-based)

## Event Handlers
- **Next handler** — advances to the next step; if on the last step, calls `onDone` instead
- **Skip handler** — immediately calls `onDone` to exit the onboarding flow

## Logic
1. Maintains an internal array of step objects, each containing an icon component, title, and description text
2. Renders the current step's icon, heading, and paragraph based on the step index
3. Displays a "Next" button that either advances the step or triggers completion
4. Shows a "Skip" link/button that bypasses remaining steps and completes the flow
5. Uses `Clock`, `Calendar`, `ClipboardList`, and `Pen` icons to visually differentiate steps

## Key Features
- **Sequential step navigation** with internal step counter
- **Completion callback** (`onDone`) triggered on final step or skip
- **Visual step differentiation** using distinct icons per step
- **Skip functionality** allowing users to exit the onboarding at any point
- **Responsive layout** with centered content and clear call-to-action buttons
