import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import mitt from 'mitt'
import TextToSpeech from '@/components/misc/TextToSpeech.vue'

vi.spyOn(window.HTMLMediaElement.prototype, 'play').mockImplementation(() => Promise.resolve())
vi.spyOn(window.HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
vi.spyOn(window.HTMLMediaElement.prototype, 'load').mockImplementation(() => {})
vi.spyOn(window.HTMLMediaElement.prototype, 'addEventListener').mockImplementation(() => {})
vi.spyOn(window.HTMLMediaElement.prototype, 'removeEventListener').mockImplementation(() => {})

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(() => '0'),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
  },
  writable: true
})

class MockSpeechSynthesisUtterance {
  constructor() {
    this.text = ''
    this.lang = ''
    this.voice = null
    this.pitch = 1
    this.rate = 1
    this.volume = 1
  }
}

window.SpeechSynthesisUtterance = MockSpeechSynthesisUtterance

const mockVoices = [
  { voiceURI: 'voice1', lang: 'de-DE', name: 'German Voice 1' },
  { voiceURI: 'voice2', lang: 'en-US', name: 'English Voice 1' },
]

Object.defineProperty(window, 'speechSynthesis', {
  value: {
    getVoices: vi.fn(() => mockVoices),
    speak: vi.fn(),
    cancel: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
  },
  writable: true
})

const createWrapper = (component, options = {}) => {
  const emitter = mitt()
  return mount(component, {
    global: {
      config: {
        globalProperties: {
          emitter
        }
      }
    },
    ...options
  })
}

describe('TextToSpeech Integration Tests', () => {
  let wrapper

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  describe('TextToSpeech', () => {
    it('renders correctly with character configs', () => {
      wrapper = createWrapper(TextToSpeech)
      expect(wrapper.vm.characterConfigs).toBeDefined()
      expect(wrapper.vm.characterConfigs.length).toBeGreaterThan(0)
    })

    it('initializes with dummy text and default settings', () => {
      wrapper = createWrapper(TextToSpeech)
      expect(wrapper.vm.inputText).toContain('Schreib mir etwas')
      expect(wrapper.vm.pitch).toBe(100)
      expect(wrapper.vm.rate).toBe(100)
      expect(wrapper.vm.volume).toBe(100)
    })

    it('loads and orders voices with German first', () => {
      wrapper = createWrapper(TextToSpeech)
      expect(wrapper.vm.voices).toEqual(mockVoices)
      expect(wrapper.vm.selectedVoice).toEqual(mockVoices[0])
    })

    it('handles missing voices gracefully', () => {
      window.speechSynthesis.getVoices.mockReturnValue([])
      wrapper = createWrapper(TextToSpeech)
      expect(wrapper.vm.voices).toEqual([])
      expect(wrapper.vm.selectedVoice).toBeUndefined()
    })

    it('restart clears input text and speech', () => {
      wrapper = createWrapper(TextToSpeech)
      wrapper.vm.inputText = 'Custom text'
      wrapper.vm.speech.text = 'Custom speech'

      wrapper.vm.restart()

      expect(wrapper.vm.inputText).toContain('Schreib mir etwas')
      expect(wrapper.vm.speech.text).toBe('')
    })

    it('clearInput clears input text and speech', () => {
      wrapper = createWrapper(TextToSpeech)
      wrapper.vm.inputText = 'Custom text'
      wrapper.vm.speech.text = 'Custom speech'

      wrapper.vm.clearInput()

      expect(wrapper.vm.inputText).toBe('')
      expect(wrapper.vm.speech.text).toBe('')
    })

    it('writeCharacter adds character to input and plays sound', () => {
      wrapper = createWrapper(TextToSpeech)
      const initialText = wrapper.vm.inputText
      const charConfig = { character: 'A', sound: 'soundA' }

      wrapper.vm.writeCharacter(charConfig)

      expect(wrapper.vm.inputText).toBe(initialText + 'a')
    })

    it('writeCharacter handles null config', () => {
      wrapper = createWrapper(TextToSpeech)
      const initialText = wrapper.vm.inputText

      wrapper.vm.writeCharacter(null)

      expect(wrapper.vm.inputText).toBe(initialText + '⚠')
    })

    it('deleteCharacter removes last character', () => {
      wrapper = createWrapper(TextToSpeech)
      wrapper.vm.inputText = 'Hello'

      wrapper.vm.deleteCharacter()

      expect(wrapper.vm.inputText).toBe('Hell')
    })

    it('writeSpace adds space', () => {
      wrapper = createWrapper(TextToSpeech)
      wrapper.vm.inputText = 'Hello'

      wrapper.vm.writeSpace()

      expect(wrapper.vm.inputText).toBe('Hello ')
    })

    it('speak configures and starts speech synthesis', () => {
      wrapper = createWrapper(TextToSpeech)
      wrapper.vm.inputText = 'Test text'
      wrapper.vm.selectedVoice = mockVoices[0]
      wrapper.vm.pitch = 100
      wrapper.vm.rate = 100
      wrapper.vm.volume = 100

      wrapper.vm.speak()

      expect(window.speechSynthesis.cancel).toHaveBeenCalled()
      expect(wrapper.vm.speech.text).toBe('Test text')
      expect(wrapper.vm.speech.voice).toEqual(mockVoices[0])
      expect(wrapper.vm.speech.pitch).toBe(1)
      expect(wrapper.vm.speech.rate).toBe(1)
      expect(wrapper.vm.speech.volume).toBe(1)
      expect(window.speechSynthesis.speak).toHaveBeenCalledWith(wrapper.vm.speech)
    })

    it('speak handles pitch boundaries', () => {
      wrapper = createWrapper(TextToSpeech)
      wrapper.vm.pitch = -10
      wrapper.vm.speak()
      expect(wrapper.vm.speech.pitch).toBe(1)

      wrapper.vm.pitch = 300
      wrapper.vm.speak()
      expect(wrapper.vm.speech.pitch).toBe(1)

      wrapper.vm.pitch = 150
      wrapper.vm.speak()
      expect(wrapper.vm.speech.pitch).toBe(1.5)
    })

    it('speak handles rate boundaries', () => {
      wrapper = createWrapper(TextToSpeech)
      wrapper.vm.rate = -10
      wrapper.vm.speak()
      expect(wrapper.vm.speech.rate).toBe(1)

      wrapper.vm.rate = 1500
      wrapper.vm.speak()
      expect(wrapper.vm.speech.rate).toBe(1)

      wrapper.vm.rate = 50
      wrapper.vm.speak()
      expect(wrapper.vm.speech.rate).toBe(0.5)
    })

    it('speak handles volume boundaries', () => {
      wrapper = createWrapper(TextToSpeech)
      wrapper.vm.volume = -10
      wrapper.vm.speak()
      expect(wrapper.vm.speech.volume).toBe(1)

      wrapper.vm.volume = 150
      wrapper.vm.speak()
      expect(wrapper.vm.speech.volume).toBe(1)

      wrapper.vm.volume = 50
      wrapper.vm.speak()
      expect(wrapper.vm.speech.volume).toBe(0.5)
    })

    it('pause cancels speech synthesis', () => {
      wrapper = createWrapper(TextToSpeech)
      wrapper.vm.pause()
      expect(window.speechSynthesis.cancel).toHaveBeenCalled()
    })

    it('gridContainer computes correct layout', () => {
      wrapper = createWrapper(TextToSpeech)
      const grid = wrapper.vm.gridContainer
      expect(grid.display).toBe('grid')
      expect(grid['grid-template-columns']).toBe('repeat(7, minmax(20pt, 1fr))')
      expect(grid['grid-gap']).toBe('7pt')
    })

    it('writeCharacter plays sound when character has sound', () => {
      wrapper = createWrapper(TextToSpeech)
      const initialText = wrapper.vm.inputText
      const charConfig = { character: 'A', sound: 'soundA' }
      const playSpy = vi.spyOn(wrapper.vm, 'writeCharacter')
      
      wrapper.vm.writeCharacter(charConfig)
      
      expect(wrapper.vm.inputText).toBe(initialText + 'a')
    })

    it('created handles empty voices array', () => {
      window.speechSynthesis.getVoices = vi.fn(() => [])
      wrapper = createWrapper(TextToSpeech)
      expect(wrapper.vm.voices).toEqual([])
      expect(wrapper.vm.selectedVoice).toBeUndefined()
    })

    it('speak handles undefined selectedVoice', () => {
      wrapper = createWrapper(TextToSpeech)
      wrapper.vm.selectedVoice = undefined
      wrapper.vm.inputText = 'Test'
      wrapper.vm.speak()
      expect(window.speechSynthesis.speak).toHaveBeenCalled()
    })

    it('speak sets pitch when in valid range', () => {
      wrapper = createWrapper(TextToSpeech)
      wrapper.vm.pitch = 150
      wrapper.vm.speak()
      expect(wrapper.vm.speech.pitch).toBe(1.5)
    })

    it('speak sets rate when in valid range', () => {
      wrapper = createWrapper(TextToSpeech)
      wrapper.vm.rate = 50
      wrapper.vm.speak()
      expect(wrapper.vm.speech.rate).toBe(0.5)
    })

    it('speak sets volume when in valid range', () => {
      wrapper = createWrapper(TextToSpeech)
      wrapper.vm.volume = 50
      wrapper.vm.speak()
      expect(wrapper.vm.speech.volume).toBe(0.5)
    })

    it('created orders voices with German first', () => {
      const deVoices = [
        { voiceURI: 'de1', lang: 'de-DE', name: 'German 1' },
        { voiceURI: 'en1', lang: 'en-US', name: 'English 1' },
        { voiceURI: 'de2', lang: 'de-DE', name: 'German 2' }
      ]
      window.speechSynthesis.getVoices = vi.fn(() => deVoices)
      wrapper = createWrapper(TextToSpeech)
      expect(wrapper.vm.voices[0].lang).toBe('de-DE')
      expect(wrapper.vm.voices[1].lang).toBe('de-DE')
      expect(wrapper.vm.voices[2].lang).toBe('en-US')
    })
  })
})