# Edukiz - Agent Instructions

## Project Overview
Edukiz is a Vue 3 educational games webapp for children, featuring memory games, drag-and-drop letter/word games, arithmetic exercises, and text-to-speech functionality. The app runs offline as a PWA.

## Tech Stack
- **Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite 6
- **Router**: Vue Router 4 (Hash mode for offline support)
- **State/Events**: Mitt (event emitter)
- **Styling**: SCSS with CSS Grid/Flexbox
- **Testing**: Vitest + Vue Test Utils
- **Linting**: ESLint 9 (flat config) + Prettier
- **PWA**: Vite PWA plugin (Workbox)
- **CI/CD**: GitHub Actions

## Project Structure
```
src/
├── main.js                 # App entry point, router setup
├── App.vue                 # Root component, global styles
├── registerServiceWorker.js # PWA registration
├── components/
│   ├── Home.vue            # Landing page with game categories
│   ├── Header.vue / Footer.vue / NavPage.vue / LinkTile.vue
│   ├── Game.vue            # Base game layout component
│   ├── ImageContainer.vue  # Image wrapper
│   ├── ErrorAnimation.vue  # Error feedback animation
│   ├── memory/
│   │   ├── MemoryNavPage.vue
│   │   ├── MemoryGame.vue  # Core memory game logic
│   │   ├── MemoryCard.vue  # Individual card component
│   │   ├── MemoryAnimals.vue / MemoryCharacters.vue
│   ├── drag_drop/
│   │   ├── DDNavPage.vue
│   │   ├── DDBuildWordsGame.vue
│   │   ├── DDCharacters.vue
│   ├── misc/
│   │   ├── MiscNavPage.vue
│   │   ├── CalculateNumbers0To18.vue
│   │   ├── TextToSpeech.vue
│   ├── utils/
│   │   ├── SoundUtils.js   # Audio management, SoundLib
│   │   ├── ArrayUtils.js   # Shuffle, etc.
│   │   ├── CharacterUtils.js / ImageUtils.js
│   ├── mixins/
│   │   ├── dragDrop.js     # Interact.js drag-drop logic
│   │   ├── characterConfigs.js / wordConfigs.js / numberConfigs.js
│   └── models/
│       └── Voice.js
public/
├── img/                    # Game assets, characters
└── sounds/                 # Audio files (de/ folder for German)
tests/
├── unit/                   # Vitest unit tests
└── e2e/                    # (Future) Playwright E2E tests
```

## Key Architectural Patterns

### Component Communication
- **Mitt emitter** (`app.config.globalProperties.emitter`) for cross-component events (rewards, sounds)
- **Props/Emits** for parent-child communication
- **Mixins** for shared game logic (drag-drop, configurations)

### Sound System
- `SoundUtils` singleton manages audio caching, playback, voice selection (boy/girl)
- `SoundLib` exports pre-configured sound objects for letters, numbers, words
- Audio files organized by language: `public/sounds/de/`

### Offline-First / PWA
- Hash router mode (`createWebHashHistory`) for file:// protocol compatibility
- Service worker caches all assets for offline use
- `publicPath: ""` in vite.config.js for relative paths

### Game Flow
1. User selects game from Home → NavPage
2. Game component (MemoryGame, DDBuildWordsGame, etc.) loads config from mixins
3. User interaction triggers sounds, level progression, rewards
4. Emitter broadcasts rewards to Header for display

## Development Commands
```bash
npm install          # Install dependencies
npm run dev          # Start dev server (Vite)
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # ESLint + Prettier check
npm run format       # Prettier write
npm run test         # Vitest run
npm run test:ui      # Vitest UI
npm run test:coverage # Coverage report
```

## Testing Strategy
- **Integration tests** (primary): Test complete user flows through Vue components using Vitest + @vue/test-utils. Focus on features, not implementation details.
- **Unit tests** (minimal): Only for pure utility functions with complex logic (e.g., `ArrayUtils.shuffleArray`, `SoundUtils.playSoundsInRow`).
- **Test files**: `tests/unit/**/*.spec.js` (legacy) and `tests/integration/**/*.integration.spec.js` (new)
- **Coverage**: v8 provider, HTML + text reports. **Minimum 95% for statements, branches, functions, and lines.**
- **Mocking**: `vi.spyOn` for external APIs (Audio, localStorage, Web Speech API). Avoid mocking internal implementation.

### Testing Principles
1. **Test features, not code paths**: Write tests that verify user-visible behavior (e.g., "completing a level unlocks the next level") rather than internal method calls.
2. **No internal mocking**: Don't mock component methods, stores, or mixins. Tests should interact with components as users do.
3. **Refactor-friendly**: Tests should survive refactoring of internal logic (sound management, level generation, etc.) because they test outcomes, not implementation.
4. **Coverage is mandatory**: CI fails if coverage drops below 95% for statements, branches, functions, or lines.

## CI/CD Pipeline (GitHub Actions)
- **ci.yml**: Lint, typecheck, test, build on every PR/push
- **deploy.yml**: Build and deploy to GitHub Pages on tag push

## Important Conventions
- **Language**: German audio, English code/comments
- **Naming**: PascalCase components, camelCase utils/methods
- **Styles**: Scoped SCSS, CSS custom properties for theming
- **Imports**: `@/` alias for `src/`
- **No TypeScript** (currently) - use JSDoc for type hints

## Common Tasks

### Adding a New Game
1. Create component in `src/components/<category>/`
2. Add route in `src/main.js`
3. Add LinkTile in appropriate NavPage
4. Add sounds to `public/sounds/de/` and register in `SoundUtils.js`
5. Write tests in `tests/unit/<category>/`

### Updating Dependencies
```bash
npm outdated           # Check outdated
npm update             # Minor/patch updates
npx npm-check-updates -u # Major updates (review carefully)
npm install
npm run test           # Verify
npm run build          # Verify
```

### Debugging Audio Issues
- Check browser console for "no audio file" errors
- Verify file exists in `public/sounds/de/<path>.mp3`
- Ensure service worker isn't caching old 404s (hard refresh)

## Known Limitations
- Only German audio currently (boy0/girl0 voices)
- Text-to-speech uses Web Speech API (browser-dependent)
- No TypeScript - consider migration for larger team
- Vue CLI migrated to Vite - some config differences possible