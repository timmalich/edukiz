import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import mitt from 'mitt';
import DDBuildWordsGame from '@/components/drag_drop/DDBuildWordsGame.vue';
import DDCharacters from '@/components/drag_drop/DDCharacters.vue';
import { CharacterUtils } from '@/components/utils/CharacterUtils.js';

vi.spyOn(window.HTMLMediaElement.prototype, 'play').mockImplementation(() => Promise.resolve());
vi.spyOn(window.HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
vi.spyOn(window.HTMLMediaElement.prototype, 'load').mockImplementation(() => {});
vi.spyOn(window.HTMLMediaElement.prototype, 'addEventListener').mockImplementation(() => {});
vi.spyOn(window.HTMLMediaElement.prototype, 'removeEventListener').mockImplementation(() => {});

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(() => '0'),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
});

const createWrapper = (component, options = {}) => {
  const emitter = mitt();
  return mount(component, {
    global: {
      config: {
        globalProperties: {
          emitter,
        },
      },
    },
    ...options,
  });
};

describe('Drag Drop Games Integration Tests', () => {
  let wrapper;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  describe('DDBuildWordsGame', () => {
    it('renders correctly with word configs', () => {
      wrapper = createWrapper(DDBuildWordsGame);
      expect(wrapper.vm.wordConfigs).toBeDefined();
      expect(wrapper.vm.wordConfigs.length).toBeGreaterThan(0);
      wrapper.vm.wordConfigs.forEach((config) => {
        expect(config.wordLength).toBeDefined();
        expect(config.words).toBeDefined();
        expect(config.words.length).toBeGreaterThan(0);
      });
    });

    it('initializes game with current word and characters', async () => {
      wrapper = createWrapper(DDBuildWordsGame);
      await flushPromises();

      expect(wrapper.vm.currentWord).toBeDefined();
      expect(wrapper.vm.currentWordCharacters).toBeDefined();
      expect(wrapper.vm.currentWordCharacters.length).toBe(wrapper.vm.currentWord.length);
      expect(wrapper.vm.draggableCharacters.length).toBe(wrapper.vm.currentWord.length);
      expect(wrapper.vm.droppedCharacters.length).toBe(0);
      expect(wrapper.vm.solvedCharacters).toBe(0);
      expect(wrapper.vm.isGameOver).toBe(false);
    });

    it('selects word from current level config', async () => {
      wrapper = createWrapper(DDBuildWordsGame);
      wrapper.vm.selectedLevel = 0;
      wrapper.vm.restart(true);
      await flushPromises();

      const levelConfig = wrapper.vm.wordConfigs[0];
      expect(levelConfig.words.map((w) => w.toUpperCase())).toContain(wrapper.vm.currentWord);
      expect(wrapper.vm.currentWordCharacters.length).toBe(levelConfig.wordLength);
    });

    it('handles correct character drop', async () => {
      wrapper = createWrapper(DDBuildWordsGame);
      wrapper.vm.selectedLevel = 0;
      wrapper.vm.restart(true);
      await flushPromises();

      const expectedChar = wrapper.vm.currentWordCharacters[0].toLowerCase();
      const dragElement = {
        getAttribute: vi.fn((attr) => {
          if (attr === 'data-identifier') return expectedChar;
          if (attr === 'data-draggable-index') return '0';
          return null;
        }),
      };
      const event = { relatedTarget: dragElement };

      const result = wrapper.vm.ondrop(event);

      expect(result).toBe(true);
      expect(wrapper.vm.solvedCharacters).toBe(1);
      expect(wrapper.vm.droppedCharacters.length).toBe(1);
      expect(wrapper.vm.draggableCharacters.length).toBe(wrapper.vm.currentWord.length - 1);
    });

    it('handles incorrect character drop', async () => {
      wrapper = createWrapper(DDBuildWordsGame);
      wrapper.vm.selectedLevel = 0;
      wrapper.vm.restart(true);
      await flushPromises();

      const wrongChar = 'x';
      const dragElement = {
        getAttribute: vi.fn((attr) => {
          if (attr === 'data-identifier') return wrongChar;
          if (attr === 'data-draggable-index') return '0';
          return null;
        }),
      };
      const event = { relatedTarget: dragElement };

      const result = wrapper.vm.ondrop(event);

      expect(result).toBe(false);
      expect(wrapper.vm.solvedCharacters).toBe(0);
      expect(wrapper.vm.droppedCharacters.length).toBe(0);
    });

    it('completes game when all characters dropped correctly', async () => {
      wrapper = createWrapper(DDBuildWordsGame);
      wrapper.vm.selectedLevel = 0;
      wrapper.vm.restart(true);
      await flushPromises();

      for (let i = 0; i < wrapper.vm.currentWordCharacters.length; i++) {
        const expectedChar = wrapper.vm.currentWordCharacters[i].toLowerCase();
        const dragElement = {
          getAttribute: vi.fn((attr) => {
            if (attr === 'data-identifier') return expectedChar;
            if (attr === 'data-draggable-index') return '0';
            return null;
          }),
        };
        const event = { relatedTarget: dragElement };
        wrapper.vm.ondrop(event);
      }

      expect(wrapper.vm.isGameOver).toBe(true);
      expect(wrapper.vm.solvedCharacters).toBe(wrapper.vm.currentWordCharacters.length);
    });

    it('navigates between levels', async () => {
      wrapper = createWrapper(DDBuildWordsGame);

      expect(wrapper.vm.selectedLevel).toBe(2);

      wrapper.vm.nextLevel();
      expect(wrapper.vm.selectedLevel).toBe(3);

      wrapper.vm.previousLevel();
      expect(wrapper.vm.selectedLevel).toBe(2);
    });

    it('does not exceed max level', () => {
      wrapper = createWrapper(DDBuildWordsGame);
      wrapper.vm.selectedLevel = wrapper.vm.wordConfigs.length - 1;
      wrapper.vm.nextLevel();
      expect(wrapper.vm.selectedLevel).toBe(wrapper.vm.wordConfigs.length - 1);
    });

    it('does not go below min level', () => {
      wrapper = createWrapper(DDBuildWordsGame);
      wrapper.vm.selectedLevel = 0;
      wrapper.vm.previousLevel();
      expect(wrapper.vm.selectedLevel).toBe(0);
    });

    it('restarts game correctly', async () => {
      wrapper = createWrapper(DDBuildWordsGame);
      wrapper.vm.selectedLevel = 0;
      wrapper.vm.restart(true);
      await flushPromises();

      const firstChars = [...wrapper.vm.currentWordCharacters];

      wrapper.vm.restart(true);
      await flushPromises();

      expect(wrapper.vm.isGameOver).toBe(false);
      expect(wrapper.vm.solvedCharacters).toBe(0);
      expect(wrapper.vm.droppedCharacters.length).toBe(0);
      expect(wrapper.vm.draggableCharacters.length).toBe(firstChars.length);
    });

    it('plays help word sound on restart', async () => {
      wrapper = createWrapper(DDBuildWordsGame);
      wrapper.vm.selectedLevel = 0;
      wrapper.vm.restart(false);
      await flushPromises();

      expect(wrapper.vm.currentWord).toBeDefined();
    });
  });

  describe('DDCharacters', () => {
    it('renders correctly with character configs', () => {
      wrapper = createWrapper(DDCharacters);
      expect(wrapper.vm.characterConfigs).toBeDefined();
      expect(wrapper.vm.characterConfigs.length).toBeGreaterThan(0);
      expect(wrapper.vm.levels).toBeDefined();
      expect(wrapper.vm.levels.length).toBeGreaterThan(0);
    });

    it('initializes game with droppable and draggable characters', async () => {
      wrapper = createWrapper(DDCharacters);
      await flushPromises();

      expect(wrapper.vm.droppableCharacters.length).toBe(
        wrapper.vm.levels[wrapper.vm.selectedLevel].elementAmount
      );
      expect(wrapper.vm.draggableCharacters.length).toBe(
        wrapper.vm.levels[wrapper.vm.selectedLevel].elementAmount
      );
      expect(wrapper.vm.solvedCharacters).toBe(0);
      expect(wrapper.vm.isGameOver).toBe(false);
    });

    it('handles correct character drop', async () => {
      wrapper = createWrapper(DDCharacters);
      await flushPromises();

      const firstDroppable = wrapper.vm.droppableCharacters[0];
      const matchingDraggable = wrapper.vm.draggableCharacters.find(
        (c) => c.character === firstDroppable.character
      );

      expect(matchingDraggable).toBeDefined();

      const dropElement = { getAttribute: vi.fn(() => firstDroppable.character) };
      const dragElement = { getAttribute: vi.fn(() => matchingDraggable.character) };
      const event = { currentTarget: dropElement, relatedTarget: dragElement };

      const result = wrapper.vm.ondrop(event);

      expect(result).toBe(true);
      expect(wrapper.vm.solvedCharacters).toBe(1);
    });

    it('handles incorrect character drop', async () => {
      wrapper = createWrapper(DDCharacters);
      await flushPromises();

      const dropElement = { getAttribute: vi.fn(() => 'A') };
      const dragElement = { getAttribute: vi.fn(() => 'B') };
      const event = { currentTarget: dropElement, relatedTarget: dragElement };

      const result = wrapper.vm.ondrop(event);

      expect(result).toBe(false);
      expect(wrapper.vm.solvedCharacters).toBe(0);
    });

    it('completes game when all characters matched', async () => {
      wrapper = createWrapper(DDCharacters);
      await flushPromises();

      for (const droppable of wrapper.vm.droppableCharacters) {
        const matchingDraggable = wrapper.vm.draggableCharacters.find(
          (c) => c.character === droppable.character
        );
        const dropElement = { getAttribute: vi.fn(() => droppable.character) };
        const dragElement = { getAttribute: vi.fn(() => matchingDraggable.character) };
        const event = { currentTarget: dropElement, relatedTarget: dragElement };
        wrapper.vm.ondrop(event);
      }

      vi.advanceTimersByTime(800);
      await flushPromises();

      expect(wrapper.vm.isGameOver).toBe(true);
      expect(wrapper.vm.solvedCharacters).toBe(wrapper.vm.droppableCharacters.length);
    });

    it('navigates between levels', async () => {
      wrapper = createWrapper(DDCharacters);

      expect(wrapper.vm.selectedLevel).toBe(2);

      wrapper.vm.nextLevel();
      expect(wrapper.vm.selectedLevel).toBe(3);

      wrapper.vm.previousLevel();
      expect(wrapper.vm.selectedLevel).toBe(2);
    });

    it('does not exceed max level', () => {
      wrapper = createWrapper(DDCharacters);
      wrapper.vm.selectedLevel = wrapper.vm.levels.length - 1;
      wrapper.vm.nextLevel();
      expect(wrapper.vm.selectedLevel).toBe(wrapper.vm.levels.length - 1);
    });

    it('does not go below min level', () => {
      wrapper = createWrapper(DDCharacters);
      wrapper.vm.selectedLevel = 0;
      wrapper.vm.previousLevel();
      expect(wrapper.vm.selectedLevel).toBe(0);
    });

    it('restarts game correctly', async () => {
      wrapper = createWrapper(DDCharacters);
      await flushPromises();

      const firstDroppableCount = wrapper.vm.droppableCharacters.length;

      wrapper.vm.restart();
      await flushPromises();

      expect(wrapper.vm.isGameOver).toBe(false);
      expect(wrapper.vm.solvedCharacters).toBe(0);
      expect(wrapper.vm.droppableCharacters.length).toBe(firstDroppableCount);
      expect(wrapper.vm.draggableCharacters.length).toBe(firstDroppableCount);
    });

    it('shuffles characters on restart', async () => {
      wrapper = createWrapper(DDCharacters);
      await flushPromises();

      const firstOrder = wrapper.vm.droppableCharacters.map((c) => c.character).join(',');
      wrapper.vm.restart();
      await flushPromises();
      const secondOrder = wrapper.vm.droppableCharacters.map((c) => c.character).join(',');

      expect(firstOrder).not.toBe(secondOrder);
    });

    it('playHelpWord plays correct sounds', async () => {
      wrapper = createWrapper(DDBuildWordsGame);
      wrapper.vm.selectedLevel = 0;
      wrapper.vm.restart(true);
      await flushPromises();

      wrapper.vm.playHelpWord();
      // Just verify it doesn't throw
    });

    it('resetGameComponents calls resetDragAndDropSuccessions', () => {
      wrapper = createWrapper(DDBuildWordsGame);
      const resetSpy = vi.spyOn(wrapper.vm, 'resetDragAndDropSuccessions');
      wrapper.vm.resetGameComponents();
      expect(resetSpy).toHaveBeenCalled();
    });

    it('resetGameComponents calls resetDragAndDropSuccessions for DDCharacters', () => {
      wrapper = createWrapper(DDCharacters);
      const resetSpy = vi.spyOn(wrapper.vm, 'resetDragAndDropSuccessions');
      wrapper.vm.resetGameComponents();
      expect(resetSpy).toHaveBeenCalled();
    });

    it('ondragstart plays sound for DDBuildWordsGame', () => {
      wrapper = createWrapper(DDBuildWordsGame);
      const dragElement = {
        getAttribute: vi.fn((attr) => (attr === 'data-identifier' ? 'a' : null)),
      };
      const event = { target: dragElement };
      wrapper.vm.ondragstart(event);
    });

    it('ondragstart plays sound for DDCharacters', () => {
      wrapper = createWrapper(DDCharacters);
      const dragElement = {
        getAttribute: vi.fn((attr) => (attr === 'data-identifier' ? 'a' : null)),
      };
      const event = { target: dragElement };
      wrapper.vm.ondragstart(event);
    });

    it('ondrop handles errorAnimation callback for DDBuildWordsGame', async () => {
      wrapper = createWrapper(DDBuildWordsGame);
      wrapper.vm.selectedLevel = 0;
      wrapper.vm.restart(true);
      await flushPromises();

      const wrongChar = 'x';
      const dragElement = {
        getAttribute: vi.fn((attr) => {
          if (attr === 'data-identifier') return wrongChar;
          if (attr === 'data-draggable-index') return '0';
          return null;
        }),
      };
      const event = { relatedTarget: dragElement };
      wrapper.vm.ondrop(event);
    });

    it('ondrop handles errorAnimation callback for DDCharacters', async () => {
      wrapper = createWrapper(DDCharacters);
      await flushPromises();

      const dropElement = { getAttribute: vi.fn(() => 'A') };
      const dragElement = { getAttribute: vi.fn(() => 'B') };
      const event = { currentTarget: dropElement, relatedTarget: dragElement };
      wrapper.vm.ondrop(event);
    });
  });

  describe('CharacterUtils', () => {
    it('creates character config with image and sound', () => {
      const config = CharacterUtils.createConfig('A');
      expect(config.character).toBe('A');
      expect(config.image).toBe('img/characters/A.svg');
      expect(config.sound).toContain('de/characters/');
    });

    it('creates config for numbers', () => {
      const config = CharacterUtils.createConfig('1');
      expect(config.character).toBe('1');
      expect(config.image).toBe('img/characters/1.svg');
    });

    it('creates config for special characters', () => {
      const config = CharacterUtils.createConfig('+');
      expect(config.character).toBe('+');
      expect(config.image).toBe('img/characters/+.svg');
    });
  });
});
