### Traditional Chinese Learning — Elementary Learner UX Review

Date: 2025-10-11

#### Executive summary
- **Overall**: Solid foundation with clear flashcard flow, bilingual labels, and printable practice. For elementary learners, simplify navigation, add audio-first interactions, increase visual scaffolding, and introduce playful motivation. Prioritize “Kid Mode,” audio on every word, tone-friendly pinyin/zhuyin, and print options that match early handwriting pedagogy.

![Home screenshot](../.playwright-mcp/ux-review-home.png)

#### What we reviewed (via hands-on exploration)
- Home screen with filters: `Select Level`, `Select Book`, `Select Lesson`
- Study mode toggle: `Sequential` / `Random`
- Flashcard: tap-to-reveal, then `Need Practice` / `Got It!`
- Quick Actions: `Prev`, `Next`, `Shuffle`, `Reset`
- Card details: Lesson / Book / Level / Character count
- Vocabulary overview grid (all matching words)
- Print worksheet (opens new tab)

#### Strengths
- **Immediate usability**: App loads fast; flashcard is primary and tappable; clear bilingual headings.
- **Progress levers**: Need Practice / Got It afford future spaced repetition; mode toggle supports varied practice.
- **Teacher utility**: Print worksheet exists; filters adapt (Book/Lesson enable after Level).

#### Key issues for elementary learners
1. **Cognitive load (too many controls and a very long word list on the same screen).** Young learners benefit from one primary task per view. The persistent, very long vocabulary grid competes with the flashcard.
2. **Lack of audio-first interactions.** Early learners decode best with sound; every item should have a big, obvious “play” option.
3. **Insufficient visual scaffolding.** No illustrative icons/images for meanings; pinyin tones not visually encoded; zhuyin (bopomofo) is missing for K-1/K-2 contexts.
4. **Control density and touch targets.** Buttons look clickable but could be larger, with increased spacing and persistent labels for clarity; `Reset` needs a confirm.
5. **Motivation loop is thin.** There’s minimal gamification (no streaks, badges, stars) and no bite-sized goals (e.g., 5-new-words mission).
6. **Onboarding/help is text-heavy.** The “How to use” section is informative but not kid-friendly or interactive.
7. **Printing lacks child-friendly presets.** No preflight for grid size, trace overlays, stroke order hints, or picture prompts.
8. **Accessibility gaps.** Likely missing consistent keyboard focus states, ARIA labeling for custom controls, and guaranteed 44×44pt touch targets.

#### Prioritized recommendations

P0: High impact, low-medium effort (do first)
- **Kid Mode toggle (default ON for first-time users)**
  - Full-bleed flashcard, 3 big controls: Play Audio, Show/Hide Pinyin+Meaning, Next.
  - Hide the long vocabulary grid by default; move it to a separate “Word Bank” tab.
  - Confirm dialog for `Reset progress`.
- **Audio everywhere**
  - Add a large Play button to the flashcard and each vocab tile; enable keyboard shortcut (space) and Enter for activation.
  - Preload short audio; keep latency <100ms on second play.
- **Tone-aware reading support**
  - Color-code pinyin tones consistently (e.g., T1=blue, T2=green, T3=orange, T4=red; neutral=gray) or add tone marks icons. Offer a setting to switch to zhuyin for early grades.
- **Bigger, clearer controls**
  - Increase tap targets and spacing for Quick Actions; always show text labels under icons; add `Are you sure?` on Reset.
- **Sticky Study Controls**
  - Keep the flashcard and its controls pinned; scroll the word bank separately under its own tab or collapsible panel.

P1: Medium impact or medium effort
- **Add visuals and micro-animations**
  - Optional picture hints on the back of the card; small bounce animation when the card flips; confetti on milestones.
- **Motivation loop**
  - Daily goal (e.g., learn 5 words), streaks, and simple stickers/badges; celebrate finishing a lesson with a friendly animation.
- **Improved Print options**
  - Presets: Tianzige(田字格) / Mi Zi Ge(米字格); trace overlay; stroke order thumbnails; number of practice boxes; optional pinyin/zhuyin watermark; picture prompt.
- **Search and quick filters**
  - Add search box to the Word Bank; chips for tones, parts of speech, lessons; keep results count visible.

P2: Longer-term improvements
- **Spaced Repetition (SRS) you can feel**
  - Visually group cards into “Practice Boxes” (Leitner); make Need Practice/Got It transparently affect scheduling; show a simple progress meter.
- **Teacher/Parent Mode**
  - Lock Kid Mode; set goals; export progress; choose pronunciation guide (pinyin vs zhuyin); pick fonts (Kai vs Hei) for worksheets.
- **Accessibility & Internationalization**
  - Formalize ARIA roles/states; high-contrast mode; full keyboard navigation; language toggles for zh-TW/English; ensure alt text on icons.

#### Detailed observations and actionable tweaks
- **Filters**: Enabling Book/Lesson after Level is good. In Kid Mode, hide filters behind a parent icon; in Teacher Mode, keep full controls.
- **Study Mode toggle**: Use a segmented control with an explanation tooltip (“Random helps with memory by mixing cards.”).
- **Flashcard reveal**: Add “Auto-pronounce on reveal” setting. For multi-character words, briefly highlight per-character audio segments.
- **Need Practice / Got It!**: Change copy to “Practice again” / “I know this!” and add icons (↺ / ✓). Show a tiny queue estimate (“3 will return soon”).
- **Vocabulary grid**: Move to a separate “Word Bank” tab. Each tile: Character • Pinyin/zhuyin • Audio • Lesson pill. Allow “Add to Practice” heart.
- **Progress**: Replace “Study Progress: 1/1 correct (100%)” with a session ring and lesson progress bar; avoid misleading percentages on tiny samples.
- **Printing**: Open the preview with a real title and pre-checked “Printer-friendly margins.” Offer A4/Letter presets and grayscale option.

#### Acceptance criteria (for P0 scope)
- Kid Mode hides the word bank by default; only big card + 3 primary controls are visible.
- Every character/word has a large, obvious Play control; first and repeated plays are snappy.
- Pinyin tones are visually distinguished, and zhuyin is available as an option for early grades.
- All interactive elements meet or exceed 44×44pt and WCAG contrast guidelines.
- Reset progress requires an explicit confirmation.
- Flashcard controls remain visible while content scrolls.

#### Measurement plan
- Track: time-on-task to complete 10 cards; number of voluntary sessions/day; completion rate of daily mini-goals; audio plays/word; error rate before/after tone coloring.
- Success: +20% session completion, +30% audio engagement, reduced abandon rate within first minute, higher worksheet prints per lesson.

#### Appendix: Screens and flows
- Home (filters + flashcard + word bank)
- Word Bank (separate, searchable list)
- Kid Mode (single-task focus)
- Print Worksheet (presets for handwriting practice)

Assets: `../.playwright-mcp/ux-review-home.png`


