/**
 * Lightweight assert library.
 * @module
 */

export function assert(condition: boolean, message?: string): void {
  if (!condition) {
    fail(message);
  }
}

export function fail(message?: string): void {
  let msg = "Assertion failed";
  if (message) {
    msg += message;
  }
  throw new Error(msg);
}

export default assert;
