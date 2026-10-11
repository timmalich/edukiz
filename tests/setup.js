import { vi } from 'vitest'

vi.spyOn(window.HTMLMediaElement.prototype, 'play').mockImplementation(() => Promise.resolve())
vi.spyOn(window.HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
vi.spyOn(window.HTMLMediaElement.prototype, 'load').mockImplementation(() => {})
vi.spyOn(window.HTMLMediaElement.prototype, 'addEventListener').mockImplementation(() => {})
vi.spyOn(window.HTMLMediaElement.prototype, 'removeEventListener').mockImplementation(() => {})

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
  },
  writable: true
})

Object.defineProperty(window, 'matchMedia', {
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  })),
  writable: true
})

// eslint-disable-next-line no-console
console.error = vi.fn()
// eslint-disable-next-line no-console
console.warn = vi.fn()