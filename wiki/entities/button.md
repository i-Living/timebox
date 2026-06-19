---
title: Button
created: 2026-06-19
updated: 2026-06-19
type: entity
tags:
  - component
  - exported
source: c:\dev\timebox\src\components\Button.tsx
confidence: medium
hash: c8ccdf11f0db57ef
---

# Button

> Source: `c:\dev\timebox\src\components\Button.tsx`

## Used in

- [[ClientsView]]
- [[DiaryView]]
- [[OnboardingView]]
- [[OrganizerView]]
- [[SettingsView]]
- [[ShareDialog]]
- [[SlotEditor]]

> Source: `c:\dev\timebox\src\components\Button.tsx`

## Used in

- [[ClientsView]]
- [[DiaryView]]
- [[OnboardingView]]
- [[OrganizerView]]
- [[SettingsView]]
- [[ShareDialog]]
- [[SlotEditor]]

> Source: `src\components\Button.tsx`

## Used in

- [[ClientsView]]
- [[DiaryView]]
- [[OnboardingView]]
- [[OrganizerView]]
- [[SettingsView]]
- [[ShareDialog]]
- [[SlotEditor]]

> Source: `c:\dev\timebox\src\components\Button.tsx`

## Used in

- [[ClientsView]]
- [[DiaryView]]
- [[OnboardingView]]
- [[OrganizerView]]
- [[SettingsView]]
- [[ShareDialog]]
- [[SlotEditor]]

> Source: `c:\dev\timebox\src\components\Button.tsx`

## Used in

- [[ClientsView]]
- [[DiaryView]]
- [[OnboardingView]]
- [[OrganizerView]]
- [[SettingsView]]
- [[ShareDialog]]
- [[SlotEditor]]

> Source: `src\components\Button.tsx`

## Used in

- [[ClientsView]]
- [[DiaryView]]
- [[OnboardingView]]
- [[OrganizerView]]
- [[SettingsView]]
- [[ShareDialog]]
- [[SlotEditor]]

> Source: `src\components\Button.tsx`

## Used in

- [[ClientsView]]
- [[DiaryView]]
- [[OnboardingView]]
- [[OrganizerView]]
- [[SettingsView]]
- [[ShareDialog]]
- [[SlotEditor]]

> Source: `c:\dev\timebox\src\components\Button.tsx`

## Used in

- [[ClientsView]]
- [[OnboardingView]]
- [[DiaryView]]
- [[OrganizerView]]
- [[SettingsView]]
- [[ShareDialog]]
- [[SlotEditor]]

## Description
A versatile button component supporting multiple visual variants, sizes, and states. Designed for form submissions and user interactions with customizable styling and accessibility attributes.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"primary" \| "outline" \| "ghost" \| "danger" \| "success"` | `"primary"` | Visual style variant of the button |
| `size` | `"sm" \| "md"` | `"sm"` | Size preset for the button |
| `block` | `boolean` | — | When true, button expands to full width of its container |
| `disabled` | `boolean` | — | Disables the button and prevents click events |
| `onClick` | `function` | — | Callback fired when the button is clicked |
| `children` | `ComponentChildren` | — | Content rendered inside the button |
| `style` | `Record \| string` | — | Inline styles or style class string |
| `title` | `string` | — | Tooltip text displayed on hover |
| `type` | `"button" \| "submit"` | `"button"` | HTML button type attribute |

## State
No internal state management (stateless component).

## Effects
No side effects or lifecycle hooks.

## Event Handlers
- **onClick**: Delegated directly to the native `<button>` element's `onClick` prop. Execution is gated by the `disabled` prop at the DOM level (disabled buttons do not fire click events).

## Logic
The component renders a native `<button>` element and applies the provided props directly as HTML attributes. Visual styling is determined by the `variant` and `size` props, while the `block` prop controls layout width. The `disabled` prop is passed to the native element, which natively prevents interaction and click events.

## Key Features
- Five visual variants: primary, outline, ghost, danger, success
- Two size options: sm, md
- Full-width block mode support
- Native disabled state handling
- Supports both inline styles and style strings
- Accessible with `title` attribute for tooltips
- Configurable `type` for form submission (`"submit"`) or standard button behavior (`"button"`)
