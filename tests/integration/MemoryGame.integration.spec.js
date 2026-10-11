import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import mitt from 'mitt';
import MemoryAnimals from '@/components/memory/MemoryAnimals.vue';
import MemoryCharacters from '@/components/memory/MemoryCharacters.vue';
import MemoryGame from '@/components/memory/MemoryGame.vue';
import { ArrayUtils } from '@/components/utils/ArrayUtils.js';

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

describe('Memory Game Integration Tests', () => {
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

  describe('MemoryAnimals', () => {
    it('renders correctly with animal card configs', () => {
      wrapper = createWrapper(MemoryAnimals);
      expect(wrapper.findComponent(MemoryGame).exists()).toBe(true);
      expect(wrapper.vm.possibleCardConfigs.length).toBeGreaterThan(0);
      wrapper.vm.possibleCardConfigs.forEach((config) => {
        expect(config.image).toContain('img/');
        expect(config.sound).toBeDefined();
      });
    });

    it('passes possibleCardConfigs to MemoryGame', () => {
      wrapper = createWrapper(MemoryAnimals);
      const memoryGame = wrapper.findComponent(MemoryGame);
      expect(memoryGame.props('possibleCardConfigs')).toEqual(wrapper.vm.possibleCardConfigs);
    });
  });

  describe('MemoryCharacters', () => {
    it('renders correctly with character configs', () => {
      wrapper = createWrapper(MemoryCharacters);
      expect(wrapper.findComponent(MemoryGame).exists()).toBe(true);
      expect(wrapper.vm.characterConfigs.length).toBeGreaterThan(0);
      wrapper.vm.characterConfigs.forEach((config) => {
        expect(config.character).toBeDefined();
        expect(config.image).toContain('img/characters/');
        expect(config.sound).toBeDefined();
      });
    });
  });

  describe('MemoryGame', () => {
    const mockCardConfigs = [
      { image: 'img/test1.svg', sound: 'sound1' },
      { image: 'img/test2.svg', sound: 'sound2' },
      { image: 'img/test3.svg', sound: 'sound3' },
      { image: 'img/test4.svg', sound: 'sound4' },
      { image: 'img/test5.svg', sound: 'sound5' },
      { image: 'img/test6.svg', sound: 'sound6' },
      { image: 'img/test7.svg', sound: 'sound7' },
      { image: 'img/test8.svg', sound: 'sound8' },
      { image: 'img/test9.svg', sound: 'sound9' },
      { image: 'img/test10.svg', sound: 'sound10' },
      { image: 'img/test11.svg', sound: 'sound11' },
      { image: 'img/test12.svg', sound: 'sound12' },
      { image: 'img/test13.svg', sound: 'sound13' },
      { image: 'img/test14.svg', sound: 'sound14' },
      { image: 'img/test15.svg', sound: 'sound15' },
      { image: 'img/test16.svg', sound: 'sound16' },
      { image: 'img/test17.svg', sound: 'sound17' },
      { image: 'img/test18.svg', sound: 'sound18' },
      { image: 'img/test19.svg', sound: 'sound19' },
      { image: 'img/test20.svg', sound: 'sound20' },
      { image: 'img/test21.svg', sound: 'sound21' },
      { image: 'img/test22.svg', sound: 'sound22' },
      { image: 'img/test23.svg', sound: 'sound23' },
      { image: 'img/test24.svg', sound: 'sound24' },
      { image: 'img/test25.svg', sound: 'sound25' },
      { image: 'img/test26.svg', sound: 'sound26' },
      { image: 'img/test27.svg', sound: 'sound27' },
      { image: 'img/test28.svg', sound: 'sound28' },
      { image: 'img/test29.svg', sound: 'sound29' },
      { image: 'img/test30.svg', sound: 'sound30' },
      { image: 'img/test31.svg', sound: 'sound31' },
      { image: 'img/test32.svg', sound: 'sound32' },
    ];

    it('calculates correct levels', () => {
      wrapper = createWrapper(MemoryGame, {
        props: { possibleCardConfigs: mockCardConfigs },
      });
      expect(wrapper.vm.levels.length).toBe(11);
      expect(wrapper.vm.levels[0]).toEqual({ rows: 1, columns: 2 });
      expect(wrapper.vm.levels[10]).toEqual({ rows: 8, columns: 8 });
    });

    it('generates correct number of cards for each level', async () => {
      wrapper = createWrapper(MemoryGame, {
        props: { possibleCardConfigs: mockCardConfigs },
      });

      for (let level = 0; level < wrapper.vm.levels.length; level++) {
        wrapper.vm.selectedLevel = level;
        await wrapper.vm.generateCards();
        const expectedCardAmount = wrapper.vm.levels[level].rows * wrapper.vm.levels[level].columns;
        expect(wrapper.vm.cards.length).toBe(expectedCardAmount);
        expect(wrapper.vm.cards.length % 2).toBe(0);
      }
    });

    it('creates pairs of matching cards', async () => {
      wrapper = createWrapper(MemoryGame, {
        props: { possibleCardConfigs: mockCardConfigs },
      });
      wrapper.vm.selectedLevel = 0;
      await wrapper.vm.generateCards();

      const cardPairs = {};
      wrapper.vm.cards.forEach((card) => {
        if (!cardPairs[card.frontFace]) {
          cardPairs[card.frontFace] = 0;
        }
        cardPairs[card.frontFace]++;
      });

      Object.values(cardPairs).forEach((count) => {
        expect(count).toBe(2);
      });
    });

    it('starts game and unlocks board after timeout', async () => {
      wrapper = createWrapper(MemoryGame, {
        props: { possibleCardConfigs: mockCardConfigs },
      });
      wrapper.vm.selectedLevel = 0;
      await wrapper.vm.generateCards();

      expect(wrapper.vm.isGameStarted).toBe(false);
      expect(wrapper.vm.isBoardLocked).toBe(true);

      vi.advanceTimersByTime(10000);
      await flushPromises();

      expect(wrapper.vm.isGameStarted).toBe(true);
      expect(wrapper.vm.isBoardLocked).toBe(false);
    });

    it('handles card flipping and matching', async () => {
      wrapper = createWrapper(MemoryGame, {
        props: { possibleCardConfigs: mockCardConfigs },
      });
      wrapper.vm.selectedLevel = 0;
      await wrapper.vm.generateCards();

      vi.advanceTimersByTime(10000);
      await flushPromises();

      const firstCard = wrapper.vm.cards[0];
      const matchingCard = wrapper.vm.cards.find(
        (c) => c.frontFace === firstCard.frontFace && c.key !== firstCard.key
      );

      wrapper.vm.cardFlipped(firstCard);
      expect(wrapper.vm.flippedCard).toBe(firstCard);
      expect(wrapper.vm.isBoardLocked).toBe(false);

      wrapper.vm.cardFlipped(matchingCard);
      expect(wrapper.vm.solvedCards).toBe(2);
      expect(wrapper.vm.flippedCard).toBeNull();
    });

    it('handles card flipping and non-matching', async () => {
      wrapper = createWrapper(MemoryGame, {
        props: { possibleCardConfigs: mockCardConfigs },
      });
      wrapper.vm.selectedLevel = 1;
      await wrapper.vm.generateCards();

      vi.advanceTimersByTime(10000);
      await flushPromises();

      const firstCard = wrapper.vm.cards[0];
      const nonMatchingCard = wrapper.vm.cards.find((c) => c.frontFace !== firstCard.frontFace);

      expect(nonMatchingCard).toBeDefined();

      wrapper.vm.cardFlipped(firstCard);
      wrapper.vm.cardFlipped(nonMatchingCard);

      expect(wrapper.vm.isBoardLocked).toBe(true);

      vi.advanceTimersByTime(1000);
      await flushPromises();

      expect(wrapper.vm.flippedCard).toBeNull();
      expect(wrapper.vm.isBoardLocked).toBe(false);
    });

    it('detects game over when all cards matched', async () => {
      wrapper = createWrapper(MemoryGame, {
        props: { possibleCardConfigs: mockCardConfigs },
      });
      wrapper.vm.selectedLevel = 0;
      await wrapper.vm.generateCards();

      vi.advanceTimersByTime(10000);
      await flushPromises();

      const cardsByFace = {};
      wrapper.vm.cards.forEach((card) => {
        if (!cardsByFace[card.frontFace]) {
          cardsByFace[card.frontFace] = [];
        }
        cardsByFace[card.frontFace].push(card);
      });

      for (const cards of Object.values(cardsByFace)) {
        wrapper.vm.cardFlipped(cards[0]);
        wrapper.vm.cardFlipped(cards[1]);
        vi.advanceTimersByTime(100);
        await flushPromises();
      }

      expect(wrapper.vm.isGameOver).toBe(true);
      expect(wrapper.vm.solvedCards).toBe(wrapper.vm.cards.length);
    });

    it('navigates between levels', async () => {
      wrapper = createWrapper(MemoryGame, {
        props: { possibleCardConfigs: mockCardConfigs },
      });

      expect(wrapper.vm.selectedLevel).toBe(4);

      wrapper.vm.nextLevel();
      expect(wrapper.vm.selectedLevel).toBe(5);

      wrapper.vm.previousLevel();
      expect(wrapper.vm.selectedLevel).toBe(4);
    });

    it('does not exceed max level', () => {
      wrapper = createWrapper(MemoryGame, {
        props: { possibleCardConfigs: mockCardConfigs },
      });
      wrapper.vm.selectedLevel = wrapper.vm.levels.length - 1;
      wrapper.vm.nextLevel();
      expect(wrapper.vm.selectedLevel).toBe(wrapper.vm.levels.length - 1);
    });

    it('does not go below min level', () => {
      wrapper = createWrapper(MemoryGame, {
        props: { possibleCardConfigs: mockCardConfigs },
      });
      wrapper.vm.selectedLevel = 0;
      wrapper.vm.previousLevel();
      expect(wrapper.vm.selectedLevel).toBe(0);
    });

    it('restarts game correctly', async () => {
      wrapper = createWrapper(MemoryGame, {
        props: { possibleCardConfigs: mockCardConfigs },
      });
      wrapper.vm.selectedLevel = 0;
      await wrapper.vm.generateCards();
      vi.advanceTimersByTime(10000);
      await flushPromises();

      const firstCard = wrapper.vm.cards[0];
      const matchingCard = wrapper.vm.cards.find(
        (c) => c.frontFace === firstCard.frontFace && c.key !== firstCard.key
      );
      wrapper.vm.cardFlipped(firstCard);
      wrapper.vm.cardFlipped(matchingCard);

      expect(wrapper.vm.solvedCards).toBe(2);

      wrapper.vm.generateCards();

      expect(wrapper.vm.isGameStarted).toBe(false);
      expect(wrapper.vm.isBoardLocked).toBe(true);
      expect(wrapper.vm.solvedCards).toBe(2);
      expect(wrapper.vm.flippedCard).toBeNull();
      expect(wrapper.vm.isGameOver).toBe(false);
    });
  });

  describe('ArrayUtils', () => {
    it('shuffles array', () => {
      const original = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const shuffled = ArrayUtils.shuffleArray([...original]);
      expect(shuffled).not.toEqual(original);
      expect(shuffled.sort((a, b) => a - b)).toEqual(original.sort((a, b) => a - b));
    });

    it('gets random array index', () => {
      const array = [1, 2, 3, 4, 5];
      for (let i = 0; i < 100; i++) {
        const index = ArrayUtils.getRandomArrayIndex(array);
        expect(index).toBeGreaterThanOrEqual(0);
        expect(index).toBeLessThan(array.length);
      }
    });

    it('gets random array element', () => {
      const array = [1, 2, 3, 4, 5];
      for (let i = 0; i < 100; i++) {
        const element = ArrayUtils.getRandomArrayElement(array);
        expect(array).toContain(element);
      }
    });
  });
});
