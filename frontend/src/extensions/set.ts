/**
 * Checks if two sets are equal.
 * @param first The first set.
 * @param second The second set.
 * @returns True if the sets are equal, false otherwise.
 */
export function isSetsEqual<T>(first: Set<T>, second: Set<T>): boolean {
  if (!first && !second) {
    return true;
  }
  if (!first || !second) {
    return false;
  }

  const firstSet = new Set(first);
  const secondSet = new Set(second);

  return firstSet.size === secondSet.size &&
    Array.from(firstSet).every((x) => secondSet.has(x));
};
