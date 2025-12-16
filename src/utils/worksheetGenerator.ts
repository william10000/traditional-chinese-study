import type { VocabularyWord } from "../types";

export const generateWorksheet = (
  selectedLesson: string,
  filteredVocabulary: VocabularyWord[]
) => {
  const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Traditional Chinese Writing Practice</title>
        <style>
          @page {
            size: A4;
            margin: 15mm;
          }
          @media print {
            body {
              margin: 0;
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
            }
            .no-print { display: none !important; }
            .page-break { page-break-before: always; }
          }
          * {
            box-sizing: border-box;
          }
          body {
            font-family: 'Arial', 'Microsoft JhengHei', '微軟正黑體', sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
            line-height: 1.4;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #c41e3a;
            padding-bottom: 20px;
          }
          .header h1 {
            color: #c41e3a;
            font-size: 28px;
            margin: 0 0 10px 0;
            font-weight: bold;
          }
          .header p {
            color: #666;
            margin: 8px 0;
            font-size: 14px;
          }
          .practice-grid {
            display: inline-grid;
            grid-template-columns: repeat(10, 50px);
            grid-template-rows: 50px;
            gap: 2px;
            margin: 12px auto;
            border: 2px solid #333;
            background: #333;
            justify-content: center;
          }
          .grid-cell {
            width: 50px;
            height: 50px;
            background: white;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            border: 1px solid #ddd;
          }
          .grid-cell::before {
            content: '';
            position: absolute;
            width: 1px;
            height: 100%;
            left: 50%;
            background: #ddd;
            z-index: 1;
          }
          .grid-cell::after {
            content: '';
            position: absolute;
            height: 1px;
            width: 100%;
            top: 50%;
            background: #ddd;
            z-index: 1;
          }
          .example {
            font-size: 36px;
            font-weight: bold;
            z-index: 2;
            color: #c41e3a;
            position: relative;
          }
          .word-section {
            margin: 30px 0;
            page-break-inside: avoid;
            border: 2px solid #eee;
            padding: 20px;
            background: #fafafa;
            border-radius: 8px;
          }
          .word-info {
            margin-bottom: 20px;
            text-align: center;
            background: white;
            padding: 15px;
            border-radius: 6px;
            border: 1px solid #ddd;
          }
          .characters {
            font-size: 32px;
            font-weight: bold;
            color: #c41e3a;
            margin-bottom: 8px;
          }
          .details {
            font-size: 16px;
            margin: 5px 0;
          }
          .pinyin {
            color: #666;
            font-weight: 500;
            margin-right: 15px;
          }
          .english {
            color: #333;
            font-style: italic;
          }
          .lesson-tag {
            background: #c41e3a;
            color: white;
            padding: 4px 12px;
            border-radius: 15px;
            font-size: 12px;
            margin-left: 15px;
            font-weight: bold;
          }
          .grid-container {
            text-align: center;
            margin: 15px 0;
          }
          .char-label {
            font-size: 18px;
            color: #666;
            margin-bottom: 8px;
            font-weight: 500;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>傳統中文書法練習<br>Traditional Chinese Writing Practice</h1>
          <p><strong>課程 Lesson:</strong> ${
            selectedLesson === "all"
              ? "All Lessons 所有課程"
              : `Lesson ${selectedLesson} 第${selectedLesson.slice(1)}課`
          }</p>
          <p><strong>練習說明 Instructions:</strong> Trace the red example character in the first box, then practice writing it in the remaining boxes</p>
          <p><strong>日期 Date:</strong> _________________ <strong>姓名 Name:</strong> _________________</p>
        </div>

        ${filteredVocabulary
          .map(
            (word, wordIndex) => `
          ${
            wordIndex > 0 && wordIndex % 3 === 0
              ? '<div class="page-break"></div>'
              : ""
          }
          <div class="word-section">
            <div class="word-info">
              <div class="characters">${word.characters}</div>
              <div class="details">
                <span class="pinyin">${word.pinyin}</span>
                <span class="english">${word.english}</span>
                <span class="lesson-tag">${word.lesson}</span>
              </div>
            </div>

            ${word.characters
              .split("")
              .map(
                (char, charIndex) => `
              <div class="grid-container">
                <div class="char-label">Character ${
                  charIndex + 1
                }: ${char}</div>
                <div class="practice-grid">
                  <div class="grid-cell">
                    <span class="example">${char}</span>
                  </div>
                  ${Array.from(
                    { length: 9 },
                    () => '<div class="grid-cell"></div>'
                  ).join("")}
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        `
          )
          .join("")}

        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
          <p>Generated by Traditional Chinese Learning App • 傳統中文學習應用程式</p>
          <p>Practice Tips: Write slowly and carefully • Follow the stroke order • Use proper posture</p>
        </div>
      </body>
      </html>
    `;

  // Create a new window/tab with the worksheet
  const newWindow = window.open("", "_blank");
  if (newWindow) {
    newWindow.document.open();
    newWindow.document.write(printContent);
    newWindow.document.close();

    // Focus the new window and trigger print dialog after content loads
    newWindow.focus();
    setTimeout(() => {
      if (newWindow && !newWindow.closed) {
        newWindow.print();
      }
    }, 1000);
  } else {
    alert("Please allow pop-ups to generate the worksheet. Then try again.");
  }
};
