"use client";

/**
 * Emits `not_found` once when a 404 page renders. Mount it inside the host's
 * `app/not-found.tsx`. props: referrer (where the broken link was).
 */
import { useEffect, useRef } from "react";
import { cleanString } from "../shared";
import { enqueue } from "./sink";

export function NotFoundReporter() {
  // Guards React's development double-invoke and any remount.
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    enqueue("not_found", { props: { referrer: cleanString(document.referrer, 300) } });
  }, []);

  return null;
}
