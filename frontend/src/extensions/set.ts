export function isSetsEqual<T>(first: Set<T>, second: Set<T>): boolean {
  if (first.size !== second.size) {
    return false;
  }

  for (const element of first) {
    if (!second.has(element)) {
      return false;
    }
  }

  return true;
};
