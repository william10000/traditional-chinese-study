import { describe, expect, test, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import ChineseLearningApp from './ChineseLearningApp';

const getPrimaryCard = () => screen.getAllByTestId('flashcard-card')[0];
const getPrimaryCharacter = () => within(getPrimaryCard()).getByTestId('flashcard-character');

beforeEach(() => {
  // reset between tests if needed in future
});

afterEach(() => {
  // placeholder for timers if added later
});

describe('ChineseLearningApp flashcards', () => {
  test('renders initial flashcard and toggles answer', () => {
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
