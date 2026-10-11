# Edukiz - Educational Games for Kids

Simple HTML/JS educational games for children, built with Vue 3 and Vite. Runs offline as a PWA.

## Deployments

| Environment | URL | Trigger | Base Path |
|-------------|-----|---------|-----------|
| **GitHub Pages (main)** | https://timmalich.github.io/edukiz/ | Push to `main` branch via GitHub Actions | `/edukiz/` |
| **GitHub Pages (legacy)** | https://timmalich.github.io/edukiz_live/ | Manual `npm run deploy-github` | `/edukiz_live/` |
| **Custom Domain** | https://edukiz.freecluster.eu/ | Manual deploy to freecluster.eu | `/` (root) |

### GitHub Pages (main) - Automatic
- **Workflow**: `.github/workflows/deploy.yml`
- **Trigger**: Push to `main` branch
- **Build**: `npm run build:edukiz` (uses `--base=/edukiz/`)
- **Deploy**: GitHub Actions → GitHub Pages
- **Important**: Repository Settings → Pages → Build and deployment → Source must be **"GitHub Actions"**

### GitHub Pages (legacy) - Manual
- **Script**: `scripts/deploy_github.sh`
- **Command**: `npm run deploy-github`
- **Build**: `npm run build:edukiz_live` (uses `--base=/edukiz_live/`)
- **Target**: Separate repo `timmalich/edukiz_live`
- **Use case**: Keep main repo clean from generated dist code

### Custom Domain - Manual
- **Target**: `edukiz.freecluster.eu` (FTP/SSH deploy)
- **Build**: `npm run build` (uses `base: ''` from vite.config.js)
- **Use case**: Production domain with root path

All three versions are built from the same source but with different `base` paths for correct asset loading.

## Objective

Simple educational games for children that work offline on any device (smartphone, tablet, Raspberry Pi, laptop, etc.).

## Boundaries

- Code should be as simple as possible, so it's easy for everyone to extend
- Must run offline (e.g. by simply copying to a smartphone, tablet, raspberry pi, laptop, ...)

## Testing Philosophy

**Testing is a first-class concern in this project.** We maintain a minimum of 95% code coverage across all statements, branches, functions, and lines.

### Why Testing Matters Here

1. **Offline-First Reliability**: Since the app runs offline on children's devices without server-side fallbacks, bugs cannot be hotfixed remotely. Every feature must work correctly on first deploy.

2. **Refactoring Confidence**: Integration tests focus on user-visible features (game flows, level progression, reward systems) rather than implementation details. This allows us to refactor internal logic (e.g., sound management, level generation) without rewriting tests.

3. **Regression Prevention**: Educational games have complex state machines (game start → play → match → reward → next level). Automated tests catch regressions in these flows immediately.

4. **Cross-Device Consistency**: Tests run in a headless browser (jsdom) ensuring consistent behavior across all target devices (phones, tablets, Raspberry Pi, laptops).

### Testing Strategy

- **Integration Tests** (primary): Test complete user flows through Vue components (e.g., "user plays memory game through 3 levels and gets reward")
- **Unit Tests** (minimal): Only for pure utility functions with complex logic (e.g., `ArrayUtils.shuffleArray`, `SoundUtils.playSoundsInRow`)
- **No Mocking of Internal Implementation**: We avoid mocking internal methods or stores. Tests interact with components as users do - clicking, dragging, navigating.

### Coverage Requirements

- **Statements**: ≥ 95%
- **Branches**: ≥ 95%
- **Functions**: ≥ 95%
- **Lines**: ≥ 95%

Run `npm run test:coverage` to verify. CI fails if coverage drops below threshold.

## Available Games

### Memory

Memory Games with:

- Letters and numbers
- Animals

### Alphabetic Games

- Drag and Drop letters on letters
- Drag letters to a word

### Arithmetic Games

- Calculations with +- for equations with solutions between 0 and 18

### Other Games

- Text to speech. Provide a text and let the computer read it out loud. Uses the Web Speech API.

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

## Project Setup

### Prerequisites

- Node.js >= 24
- npm >= 10

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd edukiz

# Install dependencies
npm install
```

### Development

```bash
# Start dev server with hot reload
npm run dev

# Run tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Production Build

```bash
# Build for production (includes formatting)
npm run build

# Preview production build locally
npm run preview
```

### Code Quality

```bash
# Lint and auto-fix
npm run lint

# Format code with Prettier
npm run format
```

### Release & Deploy

```bash
# Create a version tag (triggers GitHub Pages deployment)
npm run tag-deployment

# Manual deploy to GitHub Pages
npm run deploy-github
```

## CI/CD Pipeline

- **CI** (`.github/workflows/ci.yml`): Runs on every push/PR - lint, test, build
- **Deploy** (`.github/workflows/deploy.yml`): Deploys to GitHub Pages on version tags (v*)

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
└── setup.js                # Vitest test setup
```

## Key Features

### Offline-First / PWA

- Hash router mode (`createWebHashHistory`) for file:// protocol compatibility
- Service worker caches all assets for offline use
- Configurable base path per deployment (see Deployments table)

### Sound System

- `SoundUtils` singleton manages audio caching, playback, voice selection (boy/girl)
- `SoundLib` exports pre-configured sound objects for letters, numbers, words
- Audio files organized by language: `public/sounds/de/`

### Game Flow

1. User selects game from Home → NavPage
2. Game component loads config from mixins
3. User interaction triggers sounds, level progression, rewards
4. Event emitter broadcasts rewards to Header for display

## Adding a New Game

1. Create component in `src/components/<category>/`
2. Add route in `src/main.js`
3. Add LinkTile in appropriate NavPage
4. Add sounds to `public/sounds/de/` and register in `SoundUtils.js`
5. Write tests in `tests/unit/<category>/`

## Updating Dependencies

```bash
# Check outdated packages
npm outdated

# Minor/patch updates
npm update

# Major updates (review carefully)
npx npm-check-updates -u
npm install

# Verify
npm run test
npm run build
```

## Known Limitations

- Only German audio currently (boy0/girl0 voices)
- Text-to-speech uses Web Speech API (browser-dependent)
- No TypeScript - consider migration for larger team

## License

MIT
