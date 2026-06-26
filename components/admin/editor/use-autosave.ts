"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Debounced draft autosave for the in-place editor (Agent 5).
 *
 * Design:
 * - It watches a serialized `signature` of the editable state. When that changes
 *   AND the draft is dirty, valid, and not currently saving, it schedules a save
 *   after `delay` ms of quiet. Any further edit during the window resets the timer.
 * - It only ever calls `onSave()` (the DRAFT path) — it NEVER publishes.
 * - It refuses to autosave an invalid draft (`blocked`), so we don't spam the
 *   backend with payloads it will reject; the status reflects "waiting".
 * - The status is DERIVED from the gating flags during render (no setState in an
 *   effect → no cascading renders). Only the last save *result* is stored as
 *   state, and it's written from the host's event-driven `markSaved`/`markError`.
 *
 * The host owns the actual transition (it already wraps `savePageAction` in a
 * `useTransition`); this hook only decides WHEN to ask, and tracks status.
 */

export type AutosaveStatus =
  | "idle" // clean, nothing to do
  | "dirty" // unsaved edits, debounce not yet fired
  | "saving" // a save (manual or auto) is in flight
  | "saved" // last save succeeded
  | "error" // last save failed
  | "blocked"; // dirty but can't autosave (validation issues)

export interface UseAutosaveOptions {
  /** Master switch (e.g. disabled in Advanced view). */
  enabled: boolean;
  /** True when there are unsaved edits. */
  dirty: boolean;
  /** True when the draft has blocking validation issues — don't autosave. */
  blocked: boolean;
  /** True while ANY save (manual or auto) is in flight. */
  saving: boolean;
  /** A cheap, stable string that changes whenever the draft/meta change. */
  signature: string;
  /** Performs the DRAFT save. Must not publish. */
  onSave: () => void;
  /** Idle delay before autosaving, ms. Default 2500. */
  delay?: number;
}

export interface UseAutosaveResult {
  status: AutosaveStatus;
  /** Last time a save succeeded (manual or auto), for the chip. */
  lastSavedAt: Date | null;
  /** Host calls this when a save resolves OK. */
  markSaved: (at?: Date) => void;
  /** Host calls this when a save fails. */
  markError: () => void;
  /** Cancel any pending autosave (e.g. right before a manual save/publish). */
  cancelPending: () => void;
}

export function useAutosave({
  enabled,
  dirty,
  blocked,
  saving,
  signature,
  onSave,
  delay = 2500,
}: UseAutosaveOptions): UseAutosaveResult {
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  // The signature for which the last save FAILED — so the "error" status shows
  // until the author edits again (which changes the signature). Cleared by a
  // successful save. Set only from event handlers, never in an effect.
  const [errorSig, setErrorSig] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Keep the latest onSave without retriggering the scheduling effect on every
  // render (onSave depends on lots of state and would otherwise reset the timer).
  const onSaveRef = useRef(onSave);
  useEffect(() => {
    onSaveRef.current = onSave;
  });

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const cancelPending = useCallback(() => {
    clearTimer();
  }, [clearTimer]);

  const markSaved = useCallback(
    (at: Date = new Date()) => {
      clearTimer();
      setLastSavedAt(at);
      setErrorSig(null);
    },
    [clearTimer],
  );

  const markError = useCallback(() => {
    clearTimer();
    setErrorSig(signature);
  }, [clearTimer, signature]);

  // Schedule / reschedule the autosave whenever the signature (or gating flags)
  // change. This effect ONLY manages the timer — it never calls setState.
  useEffect(() => {
    if (saving || !enabled || !dirty || blocked) {
      clearTimer();
      return;
    }
    clearTimer();
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      onSaveRef.current();
    }, delay);
    return clearTimer;
  }, [signature, enabled, dirty, blocked, saving, delay, clearTimer]);

  // Derive the visible status (pure — no effect/setState involved).
  let status: AutosaveStatus;
  if (saving) status = "saving";
  else if (!enabled || !dirty) status = "idle";
  else if (errorSig === signature) status = "error";
  else if (blocked) status = "blocked";
  else status = "dirty";

  return { status, lastSavedAt, markSaved, markError, cancelPending };
}
