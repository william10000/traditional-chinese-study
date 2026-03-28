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

    // Answer buttons visible (Chinese-only labels)
    expect(screen.getByRole('button', { name: /不對/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /對了/ })).toBeInTheDocument();
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
    fireEvent.click(screen.getByRole('button', { name: /對了/ }));

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
    fireEvent.click(screen.getByRole('button', { name: /不對/ }));

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
    fireEvent.click(screen.getByRole('button', { name: /對了/ }));

    // Allow next card to load
    await waitForCardTransition();

    // Second: incorrect
    fireEvent.click(getLatestByTestId('flashcard-card'));
    await waitFor(() => {
      expect(screen.getByTestId('answer-buttons-container')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /不對/ }));

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
    const cancel = vi.fn();
    (window as any).speechSynthesis = {
      getVoices: () => [{ lang: 'zh-TW', name: 'Test' }],
      speak,
      cancel
    };

    // Trigger audio
    fireEvent.click(getLatestByTestId('play-audio-button'));
    expect(cancel).toHaveBeenCalledTimes(1);
    expect(speak).toHaveBeenCalledTimes(1);
    const utter = speak.mock.calls[0][0] as any;
    expect(utter).toBeInstanceOf(FakeUtterance);
    expect(utter.lang).toBe('zh-TW');
    expect(utter.rate).toBeCloseTo(0.75);
    expect(utter.voice?.lang?.toLowerCase()).toContain('zh');

    // Now no voices available
    speak.mockClear();
    cancel.mockClear();
    (window as any).speechSynthesis = {
      getVoices: () => [],
      speak,
      cancel
    };
    fireEvent.click(getLatestByTestId('play-audio-button'));
    // should still call speak and not throw
    expect(speak).toHaveBeenCalledTimes(1);
  });

  it('shows Chinese-only buttons (不對, 忘了, 對了) in order after reveal', async () => {
    mockLocalStorage(null);
    render(<ChineseLearningApp />);

    await waitFor(() => {
      expect(getLatestByTestId('kid-mode-toggle')).toHaveAttribute('aria-pressed', 'true');
    });

    // Reveal answer
    fireEvent.click(getLatestByTestId('flashcard-card'));

    // All three buttons should be visible with Chinese-only labels (no English)
    const buttons = screen.getByTestId('answer-buttons-container');
    const allButtons = buttons.querySelectorAll('button');
    expect(allButtons).toHaveLength(3);
    expect(allButtons[0].textContent).toBe('不對');
    expect(allButtons[1].textContent).toBe('忘了');
    expect(allButtons[2].textContent).toBe('對了');
  });

  it('"I forgot" button advances card and counts as incorrect', async () => {
    mockLocalStorage(null);
    render(<ChineseLearningApp />);

    await waitFor(() => {
      expect(getLatestByTestId('kid-mode-toggle')).toHaveAttribute('aria-pressed', 'true');
    });

    const originalCharacter = getLatestByTestId('flashcard-character').textContent ?? '';

    // Reveal answer and click "I forgot"
    fireEvent.click(getLatestByTestId('flashcard-card'));
    fireEvent.click(screen.getByRole('button', { name: /忘了/ }));

    // Stats should show 0/1 correct (counted as incorrect)
    await waitFor(() => {
      const stats = screen.getByTestId('kid-mode-study-stats');
      expect(stats.textContent).toMatch(/Study Progress: 0\/1 correct/);
    });

    // Card should advance
    await waitFor(() => {
      expect(getLatestByTestId('flashcard-character').textContent).not.toBe(originalCharacter);
    }, { timeout: 2000 });
  });

  it('clicking play audio also reveals the flashcard', async () => {
    mockLocalStorage(null);
    render(<ChineseLearningApp />);

    await waitFor(() => {
      expect(getLatestByTestId('kid-mode-toggle')).toHaveAttribute('aria-pressed', 'true');
    });

    // Card should start hidden
    expect(getLatestByTestId('flashcard-card').textContent).toMatch(/Click to reveal/i);

    // Click play audio
    fireEvent.click(getLatestByTestId('play-audio-button'));

    // Card should now be revealed (answer visible)
    await waitFor(() => {
      expect(getLatestByTestId('flashcard-card').textContent).toMatch(/Click to hide answer/i);
    });
  });

  it('rapid play audio presses cancel previous audio before speaking', async () => {
    mockLocalStorage(null);
    render(<ChineseLearningApp />);

    await waitFor(() => {
      expect(getLatestByTestId('kid-mode-toggle')).toHaveAttribute('aria-pressed', 'true');
    });

    class FakeUtterance {
      text: string;
      lang: string = '';
      rate: number = 0;
      voice: any;
      constructor(text: string) { this.text = text; }
    }
    (globalThis as any).SpeechSynthesisUtterance = FakeUtterance as any;

    const speak = vi.fn();
    const cancel = vi.fn();
    (window as any).speechSynthesis = {
      getVoices: () => [{ lang: 'zh-TW', name: 'Test' }],
      speak,
      cancel
    };

    // Rapid triple press
    fireEvent.click(getLatestByTestId('play-audio-button'));
    fireEvent.click(getLatestByTestId('play-audio-button'));
    fireEvent.click(getLatestByTestId('play-audio-button'));

    // Each press should cancel before speaking
    expect(cancel).toHaveBeenCalledTimes(3);
    expect(speak).toHaveBeenCalledTimes(3);
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
