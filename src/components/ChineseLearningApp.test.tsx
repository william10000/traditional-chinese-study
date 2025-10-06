import { describe, expect, test, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import ChineseLearningApp, { VOCABULARY } from './ChineseLearningApp';

const getFilterCount = () => screen.getAllByTestId('filter-count')[0];

const getPrimaryCard = () => screen.getAllByTestId('flashcard-card')[0];
const getPrimaryCharacter = () => within(getPrimaryCard()).getByTestId('flashcard-character');

const selectOption = (label: string, value: string) => {
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
};

const getSelectValues = (label: string) =>
  Array.from((screen.getByLabelText(label) as HTMLSelectElement).options).map(option => option.value);

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

describe('ChineseLearningApp filters', () => {
  test('shows total vocabulary count when no filters applied', () => {
    render(<ChineseLearningApp />);

    expect(getFilterCount()).toHaveTextContent(String(VOCABULARY.length));
  });

  test('updates count when filtering by level and book', async () => {
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
