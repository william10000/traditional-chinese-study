# Traditional Chinese Learning App (傳統中文學習應用程式)

An interactive web application for learning Traditional Chinese characters through flashcards and writing practice. Built with React, TypeScript, and Vite.

## 🌟 Features

- **Interactive Flashcards**: Click to reveal pinyin pronunciation and English translations
- **Writing Practice**: Generate printable worksheets with traditional Chinese grid format
- **Study Modes**: Sequential or random card ordering
- **Progress Tracking**: Track correct/incorrect answers with statistics
- **Lesson Filtering**: Filter vocabulary by specific lesson numbers (L1-L12)
- **Responsive Design**: Works on desktop and mobile devices
- **Beautiful UI**: Clean, modern interface with Chinese typography

## 📚 Vocabulary Content

The app includes comprehensive vocabulary from 12 lessons covering:
- Basic greetings and introductions (L1)
- Family members and numbers (L2-L3)
- Food, drinks, and daily activities (L4-L8)
- Locations, transportation, and time (L9-L12)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/william10000/traditional-chinese-study.git
   cd traditional-chinese-study
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development server**
   ```bash
   pnpm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to see the app running.

## 🛠️ Available Scripts

- `pnpm run dev` - Start development server with hot reload
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build locally
- `pnpm run type-check` - Run TypeScript type checking
- `pnpm run lint` - Run ESLint code linting
- `pnpm run lint:fix` - Fix ESLint issues automatically
- `pnpm run test` - Run Vitest in watch mode during development
- `pnpm run test:run` - Run the Vitest suite once (CI-friendly)
- `pnpm run test:coverage` - Generate coverage reports (`coverage/` directory)

## 🎯 How to Use

### Flashcard Study Mode

1. **Select Lesson**: Choose from individual lessons (L1-L12) or "All Lessons"
2. **Choose Study Mode**: Sequential (in order) or Random (shuffled)
3. **Navigate Cards**:
   - Click cards to reveal/hide pinyin and English
   - Use arrow buttons for navigation
   - Click "Shuffle" to randomize current set
   - Click "Reset" to start over
4. **Track Progress**: Mark answers as correct/incorrect to see statistics

### Writing Practice

1. **Generate Worksheets**: Click "Print Worksheet" button
2. **Practice Format**: Each character has a red example box followed by practice grids
3. **Print**: The app opens a new window with the worksheet - use browser print function
4. **Guidelines**: Traditional Chinese character grid with center lines for proper stroke placement

## 📖 Vocabulary Overview

The vocabulary grid at the bottom shows all characters in the selected lesson. Click any character to jump directly to that flashcard.

## Adding new words

1. Add unprocessed files to the unprocessed directory
2. Use coding agent to process the files and them to the app. See processing_instructions.md. gpt-5-codex has 100% accuracy in adding all relevant vocabulary words, but was often off by one in articulating how many words it added in each image

## 🏗️ Project Structure

```
src/
├── components/
│   └── ChineseLearningApp.tsx    # Main application component
├── types/
│   └── index.ts                  # TypeScript type definitions
├── App.tsx                       # Root React component
├── main.tsx                      # Application entry point
├── index.css                     # Global styles and Tailwind imports
└── vite-env.d.ts                 # Vite environment types

public/
└── vite.svg                      # Vite logo

.github/workflows/
└── deploy.yml                    # GitHub Pages deployment
```

## 🎨 Styling

- **Tailwind CSS**: Utility-first CSS framework for styling
- **Custom Fonts**: Noto Sans TC for Chinese characters
- **Color Scheme**: Red theme reflecting traditional Chinese design elements
- **Responsive**: Mobile-first design that works on all screen sizes

## 🔧 Technical Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **ESLint** - Code linting and formatting

## 🚀 Deployment

### GitHub Pages (Automatic)

The app is configured for automatic deployment to GitHub Pages when pushing to the `main` branch.

1. **Enable GitHub Pages**:
   - Go to repository Settings > Pages
   - Select "GitHub Actions" as source

2. **Deploy**:
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

### Manual Deployment

```bash
pnpm run build
pnpm run deploy
```

## 🧪 Testing Tips

- Component tests live alongside the source (`src/components/*.{test.tsx}`) and use Vitest + Testing Library.
- When debugging or running a single suite:
  ```bash
  pnpm vitest run src/components/ChineseLearningApp.test.tsx
  ```
- Coverage reports (HTML + lcov + text) are emitted to `coverage/` when you run `pnpm run test:coverage`.
- The Vitest environment uses `jsdom`, so DOM APIs such as `document` and `window` are available.

### End-to-End (E2E) with Playwright

Playwright runs E2E tests against the production build served via `vite preview`, ensuring the correct `base` path (`/traditional-chinese-study/`).

Commands:
```bash
pnpm e2e          # run headless in all browsers
pnpm e2e:headed   # run with a visible browser for debugging
pnpm e2e:ui       # use Playwright UI mode
pnpm e2e:report   # open the last HTML report
```

Details and guidance: see `docs/e2e-playwright-plan.md`.

## 🌍 Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers with modern JavaScript support

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and enhancement requests.

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

*Built with ❤️ for Traditional Chinese language learners*
