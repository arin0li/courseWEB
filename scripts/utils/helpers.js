// Small helper utilities for site-wide scripts
export function qs(selector, scope = document) {
  return scope.querySelector(selector);
}

export function qsa(selector, scope = document) {
  return Array.from(scope.querySelectorAll(selector));
}

export function on(el, evt, handler) {
  el.addEventListener(evt, handler);
}

// Placeholder for other shared helpers
// Add more as needed by pages or blocks
