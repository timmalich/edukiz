import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import mitt from 'mitt';
import Game from '@/components/Game.vue';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import NavPage from '@/components/NavPage.vue';
import LinkTile from '@/components/LinkTile.vue';
import ImageContainer from '@/components/ImageContainer.vue';
import ErrorAnimation from '@/components/ErrorAnimation.vue';
import Home from '@/components/Home.vue';
import MemoryNavPage from '@/components/memory/MemoryNavPage.vue';
import DDNavPage from '@/components/drag_drop/DDNavPage.vue';
import MiscNavPage from '@/components/misc/MiscNavPage.vue';

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
          $router: { push: vi.fn() },
        },
      },
    },
    ...options,
  });
};

describe('Common Components Integration Tests', () => {
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

  describe('Game', () => {
    it('renders header, content slot, and footer', () => {
      wrapper = createWrapper(Game, {
        props: {
          navBackPath: '/',
          isHighlightAnimationRunning: false,
          explanation: 'test',
          currentLevel: 1,
          previousLevelDisabled: false,
          nextLevelDisabled: false,
        },
        slots: {
          default: '<div class="game-content">Test Content</div>',
          header: '<div class="header-slot">Header Slot</div>',
        },
      });

      expect(wrapper.findComponent(Header).exists()).toBe(true);
      expect(wrapper.findComponent(Footer).exists()).toBe(true);
      expect(wrapper.find('.game-content').exists()).toBe(true);
      expect(wrapper.find('.header-slot').exists()).toBe(true);
      expect(wrapper.find('.game-content').text()).toBe('Test Content');
    });

    it('emits previous, restart, and next events', () => {
      wrapper = createWrapper(Game, {
        props: {
          navBackPath: '/',
          isHighlightAnimationRunning: false,
          explanation: 'test',
          currentLevel: 1,
          previousLevelDisabled: false,
          nextLevelDisabled: false,
        },
      });

      wrapper.vm.previous();
      expect(wrapper.emitted('previous')).toBeTruthy();

      wrapper.vm.restart();
      expect(wrapper.emitted('restart')).toBeTruthy();

      wrapper.vm.next();
      expect(wrapper.emitted('next')).toBeTruthy();
    });
  });

  describe('Header', () => {
    it('renders back button when navBackPath provided', () => {
      wrapper = createWrapper(Header, {
        props: {
          navBackPath: '/',
          sound: 'test',
          currentLevel: 1,
        },
      });

      expect(wrapper.find('.header-left .game-button').exists()).toBe(true);
      expect(wrapper.find('.fa-reply').exists()).toBe(true);
    });

    it('renders help button when sound provided', () => {
      wrapper = createWrapper(Header, {
        props: {
          navBackPath: '/',
          sound: 'test',
          currentLevel: 1,
        },
      });

      const buttons = wrapper.findAll('.header-left .game-button');
      expect(buttons.length).toBe(2);
      expect(wrapper.find('.fa-question').exists()).toBe(true);
      expect(wrapper.find('.fa-headphones').exists()).toBe(true);
    });

    it('does not render back button when navBackPath not provided', () => {
      wrapper = createWrapper(Header, {
        props: {
          navBackPath: '',
          sound: 'test',
          currentLevel: 1,
        },
      });

      const buttons = wrapper.findAll('.header-left .game-button');
      expect(buttons.length).toBe(1);
    });

    it('navBack calls router.push', () => {
      wrapper = createWrapper(Header, {
        props: {
          navBackPath: '/test',
          sound: 'test',
          currentLevel: 1,
        },
      });

      wrapper.vm.navBack();
      expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/test');
    });

    it('playGameExplanation calls SoundUtils.playExplanation', () => {
      wrapper = createWrapper(Header, {
        props: {
          navBackPath: '/',
          sound: 'test_explanation',
          currentLevel: 1,
        },
      });

      wrapper.vm.playGameExplanation();
    });

    it('showRewardPreview activates and deactivates preview', () => {
      wrapper = createWrapper(Header, {
        props: {
          navBackPath: '/',
          sound: 'test',
          currentLevel: 1,
        },
      });

      expect(wrapper.vm.isRewardPreviewActive).toBe(false);
      wrapper.vm.showRewardPreview();
      expect(wrapper.vm.isRewardPreviewActive).toBe(true);

      vi.advanceTimersByTime(2000);
      expect(wrapper.vm.isRewardPreviewActive).toBe(false);
    });

    it('showReward triggers reward animation', () => {
      wrapper = createWrapper(Header, {
        props: {
          navBackPath: '/',
          sound: 'test',
          currentLevel: 1,
        },
      });

      wrapper.vm.showReward(2);
      expect(wrapper.vm.isRewardShowActive).toBe(true);

      vi.advanceTimersByTime(4000);
      expect(wrapper.vm.isRewardShowActive).toBe(false);
    });

    it('getRewardHeaderImage returns correct image', () => {
      wrapper = createWrapper(Header, {
        props: {
          navBackPath: '/',
          sound: 'test',
          currentLevel: 1,
        },
      });

      wrapper.vm.rewards = 15;
      const image = wrapper.vm.getRewardHeaderImage();
      expect(image).toContain('img/');
      expect(image).toContain('.svg');
    });

    it('getNextRewardImage returns correct image', () => {
      wrapper = createWrapper(Header, {
        props: {
          navBackPath: '/',
          sound: 'test',
          currentLevel: 1,
        },
      });

      wrapper.vm.rewards = 15;
      const image = wrapper.vm.getNextRewardImage();
      expect(image).toContain('img/');
      expect(image).toContain('.svg');
    });
  });

  describe('Footer', () => {
    it('renders all buttons', () => {
      wrapper = createWrapper(Footer, {
        props: {
          isHighlightAnimationRunning: false,
          nextLevelDisabled: false,
          previousLevelDisabled: false,
          gameSwitchesHidden: false,
        },
      });

      expect(wrapper.find('.fa-arrow-alt-circle-left').exists()).toBe(true);
      expect(wrapper.find('.fa-redo-alt').exists()).toBe(true);
      expect(wrapper.find('.fa-arrow-alt-circle-right').exists()).toBe(true);
      expect(wrapper.findAll('.voiceOption').length).toBe(3);
    });

    it('disables previous button when previousLevelDisabled', () => {
      wrapper = createWrapper(Footer, {
        props: {
          isHighlightAnimationRunning: false,
          nextLevelDisabled: false,
          previousLevelDisabled: true,
          gameSwitchesHidden: false,
        },
      });

      const prevButton = wrapper.find('.fa-arrow-alt-circle-left').element.parentElement;
      expect(prevButton.classList.contains('disabled')).toBe(true);
    });

    it('disables next button when nextLevelDisabled', () => {
      wrapper = createWrapper(Footer, {
        props: {
          isHighlightAnimationRunning: false,
          nextLevelDisabled: true,
          previousLevelDisabled: false,
          gameSwitchesHidden: false,
        },
      });

      const nextButton = wrapper.find('.fa-arrow-alt-circle-right').element.parentElement;
      expect(nextButton.classList.contains('disabled')).toBe(true);
    });

    it('hides game switches when gameSwitchesHidden', () => {
      wrapper = createWrapper(Footer, {
        props: {
          isHighlightAnimationRunning: false,
          nextLevelDisabled: false,
          previousLevelDisabled: false,
          gameSwitchesHidden: true,
        },
      });

      const buttons = wrapper.findAll('.game-button');
      buttons.forEach((button) => {
        expect(button.classes()).toContain('gameSwitchesHidden');
      });
    });

    it('emits previous, restart, next events', () => {
      wrapper = createWrapper(Footer, {
        props: {
          isHighlightAnimationRunning: false,
          nextLevelDisabled: false,
          previousLevelDisabled: false,
          gameSwitchesHidden: false,
        },
      });

      wrapper.vm.previous();
      expect(wrapper.emitted('previous')).toBeTruthy();

      wrapper.vm.restart();
      expect(wrapper.emitted('restart')).toBeTruthy();

      wrapper.vm.next();
      expect(wrapper.emitted('next')).toBeTruthy();
    });

    it('does not emit previous when disabled', () => {
      wrapper = createWrapper(Footer, {
        props: {
          isHighlightAnimationRunning: false,
          nextLevelDisabled: false,
          previousLevelDisabled: true,
          gameSwitchesHidden: false,
        },
      });

      wrapper.vm.previous();
      expect(wrapper.emitted('previous')).toBeFalsy();
    });

    it('does not emit next when disabled', () => {
      wrapper = createWrapper(Footer, {
        props: {
          isHighlightAnimationRunning: false,
          nextLevelDisabled: true,
          previousLevelDisabled: false,
          gameSwitchesHidden: false,
        },
      });

      wrapper.vm.next();
      expect(wrapper.emitted('next')).toBeFalsy();
    });

    it('useBoyVoice changes voice and plays sound', () => {
      wrapper = createWrapper(Footer, {
        props: {
          isHighlightAnimationRunning: false,
          nextLevelDisabled: false,
          previousLevelDisabled: false,
          gameSwitchesHidden: false,
        },
      });

      wrapper.vm.useBoyVoice();
      expect(wrapper.vm.voiceOptionImageBoy).toBe('img/boy_happy.png');
      expect(wrapper.vm.voiceOptionImageGirl).toBe('img/girl_bored.png');
    });

    it('useGirlVoice changes voice and plays sound', () => {
      wrapper = createWrapper(Footer, {
        props: {
          isHighlightAnimationRunning: false,
          nextLevelDisabled: false,
          previousLevelDisabled: false,
          gameSwitchesHidden: false,
        },
      });

      wrapper.vm.useGirlVoice();
      expect(wrapper.vm.voiceOptionImageBoy).toBe('img/boy_bored.png');
      expect(wrapper.vm.voiceOptionImageGirl).toBe('img/girl_happy.png');
    });
  });

  describe('NavPage', () => {
    it('renders header, link area, and footer', () => {
      wrapper = createWrapper(NavPage, {
        props: { navBackPath: '/' },
        slots: {
          default: '<div class="test-slot">Test Slot Content</div>',
        },
      });

      expect(wrapper.findComponent(Header).exists()).toBe(true);
      expect(wrapper.findComponent(Footer).exists()).toBe(true);
      expect(wrapper.find('.link-area').exists()).toBe(true);
      expect(wrapper.find('.test-slot').exists()).toBe(true);
    });

    it('passes navBackPath to header', () => {
      wrapper = createWrapper(NavPage, {
        props: { navBackPath: '/custom' },
      });

      expect(wrapper.findComponent(Header).props('navBackPath')).toBe('/custom');
    });

    it('passes correct props to footer', () => {
      wrapper = createWrapper(NavPage, {
        props: { navBackPath: '/' },
      });

      const footer = wrapper.findComponent(Footer);
      expect(footer.props('previousLevelDisabled')).toBe(true);
      expect(footer.props('nextLevelDisabled')).toBe(true);
      expect(footer.props('gameSwitchesHidden')).toBe(true);
    });
  });

  describe('LinkTile', () => {
    it('renders image with title and click handler', () => {
      wrapper = createWrapper(LinkTile, {
        props: {
          title: 'Test Game',
          navPath: '/test',
          src: 'test.png',
          alt: 'test game',
        },
      });

      expect(wrapper.find('img').attributes('src')).toBe('test.png');
      expect(wrapper.find('img').attributes('alt')).toBe('test game');
      expect(wrapper.text()).toContain('Test Game');
    });
  });

  describe('ImageContainer', () => {
    it('renders image with src', () => {
      wrapper = createWrapper(ImageContainer, {
        props: { src: 'test.png' },
      });

      expect(wrapper.find('img').attributes('src')).toBe('test.png');
    });

    it('renders with wrapper div', () => {
      wrapper = createWrapper(ImageContainer, {
        props: { src: 'test.png' },
      });

      expect(wrapper.find('.wrapper').exists()).toBe(true);
    });
  });

  describe('ErrorAnimation', () => {
    it('renders error animation container', () => {
      wrapper = createWrapper(ErrorAnimation);

      expect(wrapper.find('div').exists()).toBe(true);
    });

    it('showError adds error animation element', async () => {
      wrapper = createWrapper(ErrorAnimation);

      wrapper.vm.showError();
      await flushPromises();

      expect(wrapper.find('.error-animation').exists()).toBe(true);
    });
  });

  describe('Home', () => {
    it('renders three link tiles', () => {
      wrapper = createWrapper(Home);

      const linkTiles = wrapper.findAllComponents(LinkTile);
      expect(linkTiles.length).toBe(3);
      expect(linkTiles[0].props('title')).toBe('Memory');
      expect(linkTiles[1].props('title')).toBe('Bewegen');
      expect(linkTiles[2].props('title')).toBe('Sonstiges');
    });
  });

  describe('MemoryNavPage', () => {
    it('renders two link tiles for memory games', () => {
      wrapper = createWrapper(MemoryNavPage);

      const linkTiles = wrapper.findAllComponents(LinkTile);
      expect(linkTiles.length).toBe(2);
      expect(linkTiles[0].props('title')).toBe('Bilder');
      expect(linkTiles[1].props('title')).toBe('ABC & 123');
    });
  });

  describe('DDNavPage', () => {
    it('renders link tiles for drag drop games', () => {
      wrapper = createWrapper(DDNavPage);

      const linkTiles = wrapper.findAllComponents(LinkTile);
      expect(linkTiles.length).toBe(2);
    });
  });

  describe('MiscNavPage', () => {
    it('renders link tiles for misc games', () => {
      wrapper = createWrapper(MiscNavPage);

      const linkTiles = wrapper.findAllComponents(LinkTile);
      expect(linkTiles.length).toBe(2);
    });
  });
});
