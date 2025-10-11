The unprocessed directory contains a number of raw images that need to be processed, and added to the Vocabulary array in ChineseLearningApp.tsx.

Each image has a name that indicates the level, book, and image number in the book series.

For example, level_01_book_a_01 indicates level 1, book A, image 1.
For each image, send the image to the LLM as part of the prompt, extract the pinyin, characters, and english from the image name as well as the lesson number, and add it to the Vocabulary array in ChineseLearningApp.tsx. It may help to make a list of images to process so you do them one at a time.

After processing each image, add a brief summary to this document of how many rows of vocabulary were extraccted.

Processed level_01_book_a_01.jpg: added 25 vocabulary rows to `src/components/ChineseLearningApp.tsx`.
Processed level_01_book_a_02.jpg: added 25 vocabulary rows to `src/components/ChineseLearningApp.tsx`.
Processed level_01_book_a_03.jpg: added 28 vocabulary rows to `src/components/ChineseLearningApp.tsx`.
Processed level_02_book_a_test_01_01.jpg: added 15 vocabulary rows to `src/components/ChineseLearningApp.tsx`.
Processed level_02_book_a_test_01_02.jpg: added 16 vocabulary rows to `src/components/ChineseLearningApp.tsx`.
Processed level_02_book_a_test_01_03.jpg: added 14 vocabulary rows to `src/components/ChineseLearningApp.tsx`.
Processed level_k2_book_a_01.jpg: added 21 vocabulary rows to `src/components/ChineseLearningApp.tsx`.
Processed level_k2_book_a_02.jpg: added 22 vocabulary rows to `src/components/ChineseLearningApp.tsx`.
Processed level_k2_book_a_03.jpg: added 23 vocabulary rows to `src/components/ChineseLearningApp.tsx`.
Processed level_k2_book_a_04.jpg: added 21 vocabulary rows to `src/components/ChineseLearningApp.tsx`.
Processed level_k2_book_a_05.jpg: added 6 vocabulary rows to `src/components/ChineseLearningApp.tsx`.
Processed level_02_book_a_01.jpg: added 23 vocabulary rows to `src/components/ChineseLearningApp.tsx`.
Processed level_02_book_a_02.jpg: added 25 vocabulary rows to `src/components/ChineseLearningApp.tsx`.
Processed level_02_book_a_03.jpg: added 26 vocabulary rows to `src/components/ChineseLearningApp.tsx`.
Processed level_02_book_a_04.jpg: added 19 vocabulary rows to `src/components/ChineseLearningApp.tsx`.


Processed level_01_book_b_01.jpg: added 22 vocabulary rows to `src/components/ChineseLearningApp.tsx`.
Processed level_01_book_b_02.jpg: added 27 vocabulary rows to `src/components/ChineseLearningApp.tsx`.
Processed level_01_book_b_03.jpg: added 30 vocabulary rows to `src/components/ChineseLearningApp.tsx`.
Processed level_01_book_b_04.jpg: added 29 vocabulary rows to `src/components/ChineseLearningApp.tsx`.
Processed level_01_book_b_05.jpg: added 30 vocabulary rows to `src/components/ChineseLearningApp.tsx`.
Processed level_01_book_b_06.jpg: added 25 vocabulary rows to `src/components/ChineseLearningApp.tsx`.