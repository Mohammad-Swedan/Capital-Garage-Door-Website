# Sidebar Collapse Design

**Date:** 2026-06-28

## Goal
Add collapse/expand to the admin sidebar. Collapsed = icon-only rail with tooltips. Expanded = current full layout. Same nav items, no routing changes.

## Approach
Toggle button at bottom of sidebar. `w-64` ↔ `w-16` width transition. State persisted to `localStorage`. Tooltips via `@base-ui/react/tooltip`.

## Files
- `components/ui/tooltip.tsx` — new Base UI tooltip primitive
- `components/admin/ui/sidebar-nav.tsx` — accepts `collapsed` prop; tooltips, icon centering, group label → divider
- `components/admin/ui/admin-shell.tsx` — collapse state, width transition, toggle button
