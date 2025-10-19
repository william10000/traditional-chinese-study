## Testing Coverage Review and Improvement Plan

### Scope
- Evaluate core application logic in `src/components/ChineseLearningApp.tsx` and its related data/types.
- Assess whether logic paths are covered by unit (Vitest) and E2E (Playwright) tests.
- Special focus on correctness of word counts: filter counts, study progress counts (correct/total), and related UI.

### Key Application Logic (ground truth references)

- Filtered vocabulary list used by the UI and counts:
```202:215:/Users/williamwan/github/william10000/traditional-chinese-study/src/components/ChineseLearningApp.tsx
  const filteredVocabulary = useMemo(() => {
    return VOCABULARY.filter(word => {
      if (selectedLevel !== ALL_OPTION && word.level !== selectedLevel) {
        return false;
      }
      if (selectedBook !== ALL_OPTION && word.book !== selectedBook) {
        return false;
      }
      if (selectedLesson !== ALL_OPTION && word.lesson !== selectedLesson) {
        return false;
      }
      return true;
    });
  }, [selectedLevel, selectedBook, selectedLesson]);
```

- Count displayed to users ("Matching Words"):
```714:725:/Users/williamwan/github/william10000/traditional-chinese-study/src/components/ChineseLearningApp.tsx
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div
              className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-800 px-3 py-2 rounded-lg"
              data-testid="filter-summary"
            >
              <span className="font-semibold">Current Filter:</span>
              <span>{filterSummary}</span>
            </div>
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 px-3 py-2 rounded-lg justify-between">
              <span className="font-semibold">Matching Words:</span>
              <span data-testid="filter-count" className="text-lg font-bold">{filteredVocabulary.length}</span>
            </div>
          </div>
```

- Study progress update and display:
```324:333:/Users/williamwan/github/william10000/traditional-chinese-study/src/components/ChineseLearningApp.tsx
  const markAnswer = (isCorrect: boolean) => {
    if (!hasCards) {
      return;
    }
    setStudyStats(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));
    setTimeout(nextCard, 500);
  };
```

```740:749:/Users/williamwan/github/william10000/traditional-chinese-study/src/components/ChineseLearningApp.tsx
        {!kidMode && studyStats.total > 0 && (
          <div className="bg-white rounded-lg p-4 mb-8 shadow-lg text-center max-w-4xl mx-auto">
            <div className="text-lg font-semibold text-gray-700">
              Study Progress: {studyStats.correct}/{studyStats.total} correct
              <span className="text-green-600 ml-2">
                ({studyStats.total > 0 ? Math.round((studyStats.correct / studyStats.total) * 100) : 0}%)
              </span>
            </div>
          </div>
        )}
```

- Sentence generation uses only words available up to the selected lesson:
```217:231:/Users/williamwan/github/william10000/traditional-chinese-study/src/components/ChineseLearningApp.tsx
  const availableUpToLesson = useMemo(() => {
    const base = VOCABULARY.filter(word => {
      if (selectedLevel !== ALL_OPTION && word.level !== selectedLevel) return false;
      if (selectedBook !== ALL_OPTION && word.book !== selectedBook) return false;
      return true;
    });
    if (selectedLesson === ALL_OPTION) return base;
    const cutoff = lessonRank(selectedLesson);
    return base.filter(w => lessonRank(w.lesson) <= cutoff);
  }, [selectedLevel, selectedBook, selectedLesson]);
```

### Current Test Coverage Map

- Unit tests (`src/components/ChineseLearningApp.test.tsx`):
  - Flashcards render and toggle answer.
  - Marking correct increments study stats and advances cards.
  - Deterministic prev/next navigation via quick actions.
  - Filters: level/book/lesson update counts; includes `Test1` lesson option for level 2, book A; filter count equals exact filtered `VOCABULARY.length` for selected filters.
  - Reset shows confirmation dialog.

- Unit tests (`src/components/ChineseLearningApp.kidmode.test.tsx`):
  - Kid Mode defaults ON on first visit; complex UI hidden; primary controls visible.
  - Toggle Kid Mode OFF shows full UI.
  - Kid Mode back/next navigation works.
  - Study stats appear after answering and update when answering again (pattern assertion).

- E2E tests (`tests/e2e/*.spec.ts`):
  - Smoke: app loads; flashcard visible.
  - Kid Mode toggle hides/shows filter panel.
  - Filters: applying level/book/lesson updates the visible count; asserts new count <= initial count.
  - Flashcard interactions: reveal/hide; next/prev via quick actions.

### Word Count Coverage Assessment

- Filter count correctness ("Matching Words"):
  - Unit tests verify exact counts for: all words, level-only, level+book, and specific lessons (including `Test1`).
  - E2E verifies that counts change in the expected direction when filtering (not exact equality).
  - Gap: No assertion that the Vocabulary Overview Grid card count equals `filteredVocabulary.length` or `filter-count`.

- Study progress counts (correct/total):
  - Unit tests verify exact 1/1 after a correct answer in standard mode and card advances.
  - Kid Mode tests assert presence and updating of stats, but not exact values after mixed correct/incorrect sequences.
  - Gaps:
    - No explicit assertion that an incorrect answer increments only `total` and leaves `correct` unchanged.
    - No reset flow test validating stats reset to 0/0 after confirmation.
    - No test for percentage rounding and formatting.
    - No test for stats visibility conditions (hidden when total == 0) across mode toggles.

- Sentence card generation and counts:
  - No tests asserting sentence cards only use words from `availableUpToLesson`.
  - No tests around sentence-card count sizing relative to available words.

### Additional Logic Areas Not Fully Covered

- Reset behavior: Index reset to 0 and `showAnswer` reset to false after confirming reset.
- Shuffle behavior: Card order changes on Shuffle; answer hidden; index reset.
- Edge states: Filters producing 0 matches show empty-state message; prev/next disabled when only one card available.
- Persistence: `localStorage` writes upon toggling Kid Mode; loads correctly on mount.
- Audio: Clicking Play Audio calls `speechSynthesis.speak` with zh-* voice when available and does not throw when unavailable.
- Worksheet generation: `window.open` path runs without errors; writes template; triggers `print()`.
- Filter cascade: Changing `level` resets `book` and `lesson`; changing `book` resets `lesson`.
- Card Details panel: Character count equals length of the current vocabulary entry’s `characters` string.

### Recommended Improvements (actionable test additions)

Implement the following tests. Group by target file with clear, small-scoped cases to avoid flakiness.

1) ChineseLearningApp.test.tsx (standard mode)
- Add: verifies incorrect answer updates only total
  - Steps: Kid Mode OFF; reveal; click "Need Practice"; assert "Study Progress: 0/1 correct (0%)".
- Add: verifies mixed answers update correct/total and percentage rounding
  - Steps: answer correct, then incorrect; assert "1/2" and percentage equals 50%.
- Add: reset clears stats, hides stats, resets index and answer state
  - Mock confirm=true; click Reset; assert no stats visible; index returns to 1st card; `Click to reveal...` visible.
- Add: grid count equals filter count
  - Select a specific lesson; assert number of cards in `vocab-overview-section` equals `filter-count`.
- Add: zero-results empty state and disabled navigation
  - Pick a filter combo with 0 matches; assert empty-state element; assert next/prev buttons disabled.
- Add: shuffle changes order and hides answer
  - Click Shuffle; assert current card index resets to 0; and prompt shows "Click to reveal...".
- Add: filter cascade resets
  - Select level then book then lesson; change level; assert book/lesson reset to `all` and their disabled state matches UI rules.
- Add: Card Details correctness
  - With word cards, assert "Characters" count equals `characters.length` for the selected item.

2) ChineseLearningApp.kidmode.test.tsx (Kid Mode)
- Add: exact stat numbers after mixed answers in Kid Mode
  - Steps: ensure Kid Mode ON; answer correct then incorrect; assert "1/2 correct" and percentage 50%.
- Add: audio playback handler safety
  - Stub `window.speechSynthesis.getVoices` and `speak`; click "Play audio"; assert `speak` called with zh-* voice when present; ensure no throw when absent.
- Add: localStorage persistence
  - Start with Kid Mode ON (null -> default ON), toggle OFF, assert `localStorage.setItem('kidMode','false')` called.

3) tests/e2e/kidmode-and-filters.spec.ts (Playwright)
- Strengthen filter count check
  - Compute expected counts in the browser context by filtering `window.__VOCAB__` or expose a data attribute for total words; then assert equality for chosen filters.
  - Alternative: Assert that the number of visible vocab cards equals the displayed `filter-count`.
- Add: empty-state flow
  - Drive filters to 0 results; assert empty-state element appears and next/prev are disabled.

4) tests/e2e/smoke.spec.ts (Playwright)
- Add: reveal -> answer -> progress visible
  - Click to reveal, click "Got It!", assert progress bar text appears with 1/1.

5) Sentence generation logic (unit, standard mode)
- Add: sentence words are drawn from availableUpToLesson
  - Mock `Math.random` deterministically; set Level/Book/Lesson to a very small subset; switch to sentence mode; reveal; assert all Han characters (excluding punctuation) exist within the union of `characters` of `availableUpToLesson` words.

### Implementation Notes for the Coding Agent

- Prefer deterministic tests where randomness is involved:
  - Mock `Math.random` with a seeded sequence to make sentence and shuffle behavior reproducible.

- For exact count assertions in E2E, either:
  - Expose `VOCABULARY.length` via a data attribute or attach it to `window` during dev/test builds; or
  - Count DOM nodes in `vocab-overview-section` and compare to `filter-count` text.

- For audio tests, stub `window.speechSynthesis` with:
  - `getVoices: () => [{ lang: 'zh-TW', name: 'Test' }]`
  - `speak: vi.fn()`

- For worksheet tests, stub `window.open` to return a fake window with `document.open/write/close` and `print` as spies; assert they are called.

### Prioritized Checklist

1. Unit: incorrect increments only total; reset clears stats; exact Kid Mode stats after mixed answers.
2. Unit: grid count equals filter count; empty-state zero results; filter cascade resets; shuffle hides answer.
3. E2E: strengthen count equality; empty-state; smoke progress.
4. Unit: sentence generation obeys availableUpToLesson with deterministic randomness.
5. Unit: audio and worksheet safety.

These additions will close the main gaps around count correctness and edge-state coverage while keeping tests stable and maintainable.


