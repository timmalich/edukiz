import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { wordConfigs as wordPhoneConfigs } from '@/components/mixins/wordPhoneConfigs.js';
import { logger } from '@/utils/logger.js';

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

vi.mock('@interactjs/interactjs', () => {
  const mockInteract = vi.fn(() => ({
    dropzone: vi.fn().mockReturnThis(),
    draggable: vi.fn().mockReturnThis(),
    unset: vi.fn(),
  }));
  mockInteract.dropzone = vi.fn().mockReturnThis();
  mockInteract.draggable = vi.fn().mockReturnThis();
  mockInteract.unset = vi.fn();
  return { default: mockInteract };
});

import { dragDrop } from '@/components/mixins/dragDrop.js';

describe('Mixins and Utils Integration Tests', () => {
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

  describe('dragDrop mixin', () => {
    it('has unmounted method that unsets interact', () => {
      expect(typeof dragDrop.unmounted).toBe('function');
    });

    it('has resetDragAndDropSuccessions method', () => {
      expect(typeof dragDrop.methods.resetDragAndDropSuccessions).toBe('function');
    });

    it('has markSuccess method', () => {
      expect(typeof dragDrop.methods.markSuccess).toBe('function');
    });

    it('has resetSuccessionDropMark method', () => {
      expect(typeof dragDrop.methods.resetSuccessionDropMark).toBe('function');
    });

    it('has resetSuccessionDragMark method', () => {
      expect(typeof dragDrop.methods.resetSuccessionDragMark).toBe('function');
    });

    it('has initDragDrop method', () => {
      expect(typeof dragDrop.methods.initDragDrop).toBe('function');
    });

    it('markSuccess adds and removes correct classes', () => {
      const dropzone = document.createElement('div');
      dropzone.classList.add('dropzone', 'empty-droppable-element');
      const dragEl = document.createElement('div');
      dragEl.classList.add('draggable-element');

      dragDrop.methods.markSuccess(dropzone, dragEl);

      expect(dropzone.classList.contains('drop-success')).toBe(true);
      expect(dropzone.classList.contains('empty-droppable-element')).toBe(false);
      expect(dragEl.classList.contains('drag-success')).toBe(true);
    });

    it('resetSuccessionDropMark removes drop-success and adds empty-droppable-element', () => {
      const element = document.createElement('div');
      element.classList.add('drop-success');

      dragDrop.methods.resetSuccessionDropMark(element);

      expect(element.classList.contains('drop-success')).toBe(false);
      expect(element.classList.contains('empty-droppable-element')).toBe(true);
    });

    it('resetSuccessionDragMark removes drag-success', () => {
      const element = document.createElement('div');
      element.classList.add('drag-success');

      dragDrop.methods.resetSuccessionDragMark(element);

      expect(element.classList.contains('drag-success')).toBe(false);
    });

    it('resetDragAndDropSuccessions calls mark methods for all elements', () => {
      const dropzone1 = document.createElement('div');
      dropzone1.classList.add('dropzone', 'drop-success');
      const dropzone2 = document.createElement('div');
      dropzone2.classList.add('dropzone', 'drop-success');
      const drag1 = document.createElement('div');
      drag1.classList.add('draggable-element', 'drag-success');
      const drag2 = document.createElement('div');
      drag2.classList.add('draggable-element', 'drag-success');
      document.body.appendChild(dropzone1);
      document.body.appendChild(dropzone2);
      document.body.appendChild(drag1);
      document.body.appendChild(drag2);

      const vm = { ...dragDrop.methods };
      vm.resetDragAndDropSuccessions();

      expect(dropzone1.classList.contains('drop-success')).toBe(false);
      expect(dropzone1.classList.contains('empty-droppable-element')).toBe(true);
      expect(dropzone2.classList.contains('drop-success')).toBe(false);
      expect(dropzone2.classList.contains('empty-droppable-element')).toBe(true);
      expect(drag1.classList.contains('drag-success')).toBe(false);
      expect(drag2.classList.contains('drag-success')).toBe(false);

      document.body.removeChild(dropzone1);
      document.body.removeChild(dropzone2);
      document.body.removeChild(drag1);
      document.body.removeChild(drag2);
    });

    it('initDragDrop calls interact.dropzone and interact.draggable', async () => {
      const interactModule = await import('@interactjs/interactjs');
      const interact = interactModule.default;
      const vm = {
        ...dragDrop.methods,
        ondrop: vi.fn(() => true),
        ondragstart: vi.fn(),
      };

      vm.initDragDrop(false);

      expect(interact).toHaveBeenCalled();
      expect(interact.mock.results[0].value.dropzone).toHaveBeenCalled();
      expect(interact.mock.results[1].value.draggable).toHaveBeenCalled();
    });

    it('initDragDrop with lockDropzoneSuccessfulAfterDrag=true checks drop-success class', async () => {
      const interactModule = await import('@interactjs/interactjs');
      const interact = interactModule.default;
      const vm = {
        ...dragDrop.methods,
        ondrop: vi.fn(() => true),
        ondragstart: vi.fn(),
      };

      vm.initDragDrop(true);

      expect(interact).toHaveBeenCalled();
      expect(interact.mock.results[0].value.dropzone).toHaveBeenCalled();
      expect(interact.mock.results[1].value.draggable).toHaveBeenCalled();
    });

    it('unmounted calls interact.unset', async () => {
      const interactModule = await import('@interactjs/interactjs');
      const interact = interactModule.default;
      dragDrop.unmounted();
      expect(interact).toHaveBeenCalledTimes(2);
      expect(interact.mock.results[0].value.unset).toHaveBeenCalled();
      expect(interact.mock.results[1].value.unset).toHaveBeenCalled();
    });
  });

  describe('wordPhoneConfigs mixin', () => {
    it('exports wordPhoneConfigs array', () => {
      expect(wordPhoneConfigs).toBeDefined();
      expect(typeof wordPhoneConfigs.data).toBe('function');
    });

    it('returns wordPhoneConfigs with correct structure', () => {
      const data = wordPhoneConfigs.data();
      expect(data.wordPhoneConfigs).toBeDefined();
      expect(Array.isArray(data.wordPhoneConfigs)).toBe(true);
      expect(data.wordPhoneConfigs.length).toBe(3);
    });

    it('has correct wordLength and phones for each config', () => {
      const data = wordPhoneConfigs.data();
      expect(data.wordPhoneConfigs[0]).toEqual({ wordLength: 2, phones: [['j', 'a']] });
      expect(data.wordPhoneConfigs[1]).toEqual({ wordLength: 3, phones: [['f', 'o', 'o']] });
      expect(data.wordPhoneConfigs[2]).toEqual({
        wordLength: 4,
        phones: [
          ['m', 'a', 'm', 'a'],
          ['p', 'a', 'p', 'a'],
        ],
      });
    });
  });

  describe('logger utility', () => {
    it('exports logger object with error, warn, info, log methods', () => {
      expect(logger).toBeDefined();
      expect(typeof logger.error).toBe('function');
      expect(typeof logger.warn).toBe('function');
      expect(typeof logger.info).toBe('function');
      expect(typeof logger.log).toBe('function');
    });

    it('error calls console.error in dev mode', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      logger.error('test error', { detail: 'info' });

      expect(consoleSpy).toHaveBeenCalledWith('test error', { detail: 'info' });
      consoleSpy.mockRestore();
    });

    it('warn calls console.warn in dev mode', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      logger.warn('test warning');

      expect(consoleSpy).toHaveBeenCalledWith('test warning');
      consoleSpy.mockRestore();
    });

    it('info calls console.info in dev mode', () => {
      const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});

      logger.info('test info');

      expect(consoleSpy).toHaveBeenCalledWith('test info');
      consoleSpy.mockRestore();
    });

    it('log calls console.log in dev mode', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      logger.log('test log');

      expect(consoleSpy).toHaveBeenCalledWith('test log');
      consoleSpy.mockRestore();
    });
  });
});
