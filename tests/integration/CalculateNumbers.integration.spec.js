import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import mitt from 'mitt';
import CalculateNumbers0To18 from '@/components/misc/CalculateNumbers0To18.vue';
import { CharacterUtils } from '@/components/utils/CharacterUtils.js';

vi.spyOn(window.HTMLMediaElement.prototype, 'play').mockImplementation(() => Promise.resolve());
vi.spyOn(window.HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
vi.spyOn(window.HTMLMediaElement.prototype, 'load').mockImplementation(() => {});
vi.spyOn(window.HTMLMediaElement.prototype, 'addEventListener').mockImplementation(() => {});
vi.spyOn(window.HTMLMediaElement.prototype, 'removeEventListener').mockImplementation(() => {});

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
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

describe('CalculateNumbers0To18 Integration Tests', () => {
  let wrapper;

  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.calculateNumbers0To18_selectedLevel = '1';
    localStorage.calculateNumbers0To18_unlockedLevels = '1';
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
    vi.useRealTimers();
    vi.clearAllMocks();
    delete localStorage.calculateNumbers0To18_selectedLevel;
    delete localStorage.calculateNumbers0To18_unlockedLevels;
  });

  describe('CalculateNumbers0To18', () => {
    it('renders correctly with number configs', () => {
      wrapper = createWrapper(CalculateNumbers0To18);
      expect(wrapper.vm.numberConfigs).toBeDefined();
      expect(wrapper.vm.numberConfigs.length).toBe(10);
      wrapper.vm.numberConfigs.forEach((config, index) => {
        expect(config.number).toBe(index);
        expect(config.image).toContain('img/characters/');
        expect(config.sound).toContain('de/characters/');
      });
    });

    it('initializes with correct default values', () => {
      wrapper = createWrapper(CalculateNumbers0To18);
      expect(wrapper.vm.selectedLevel).toBe(1);
      expect(wrapper.vm.unlockedLevels).toBe(1);
      expect(wrapper.vm.maxLevel).toBe(6);
      expect(wrapper.vm.finishedRounds).toBe(0);
      expect(wrapper.vm.isGameOver).toBe(false);
      expect(wrapper.vm.isLevelFinished).toBe(false);
      expect(wrapper.vm.operator.character).toBe('+');
    });

    it('loads selected level from localStorage', () => {
      localStorage.calculateNumbers0To18_selectedLevel = '3';
      localStorage.calculateNumbers0To18_unlockedLevels = '4';
      wrapper = createWrapper(CalculateNumbers0To18);
      expect(wrapper.vm.selectedLevel).toBe(3);
      expect(wrapper.vm.unlockedLevels).toBe(4);
    });

    it('generates level 1: addition with total max 5, 4 choices', () => {
      wrapper = createWrapper(CalculateNumbers0To18);
      wrapper.vm.selectedLevel = 1;
      wrapper.vm.generateLevel();

      expect(wrapper.vm.firstElement.number).toBeGreaterThanOrEqual(0);
      expect(wrapper.vm.firstElement.number).toBeLessThanOrEqual(9);
      expect(wrapper.vm.secondElement.number).toBeGreaterThanOrEqual(0);
      expect(wrapper.vm.secondElement.number).toBeLessThanOrEqual(9);
      expect(wrapper.vm.firstElement.number + wrapper.vm.secondElement.number).toBeLessThanOrEqual(
        5
      );
      expect(wrapper.vm.solution.asInt).toBe(
        wrapper.vm.firstElement.number + wrapper.vm.secondElement.number
      );
      expect(wrapper.vm.choicesAmount).toBe(4);
      expect(wrapper.vm.operator.character).toBe('+');
    });

    it('generates level 2: addition with total max 5', () => {
      wrapper = createWrapper(CalculateNumbers0To18);
      wrapper.vm.selectedLevel = 2;
      wrapper.vm.generateLevel();

      expect(wrapper.vm.firstElement.number + wrapper.vm.secondElement.number).toBeLessThanOrEqual(
        5
      );
      expect(wrapper.vm.solution.asInt).toBe(
        wrapper.vm.firstElement.number + wrapper.vm.secondElement.number
      );
      expect(wrapper.vm.operator.character).toBe('+');
    });

    it('generates level 3: addition with total max 9', () => {
      wrapper = createWrapper(CalculateNumbers0To18);
      wrapper.vm.selectedLevel = 3;
      wrapper.vm.generateLevel();

      expect(wrapper.vm.firstElement.number + wrapper.vm.secondElement.number).toBeLessThanOrEqual(
        9
      );
      expect(wrapper.vm.solution.asInt).toBe(
        wrapper.vm.firstElement.number + wrapper.vm.secondElement.number
      );
      expect(wrapper.vm.operator.character).toBe('+');
    });

    it('generates level 4: addition 0-18', () => {
      wrapper = createWrapper(CalculateNumbers0To18);
      wrapper.vm.selectedLevel = 4;
      wrapper.vm.generateLevel();

      expect(wrapper.vm.firstElement.number).toBeGreaterThanOrEqual(0);
      expect(wrapper.vm.firstElement.number).toBeLessThanOrEqual(9);
      expect(wrapper.vm.secondElement.number).toBeGreaterThanOrEqual(0);
      expect(wrapper.vm.secondElement.number).toBeLessThanOrEqual(9);
      expect(wrapper.vm.solution.asInt).toBe(
        wrapper.vm.firstElement.number + wrapper.vm.secondElement.number
      );
      expect(wrapper.vm.operator.character).toBe('+');
    });

    it('generates level 5: subtraction', () => {
      wrapper = createWrapper(CalculateNumbers0To18);
      wrapper.vm.selectedLevel = 5;
      wrapper.vm.generateLevel();

      expect(wrapper.vm.firstElement.number).toBeGreaterThanOrEqual(0);
      expect(wrapper.vm.firstElement.number).toBeLessThanOrEqual(9);
      expect(wrapper.vm.secondElement.number).toBeGreaterThanOrEqual(0);
      expect(wrapper.vm.secondElement.number).toBeLessThanOrEqual(9);
      expect(wrapper.vm.firstElement.number).toBeGreaterThanOrEqual(
        wrapper.vm.secondElement.number
      );
      expect(wrapper.vm.solution.asInt).toBe(
        wrapper.vm.firstElement.number - wrapper.vm.secondElement.number
      );
      expect(wrapper.vm.operator.character).toBe('-');
    });

    it('generates level 6+: alternates addition and subtraction', () => {
      wrapper = createWrapper(CalculateNumbers0To18);
      wrapper.vm.selectedLevel = 6;
      wrapper.vm.finishedRounds = 0;
      wrapper.vm.generateLevel();
      const firstOperator = wrapper.vm.operator.character;

      wrapper.vm.finishedRounds = 1;
      wrapper.vm.generateLevel();
      const secondOperator = wrapper.vm.operator.character;

      expect(firstOperator).not.toBe(secondOperator);
      expect(['+', '-']).toContain(firstOperator);
      expect(['+', '-']).toContain(secondOperator);
    });

    it('creates solution correctly for single digit', () => {
      wrapper = createWrapper(CalculateNumbers0To18);
      const solution = wrapper.vm.createSolution(5);
      expect(solution.asInt).toBe(5);
      expect(solution.numberConfigs.length).toBe(1);
      expect(solution.numberConfigs[0].number).toBe(5);
    });

    it('creates solution correctly for double digit', () => {
      wrapper = createWrapper(CalculateNumbers0To18);
      const solution = wrapper.vm.createSolution(12);
      expect(solution.asInt).toBe(12);
      expect(solution.numberConfigs.length).toBe(2);
      expect(solution.numberConfigs[0].number).toBe(1);
      expect(solution.numberConfigs[1].number).toBe(2);
    });

    it('restart generates new level and choices', () => {
      wrapper = createWrapper(CalculateNumbers0To18);
      wrapper.vm.selectedLevel = 1;
      wrapper.vm.restart();

      expect(wrapper.vm.isGameOver).toBe(false);
      expect(wrapper.vm.isLevelFinished).toBe(false);
      expect(wrapper.vm.droppedNumbers.length).toBe(0);
      expect(wrapper.vm.choices.length).toBeGreaterThan(0);
      expect(
        wrapper.vm.choices.some((c) => c.number === wrapper.vm.solution.numberConfigs[0].number)
      ).toBe(true);
    });

    it('handles correct number drop', () => {
      wrapper = createWrapper(CalculateNumbers0To18);
      wrapper.vm.selectedLevel = 1;
      wrapper.vm.restart();

      const expectedNumber = wrapper.vm.solution.numberConfigs[0].number;
      const choiceIndex = wrapper.vm.choices.findIndex((c) => c.number === expectedNumber);
      expect(choiceIndex).toBeGreaterThanOrEqual(0);

      const dragElement = {
        getAttribute: vi.fn((attr) => {
          if (attr === 'data-identifier') return expectedNumber.toString();
          if (attr === 'data-draggable-index') return choiceIndex.toString();
          return null;
        }),
      };
      const event = { relatedTarget: dragElement };

      const result = wrapper.vm.ondrop(event);

      expect(result).toBe(true);
      expect(wrapper.vm.droppedNumbers.length).toBe(1);
      expect(wrapper.vm.droppedNumbers[0].number).toBe(expectedNumber);
    });

    it('handles incorrect number drop', () => {
      wrapper = createWrapper(CalculateNumbers0To18);
      wrapper.vm.selectedLevel = 1;
      wrapper.vm.restart();

      const wrongNumber = 99;
      const dragElement = {
        getAttribute: vi.fn((attr) => {
          if (attr === 'data-identifier') return wrongNumber.toString();
          if (attr === 'data-draggable-index') return '0';
          return null;
        }),
      };
      const event = { relatedTarget: dragElement };

      const result = wrapper.vm.ondrop(event);

      expect(result).toBe(false);
      expect(wrapper.vm.droppedNumbers.length).toBe(0);
    });

    it('completes level when all solution numbers dropped', () => {
      wrapper = createWrapper(CalculateNumbers0To18);
      wrapper.vm.selectedLevel = 1;
      wrapper.vm.restart();

      for (const solutionPart of wrapper.vm.solution.numberConfigs) {
        const choiceIndex = wrapper.vm.choices.findIndex((c) => c.number === solutionPart.number);
        expect(choiceIndex).toBeGreaterThanOrEqual(0);

        const dragElement = {
          getAttribute: vi.fn((attr) => {
            if (attr === 'data-identifier') return solutionPart.number.toString();
            if (attr === 'data-draggable-index') return choiceIndex.toString();
            return null;
          }),
        };
        const event = { relatedTarget: dragElement };
        wrapper.vm.ondrop(event);
      }

      expect(wrapper.vm.isLevelFinished).toBe(true);
      expect(wrapper.vm.finishedRounds).toBe(1);
    });

    it('increases level after 3 finished rounds', () => {
      wrapper = createWrapper(CalculateNumbers0To18);
      wrapper.vm.selectedLevel = 1;
      wrapper.vm.unlockedLevels = 1;
      wrapper.vm.maxLevel = 6;

      wrapper.vm.levelCompleted();
      wrapper.vm.levelCompleted();
      wrapper.vm.levelCompleted();

      expect(wrapper.vm.finishedRounds).toBe(3);
      expect(wrapper.vm.selectedLevel).toBe(2);
      expect(wrapper.vm.unlockedLevels).toBe(2);
    });

    it('does not increase level above maxLevel', () => {
      wrapper = createWrapper(CalculateNumbers0To18);
      wrapper.vm.selectedLevel = 5;
      wrapper.vm.unlockedLevels = 5;
      wrapper.vm.maxLevel = 6;

      for (let i = 0; i < 3; i++) {
        wrapper.vm.levelCompleted();
      }

      expect(wrapper.vm.selectedLevel).toBe(6);
      expect(wrapper.vm.unlockedLevels).toBe(6);

      wrapper.vm.levelCompleted();
      expect(wrapper.vm.selectedLevel).toBe(6);
      expect(wrapper.vm.unlockedLevels).toBe(6);
    });

    it('navigates between levels', () => {
      wrapper = createWrapper(CalculateNumbers0To18);
      wrapper.vm.unlockedLevels = 3;

      expect(wrapper.vm.selectedLevel).toBe(1);

      wrapper.vm.nextLevel();
      expect(wrapper.vm.selectedLevel).toBe(2);

      wrapper.vm.nextLevel();
      expect(wrapper.vm.selectedLevel).toBe(3);

      wrapper.vm.previousLevel();
      expect(wrapper.vm.selectedLevel).toBe(2);
    });

    it('does not exceed unlocked levels', () => {
      wrapper = createWrapper(CalculateNumbers0To18);
      wrapper.vm.unlockedLevels = 2;
      wrapper.vm.selectedLevel = 2;

      wrapper.vm.nextLevel();
      expect(wrapper.vm.selectedLevel).toBe(2);
    });

    it('does not go below level 1', () => {
      wrapper = createWrapper(CalculateNumbers0To18);
      wrapper.vm.selectedLevel = 1;

      wrapper.vm.previousLevel();
      expect(wrapper.vm.selectedLevel).toBe(1);
    });

    it('getTwoRandomNumbersHavingATotalOfMaxN returns valid pairs', () => {
      wrapper = createWrapper(CalculateNumbers0To18);
      for (let i = 0; i < 100; i++) {
        const result = wrapper.vm.getTwoRandomNumbersHavingATotalOfMaxN(9);
        expect(result.length).toBe(2);
        expect(result[0] + result[1]).toBeLessThanOrEqual(9);
        expect(result[0]).toBeGreaterThanOrEqual(0);
        expect(result[1]).toBeGreaterThanOrEqual(0);
      }
    });

    it('getTwoRandomNumbersHavingATotalOfMaxN works for maxTotal 5', () => {
      wrapper = createWrapper(CalculateNumbers0To18);
      for (let i = 0; i < 100; i++) {
        const result = wrapper.vm.getTwoRandomNumbersHavingATotalOfMaxN(5);
        expect(result.length).toBe(2);
        expect(result[0] + result[1]).toBeLessThanOrEqual(5);
        expect(result[0]).toBeGreaterThanOrEqual(0);
        expect(result[1]).toBeGreaterThanOrEqual(0);
      }
    });

    it('handles level buttons correctly', () => {
      wrapper = createWrapper(CalculateNumbers0To18);
      wrapper.vm.selectedLevel = 1;
      wrapper.vm.unlockedLevels = 1;
      wrapper.vm.handleLevelButtons();
      expect(wrapper.vm.previousLevelDisabled).toBe(true);
      expect(wrapper.vm.nextLevelDisabled).toBe(true);

      wrapper.vm.unlockedLevels = 3;
      wrapper.vm.handleLevelButtons();
      expect(wrapper.vm.previousLevelDisabled).toBe(true);
      expect(wrapper.vm.nextLevelDisabled).toBe(false);

      wrapper.vm.selectedLevel = 2;
      wrapper.vm.handleLevelButtons();
      expect(wrapper.vm.previousLevelDisabled).toBe(false);
      expect(wrapper.vm.nextLevelDisabled).toBe(false);
    });

    it('generateLevel default case alternates addition and subtraction for level 6+', () => {
      wrapper = createWrapper(CalculateNumbers0To18);
      wrapper.vm.selectedLevel = 6;
      wrapper.vm.finishedRounds = 0;
      wrapper.vm.generateLevel();
      expect(['+', '-']).toContain(wrapper.vm.operator.character);
      const firstOp = wrapper.vm.operator.character;

      wrapper.vm.finishedRounds = 1;
      wrapper.vm.generateLevel();
      expect(wrapper.vm.operator.character).not.toBe(firstOp);

      wrapper.vm.finishedRounds = 2;
      wrapper.vm.generateLevel();
      expect(wrapper.vm.operator.character).toBe(firstOp);
    });

    it('ondrop handles errorAnimation callback with solution length > 1', () => {
      wrapper = createWrapper(CalculateNumbers0To18);
      wrapper.vm.selectedLevel = 4;
      wrapper.vm.restart();

      wrapper.vm.solution = {
        asInt: 12,
        numberConfigs: [
          { number: 1, image: 'img/1.svg' },
          { number: 2, image: 'img/2.svg' },
        ],
      };
      wrapper.vm.firstElement = { number: 5 };
      wrapper.vm.secondElement = { number: 7 };
      wrapper.vm.operator = { character: '+' };

      const wrongNumber = 9;
      const dragElement = {
        getAttribute: vi.fn((attr) => {
          if (attr === 'data-identifier') return wrongNumber.toString();
          if (attr === 'data-draggable-index') return '0';
          return null;
        }),
      };
      const event = { relatedTarget: dragElement };
      wrapper.vm.ondrop(event);
    });

    it('ondrop handles errorAnimation callback with solution length = 1', () => {
      wrapper = createWrapper(CalculateNumbers0To18);
      wrapper.vm.selectedLevel = 1;
      wrapper.vm.restart();

      wrapper.vm.solution = {
        asInt: 5,
        numberConfigs: [{ number: 5, image: 'img/5.svg' }],
      };
      wrapper.vm.firstElement = { number: 2 };
      wrapper.vm.secondElement = { number: 3 };
      wrapper.vm.operator = { character: '+' };

      const wrongNumber = 9;
      const dragElement = {
        getAttribute: vi.fn((attr) => {
          if (attr === 'data-identifier') return wrongNumber.toString();
          if (attr === 'data-draggable-index') return '0';
          return null;
        }),
      };
      const event = { relatedTarget: dragElement };
      wrapper.vm.ondrop(event);
    });

    it('levelCompleted plays audio sequence for subtraction', () => {
      wrapper = createWrapper(CalculateNumbers0To18);
      wrapper.vm.selectedLevel = 5;
      wrapper.vm.firstElement = { number: 8 };
      wrapper.vm.secondElement = { number: 3 };
      wrapper.vm.operator = { character: '-' };
      wrapper.vm.solution = { asInt: 5, numberConfigs: [{ number: 5 }] };
      wrapper.vm.finishedRounds = 2;

      wrapper.vm.levelCompleted();

      expect(wrapper.vm.isLevelFinished).toBe(true);
      expect(wrapper.vm.finishedRounds).toBe(3);
    });

    it('increaseLevel returns false when maxLevel reached', () => {
      wrapper = createWrapper(CalculateNumbers0To18);
      wrapper.vm.selectedLevel = 6;
      wrapper.vm.maxLevel = 6;
      wrapper.vm.finishedRounds = 3;

      const result = wrapper.vm.increaseLevel();

      expect(result).toBe(false);
      expect(wrapper.vm.selectedLevel).toBe(6);
    });

    it('createSolution handles numbers 10-18', () => {
      wrapper = createWrapper(CalculateNumbers0To18);
      for (let i = 10; i <= 18; i++) {
        const solution = wrapper.vm.createSolution(i);
        expect(solution.asInt).toBe(i);
        expect(solution.numberConfigs.length).toBe(2);
        expect(solution.numberConfigs[0].number).toBe(Math.floor(i / 10));
        expect(solution.numberConfigs[1].number).toBe(i % 10);
      }
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

    it('creates config for operators', () => {
      const config = CharacterUtils.createConfig('+');
      expect(config.character).toBe('+');
      expect(config.image).toBe('img/characters/+.svg');
    });

    it('creates config for equals', () => {
      const config = CharacterUtils.createConfig('=');
      expect(config.character).toBe('=');
      expect(config.image).toBe('img/characters/=.svg');
    });
  });
});
