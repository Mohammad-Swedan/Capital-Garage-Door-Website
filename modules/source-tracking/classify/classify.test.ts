import { describe, expect, it } from "vitest";
import { DEFAULT_BOT_PATTERN } from "../config";
import { isBotUserAgent } from "./bot";
import { detectDevice } from "./device";
import { classifyLink } from "./link";

const ORIGIN = "https://example-garage.com.au";

describe("classifyLink", () => {
  it("classifies protocol links", () => {
    expect(classifyLink("tel:+61400000000", ORIGIN).kind).toBe("tel");
    expect(classifyLink("mailto:a@b.c", ORIGIN).kind).toBe("mailto");
    expect(classifyLink("sms:+61400000000?body=hi", ORIGIN).kind).toBe("sms");
    expect(classifyLink("SMSTO:+61400000000", ORIGIN).kind).toBe("sms");
    expect(classifyLink("whatsapp://send?phone=1", ORIGIN).kind).toBe("whatsapp");
    expect(classifyLink("geo:-31.95,115.86", ORIGIN).kind).toBe("directions");
  });

  it("classifies WhatsApp and directions hosts", () => {
    expect(classifyLink("https://wa.me/61400000000?text=hi", ORIGIN)).toEqual({
      kind: "whatsapp",
      host: "wa.me",
      href: "https://wa.me/61400000000",
    });
    expect(classifyLink("https://api.whatsapp.com/send?phone=1", ORIGIN).kind).toBe("whatsapp");
    for (const href of [
      "https://maps.google.com/?q=x",
      "https://www.google.com/maps/dir/?api=1&destination=x",
      "https://www.google.com.au/maps/place/x",
      "https://goo.gl/maps/abc",
      "https://maps.app.goo.gl/abc",
      "https://maps.apple.com/?daddr=x",
    ]) {
      expect(classifyLink(href, ORIGIN).kind, href).toBe("directions");
    }
  });

  it("separates outbound from internal, and strips query strings", () => {
    expect(classifyLink("https://www.facebook.com/page?fbclid=1", ORIGIN)).toEqual({
      kind: "outbound",
      host: "facebook.com",
      href: "https://www.facebook.com/page",
    });
    expect(classifyLink("https://www.google.com/search?q=x", ORIGIN).kind).toBe("outbound");
    expect(classifyLink("/contact", ORIGIN).kind).toBe("internal");
    expect(classifyLink("https://www.example-garage.com.au/about", ORIGIN).kind).toBe("internal");
    expect(classifyLink("#faq", ORIGIN).kind).toBe("other");
    expect(classifyLink("javascript:void(0)", ORIGIN).kind).toBe("other");
    expect(classifyLink("", ORIGIN).kind).toBe("other");
    expect(classifyLink(null, ORIGIN).kind).toBe("other");
  });
});

describe("detectDevice / isBotUserAgent", () => {
  const bots = new RegExp(DEFAULT_BOT_PATTERN, "i");
  const iphone =
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
  const ipad = "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/604.1";
  const androidTablet = "Mozilla/5.0 (Linux; Android 14; SM-X710) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
  const androidPhone =
    "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Mobile Safari/537.36";
  const desktop = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

  it("buckets devices", () => {
    expect(detectDevice(iphone)).toBe("mobile");
    expect(detectDevice(androidPhone)).toBe("mobile");
    expect(detectDevice(ipad)).toBe("tablet");
    expect(detectDevice(androidTablet)).toBe("tablet");
    expect(detectDevice(desktop)).toBe("desktop");
    expect(detectDevice(null)).toBe("desktop");
  });

  it("flags bots, including AI crawlers and blank agents", () => {
    expect(isBotUserAgent("Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)", bots)).toBe(true);
    expect(isBotUserAgent("Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.2)", bots)).toBe(true);
    expect(isBotUserAgent("Mozilla/5.0 ... HeadlessChrome/126.0", bots)).toBe(true);
    expect(isBotUserAgent("curl/8.4.0", bots)).toBe(true);
    expect(isBotUserAgent("", bots)).toBe(true);
    expect(isBotUserAgent(null, bots)).toBe(true);
    expect(isBotUserAgent(iphone, bots)).toBe(false);
    expect(isBotUserAgent(desktop, bots)).toBe(false);
  });
});
