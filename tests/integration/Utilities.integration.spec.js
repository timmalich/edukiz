import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SoundUtils, SoundLib } from '@/components/utils/SoundUtils.js';
import { ImageUtils } from '@/components/utils/ImageUtils.js';
import { Voice } from '@/models/Voice.js';
import { ArrayUtils } from '@/components/utils/ArrayUtils.js';
import { CharacterUtils } from '@/components/utils/CharacterUtils.js';

vi.spyOn(window.HTMLMediaElement.prototype, 'play').mockImplementation(() => Promise.resolve());
vi.spyOn(window.HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
vi.spyOn(window.HTMLMediaElement.prototype, 'load').mockImplementation(() => {});
vi.spyOn(window.HTMLMediaElement.prototype, 'addEventListener').mockImplementation(() => {});
vi.spyOn(window.HTMLMediaElement.prototype, 'removeEventListener').mockImplementation(() => {});

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(() => null),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
});

describe('Utilities Integration Tests', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    SoundUtils.stopAll();
    SoundUtils.audios = {};
    SoundUtils.eventListeners = [];
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  describe('Voice Model', () => {
    it('creates voice with id and name', () => {
      const voice = new Voice('test_id', 'Test Voice');
      expect(voice.id).toBe('test_id');
      expect(voice.name).toBe('Test Voice');
    });
  });

  describe('ImageUtils', () => {
    it('getCharacterImagePath returns correct path for letters', () => {
      expect(ImageUtils.getCharacterImagePath('A')).toBe('img/characters/A.svg');
      expect(ImageUtils.getCharacterImagePath('z')).toBe('img/characters/Z.svg');
    });

    it('getCharacterImagePath returns correct path for numbers', () => {
      expect(ImageUtils.getCharacterImagePath('1')).toBe('img/characters/1.svg');
      expect(ImageUtils.getCharacterImagePath('0')).toBe('img/characters/0.svg');
    });

    it('getCharacterImagePath returns correct path for special chars', () => {
      expect(ImageUtils.getCharacterImagePath('+')).toBe('img/characters/+.svg');
      expect(ImageUtils.getCharacterImagePath('=')).toBe('img/characters/=.svg');
    });
  });

  describe('SoundUtils', () => {
    it('preload creates audio element', () => {
      SoundUtils.preload('test/sound');
      expect(SoundUtils.audios['test/sound']).toBeDefined();
      expect(SoundUtils.audios['test/sound'].src).toContain('sounds/test/sound.mp3');
    });

    it('getFromCache returns undefined for non-existent', () => {
      const audio = SoundUtils.getFromCache('non/existent');
      expect(audio).toBeUndefined();
    });

    it('playSound creates and plays audio', () => {
      const audio = SoundUtils.playSound('test/sound');
      expect(audio).toBeDefined();
      expect(audio.src).toContain('sounds/test/sound.mp3');
    });

    it('playSound creates new audio each call without preload', () => {
      const audio1 = SoundUtils.playSound('test/sound');
      const audio2 = SoundUtils.playSound('test/sound');
      expect(audio1).not.toBe(audio2);
    });

    it('stopAll pauses all audios', () => {
      SoundUtils.playSound('test/sound1');
      SoundUtils.playSound('test/sound2');

      SoundUtils.stopAll();

      expect(SoundUtils.audios['test/sound1'].paused).toBe(true);
      expect(SoundUtils.audios['test/sound2'].paused).toBe(true);
    });

    it('playSoundsInRow returns audio for first sound', () => {
      const audio = SoundUtils.playSoundsInRow(['test/sound1']);
      expect(audio).toBeDefined();
    });

    it('playError plays random error sound', () => {
      const audio = SoundUtils.playError();
      expect(audio).toBeDefined();
      expect(['error1', 'error3', 'error4']).toContain(
        audio.src.split('/').pop().replace('.mp3', '')
      );
    });

    it('playSuccess plays random success sound', () => {
      const audio = SoundUtils.playSuccess();
      expect(audio).toBeDefined();
      expect(['success1', 'success2', 'success3', 'success4', 'success5']).toContain(
        audio.src.split('/').pop().replace('.mp3', '')
      );
    });

    it('playBigSuccess plays big_success1', () => {
      const audio = SoundUtils.playBigSuccess();
      expect(audio).toBeDefined();
      expect(audio.src).toContain('big_success1');
    });

    it('playExplanation plays explanation sound', () => {
      const audio = SoundUtils.playExplanation('test');
      expect(audio).toBeDefined();
      expect(audio.src).toContain('de/explanations/test');
    });

    it('play handles valid sound object', () => {
      const mockSound = { play: vi.fn() };
      SoundUtils.play(mockSound);
      expect(mockSound.play).toHaveBeenCalled();
    });

    it('play handles null/undefined sound', () => {
      expect(() => SoundUtils.play(null)).not.toThrow();
      expect(() => SoundUtils.play(undefined)).not.toThrow();
    });

    it('play handles sound with error', () => {
      const mockSound = {
        play: vi.fn(() => {
          throw new Error('play failed');
        }),
      };
      expect(() => SoundUtils.play(mockSound)).not.toThrow();
    });

    it('setVoice updates selectedVoice and localStorage', () => {
      const voice = { id: 'test_voice', name: 'Test' };
      SoundUtils.setVoice(voice);
      expect(SoundUtils.selectedVoice).toBe(voice);
      expect(localStorage.setItem).toHaveBeenCalledWith('selectedVoice', JSON.stringify(voice));
    });

    it('useBoy0Voice sets boy0 voice', () => {
      SoundUtils.useBoy0Voice();
      expect(SoundUtils.selectedVoice).toBe(SoundUtils.voices.boy0);
    });

    it('useGirl0Voice sets girl0 voice', () => {
      SoundUtils.useGirl0Voice();
      expect(SoundUtils.selectedVoice).toBe(SoundUtils.voices.girl0);
    });

    it('getCharacterPath returns correct path', () => {
      expect(SoundUtils.getCharacterPath('A')).toBe('de/characters/a');
      expect(SoundUtils.getCharacterPath('1')).toBe('de/characters/1');
    });

    it('playCharacter plays character sound', () => {
      const audio = SoundUtils.playCharacter('A');
      expect(audio).toBeDefined();
      expect(audio.src).toContain('de/characters/a');
    });
  });

  describe('SoundLib', () => {
    it('contains all letter sounds', () => {
      'abcdefghijklmnopqrstuvwxyz'.split('').forEach((letter) => {
        expect(SoundLib[letter]).toBeDefined();
        expect(typeof SoundLib[letter].play).toBe('function');
      });
    });

    it('contains all number sounds', () => {
      for (let i = 0; i <= 20; i++) {
        expect(SoundLib[i]).toBeDefined();
        expect(typeof SoundLib[i].play).toBe('function');
      }
    });

    it('contains kiz sounds', () => {
      const kizSounds = [
        'ambulance',
        'bunny',
        'butterfly',
        'car',
        'cat',
        'chicken',
        'christmasTree',
        'dino',
        'dog',
        'dragon',
        'fireDepartment',
        'fireEngine',
        'fish',
        'frog',
        'goat',
        'hi',
        'laugh1',
        'laugh2',
        'laugh3',
        'ninja',
        'owl',
        'penguin',
        'police',
        'rainbow',
        'rainbowFish',
        'santa',
        'snail',
        'snowman',
        'tractor',
        'tree',
        'unicorn',
      ];
      kizSounds.forEach((sound) => {
        expect(SoundLib[sound]).toBeDefined();
        expect(typeof SoundLib[sound].play).toBe('function');
      });
    });

    it('contains dad sounds', () => {
      expect(SoundLib.dad_dragon).toBeDefined();
      expect(typeof SoundLib.dad_dragon.play).toBe('function');
    });

    it('contains general sounds', () => {
      for (let i = 1; i <= 5; i++) {
        expect(SoundLib[`success${i}`]).toBeDefined();
        expect(typeof SoundLib[`success${i}`].play).toBe('function');
      }
    });
  });

  describe('ArrayUtils', () => {
    it('shuffleArray shuffles array in place', () => {
      const original = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const copy = [...original];
      ArrayUtils.shuffleArray(copy);
      expect(copy).not.toEqual(original);
      expect(copy.sort((a, b) => a - b)).toEqual(original.sort((a, b) => a - b));
    });

    it('getRandomArrayIndex returns valid index', () => {
      const array = [1, 2, 3, 4, 5];
      for (let i = 0; i < 100; i++) {
        const index = ArrayUtils.getRandomArrayIndex(array);
        expect(index).toBeGreaterThanOrEqual(0);
        expect(index).toBeLessThan(array.length);
      }
    });

    it('getRandomArrayElement returns element from array', () => {
      const array = [1, 2, 3, 4, 5];
      for (let i = 0; i < 100; i++) {
        const element = ArrayUtils.getRandomArrayElement(array);
        expect(array).toContain(element);
      }
    });
  });

  describe('CharacterUtils', () => {
    it('createConfig creates config with character, sound, image', () => {
      const config = CharacterUtils.createConfig('A');
      expect(config.character).toBe('A');
      expect(config.image).toBe('img/characters/A.svg');
      expect(config.sound).toBe('de/characters/a');
    });

    it('createConfig works for numbers', () => {
      const config = CharacterUtils.createConfig('5');
      expect(config.character).toBe('5');
      expect(config.image).toBe('img/characters/5.svg');
      expect(config.sound).toBe('de/characters/5');
    });

    it('createConfig works for operators', () => {
      const config = CharacterUtils.createConfig('+');
      expect(config.character).toBe('+');
      expect(config.image).toBe('img/characters/+.svg');
      expect(config.sound).toBe('de/characters/+');
    });
  });
});
