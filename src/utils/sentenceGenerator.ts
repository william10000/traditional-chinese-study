import type { VocabularyWord } from "../types";

export type SentenceCard = { characters: string; pinyin: string; english: string };

export const buildSentenceCards = (
  available: VocabularyWord[],
  desiredCount = 24
): SentenceCard[] => {
  if (!available.length) return [];

  const byChars = new Map(available.map((w) => [w.characters, w] as const));

  const pick = <T>(arr: T[]) =>
    arr.length ? arr[Math.floor(Math.random() * arr.length)] : undefined;

  const fromChars = (chars: string[]) =>
    chars.map((c) => byChars.get(c)).filter(Boolean) as VocabularyWord[];

  const subjects = fromChars([
    "我",
    "你",
    "他",
    "她",
    "我們",
    "你們",
    "他們",
    "媽媽",
    "爸爸",
    "老師",
    "同學",
    "小朋友",
    "王",
    "李大文",
    "林東明",
    "陳心美",
    "張莉",
    "方友朋",
  ]);
  const advs = fromChars(["很", "也", "都"]);
  const verbsTransitive = fromChars(["喜歡", "吃", "喝", "看", "買", "要"]);
  const verbObjects = fromChars([
    "跑步",
    "跳舞",
    "聽音樂",
    "看書",
    "看電視",
    "打球",
    "游泳",
  ]);
  const objects = fromChars([
    "蘋果",
    "麵包",
    "牛奶",
    "書",
    "中文",
    "巧克力",
    "披薩",
    "蛋糕",
    "香蕉",
    "水果",
    "照片",
    "手機",
    "校車",
    "學校",
    "公園",
    "超級市場",
    "果汁",
    "湯",
    "糖果",
    "魚",
    "玉米",
    "米",
    "麵",
  ]);
  const adjectives = fromChars(["冷", "熱", "漂亮", "高興", "舒服", "新"]);
  const timeWords = fromChars(["今天", "明天", "昨天", "現在", "週末"]);
  const places = fromChars([
    "學校",
    "公園",
    "家",
    "外面",
    "裡面",
    "前面",
    "後面",
    "中間",
    "房間",
    "超級市場",
  ]);
  const zai = byChars.get("在");
  const ma = byChars.get("嗎");

  const joinChars = (parts: VocabularyWord[]) =>
    parts.map((w) => w.characters).join("");
  const joinPinyin = (parts: VocabularyWord[]) =>
    parts.map((w) => w.pinyin).join(" ");
  const joinEnglish = (parts: VocabularyWord[]) =>
    parts.map((w) => w.english).join(" ");

  const cards: SentenceCard[] = [];
  const max = Math.max(6, desiredCount);
  let guard = 0;
  while (cards.length < max && guard++ < max * 10) {
    const templates: (() => SentenceCard | undefined)[] = [];

    // Template A: S (+adv?) + Vt + O (+ 嗎)?
    templates.push(() => {
      const s = pick(subjects);
      const v = pick(verbsTransitive);
      const o = pick(objects);
      if (!s || !v || !o) return undefined;
      const maybeAdv = Math.random() < 0.4 ? pick(advs) : undefined;
      const parts = [s, ...(maybeAdv ? [maybeAdv] : []), v, o];
      const endQuestion = ma && Math.random() < 0.25;
      const characters =
        joinChars(parts) + (endQuestion ? ma.characters + "？" : "。");
      const pinyin =
        joinPinyin(parts) + (endQuestion ? ` ${ma.pinyin} ?` : " .");
      const english = joinEnglish(parts) + (endQuestion ? " ?" : " .");
      return { characters, pinyin, english };
    });

    // Template B: S 很 + ADJ
    templates.push(() => {
      const s = pick(subjects);
      const h = advs.find((a) => a.characters === "很");
      const adj = pick(adjectives);
      if (!s || !h || !adj) return undefined;
      const parts = [s, h, adj];
      return {
        characters: joinChars(parts) + "。",
        pinyin: joinPinyin(parts) + " .",
        english: joinEnglish(parts) + " .",
      };
    });

    // Template C: (TIME?) S 在 PLACE + VO
    templates.push(() => {
      const t = Math.random() < 0.5 ? pick(timeWords) : undefined;
      const s = pick(subjects);
      const place = pick(places);
      const vo = pick(verbObjects);
      if (!s || !place || !vo || !zai) return undefined;
      const parts = [...(t ? [t] : []), s, zai, place, vo];
      return {
        characters: joinChars(parts) + "。",
        pinyin: joinPinyin(parts) + " .",
        english: joinEnglish(parts) + " .",
      };
    });

    const make = pick(templates)?.();
    if (make) {
      if (!cards.some((c) => c.characters === make.characters)) {
        cards.push(make);
      }
    }
  }
  return cards;
};
