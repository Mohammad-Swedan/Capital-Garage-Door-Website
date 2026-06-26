/**
 * Tiny dot/bracket path helpers for the in-place editor's draft store.
 *
 * Supports paths like `hero.h1`, `processSteps[2].title`, `intro.paragraphs[0]`.
 * No external deps (immer/lodash are explicitly banned) — `setPath` returns a new
 * object with structural sharing along the touched path only, so React re-renders
 * are cheap and the rest of the (presentational) tree is untouched.
 */

export type PathToken = string | number;

/** Parse `processSteps[2].title` → ["processSteps", 2, "title"]. */
export function parsePath(path: string): PathToken[] {
  const tokens: PathToken[] = [];
  // Match either `.foo` / leading `foo` segments or `[123]` index segments.
  const re = /[^.[\]]+|\[(\d+)\]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(path)) !== null) {
    if (m[1] !== undefined) {
      tokens.push(Number(m[1]));
    } else {
      tokens.push(m[0]);
    }
  }
  return tokens;
}

/** Read the value at `path` from `obj` (undefined if any segment is missing). */
export function getPath(obj: unknown, path: string): unknown {
  const tokens = parsePath(path);
  let cur: unknown = obj;
  for (const token of tokens) {
    if (cur == null) return undefined;
    cur = (cur as Record<PathToken, unknown>)[token];
  }
  return cur;
}

function cloneContainer(value: unknown, nextToken: PathToken): unknown {
  // Choose the right container type for the *next* token so we can write into it.
  if (typeof nextToken === "number") {
    return Array.isArray(value) ? [...value] : [];
  }
  if (value != null && typeof value === "object" && !Array.isArray(value)) {
    return { ...(value as Record<string, unknown>) };
  }
  return {};
}

/** Immutably set `path` to `value`, returning a new root object. */
export function setPath<T>(obj: T, path: string, value: unknown): T {
  const tokens = parsePath(path);
  if (tokens.length === 0) return obj;

  const root = cloneContainer(obj, tokens[0]) as Record<PathToken, unknown>;
  let cur = root;

  for (let i = 0; i < tokens.length - 1; i++) {
    const token = tokens[i];
    const nextToken = tokens[i + 1];
    const cloned = cloneContainer(cur[token], nextToken);
    cur[token] = cloned;
    cur = cloned as Record<PathToken, unknown>;
  }

  cur[tokens[tokens.length - 1]] = value;
  return root as unknown as T;
}

/** Apply a function to the array at `path`, returning a new root object. */
export function updateArray<T>(
  obj: T,
  path: string,
  fn: (arr: unknown[]) => unknown[],
): T {
  const current = getPath(obj, path);
  const arr = Array.isArray(current) ? current : [];
  return setPath(obj, path, fn([...arr]));
}
