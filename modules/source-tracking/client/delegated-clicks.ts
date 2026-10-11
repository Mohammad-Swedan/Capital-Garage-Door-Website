/**
 * One capture-phase click listener (plus one capture-phase `toggle` listener,
 * because `toggle` does not bubble) on the document:
 *
 * | Click on                                 | Event              | label                    |
 * |------------------------------------------|--------------------|--------------------------|
 * | `sms:` link                              | sms_click          | number                   |
 * | wa.me / api.whatsapp.com link            | whatsapp_click     | link (no query)          |
 * | Google / Apple Maps, directions link     | directions_click   | host                     |
 * | any other external http(s) link          | outbound_click     | host (props.href)        |
 * | `[data-track]` element                   | cta_click          | the attribute value      |
 * | accordion trigger (heading > button)     | faq_open           | question text (≤120)     |
 * | `<details>` opened                       | faq_open           | summary text (≤120)      |
 *
 * `tel:` and `mailto:` are deliberately NOT emitted here: the host's own
 * analytics emits call_click / email_click and the analytics bridge forwards
 * them. Because this listener runs in the CAPTURE phase it sees the click
 * first and records its placement, which the bridged event then picks up.
 */
import { MAX_LABEL, cleanString, cleanText } from "../shared";
import { classifyLink } from "../classify/link";
import { recordClickPlacement, resolvePlacement } from "./placement";
import { enqueue } from "./sink";

const HEADING_SELECTOR = "h1,h2,h3,h4,h5,h6,[role=heading]";

function smsLabel(href: string): string | null {
  const body = href.replace(/^(sms|smsto):/i, "").split("?")[0];
  return cleanString(body, MAX_LABEL);
}

function handleClick(event: MouseEvent): void {
  const raw = event.target;
  const target = raw instanceof Element ? raw : raw instanceof Node ? raw.parentElement : null;
  if (!target) return;

  const placement = resolvePlacement(target);
  recordClickPlacement(placement);

  const tracked = target.closest("[data-track]");
  if (tracked) {
    enqueue("cta_click", { label: cleanText(tracked.getAttribute("data-track"), MAX_LABEL), placement });
  }

  const anchor = target.closest("a[href]");
  if (anchor) {
    const info = classifyLink(anchor.getAttribute("href"), window.location.origin);
    switch (info.kind) {
      case "sms":
        enqueue("sms_click", { label: smsLabel(info.href), placement });
        break;
      case "whatsapp":
        enqueue("whatsapp_click", { label: info.host ? info.href : cleanString(info.href, MAX_LABEL), placement });
        break;
      case "directions":
        enqueue("directions_click", { label: info.host ?? "maps", placement, props: { href: info.href } });
        break;
      case "outbound":
        enqueue("outbound_click", { label: info.host, placement, props: { href: info.href } });
        break;
      default:
        // tel:/mailto: → the analytics bridge; internal links → page_view on arrival.
        break;
    }
    return;
  }

  // WAI-ARIA accordion pattern: <hN><button aria-expanded="false">Question</button></hN>.
  // Capture phase, so aria-expanded still holds the pre-click state.
  const trigger = target.closest("button[aria-expanded]");
  if (
    trigger &&
    trigger.getAttribute("aria-expanded") === "false" &&
    trigger.parentElement?.matches(HEADING_SELECTOR)
  ) {
    enqueue("faq_open", { label: cleanText(trigger.textContent, MAX_LABEL), placement });
  }
}

function handleToggle(event: Event): void {
  const details = event.target;
  if (!(details instanceof HTMLDetailsElement) || !details.open) return;
  const summary = details.querySelector("summary");
  enqueue("faq_open", {
    label: cleanText(summary?.textContent ?? "", MAX_LABEL),
    placement: resolvePlacement(details),
  });
}

/** Install the listeners; returns the uninstaller. */
export function installDelegatedClicks(): () => void {
  if (typeof document === "undefined") return () => {};
  const onClick = (event: MouseEvent) => {
    try {
      handleClick(event);
    } catch {
      // Never let tracking break a click.
    }
  };
  const onToggle = (event: Event) => {
    try {
      handleToggle(event);
    } catch {
      // ignore
    }
  };
  document.addEventListener("click", onClick, true);
  document.addEventListener("toggle", onToggle, true);
  return () => {
    document.removeEventListener("click", onClick, true);
    document.removeEventListener("toggle", onToggle, true);
  };
}
