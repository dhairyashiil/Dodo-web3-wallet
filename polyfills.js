// Global polyfills for browser environment
if (typeof window !== 'undefined') {
  window.Buffer = window.Buffer || require('buffer').Buffer
  window.process = window.process || require('process/browser')
}
