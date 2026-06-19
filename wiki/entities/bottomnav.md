---
title: BottomNav
created: 2026-06-19
updated: 2026-06-19
type: entity
tags:
  - component
  - exported
source: c:\dev\timebox\src\components\BottomNav.tsx
confidence: high
hash: 8da5bf9f6de8e25d
---

# BottomNav

> Source: `c:\dev\timebox\src\components\BottomNav.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[Calendar]]
- [[Users]]
- [[BookOpen]]
- [[Settings]]

> Source: `c:\dev\timebox\src\components\BottomNav.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[Calendar]]
- [[Users]]
- [[BookOpen]]
- [[Settings]]

> Source: `src\components\BottomNav.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[Calendar]]
- [[Users]]
- [[BookOpen]]
- [[Settings]]

> Source: `c:\dev\timebox\src\components\BottomNav.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[Calendar]]
- [[Users]]
- [[BookOpen]]
- [[Settings]]

> Source: `c:\dev\timebox\src\components\BottomNav.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[Calendar]]
- [[Users]]
- [[BookOpen]]
- [[Settings]]

> Source: `src\components\BottomNav.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[Calendar]]
- [[Users]]
- [[BookOpen]]
- [[Settings]]

> Source: `src\components\BottomNav.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[Calendar]]
- [[Users]]
- [[BookOpen]]
- [[Settings]]

> Source: `c:\dev\timebox\src\components\BottomNav.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[Calendar]]
- [[Users]]
- [[BookOpen]]
- [[Settings]]

## Description

A bottom navigation bar component that provides navigation between four main sections: Calendar, Clients, Diary, and Settings. It highlights the currently active tab and triggers a callback when a different tab is selected.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `active` | `"calendar" \| "clients" \| "diary" \| "settings"` | `"calendar"` | The currently active navigation tab identifier |
| `onSelect` | `function` | — | Callback function invoked when a navigation tab is clicked. Receives the selected tab identifier as an argument |

## Logic

The component renders a horizontal bar containing four navigation buttons, each with an associated icon (`Calendar`, `Users`, `BookOpen`, `Settings`) and a text label. The currently active tab (determined by the `active` prop) is visually distinguished from the others. When a user clicks a button, the `onSelect` callback is called with the corresponding tab identifier.

## Key Features

- **Active state indication**: Visually highlights the currently selected tab
- **Icon + label display**: Each navigation item includes both an icon and descriptive text
- **Controlled component**: Relies on parent-provided `active` and `onSelect` props for state management
- **Four navigation targets**: Supports Calendar, Clients, Diary, and Settings sections
