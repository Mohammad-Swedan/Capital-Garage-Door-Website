/**
 * Bot flag from a User-Agent. A missing or blank User-Agent counts as a bot:
 * every real browser sends one, scripts often don't.
 */
export function isBotUserAgent(userAgent: string | null | undefined, pattern: RegExp): boolean {
  if (!userAgent || !userAgent.trim()) return true;
  return pattern.test(userAgent);
}
