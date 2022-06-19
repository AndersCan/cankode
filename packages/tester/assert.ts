export function assert(assertion: boolean, message?: string) {
  if (assertion) {
    return;
  }

  throw new Error(`failed: ${message}`);
}
