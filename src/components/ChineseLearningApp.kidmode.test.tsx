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

const waitForCardTransition = (ms = 600) => new Promise(resolve => setTimeout(resolve, ms));

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

    // Reveal answer by clicking the card
    fireEvent.click(getLatestByTestId('flashcard-card'));

    // Answer buttons visible
    expect(screen.getByRole('button', { name: /Incorrect/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Got It!/i })).toBeInTheDocument();
  });

  it('shows and updates study progress in Kid Mode after answering', async () => {
    mockLocalStorage(null);
    render(<ChineseLearningApp />);

    await waitFor(() => {
      expect(getLatestByTestId('kid-mode-toggle')).toHaveAttribute('aria-pressed', 'true');
    });

    // Reveal answer to show buttons
    fireEvent.click(getLatestByTestId('flashcard-card'));
    await waitFor(() => {
      expect(screen.getByTestId('answer-buttons-container')).toBeInTheDocument();
    });

    // Mark as correct to increment stats
    fireEvent.click(screen.getByRole('button', { name: /Got It!/i }));

    // Stats should now appear
    await waitFor(() => {
      expect(screen.getByTestId('kid-mode-study-stats')).toBeInTheDocument();
    });

    // Allow next card to load before interacting again
    await waitForCardTransition();

    // Reveal answer on next card and mark incorrect
    fireEvent.click(getLatestByTestId('flashcard-card'));
    await waitFor(() => {
      expect(screen.getByTestId('answer-buttons-container')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Incorrect/i }));

    // Stats should update (at least total increments)
    await waitFor(() => {
      const stats = screen.getByTestId('kid-mode-study-stats');
      expect(stats.textContent).toMatch(/Study Progress: \d+\/\d+ correct/);
    });
  });

  it('shows exact numbers after mixed answers in Kid Mode (1/2, 50%)', async () => {
    mockLocalStorage(null);
    render(<ChineseLearningApp />);

    await waitFor(() => {
      expect(getLatestByTestId('kid-mode-toggle')).toHaveAttribute('aria-pressed', 'true');
    });

    // First: correct
    fireEvent.click(getLatestByTestId('flashcard-card'));
    await waitFor(() => {
      expect(screen.getByTestId('answer-buttons-container')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Got It!/i }));

    // Allow next card to load
    await waitForCardTransition();

    // Second: incorrect
    fireEvent.click(getLatestByTestId('flashcard-card'));
    await waitFor(() => {
      expect(screen.getByTestId('answer-buttons-container')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Incorrect/i }));

    // Assert exact 1/2 and 50%
    const stats = await screen.findByTestId('kid-mode-study-stats');
    const text = stats.textContent || '';
    expect(text).toMatch(/Study Progress: 1\/2 correct/);
    expect(text).toMatch(/\(50%\)/);
  });

  it('audio playback uses zh voice when available and does not throw when absent', async () => {
    mockLocalStorage(null);
    render(<ChineseLearningApp />);

    await waitFor(() => {
      expect(getLatestByTestId('kid-mode-toggle')).toHaveAttribute('aria-pressed', 'true');
    });

    // Provide a fake SpeechSynthesisUtterance and speechSynthesis
    class FakeUtterance {
      text: string;
      lang: string = '';
      rate: number = 0;
      voice: any;
      constructor(text: string) {
        this.text = text;
      }
    }
    (globalThis as any).SpeechSynthesisUtterance = FakeUtterance as any;

    const speak = vi.fn();
    (window as any).speechSynthesis = {
      getVoices: () => [{ lang: 'zh-TW', name: 'Test' }],
      speak
    };

    // Trigger audio
    fireEvent.click(getLatestByTestId('play-audio-button'));
    expect(speak).toHaveBeenCalledTimes(1);
    const utter = speak.mock.calls[0][0] as any;
    expect(utter).toBeInstanceOf(FakeUtterance);
    expect(utter.lang).toBe('zh-TW');
    expect(utter.rate).toBeCloseTo(0.75);
    expect(utter.voice?.lang?.toLowerCase()).toContain('zh');

    // Now no voices available
    speak.mockClear();
    (window as any).speechSynthesis = {
      getVoices: () => [],
      speak
    };
    fireEvent.click(getLatestByTestId('play-audio-button'));
    // should still call speak and not throw
    expect(speak).toHaveBeenCalledTimes(1);
  });

  it('persists Kid Mode setting to localStorage on toggle', async () => {
    const { setItem } = mockLocalStorage(null);
    render(<ChineseLearningApp />);

    await waitFor(() => {
      expect(getLatestByTestId('kid-mode-toggle')).toHaveAttribute('aria-pressed', 'true');
    });

    // Toggle OFF
    fireEvent.click(getLatestByTestId('kid-mode-toggle'));
    expect(setItem).toHaveBeenCalledWith('kidMode', 'false');

    // Toggle ON again
    fireEvent.click(getLatestByTestId('kid-mode-toggle'));
    expect(setItem).toHaveBeenCalledWith('kidMode', 'true');
  });
});
