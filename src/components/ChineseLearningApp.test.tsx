import { describe, expect, test, afterEach, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, within, cleanup } from '@testing-library/react';
import ChineseLearningApp from './ChineseLearningApp';
import { VOCABULARY } from '../data/vocabulary';

const getFilterCount = () => screen.getAllByTestId('filter-count')[0];

const getPrimaryCard = () => screen.getAllByTestId('flashcard-card')[0];
const getPrimaryCharacter = () => within(getPrimaryCard()).getByTestId('flashcard-character');

const selectOption = (label: string, value: string) => {
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
};

const getSelectValues = (label: string) =>
  Array.from((screen.getByLabelText(label) as HTMLSelectElement).options).map(option => option.value);

const mockLocalStorage = (kidModeValue: string | null) => {
  const getItem = vi.fn((key: string) => {
    if (key === 'kidMode') return kidModeValue;
    return null;
  });
  const setItem = vi.fn((_key: string, _value: string) => {});
  vi.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation(getItem as unknown as () => string | null);
  vi.spyOn(window.localStorage.__proto__, 'setItem').mockImplementation(setItem as unknown as () => void);
  return { getItem, setItem };
};

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const getLatestByTestId = (testId: string) => {
  const all = screen.queryAllByTestId(testId);
  if (!all.length) {
    throw new Error(`No elements found for testId: ${testId}`);
  }
  return all[all.length - 1];
};

describe('ChineseLearningApp flashcards', () => {
  test('renders initial flashcard and toggles answer', async () => {
    mockLocalStorage('true');
    render(<ChineseLearningApp />);
    await screen.findByTestId('flashcard-card');

    const initialCharacter = getPrimaryCharacter().textContent ?? '';
    expect(initialCharacter).not.toEqual('');
    expect(within(getPrimaryCard()).getByText(/Click to reveal/i)).toBeInTheDocument();

    fireEvent.click(getPrimaryCard());

    const revealedCard = getPrimaryCard();
    expect(within(revealedCard).getAllByText(initialCharacter)[0]).toBeInTheDocument();
    expect(within(revealedCard).getByText(/Click to hide answer/i)).toBeInTheDocument();

    fireEvent.click(revealedCard);

    expect(within(getPrimaryCard()).getByText(/Click to reveal/i)).toBeInTheDocument();
  });

  test('records study progress and advances to next card', async () => {
    mockLocalStorage('true');
    render(<ChineseLearningApp />);
    await screen.findByTestId('flashcard-card');

    const originalCharacter = getPrimaryCharacter().textContent ?? '';

    fireEvent.click(getPrimaryCard());
    fireEvent.click(screen.getByRole('button', { name: /Got It/i }));

    await screen.findByText(/Study Progress: 1\/1 correct/i, {}, { timeout: 2000 });

    await waitFor(() => {
      expect(getPrimaryCharacter().textContent).not.toBe(originalCharacter);
    }, { timeout: 2000 });
  });

  test('mixed answers update correct/total and percentage rounds to 50%', async () => {
    mockLocalStorage('true');
    render(<ChineseLearningApp />);
    await screen.findByTestId('flashcard-card');

    // 1) correct
    fireEvent.click(getPrimaryCard());
    fireEvent.click(screen.getByRole('button', { name: /Got It/i }));
    await screen.findByText(/Study Progress: 1\/1 correct/i, {}, { timeout: 2000 });
    // wait for next card to render before proceeding
    const afterFirst = getPrimaryCharacter().textContent || '';
    await waitFor(() => {
      expect(getPrimaryCharacter().textContent || '').not.toBe(afterFirst);
    }, { timeout: 2000 });

    // 2) incorrect on next card
    fireEvent.click(getPrimaryCard());
    fireEvent.click(screen.getByRole('button', { name: /Incorrect/i }));

    await screen.findByText(/Study Progress: 1\/2 correct/i, {}, { timeout: 2000 });
    const stats = screen.getByText(/Study Progress: 1\/2 correct/i).parentElement?.textContent || '';
    expect(stats).toMatch(/\(50%\)/);
  });

  test('does not render flashcards in normal mode', () => {
    mockLocalStorage('false');
    render(<ChineseLearningApp />);

    expect(screen.queryByTestId('flashcard-section')).toBeNull();
  });

});

describe('ChineseLearningApp sentence flashcards', () => {
  test('renders sentence flashcard and toggles answer', async () => {
    mockLocalStorage('false');
    render(<ChineseLearningApp />);

    // Switch to sentence mode
    fireEvent.click(screen.getByRole('button', { name: /Sentences/i }));
    fireEvent.click(screen.getByTestId('kid-mode-toggle'));
    await waitFor(() => {
      expect(screen.getByTestId('kid-mode-toggle')).toHaveAttribute('aria-pressed', 'true');
    });
    await screen.findByTestId('flashcard-card');

    // Ensure a sentence appears on the front (Chinese + punctuation)
    const frontCharacterEl = getPrimaryCharacter();
    const frontText = frontCharacterEl.textContent ?? '';
    expect(frontText).not.toEqual('');

    // Reveal answer (should show pinyin + English)
    fireEvent.click(getPrimaryCard());
    const revealedText = getPrimaryCard().textContent ?? '';
    expect(revealedText).toMatch(/Click to hide answer/i);
    // The revealed content includes Latin letters due to pinyin/English
    expect(revealedText).toMatch(/[A-Za-z]/);
  });

  test('navigates to next sentence and changes the card content', async () => {
    mockLocalStorage('false');
    render(<ChineseLearningApp />);

    // Switch to sentence mode
    fireEvent.click(screen.getByRole('button', { name: /Sentences/i }));
    fireEvent.click(screen.getByTestId('kid-mode-toggle'));
    await waitFor(() => {
      expect(screen.getByTestId('kid-mode-toggle')).toHaveAttribute('aria-pressed', 'true');
    });
    await screen.findByTestId('flashcard-card');

    const firstSentence = getPrimaryCharacter().textContent ?? '';
    expect(firstSentence).not.toEqual('');

    fireEvent.click(getPrimaryCard());
    fireEvent.click(screen.getByRole('button', { name: /Got It/i }));

    await waitFor(() => {
      expect(getPrimaryCharacter().textContent).not.toBe(firstSentence);
    }, { timeout: 2000 });
  });

});

describe('ChineseLearningApp filters', () => {
  test('shows total vocabulary count when no filters applied', () => {
    mockLocalStorage('false');
    render(<ChineseLearningApp />);

    expect(getFilterCount()).toHaveTextContent(String(VOCABULARY.length));
  });

  test('updates count when filtering by level and book', async () => {
    mockLocalStorage('false');
    render(<ChineseLearningApp />);

    const level = 'K2';
    const book = 'B';

    selectOption('Select Level:', level);

    const expectedLevelCount = VOCABULARY.filter(word => word.level === level).length;

    await waitFor(() => {
      expect(getFilterCount()).toHaveTextContent(String(expectedLevelCount));
      expect(screen.getByLabelText('Select Book:')).not.toBeDisabled();
    });

    selectOption('Select Book:', book);

    const expectedBookCount = VOCABULARY.filter(
      word => word.level === level && word.book === book
    ).length;

    await waitFor(() => {
      expect(getFilterCount()).toHaveTextContent(String(expectedBookCount));
      expect(screen.getByLabelText('Select Lesson:')).not.toBeDisabled();
      expect(getSelectValues('Select Lesson:')).toContain('L1');
    });

    const lesson = 'L1';

    selectOption('Select Lesson:', lesson);

    const expectedLessonCount = VOCABULARY.filter(
      word => word.level === level && word.book === book && word.lesson === lesson
    ).length;

    await waitFor(() => {
      expect(getFilterCount()).toHaveTextContent(String(expectedLessonCount));
    });
  });

  test('includes test lessons when filtering level 2 book A', async () => {
    mockLocalStorage('false');
    render(<ChineseLearningApp />);

    const level = '2';
    const book = 'A';
    const lesson = 'Test1';

    selectOption('Select Level:', level);

    await waitFor(() => {
      expect(screen.getByLabelText('Select Book:')).not.toBeDisabled();
    });

    selectOption('Select Book:', book);

    await waitFor(() => {
      expect(getSelectValues('Select Lesson:')).toContain(lesson);
    });

    selectOption('Select Lesson:', lesson);

    const expectedCount = VOCABULARY.filter(
      word => word.level === level && word.book === book && word.lesson === lesson
    ).length;

    await waitFor(() => {
      expect(getFilterCount()).toHaveTextContent(String(expectedCount));
    });
  });

  test('grid count equals displayed filter count for specific lesson', async () => {
    mockLocalStorage('false');
    render(<ChineseLearningApp />);

    // Choose a concrete level/book/lesson
    const level = '2';
    const book = 'A';
    const lesson = 'Test1';
    selectOption('Select Level:', level);
    await waitFor(() => expect(screen.getByLabelText('Select Book:')).not.toBeDisabled());
    selectOption('Select Book:', book);
    await waitFor(() => expect(screen.getByLabelText('Select Lesson:')).not.toBeDisabled());
    selectOption('Select Lesson:', lesson);

    const expected = VOCABULARY.filter(w => w.level === level && w.book === book && w.lesson === lesson).length;
    await waitFor(() => expect(getFilterCount()).toHaveTextContent(String(expected)));

    const section = screen.getByTestId('vocab-overview-section');
    const rows = section.querySelectorAll('tbody tr');
    expect(rows.length).toBe(expected);
  });



  test('filter cascade resets book and lesson to all and disables lesson appropriately', async () => {
    mockLocalStorage('false');
    render(<ChineseLearningApp />);

    // Set a deep selection first
    selectOption('Select Level:', '2');
    await waitFor(() => expect(screen.getByLabelText('Select Book:')).not.toBeDisabled());
    selectOption('Select Book:', 'A');
    await waitFor(() => expect(screen.getByLabelText('Select Lesson:')).not.toBeDisabled());
    selectOption('Select Lesson:', 'Test1');

    // Change level should reset book+lesson to all; lesson disabled because book is all
    selectOption('Select Level:', '1');

    const bookSelect = screen.getByLabelText('Select Book:') as HTMLSelectElement;
    const lessonSelect = screen.getByLabelText('Select Lesson:') as HTMLSelectElement;
    await waitFor(() => {
      expect(bookSelect.value).toBe('all');
      expect(lessonSelect.value).toBe('all');
      expect(lessonSelect).toBeDisabled();
    });
  });



  test('zero-results empty state shows and nav controls are not rendered', async () => {
    mockLocalStorage('false');
    render(<ChineseLearningApp />);

    // Pick a real level to enable book/lesson controls
    selectOption('Select Level:', '1');
    await waitFor(() => expect(screen.getByLabelText('Select Book:')).not.toBeDisabled());

    // Force-select a non-existent book value to create 0 results
    const bookSelect = screen.getByLabelText('Select Book:');
    fireEvent.change(bookSelect, { target: { value: 'Z' } });

    // Lesson becomes enabled because book !== all; pick any valid lesson for level
    const lessonSelect = screen.getByLabelText('Select Lesson:');
    await waitFor(() => expect(lessonSelect).not.toBeDisabled());
    const lessonValues = Array.from((lessonSelect as HTMLSelectElement).options).map(o => o.value);
    const lesson = lessonValues.find(v => v !== 'all') || 'L1';
    fireEvent.change(lessonSelect, { target: { value: lesson } });

    // Expect 0 results and empty-state banner
    await waitFor(() => {
      expect(screen.getByTestId('filter-count')).toHaveTextContent('0');
      expect(screen.getByText('尚未找到符合條件的卡片，請選擇其他課程。')).toBeInTheDocument();
    });

    // Flashcard and quick actions should not be present
    expect(screen.queryByTestId('flashcard-section')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Next card' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Previous card' })).toBeNull();
  });
});

describe('ChineseLearningApp - Sentence generation constraints', () => {
  const lessonRank = (lesson: string) => {
    const m = lesson.trim().match(/^L(\d+)$/i);
    if (m) return parseInt(m[1], 10);
    const t = lesson.trim().match(/^Test(\d+)$/i);
    if (t) return 100 + parseInt(t[1], 10);
    return Number.MAX_SAFE_INTEGER;
  };

  test('sentence characters are drawn from availableUpToLesson', async () => {
    mockLocalStorage('false');
    render(<ChineseLearningApp />);

    // Narrow to a subset yet rich enough for sentences
    const level = '2';
    const book = 'A';
    const lesson = 'L3';
    selectOption('Select Level:', level);
    await waitFor(() => expect(screen.getByLabelText('Select Book:')).not.toBeDisabled());
    selectOption('Select Book:', book);
    await waitFor(() => expect(screen.getByLabelText('Select Lesson:')).not.toBeDisabled());
    selectOption('Select Lesson:', lesson);

    // Switch to sentence mode
    fireEvent.click(screen.getByRole('button', { name: /Sentences/i }));
    fireEvent.click(screen.getByTestId('kid-mode-toggle'));
    await waitFor(() => {
      expect(screen.getByTestId('kid-mode-toggle')).toHaveAttribute('aria-pressed', 'true');
    });
    await screen.findByTestId('flashcard-card');

    // Build allowed character set from availableUpToLesson
    const cutoff = lessonRank(lesson);
    const allowed = new Set(
      VOCABULARY
        .filter(w => w.level === level && w.book === book && lessonRank(w.lesson) <= cutoff)
        .flatMap(w => w.characters.split(''))
    );

    const sentence = (screen.getAllByTestId('flashcard-character')[0].textContent || '').trim();
    const chineseChars = sentence.replace(/[A-Za-z0-9\s.,!?，。？！・・]/g, '');
    expect(chineseChars.length).toBeGreaterThan(0);
    for (const ch of chineseChars) {
      expect(allowed.has(ch)).toBe(true);
    }
  });
});

describe('ChineseLearningApp - Worksheet generation', () => {
  test('Print Worksheet opens a window, writes content, and prints', async () => {
    mockLocalStorage('false');
    render(<ChineseLearningApp />);

    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => {
      const write = vi.fn();
      const open = vi.fn();
      const close = vi.fn();
      const print = vi.fn();
      return {
        document: { open, write, close },
        focus: vi.fn(),
        print,
        closed: false
      } as unknown as Window;
    });

    const printBtn = screen.getByRole('button', { name: /Print Worksheet/i });
    fireEvent.click(printBtn);

    expect(openSpy).toHaveBeenCalled();
    // Give the print timeout a moment (it uses setTimeout)
    await waitFor(() => {
      const win = openSpy.mock.results[0].value as any;
      expect(win.document.open).toHaveBeenCalled();
      expect(win.document.write).toHaveBeenCalled();
      expect(win.document.close).toHaveBeenCalled();
      expect(win.print).toHaveBeenCalled();
    }, { timeout: 2000 });
  });
});

describe('ChineseLearningApp - Kid Mode', () => {
  const getKidModeToggle = () => getLatestByTestId('kid-mode-toggle');

  it('enables Kid Mode by default on first load and hides complex UI', () => {
    mockLocalStorage(null); // first visit
    render(<ChineseLearningApp />);

    // effect flips Kid Mode to ON – wait for it
    const toggle = getKidModeToggle();
    expect(toggle).toBeInTheDocument();
    // wait for ON state and hidden complex UI
    return waitFor(() => {
      const latestToggle = getKidModeToggle();
      expect(latestToggle).toHaveAttribute('aria-pressed', 'true');
      expect(latestToggle).toHaveTextContent('Kid Mode ON');
      expect(screen.queryByTestId('filter-panel')).not.toBeInTheDocument();
      expect(screen.queryByTestId('vocab-overview-section')).not.toBeInTheDocument();
      expect(getLatestByTestId('kid-mode-primary-controls')).toBeInTheDocument();
    });
  });

  it('toggles Kid Mode OFF to show full UI including filters', () => {
    mockLocalStorage(null);
    render(<ChineseLearningApp />);
    // ensure Kid Mode ON first
    return waitFor(() => {
      expect(getKidModeToggle()).toHaveAttribute('aria-pressed', 'true');
    }).then(() => {
      const toggle = getKidModeToggle();
      fireEvent.click(toggle);
      expect(getKidModeToggle()).toHaveAttribute('aria-pressed', 'false');
      expect(getKidModeToggle()).toHaveTextContent('Kid Mode OFF');
      expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
      expect(screen.getByText('Study Mode:')).toBeInTheDocument();
    });
  });
});
