---
title: SlotCard
created: 2026-06-19
updated: 2026-06-19
type: entity
tags:
  - component
  - exported
source: c:\dev\timebox\src\components\SlotCard.tsx
confidence: high
hash: d580867f6753765f
---

# SlotCard

> Source: `c:\dev\timebox\src\components\SlotCard.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[Clipboard]]

> Source: `c:\dev\timebox\src\components\SlotCard.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[Clipboard]]

> Source: `src\components\SlotCard.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[Clipboard]]

> Source: `c:\dev\timebox\src\components\SlotCard.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[Clipboard]]

> Source: `c:\dev\timebox\src\components\SlotCard.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[Clipboard]]

> Source: `src\components\SlotCard.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[Clipboard]]

> Source: `src\components\SlotCard.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[Clipboard]]

> Source: `c:\dev\timebox\src\components\SlotCard.tsx`

## Used in

- [[OrganizerView]]

## Uses

- [[Clipboard]]

## Description

A card component that displays a slot's information and provides an optional copy-to-clipboard action. It supports click interactions for selection or navigation.

## Props

| Prop     | Type       | Description                                      |
|----------|------------|--------------------------------------------------|
| `slot`   | `Slot`     | The slot data object to render in the card.      |
| `onClick`| `function` | Callback invoked when the card is clicked.       |
| `onCopy?`| `function` | Optional callback invoked after copying content. |

## State

No `useState` hooks are used in this component.

## Effects

No `useEffect` hooks are used in this component.

## Event Handlers

- **`onClick`** — Triggered when the card's `<div>` container is clicked. Calls the `onClick` prop with the slot data.
- **`onCopy`** — Triggered when the copy button is clicked. Copies slot-related content to the clipboard and calls the `onCopy` prop if provided.

## Logic

The component renders a `<div>` wrapper that handles the primary click interaction. Inside, it displays slot details using `<span>` elements. A `<button>` with a `<Clipboard>` icon is rendered to enable copying slot information. When the copy button is clicked, the component copies the relevant slot data to the clipboard and optionally invokes the `onCopy` callback.

## Key Features

- Clickable card for slot selection or navigation.
- Built-in clipboard copy functionality with optional callback.
- Compact layout using semantic HTML elements.
