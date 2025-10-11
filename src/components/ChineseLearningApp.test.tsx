import { describe, expect, test, afterEach, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, within, cleanup } from '@testing-library/react';
import ChineseLearningApp, { VOCABULARY } from './ChineseLearningApp';

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
  test('renders initial flashcard and toggles answer', () => {
    mockLocalStorage('false'); // Kid Mode OFF to show full UI for legacy tests
    render(<ChineseLearningApp />);

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
    mockLocalStorage('false');
    render(<ChineseLearningApp />);

    const originalCharacter = getPrimaryCharacter().textContent ?? '';

    fireEvent.click(getPrimaryCard());
    fireEvent.click(screen.getByRole('button', { name: /Got It/i }));

    await screen.findByText(/Study Progress: 1\/1 correct/i, {}, { timeout: 2000 });

    await waitFor(() => {
      expect(getPrimaryCharacter().textContent).not.toBe(originalCharacter);
    }, { timeout: 2000 });
  });

  test('navigates using next and previous buttons deterministically', async () => {
    mockLocalStorage('false');
    render(<ChineseLearningApp />);

    const getFlashcardSection = () => screen.getAllByTestId('flashcard-section')[0];

    const firstCharacter = getPrimaryCharacter().textContent ?? '';

    const nextButton = within(getFlashcardSection()).getAllByRole('button', { name: /Next card/i })[0];
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(getPrimaryCharacter().textContent).not.toBe(firstCharacter);
    }, { timeout: 2000 });

    const prevButton = within(getFlashcardSection()).getAllByRole('button', { name: /Previous card/i })[0];
    fireEvent.click(prevButton);

    await waitFor(() => {
      expect(getPrimaryCharacter().textContent).toBe(firstCharacter);
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

describe('ChineseLearningApp - Reset confirmation', () => {
  it('asks for confirmation before resetting', () => {
    mockLocalStorage('false'); // Kid Mode OFF to render quick actions
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    render(<ChineseLearningApp />);
    const resetBtn = getLatestByTestId('quick-actions-reset');
    fireEvent.click(resetBtn);
    expect(confirmSpy).toHaveBeenCalled();
    confirmSpy.mockReturnValue(true);
    fireEvent.click(getLatestByTestId('quick-actions-reset'));
    expect(confirmSpy).toHaveBeenCalledTimes(2);
  });
});
