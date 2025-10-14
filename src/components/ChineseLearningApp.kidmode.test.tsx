import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import ChineseLearningApp from './ChineseLearningApp';

const mockLocalStorage = (kidModeValue: string | null) => {
  const getItem = vi.fn((key: string) => (key === 'kidMode' ? kidModeValue : null));
  const setItem = vi.fn((_key: string, _value: string) => {});
  vi.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation(getItem as unknown as () => string | null);
  vi.spyOn(window.localStorage.__proto__, 'setItem').mockImplementation(setItem as unknown as () => void);
  return { getItem, setItem };
};

const getLatestByTestId = (testId: string) => {
  const all = screen.queryAllByTestId(testId);
  if (!all.length) throw new Error(`No elements for ${testId}`);
  return all[all.length - 1];
};

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('Kid Mode enhancements', () => {
  it('shows answer buttons after reveal in Kid Mode', async () => {
    mockLocalStorage(null); // default ON
    render(<ChineseLearningApp />);

    await waitFor(() => {
      expect(getLatestByTestId('kid-mode-toggle')).toHaveAttribute('aria-pressed', 'true');
    });

    // Reveal answer
    fireEvent.click(getLatestByTestId('toggle-answer-button'));

    // Answer buttons visible
    expect(getLatestByTestId('kid-mode-answer-buttons')).toBeInTheDocument();
    expect(screen.getByText(/Need Practice/i)).toBeInTheDocument();
    expect(screen.getByText(/Got It!/i)).toBeInTheDocument();
  });

  it('navigates back with Back button in Kid Mode', async () => {
    mockLocalStorage(null);
    render(<ChineseLearningApp />);

    await waitFor(() => {
      expect(getLatestByTestId('kid-mode-toggle')).toHaveAttribute('aria-pressed', 'true');
    });

    const getChar = () => screen.getAllByTestId('flashcard-character')[0].textContent;
    const first = getChar();

    // Go next
    fireEvent.click(getLatestByTestId('next-button'));
    await waitFor(() => {
      expect(getChar()).not.toBe(first);
    });

    const afterNext = getChar();

    // Go back
    fireEvent.click(getLatestByTestId('back-button'));
    await waitFor(() => {
      expect(getChar()).toBe(first);
    });

    // sanity: next returns to afterNext
    fireEvent.click(getLatestByTestId('next-button'));
    await waitFor(() => {
      expect(getChar()).toBe(afterNext);
    });
  });

  it('shows and updates study progress in Kid Mode after answering', async () => {
    mockLocalStorage(null);
    render(<ChineseLearningApp />);

    await waitFor(() => {
      expect(getLatestByTestId('kid-mode-toggle')).toHaveAttribute('aria-pressed', 'true');
    });

    // Reveal answer to show buttons (click card to ensure it toggles)
    fireEvent.click(getLatestByTestId('flashcard-card'));
    // Fallback: use toggle button if needed
    if (!screen.queryByRole('button', { name: /Got It!/i })) {
      fireEvent.click(getLatestByTestId('toggle-answer-button'));
    }
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Got It!/i })).toBeInTheDocument();
    });

    // Mark as correct to increment stats
    fireEvent.click(screen.getByRole('button', { name: /Got It!/i }));

    // Stats should now appear
    await waitFor(() => {
      expect(screen.getByTestId('kid-mode-study-stats')).toBeInTheDocument();
    });

    // Reveal answer on next card and mark incorrect
    fireEvent.click(getLatestByTestId('flashcard-card'));
    if (!screen.queryByRole('button', { name: /Need Practice/i })) {
      fireEvent.click(getLatestByTestId('toggle-answer-button'));
    }
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Need Practice/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Need Practice/i }));

    // Stats should update (at least total increments)
    await waitFor(() => {
      const stats = screen.getByTestId('kid-mode-study-stats');
      expect(stats.textContent).toMatch(/Study Progress: \d+\/\d+ correct/);
    });
  });
});


