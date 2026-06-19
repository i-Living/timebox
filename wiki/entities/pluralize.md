---
title: pluralize
created: 2026-06-19
updated: 2026-06-19
type: entity
tags:
  - component
  - internal
source: c:\dev\timebox\src\utils\pluralize.ts
confidence: low
hash: 9c78d298c39cdf97
---

# pluralize

> Source: `c:\dev\timebox\src\utils\pluralize.ts`


> Source: `c:\dev\timebox\src\utils\pluralize.ts`


> Source: `src\utils\pluralize.ts`


> Source: `c:\dev\timebox\src\utils\pluralize.ts`


> Source: `c:\dev\timebox\src\utils\pluralize.ts`


> Source: `src\utils\pluralize.ts`


> Source: `src\utils\pluralize.ts`


> Source: `c:\dev\timebox\src\utils\pluralize.ts`


> Source: `c:\dev\timebox\src\utils\pluralize.ts`


> Source: `c:\dev\timebox\src\utils\pluralize.ts`


> Source: `c:\dev\timebox\src\utils\pluralize.ts`


> Source: `c:\dev\timebox\src\utils\pluralize.ts`


## Description

A utility function that returns the plural form of a given English noun. It applies standard English pluralization rules to convert singular nouns to their plural counterparts.

## Parameters

| Parameter | Type     | Description                                      |
|-----------|----------|--------------------------------------------------|
| `word`    | `string` | The singular noun to be pluralized.              |

## Return Value

| Type     | Description                                      |
|----------|--------------------------------------------------|
| `string` | The pluralized form of the input word.           |

## Algorithm

1. If the input word ends with `s`, `x`, `z`, `ch`, or `sh`, append `es`.
2. If the input word ends with a consonant followed by `y`, replace the `y` with `ies`.
3. Otherwise, append `s` to the word.

## Complexity

- **Time:** O(n), where n is the length of the input word (due to string suffix checks and concatenation).
- **Space:** O(n), for the resulting plural string.

## Limitations

- Does not handle irregular plurals (e.g., `child` → `children`, `mouse` → `mice`).
- Does not handle words ending in `f` or `fe` (e.g., `wolf` → `wolves`, `knife` → `knives`).
- Does not handle words ending in `o` (e.g., `potato` → `potatoes`, `photo` → `photos`).
- Assumes input is a singular noun; no validation or error handling for non-noun or empty strings.
