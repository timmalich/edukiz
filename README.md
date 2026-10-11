# Edukiz - Educational Games for Kids

Simple HTML/JS educational games for children, built with Vue 3 and Vite. Runs offline as a PWA.

## Objective

Simple educational games for children that work offline on any device (smartphone, tablet, Raspberry Pi, laptop, etc.).

## Boundaries

- Code should be as simple as possible, so it's easy for everyone to extend
- Must run offline (e.g. by simply copying to a smartphone, tablet, raspberry pi, laptop, ...)

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
- Node.js >= 20
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
- Relative paths (`base: ''`) for flexible deployment

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