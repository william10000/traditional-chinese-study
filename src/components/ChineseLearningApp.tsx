import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Printer, Shuffle, Check, X, Volume2, Eye, EyeOff } from 'lucide-react';
import { VocabularyWord, StudyStats } from '../types';

const ALL_OPTION = 'all';

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

const getUniqueSortedValues = (values: string[]) =>
  Array.from(new Set(values)).sort((a, b) => collator.compare(a, b));

const formatLessonLabel = (lesson: string) => {
  const normalized = lesson.trim();

  const lessonMatch = normalized.match(/^L(\d+)$/i);
  if (lessonMatch) {
    return `Lesson ${normalized.toUpperCase()} 第${lessonMatch[1]}課`;
  }

  const testMatch = normalized.match(/^Test(\d+)$/i);
  if (testMatch) {
    return `Test ${testMatch[1]} 測驗${testMatch[1]}`;
  }

  return normalized;
};

export const VOCABULARY: VocabularyWord[] = [
  { pinyin: 'ā yí', characters: '阿姨', english: 'aunt', lesson: 'L12', book: 'B', level: 'K2' },
  { pinyin: 'bā', characters: '八', english: 'eight', lesson: 'L3', book: 'B', level: 'K2' },
  
  { pinyin: 'bà ba', characters: '爸爸', english: 'dad', lesson: 'L2', book: 'B', level: 'K2' },
  { pinyin: 'bā yuè', characters: '八月', english: 'August', lesson: 'L6', book: 'B', level: 'K2' },
  { pinyin: 'bān', characters: '班', english: 'class', lesson: 'L3', book: 'B', level: 'K2' },
  { pinyin: 'bí zi', characters: '鼻子', english: 'nose', lesson: 'L7', book: 'B', level: 'K2' },
  { pinyin: 'bù', characters: '不', english: 'no', lesson: 'L5', book: 'B', level: 'K2' },
  { pinyin: 'chàng gē', characters: '唱歌', english: 'to sing a song', lesson: 'L8', book: 'B', level: 'K2' },
  { pinyin: 'chāo jí shì chǎng', characters: '超級市場', english: 'supermarket', lesson: 'L11', book: 'B', level: 'K2' },
  { pinyin: 'chén xīn měi', characters: '陳心美', english: 'May Chen', lesson: 'L1', book: 'B', level: 'K2' },
  { pinyin: 'chī', characters: '吃', english: 'to eat', lesson: 'L4', book: 'B', level: 'K2' },
  { pinyin: 'chūn tiān', characters: '春天', english: 'spring', lesson: 'L5', book: 'B', level: 'K2' },
  { pinyin: 'dǎ', characters: '打', english: 'to call, to beat, to strike', lesson: 'L12', book: 'B', level: 'K2' },
  { pinyin: 'dǎ qiú', characters: '打球', english: 'to play ball', lesson: 'L8', book: 'B', level: 'K2' },
  { pinyin: 'dàn', characters: '蛋', english: 'egg', lesson: 'L4', book: 'B', level: 'K2' },
  { pinyin: 'de', characters: '的', english: "'s (possessive particle)", lesson: 'L6', book: 'B', level: 'K2' },
  { pinyin: 'dì di', characters: '弟弟', english: 'younger brother', lesson: 'L2', book: 'B', level: 'K2' },
  { pinyin: 'diàn huà', characters: '電話', english: 'phone', lesson: 'L12', book: 'B', level: 'K2' },
  { pinyin: 'dōng tiān', characters: '冬天', english: 'winter', lesson: 'L5', book: 'B', level: 'K2' },
  { pinyin: 'èr', characters: '二', english: 'two', lesson: 'L2', book: 'B', level: 'K2' },
  { pinyin: 'èr shí', characters: '二十', english: 'twenty', lesson: 'L6', book: 'B', level: 'K2' },
  { pinyin: 'èr yuè', characters: '二月', english: 'February', lesson: 'L6', book: 'B', level: 'K2' },
  // G-H-J-K section
  { pinyin: 'ge', characters: '個', english: '(measure word)', lesson: 'L2', book: 'B', level: 'K2' },
  { pinyin: 'gē ge', characters: '哥哥', english: 'older brother', lesson: 'L2', book: 'B', level: 'K2' },
  { pinyin: 'gēn', characters: '跟', english: 'with', lesson: 'L7', book: 'B', level: 'K2' },
  { pinyin: 'gōng yuán', characters: '公園', english: 'park', lesson: 'L11', book: 'B', level: 'K2' },
  { pinyin: 'gū gu', characters: '姑姑', english: "aunt, father's sister", lesson: 'L10', book: 'B', level: 'K2' },
  { pinyin: 'hàn', characters: '和', english: 'with, and', lesson: 'L2', book: 'B', level: 'K2' },
  { pinyin: 'hàn bǎo', characters: '漢堡', english: 'hamburger', lesson: 'L4', book: 'B', level: 'K2' },
  { pinyin: 'hǎo', characters: '好', english: 'good, fine', lesson: 'L7', book: 'B', level: 'K2' },
  { pinyin: 'hào', characters: '號', english: 'day of the month, ordinal number', lesson: 'L6', book: 'B', level: 'K2' },
  { pinyin: 'hē', characters: '喝', english: 'to drink', lesson: 'L4', book: 'B', level: 'K2' },
  { pinyin: 'hěn', characters: '很', english: 'very', lesson: 'L5', book: 'B', level: 'K2' },
  { pinyin: 'hòu miàn', characters: '後面', english: 'behind', lesson: 'L9', book: 'B', level: 'K2' },
  { pinyin: 'huà', characters: '畫', english: 'to draw', lesson: 'L7', book: 'B', level: 'K2' },
  { pinyin: 'huà tú', characters: '畫圖', english: 'to draw a picture', lesson: 'L7', book: 'B', level: 'K2' },
  { pinyin: 'jǐ', characters: '幾', english: 'how much, how many, several, a few', lesson: 'L2', book: 'B', level: 'K2' },
  { pinyin: 'jiā', characters: '家', english: 'family, home', lesson: 'L2', book: 'B', level: 'K2' },
  { pinyin: 'jiào', characters: '叫', english: 'to be called (by the name of), to call', lesson: 'L1', book: 'B', level: 'K2' },
  { pinyin: 'jiě jie', characters: '姊姊', english: 'older sister', lesson: 'L2', book: 'B', level: 'K2' },
  { pinyin: 'jīn tiān', characters: '今天', english: 'today', lesson: 'L4', book: 'B', level: 'K2' },
  { pinyin: 'jiǔ', characters: '九', english: 'nine', lesson: 'L3', book: 'B', level: 'K2' },
  { pinyin: 'jiǔ yuè', characters: '九月', english: 'September', lesson: 'L6', book: 'B', level: 'K2' },
  { pinyin: 'kāi chē', characters: '開車', english: 'to drive', lesson: 'L11', book: 'B', level: 'K2' },
  { pinyin: 'kàn diàn shì', characters: '看電視', english: 'to watch television (TV)', lesson: 'L8', book: 'B', level: 'K2' },
  { pinyin: 'kě shì', characters: '可是', english: 'but', lesson: 'L8', book: 'B', level: 'K2' },
  // L-M-N section
  { pinyin: 'lái', characters: '來', english: 'to come', lesson: 'L12', book: 'B', level: 'K2' },
  { pinyin: 'lǎo shī', characters: '老師', english: 'teacher', lesson: 'L3', book: 'B', level: 'K2' },
  { pinyin: 'lěng', characters: '冷', english: 'cold', lesson: 'L5', book: 'B', level: 'K2' },
  { pinyin: 'lǐ dà wén', characters: '李大文', english: 'Devin Li', lesson: 'L1', book: 'B', level: 'K2' },
  { pinyin: 'lǐ miàn', characters: '裡面', english: 'inside', lesson: 'L9', book: 'B', level: 'K2' },
  { pinyin: 'liǎng', characters: '兩', english: 'two', lesson: 'L3', book: 'B', level: 'K2' },
  { pinyin: 'lín dōng míng', characters: '林東明', english: 'Tony Lin', lesson: 'L1', book: 'B', level: 'K2' },
  { pinyin: 'liù', characters: '六', english: 'six', lesson: 'L3', book: 'B', level: 'K2' },
  { pinyin: 'liù yuè', characters: '六月', english: 'June', lesson: 'L6', book: 'B', level: 'K2' },
  { pinyin: 'ma', characters: '嗎', english: 'question particle for "yes-no" questions', lesson: 'L5', book: 'B', level: 'K2' },
  { pinyin: 'mā ma', characters: '媽媽', english: 'mom', lesson: 'L2', book: 'B', level: 'K2' },
  { pinyin: 'mèi mei', characters: '妹妹', english: 'younger sister', lesson: 'L2', book: 'B', level: 'K2' },
  { pinyin: 'miàn bāo', characters: '麵包', english: 'bread', lesson: 'L4', book: 'B', level: 'K2' },
  { pinyin: 'míng tiān', characters: '明天', english: 'tomorrow', lesson: 'L4', book: 'B', level: 'K2' },
  { pinyin: 'míng zi', characters: '名字', english: 'name', lesson: 'L1', book: 'B', level: 'K2' },
  { pinyin: 'nà', characters: '那', english: 'that', lesson: 'L10', book: 'B', level: 'K2' },
  { pinyin: 'nǎ lǐ', characters: '哪裡', english: 'where', lesson: 'L9', book: 'B', level: 'K2' },
  { pinyin: 'nǎi nai', characters: '奶奶', english: 'grandma, grandmother', lesson: 'L10', book: 'B', level: 'K2' },
  { pinyin: 'nán shēng', characters: '男生', english: 'boy', lesson: 'L3', book: 'B', level: 'K2' },
  { pinyin: 'ne', characters: '呢', english: '(question particle)', lesson: 'L9', book: 'B', level: 'K2' },
  { pinyin: 'nǐ', characters: '你', english: 'you', lesson: 'L1', book: 'B', level: 'K2' },
  { pinyin: 'nǐ hǎo', characters: '你好', english: 'hello', lesson: 'L1', book: 'B', level: 'K2' },
  { pinyin: 'nǐ men', characters: '你們', english: 'you (plural)', lesson: 'L3', book: 'B', level: 'K2' },
  { pinyin: 'nín', characters: '您', english: 'you (courteous)', lesson: 'L12', book: 'B', level: 'K2' },
  { pinyin: 'niú nǎi', characters: '牛奶', english: 'milk', lesson: 'L4', book: 'B', level: 'K2' },
  { pinyin: 'nǚ shēng', characters: '女生', english: 'girl', lesson: 'L3', book: 'B', level: 'K2' },
  // P-Q-R-S section
  { pinyin: 'pǎo bù', characters: '跑步', english: 'to run, to jog', lesson: 'L8', book: 'B', level: 'K2' },
  { pinyin: 'pī sà', characters: '披薩', english: 'pizza', lesson: 'L4', book: 'B', level: 'K2' },
  { pinyin: 'píng guǒ', characters: '蘋果', english: 'apple', lesson: 'L4', book: 'B', level: 'K2' },
  { pinyin: 'qī', characters: '七', english: 'seven', lesson: 'L3', book: 'B', level: 'K2' },
  { pinyin: 'qī yuè', characters: '七月', english: 'July', lesson: 'L6', book: 'B', level: 'K2' },
  { pinyin: 'qián miàn', characters: '前面', english: 'in front of', lesson: 'L9', book: 'B', level: 'K2' },
  { pinyin: 'qǐng wèn', characters: '請問', english: 'Excuse me, may I ask...?', lesson: 'L12', book: 'B', level: 'K2' },
  { pinyin: 'qiú', characters: '球', english: 'ball', lesson: 'L9', book: 'B', level: 'K2' },
  { pinyin: 'qiū tiān', characters: '秋天', english: 'autumn, fall', lesson: 'L5', book: 'B', level: 'K2' },
  { pinyin: 'qù', characters: '去', english: 'to go', lesson: 'L11', book: 'B', level: 'K2' },
  { pinyin: 'rè', characters: '熱', english: 'hot', lesson: 'L5', book: 'B', level: 'K2' },
  { pinyin: 'rén', characters: '人', english: 'people, person', lesson: 'L2', book: 'B', level: 'K2' },
  { pinyin: 'sān', characters: '三', english: 'three', lesson: 'L2', book: 'B', level: 'K2' },
  { pinyin: 'sān shí', characters: '三十', english: 'thirty', lesson: 'L6', book: 'B', level: 'K2' },
  { pinyin: 'sān yuè', characters: '三月', english: 'March', lesson: 'L6', book: 'B', level: 'K2' },
  { pinyin: 'shàng miàn', characters: '上面', english: 'on top of', lesson: 'L9', book: 'B', level: 'K2' },
  { pinyin: 'shéi', characters: '誰', english: 'who', lesson: 'L10', book: 'B', level: 'K2' },
  { pinyin: 'shén me', characters: '什麼', english: 'what', lesson: 'L1', book: 'B', level: 'K2' },
  { pinyin: 'shēn tǐ', characters: '身體', english: 'body', lesson: 'L7', book: 'B', level: 'K2' },
  { pinyin: 'shēng rì', characters: '生日', english: 'birthday', lesson: 'L6', book: 'B', level: 'K2' },
  { pinyin: 'shí', characters: '十', english: 'ten', lesson: 'L3', book: 'B', level: 'K2' },
  { pinyin: 'shì', characters: '是', english: 'to be (am, are, is)', lesson: 'L6', book: 'B', level: 'K2' },
  { pinyin: 'shí bā', characters: '十八', english: 'eighteen', lesson: 'L6', book: 'B', level: 'K2' },
  { pinyin: 'shí èr', characters: '十二', english: 'twelve', lesson: 'L6', book: 'B', level: 'K2' },
  { pinyin: 'shí èr yuè', characters: '十二月', english: 'December', lesson: 'L6', book: 'B', level: 'K2' },
  { pinyin: 'shí jiǔ', characters: '十九', english: 'nineteen', lesson: 'L6', book: 'B', level: 'K2' },
  { pinyin: 'shí liù', characters: '十六', english: 'sixteen', lesson: 'L6', book: 'B', level: 'K2' },
  { pinyin: 'shí qī', characters: '十七', english: 'seventeen', lesson: 'L6', book: 'B', level: 'K2' },
  { pinyin: 'shí sān', characters: '十三', english: 'thirteen', lesson: 'L6', book: 'B', level: 'K2' },
  { pinyin: 'shí sì', characters: '十四', english: 'fourteen', lesson: 'L6', book: 'B', level: 'K2' },
  { pinyin: 'shí wǔ', characters: '十五', english: 'fifteen', lesson: 'L6', book: 'B', level: 'K2' },
  { pinyin: 'shí yī', characters: '十一', english: 'eleven', lesson: 'L6', book: 'B', level: 'K2' },
  { pinyin: 'shí yī yuè', characters: '十一月', english: 'November', lesson: 'L6', book: 'B', level: 'K2' },
  { pinyin: 'shí yuè', characters: '十月', english: 'October', lesson: 'L6', book: 'B', level: 'K2' },
  { pinyin: 'shǒu', characters: '手', english: 'hand(s)', lesson: 'L7', book: 'B', level: 'K2' },
  { pinyin: 'shǒu jī', characters: '手機', english: 'cell phone', lesson: 'L12', book: 'B', level: 'K2' },
  { pinyin: 'shū', characters: '書', english: 'book', lesson: 'L9', book: 'B', level: 'K2' },
  { pinyin: 'shū shu', characters: '叔叔', english: "uncle, father's younger brother", lesson: 'L10', book: 'B', level: 'K2' },
  { pinyin: 'shuǐ guǒ', characters: '水果', english: 'fruit', lesson: 'L4', book: 'B', level: 'K2' },
  { pinyin: 'sì', characters: '四', english: 'four', lesson: 'L2', book: 'B', level: 'K2' },
  { pinyin: 'sì yuè', characters: '四月', english: 'April', lesson: 'L6', book: 'B', level: 'K2' },
  { pinyin: 'sòng', characters: '送', english: 'to send, to deliver', lesson: 'L11', book: 'B', level: 'K2' },
  { pinyin: 'suì', characters: '歲', english: 'years old', lesson: 'L10', book: 'B', level: 'K2' },
  // T section
  { pinyin: 'tā', characters: '他', english: 'he, him', lesson: 'L1', book: 'B', level: 'K2' },
  { pinyin: 'tā', characters: '她', english: 'she, her', lesson: 'L1', book: 'B', level: 'K2' },
  { pinyin: 'tā men', characters: '他們', english: 'they', lesson: 'L10', book: 'B', level: 'K2' },
  { pinyin: 'tiào wǔ', characters: '跳舞', english: 'to dance', lesson: 'L8', book: 'B', level: 'K2' },
  { pinyin: 'tīng yīn yuè', characters: '聽音樂', english: 'to listen to music', lesson: 'L8', book: 'B', level: 'K2' },
  { pinyin: 'tóng xué', characters: '同學', english: 'classmate', lesson: 'L3', book: 'B', level: 'K2' },
  { pinyin: 'tóu', characters: '頭', english: 'head', lesson: 'L7', book: 'B', level: 'K2' },
  // W-X-Y section
  { pinyin: 'wài miàn', characters: '外面', english: 'outside', lesson: 'L9', book: 'B', level: 'K2' },
  { pinyin: 'wǎn fàn', characters: '晚飯', english: 'dinner', lesson: 'L4', book: 'B', level: 'K2' },
  { pinyin: 'wǎn shang', characters: '晚上', english: 'night', lesson: 'L12', book: 'B', level: 'K2' },
  { pinyin: 'wéi', characters: '喂', english: 'hello (when answering the phone)', lesson: 'L12', book: 'B', level: 'K2' },
  { pinyin: 'wǒ', characters: '我', english: 'I, me', lesson: 'L1', book: 'B', level: 'K2' },
  { pinyin: 'wǒ men', characters: '我們', english: 'we', lesson: 'L3', book: 'B', level: 'K2' },
  { pinyin: 'wǔ', characters: '五', english: 'five', lesson: 'L2', book: 'B', level: 'K2' },
  { pinyin: 'wǔ fàn', characters: '午飯', english: 'lunch', lesson: 'L4', book: 'B', level: 'K2' },
  { pinyin: 'wǔ yuè', characters: '五月', english: 'May', lesson: 'L6', book: 'B', level: 'K2' },
  { pinyin: 'xià kè', characters: '下課', english: 'to finish class, Class is dismissed', lesson: 'L8', book: 'B', level: 'K2' },
  { pinyin: 'xià miàn', characters: '下面', english: 'under, below', lesson: 'L9', book: 'B', level: 'K2' },
  { pinyin: 'xiào chē', characters: '校車', english: 'school bus', lesson: 'L11', book: 'B', level: 'K2' },
  { pinyin: 'xiǎo péng yǒu', characters: '小朋友', english: 'kids, children', lesson: 'L3', book: 'B', level: 'K2' },
  { pinyin: 'xiǎo qì chē', characters: '小汽車', english: 'toy car', lesson: 'L9', book: 'B', level: 'K2' },
  { pinyin: 'xǐ huān', characters: '喜歡', english: 'to like', lesson: 'L5', book: 'B', level: 'K2' },
  { pinyin: 'xià tiān', characters: '夏天', english: 'summer', lesson: 'L5', book: 'B', level: 'K2' },
  { pinyin: 'xiāng jiāo', characters: '香蕉', english: 'banana', lesson: 'L4', book: 'B', level: 'K2' },
  { pinyin: 'xiè xie', characters: '謝謝', english: 'Thank you', lesson: 'L12', book: 'B', level: 'K2' },
  { pinyin: 'xuě rén', characters: '雪人', english: 'snowman', lesson: 'L7', book: 'B', level: 'K2' },
  { pinyin: 'xuě xiào', characters: '學校', english: 'school', lesson: 'L11', book: 'B', level: 'K2' },
  { pinyin: 'yǎn jīng', characters: '眼睛', english: 'eye(s)', lesson: 'L7', book: 'B', level: 'K2' },
  { pinyin: 'yào', characters: '要', english: 'to want', lesson: 'L7', book: 'B', level: 'K2' },
  { pinyin: 'yě', characters: '也', english: 'also', lesson: 'L8', book: 'B', level: 'K2' },
  { pinyin: 'yé ye', characters: '爺爺', english: 'grandpa, grandfather', lesson: 'L10', book: 'B', level: 'K2' },
  { pinyin: 'yī', characters: '一', english: 'one', lesson: 'L2', book: 'B', level: 'K2' },
  { pinyin: 'yǐ hòu', characters: '以後', english: 'after, afterwards', lesson: 'L8', book: 'B', level: 'K2' },
  { pinyin: 'yī qǐ', characters: '一起', english: 'together', lesson: 'L7', book: 'B', level: 'K2' },
  { pinyin: 'yī yuè', characters: '一月', english: 'January', lesson: 'L6', book: 'B', level: 'K2' },
  { pinyin: 'yǐ zi', characters: '椅子', english: 'chair', lesson: 'L9', book: 'B', level: 'K2' },
  { pinyin: 'yǒu', characters: '有', english: 'there is / are', lesson: 'L2', book: 'B', level: 'K2' },
  { pinyin: 'yuè', characters: '月', english: 'month', lesson: 'L6', book: 'B', level: 'K2' },
  { pinyin: 'zài', characters: '在', english: '(located) at, (to be) in', lesson: 'L9', book: 'B', level: 'K2' },
  { pinyin: 'zài', characters: '再', english: 'again', lesson: 'L12', book: 'B', level: 'K2' },
  { pinyin: 'zǎo fàn', characters: '早飯', english: 'breakfast', lesson: 'L4', book: 'B', level: 'K2' },
  { pinyin: 'zěn me', characters: '怎麼', english: 'how? why?', lesson: 'L11', book: 'B', level: 'K2' },
  { pinyin: 'zhāng', characters: '張', english: 'sheet, piece, objects that are flat like paper', lesson: 'L10', book: 'B', level: 'K2' },
  { pinyin: 'zhào piàn', characters: '照片', english: 'photograph', lesson: 'L10', book: 'B', level: 'K2' },
  { pinyin: 'zhè', characters: '這', english: 'this', lesson: 'L10', book: 'B', level: 'K2' },
  { pinyin: 'zhuō zi', characters: '桌子', english: 'table', lesson: 'L9', book: 'B', level: 'K2' },
  { pinyin: 'zǒu lù', characters: '走路', english: 'to walk', lesson: 'L11', book: 'B', level: 'K2' },
  { pinyin: 'zuǐ ba', characters: '嘴巴', english: 'mouth', lesson: 'L7', book: 'B', level: 'K2' },
  { pinyin: 'zuò', characters: '坐', english: 'to sit, to ride', lesson: 'L11', book: 'B', level: 'K2' },
  { pinyin: 'zuò', characters: '做', english: 'to do', lesson: 'L8', book: 'B', level: 'K2' },
  { pinyin: 'zuó tiān', characters: '昨天', english: 'yesterday', lesson: 'L6', book: 'B', level: 'K2' },
  // Level 1 Book A - Page 107 (level_01_book_a_01.jpg)
  { pinyin: 'bā', characters: '八', english: 'eight', lesson: 'L3', book: 'A', level: '1' },
  { pinyin: 'bà ba', characters: '爸爸', english: 'dad', lesson: 'L3', book: 'A', level: '1' },
  { pinyin: 'bān', characters: '班', english: 'class', lesson: 'L3', book: 'A', level: '1' },
  { pinyin: 'chén xīn měi', characters: '陳心美', english: 'May Chen', lesson: 'L1', book: 'A', level: '1' },
  { pinyin: 'chī', characters: '吃', english: 'to eat', lesson: 'L2', book: 'A', level: '1' },
  { pinyin: 'dàn gāo', characters: '蛋糕', english: 'cake', lesson: 'L4', book: 'A', level: '1' },
  { pinyin: 'dào', characters: '到', english: 'to (a place), until (a time)', lesson: 'L6', book: 'A', level: '1' },
  { pinyin: 'de', characters: '的', english: "'s (possessive particle)", lesson: 'L6', book: 'A', level: '1' },
  { pinyin: 'dì di', characters: '弟弟', english: 'younger brother', lesson: 'L2', book: 'A', level: '1' },
  { pinyin: 'dōng tiān', characters: '冬天', english: 'winter', lesson: 'L5', book: 'A', level: '1' },
  { pinyin: 'èr shí bā', characters: '二十八', english: 'twenty-eight', lesson: 'L6', book: 'A', level: '1' },
  { pinyin: 'gè', characters: '個', english: '(measure word)', lesson: 'L2', book: 'A', level: '1' },
  { pinyin: 'gē ge', characters: '哥哥', english: 'older brother', lesson: 'L2', book: 'A', level: '1' },
  { pinyin: 'guǒ zhī', characters: '果汁', english: 'juice', lesson: 'L4', book: 'A', level: '1' },
  { pinyin: 'hái yào', characters: '還要', english: 'also want', lesson: 'L4', book: 'A', level: '1' },
  { pinyin: 'hái yǒu', characters: '還有', english: 'also have, in addition', lesson: 'L4', book: 'A', level: '1' },
  { pinyin: 'hàn', characters: '和', english: 'with, and', lesson: 'L2', book: 'A', level: '1' },
  { pinyin: 'hǎo', characters: '好', english: 'good, fine', lesson: 'L6', book: 'A', level: '1' },
  { pinyin: 'hào', characters: '號', english: 'day of the month, ordinal number', lesson: 'L6', book: 'A', level: '1' },
  { pinyin: 'hē', characters: '喝', english: 'to drink', lesson: 'L2', book: 'A', level: '1' },
  { pinyin: 'hěn', characters: '很', english: 'very', lesson: 'L5', book: 'A', level: '1' },
  { pinyin: 'jǐ', characters: '幾', english: 'how many', lesson: 'L2', book: 'A', level: '1' },
  { pinyin: 'jiā', characters: '家', english: 'family, home', lesson: 'L2', book: 'A', level: '1' },
  { pinyin: 'jiào', characters: '叫', english: 'to be called (by the name of), to call', lesson: 'L1', book: 'A', level: '1' },
  { pinyin: 'jiě jie', characters: '姊姊', english: 'older sister', lesson: 'L2', book: 'A', level: '1' },
  // Level 1 Book A - Page 108 (level_01_book_a_02.jpg)
  { pinyin: 'jīn tiān', characters: '今天', english: 'today', lesson: 'L4', book: 'A', level: '1' },
  { pinyin: 'jiǔ', characters: '九', english: 'nine', lesson: 'L3', book: 'A', level: '1' },
  { pinyin: 'jué de', characters: '覺得', english: 'to think, to feel', lesson: 'L5', book: 'A', level: '1' },
  { pinyin: 'kě shì', characters: '可是', english: 'but, however', lesson: 'L5', book: 'A', level: '1' },
  { pinyin: 'kuài', characters: '快', english: 'nearly', lesson: 'L6', book: 'A', level: '1' },
  { pinyin: 'píng guǒ', characters: '蘋果', english: 'apple', lesson: 'L4', book: 'A', level: '1' },
  { pinyin: 'lái', characters: '來', english: 'to come', lesson: 'L4', book: 'A', level: '1' },
  { pinyin: 'lǎo shī', characters: '老師', english: 'teacher', lesson: 'L3', book: 'A', level: '1' },
  { pinyin: 'lěng', characters: '冷', english: 'cold', lesson: 'L5', book: 'A', level: '1' },
  { pinyin: 'lǐ dà wén', characters: '李大文', english: 'Devin Li', lesson: 'L1', book: 'A', level: '1' },
  { pinyin: 'lǐ wù', characters: '禮物', english: 'gift', lesson: 'L6', book: 'A', level: '1' },
  { pinyin: 'liǎng', characters: '兩', english: 'two', lesson: 'L3', book: 'A', level: '1' },
  { pinyin: 'lín dōng míng', characters: '林東明', english: 'Tony Lin', lesson: 'L1', book: 'A', level: '1' },
  { pinyin: 'liù', characters: '六', english: 'six', lesson: 'L3', book: 'A', level: '1' },
  { pinyin: 'ma', characters: '嗎', english: 'question particle for "yes-no" questions', lesson: 'L3', book: 'A', level: '1' },
  { pinyin: 'mān huà', characters: '漫畫', english: 'comic', lesson: 'L4', book: 'A', level: '1' },
  { pinyin: 'mā ma', characters: '媽媽', english: 'mom', lesson: 'L2', book: 'A', level: '1' },
  { pinyin: 'mèi mei', characters: '妹妹', english: 'younger sister', lesson: 'L2', book: 'A', level: '1' },
  { pinyin: 'miàn bāo', characters: '麵包', english: 'bread', lesson: 'L4', book: 'A', level: '1' },
  { pinyin: 'míng zi', characters: '名字', english: 'name', lesson: 'L1', book: 'A', level: '1' },
  { pinyin: 'nán shēng', characters: '男生', english: 'boy', lesson: 'L3', book: 'A', level: '1' },
  { pinyin: 'ne', characters: '呢', english: '(question particle)', lesson: 'L3', book: 'A', level: '1' },
  { pinyin: 'nǐ hǎo', characters: '你好', english: 'hello', lesson: 'L1', book: 'A', level: '1' },
  { pinyin: 'nǐ men', characters: '你們', english: 'you (plural)', lesson: 'L3', book: 'A', level: '1' },
  { pinyin: 'niú nǎi', characters: '牛奶', english: 'milk', lesson: 'L4', book: 'A', level: '1' },
  { pinyin: 'nǚ shēng', characters: '女生', english: 'girl', lesson: 'L3', book: 'A', level: '1' },
  { pinyin: 'qī', characters: '七', english: 'seven', lesson: 'L3', book: 'A', level: '1' },
  { pinyin: 'rè', characters: '熱', english: 'hot', lesson: 'L5', book: 'A', level: '1' },
  { pinyin: 'rén', characters: '人', english: 'people, person', lesson: 'L2', book: 'A', level: '1' },
  // Level 1 Book A - Page 109 (level_01_book_a_03.jpg)
  { pinyin: 'sān', characters: '三', english: 'three', lesson: 'L2', book: 'A', level: '1' },
  { pinyin: 'sān shí', characters: '三十', english: 'thirty', lesson: 'L6', book: 'A', level: '1' },
  { pinyin: 'shén me', characters: '什麼', english: 'what', lesson: 'L1', book: 'A', level: '1' },
  { pinyin: 'shēng rì', characters: '生日', english: 'birthday', lesson: 'L6', book: 'A', level: '1' },
  { pinyin: 'shí', characters: '十', english: 'ten', lesson: 'L3', book: 'A', level: '1' },
  { pinyin: 'shì', characters: '是', english: 'to be (am, are, is)', lesson: 'L1', book: 'A', level: '1' },
  { pinyin: 'shí yī', characters: '十一', english: 'eleven', lesson: 'L6', book: 'A', level: '1' },
  { pinyin: 'shū', characters: '書', english: 'book', lesson: 'L5', book: 'A', level: '1' },
  { pinyin: 'shuǐ guǒ', characters: '水果', english: 'fruit', lesson: 'L4', book: 'A', level: '1' },
  { pinyin: 'sì', characters: '四', english: 'four', lesson: 'L2', book: 'A', level: '1' },
  { pinyin: 'tā', characters: '他', english: 'he, him', lesson: 'L1', book: 'A', level: '1' },
  { pinyin: 'tā', characters: '她', english: 'she, her', lesson: 'L1', book: 'A', level: '1' },
  { pinyin: 'tài ... le', characters: '太⋯⋯了', english: 'too...', lesson: 'L5', book: 'A', level: '1' },
  { pinyin: 'tóng xué', characters: '同學', english: 'classmate', lesson: 'L6', book: 'A', level: '1' },
  { pinyin: 'wán jù', characters: '玩具', english: 'toy', lesson: 'L6', book: 'A', level: '1' },
  { pinyin: 'wǎn fàn', characters: '晚飯', english: 'dinner', lesson: 'L4', book: 'A', level: '1' },
  { pinyin: 'wáng', characters: '王', english: 'Wang (a surname)', lesson: 'L2', book: 'A', level: '1' },
  { pinyin: 'wǒ', characters: '我', english: 'I, me', lesson: 'L1', book: 'A', level: '1' },
  { pinyin: 'wǒ men', characters: '我們', english: 'we, us', lesson: 'L3', book: 'A', level: '1' },
  { pinyin: 'wǔ', characters: '五', english: 'five', lesson: 'L2', book: 'A', level: '1' },
  { pinyin: 'wǔ fàn', characters: '午飯', english: 'lunch', lesson: 'L4', book: 'A', level: '1' },
  { pinyin: 'xǐ huān', characters: '喜歡', english: 'to like', lesson: 'L5', book: 'A', level: '1' },
  { pinyin: 'xià tiān', characters: '夏天', english: 'summer', lesson: 'L5', book: 'A', level: '1' },
  { pinyin: 'xiāng jiāo', characters: '香蕉', english: 'banana', lesson: 'L4', book: 'A', level: '1' },
  { pinyin: 'yě', characters: '也', english: 'also', lesson: 'L3', book: 'A', level: '1' },
  { pinyin: 'yǒu', characters: '有', english: 'to have, there is / are, is / are there', lesson: 'L2', book: 'A', level: '1' },
  { pinyin: 'yǒu yì diǎn', characters: '有一點', english: 'a little', lesson: 'L5', book: 'A', level: '1' },
  { pinyin: 'yuè', characters: '月', english: 'month', lesson: 'L6', book: 'A', level: '1' },
  { pinyin: 'zǎo fàn', characters: '早飯', english: 'breakfast', lesson: 'L4', book: 'A', level: '1' },
  // Level 2 Book A Page 110 (level_02_book_a_01.jpg)
  { pinyin: 'bài nián', characters: '拜年', english: 'to visit somebody during the Chinese New Year holiday', lesson: 'L6', book: 'A', level: '2' },
  { pinyin: 'bái sè', characters: '白色', english: 'white', lesson: 'L5', book: 'A', level: '2' },
  { pinyin: 'bāng', characters: '幫', english: 'to help, to assist', lesson: 'L2', book: 'A', level: '2' },
  { pinyin: 'bǐ jiào', characters: '比較', english: 'comparatively, to compare, relatively', lesson: 'L1', book: 'A', level: '2' },
  { pinyin: 'biàn', characters: '變', english: 'to change', lesson: 'L3', book: 'A', level: '2' },
  { pinyin: 'bīng qí lín', characters: '冰淇淋', english: 'ice cream', lesson: 'L3', book: 'A', level: '2' },
  { pinyin: 'bú cuò', characters: '不錯', english: 'not bad, pretty good', lesson: 'L5', book: 'A', level: '2' },
  { pinyin: 'cǎo', characters: '草', english: 'grass', lesson: 'L3', book: 'A', level: '2' },
  { pinyin: 'chāo jí shì chǎng', characters: '超級市場', english: 'supermarket', lesson: 'L3', book: 'A', level: '2' },
  { pinyin: 'chū qù', characters: '出去', english: 'to go out', lesson: 'L4', book: 'A', level: '2' },
  { pinyin: 'chūn tiān', characters: '春天', english: 'spring', lesson: 'L5', book: 'A', level: '2' },
  { pinyin: 'dà jiā', characters: '大家', english: 'everyone', lesson: 'L4', book: 'A', level: '2' },
  { pinyin: 'dàn chǎo fàn', characters: '蛋炒飯', english: 'egg fried rice', lesson: 'L4', book: 'A', level: '2' },
  { pinyin: 'diàn nǎo gōng sī', characters: '電腦公司', english: 'computer company', lesson: 'L2', book: 'A', level: '2' },
  { pinyin: 'dōng xi', characters: '東西', english: 'thing(s), stuff', lesson: 'L3', book: 'A', level: '2' },
  { pinyin: 'è', characters: '餓', english: 'hungry', lesson: 'L4', book: 'A', level: '2' },
  { pinyin: 'fàng biān pào', characters: '放鞭炮', english: 'to set off firecrackers', lesson: 'L6', book: 'A', level: '2' },
  { pinyin: 'fāng yǒu péng', characters: '方友朋', english: 'Joe Fang', lesson: 'L1', book: 'A', level: '2' },
  { pinyin: 'fù jìn', characters: '附近', english: 'nearby, next to', lesson: 'L3', book: 'A', level: '2' },
  { pinyin: 'gāo xìng', characters: '高興', english: 'happy, glad', lesson: 'L3', book: 'A', level: '2' },
  { pinyin: 'gěi', characters: '給', english: 'to give, to, for', lesson: 'L1', book: 'A', level: '2' },
  { pinyin: 'gēn', characters: '跟', english: 'with', lesson: 'L6', book: 'A', level: '2' },
  { pinyin: 'gōng zuò', characters: '工作', english: 'to work, job, task', lesson: 'L1', book: 'A', level: '2' },
  // Level 2 Book A Page 111 (level_02_book_a_02.jpg)
  { pinyin: 'hái shì', characters: '還是', english: 'still', lesson: 'L5', book: 'A', level: '2' },
  { pinyin: 'hàn bǎo', characters: '漢堡', english: 'hamburger', lesson: 'L4', book: 'A', level: '2' },
  { pinyin: 'hóng bāo', characters: '紅包', english: 'money in a red envelope given as a gift, especially during the Chinese New Year', lesson: 'L6', book: 'A', level: '2' },
  { pinyin: 'hóng sè', characters: '紅色', english: 'red', lesson: 'L5', book: 'A', level: '2' },
  { pinyin: 'huā', characters: '花', english: 'flower(s)', lesson: 'L3', book: 'A', level: '2' },
  { pinyin: 'huá rén', characters: '華人', english: 'Chinese (person, people)', lesson: 'L6', book: 'A', level: '2' },
  { pinyin: 'huān yíng', characters: '歡迎', english: 'welcome, to welcome', lesson: 'L1', book: 'A', level: '2' },
  { pinyin: 'huáng', characters: '黃', english: 'yellow', lesson: 'L3', book: 'A', level: '2' },
  { pinyin: 'huì', characters: '會', english: 'shall, will', lesson: 'L6', book: 'A', level: '2' },
  { pinyin: 'jiè shào', characters: '介紹', english: 'to introduce', lesson: 'L1', book: 'A', level: '2' },
  { pinyin: 'jīn nián', characters: '今年', english: 'this year', lesson: 'L1', book: 'A', level: '2' },
  { pinyin: 'kàn shū', characters: '看書', english: 'to read, to study', lesson: 'L3', book: 'A', level: '2' },
  { pinyin: 'kě yǐ', characters: '可以', english: 'can, may, possible, be able to', lesson: 'L4', book: 'A', level: '2' },
  { pinyin: 'kuài diǎn', characters: '快點', english: 'to do more quickly, earlier, faster', lesson: 'L4', book: 'A', level: '2' },
  { pinyin: 'le', characters: '了', english: 'change', lesson: 'L5', book: 'A', level: '2' },
  { pinyin: 'lǜ sè', characters: '綠色', english: 'green', lesson: 'L5', book: 'A', level: '2' },
  { pinyin: 'mǎi', characters: '買', english: 'to buy', lesson: 'L3', book: 'A', level: '2' },
  { pinyin: 'měi', characters: '每', english: 'every, each', lesson: 'L6', book: 'A', level: '2' },
  { pinyin: 'mǐ', characters: '米', english: 'uncooked rice', lesson: 'L3', book: 'A', level: '2' },
  { pinyin: 'miàn', characters: '麵', english: 'noodles', lesson: 'L4', book: 'A', level: '2' },
  { pinyin: 'míng tiān', characters: '明天', english: 'tomorrow', lesson: 'L6', book: 'A', level: '2' },
  { pinyin: 'nà tiān', characters: '那天', english: 'that day, the other day', lesson: 'L6', book: 'A', level: '2' },
  { pinyin: 'nián gāo', characters: '年糕', english: 'New Year\'s cake made of steamed glutinous rice, sticky cake', lesson: 'L6', book: 'A', level: '2' },
  { pinyin: 'niú ròu', characters: '牛肉', english: 'beef', lesson: 'L3', book: 'A', level: '2' },
  { pinyin: 'piào liang', characters: '漂亮', english: 'pretty, beautiful', lesson: 'L5', book: 'A', level: '2' },
  // Level 2 Book A Page 112 (level_02_book_a_03.jpg)
  { pinyin: 'qiǎo kè lì', characters: '巧克力', english: 'chocolate', lesson: 'L3', book: 'A', level: '2' },
  { pinyin: 'qīng cài', characters: '青菜', english: 'green vegetables', lesson: 'L3', book: 'A', level: '2' },
  { pinyin: 'qiū tiān', characters: '秋天', english: 'autumn, fall', lesson: 'L5', book: 'A', level: '2' },
  { pinyin: 'rèn shì', characters: '認識', english: 'to know, to recognize', lesson: 'L1', book: 'A', level: '2' },
  { pinyin: 'rú guǒ', characters: '如果', english: 'if', lesson: 'L5', book: 'A', level: '2' },
  { pinyin: 'shàng bān', characters: '上班', english: 'to go to work, to start work', lesson: 'L2', book: 'A', level: '2' },
  { pinyin: 'shí hòu', characters: '時候', english: 'time, when', lesson: 'L5', book: 'A', level: '2' },
  { pinyin: 'shū fu', characters: '舒服', english: 'comfortable', lesson: 'L5', book: 'A', level: '2' },
  { pinyin: 'shǔ tiáo', characters: '薯條', english: 'french fries', lesson: 'L4', book: 'A', level: '2' },
  { pinyin: 'shù yè', characters: '樹葉', english: 'leaf, leaves', lesson: 'L6', book: 'A', level: '2' },
  { pinyin: 'shuō', characters: '說', english: 'to speak, to say', lesson: 'L5', book: 'A', level: '2' },
  { pinyin: 'tái wān', characters: '臺灣', english: 'Taiwan', lesson: 'L6', book: 'A', level: '2' },
  { pinyin: 'tāng', characters: '湯', english: 'soup', lesson: 'L4', book: 'A', level: '2' },
  { pinyin: 'táng guǒ', characters: '糖果', english: 'candy', lesson: 'L3', book: 'A', level: '2' },
  { pinyin: 'tiān qì', characters: '天氣', english: 'weather', lesson: 'L5', book: 'A', level: '2' },
  { pinyin: 'tiē chūn lián', characters: '貼春聯', english: 'to stick / paste / put up spring festival couplets', lesson: 'L6', book: 'A', level: '2' },
  { pinyin: 'wài gōng', characters: '外公', english: 'maternal grandfather', lesson: 'L2', book: 'A', level: '2' },
  { pinyin: 'wài pó', characters: '外婆', english: 'maternal grandmother', lesson: 'L2', book: 'A', level: '2' },
  { pinyin: 'wǎn cān / fàn', characters: '晚餐／飯', english: 'dinner, supper', lesson: 'L4', book: 'A', level: '2' },
  { pinyin: 'xià', characters: '下', english: 'next (week, etc.), down, below', lesson: 'L6', book: 'A', level: '2' },
  { pinyin: 'xiān', characters: '先', english: 'first, early', lesson: 'L6', book: 'A', level: '2' },
  { pinyin: 'xiàn zài', characters: '現在', english: 'now', lesson: 'L4', book: 'A', level: '2' },
  { pinyin: 'xīn', characters: '新', english: 'new', lesson: 'L1', book: 'A', level: '2' },
  { pinyin: 'xīn nián', characters: '新年', english: 'new year', lesson: 'L6', book: 'A', level: '2' },
  { pinyin: 'xīng qí', characters: '星期', english: 'week', lesson: 'L6', book: 'A', level: '2' },
  { pinyin: 'xué', characters: '學', english: 'to learn, to study', lesson: 'L1', book: 'A', level: '2' },
  // Level 2 Book A Page 113 (level_02_book_a_04.jpg)
  { pinyin: 'yán sè', characters: '顏色', english: 'color', lesson: 'L5', book: 'A', level: '2' },
  { pinyin: 'yào', characters: '要', english: 'to want', lesson: 'L3', book: 'A', level: '2' },
  { pinyin: 'yǐ hòu', characters: '以後', english: 'in the future', lesson: 'L2', book: 'A', level: '2' },
  { pinyin: 'yǐ jīng', characters: '已經', english: 'already', lesson: 'L4', book: 'A', level: '2' },
  { pinyin: 'yǐ qián', characters: '以前', english: 'before, previously', lesson: 'L2', book: 'A', level: '2' },
  { pinyin: 'yī shēng', characters: '醫生', english: 'doctor', lesson: 'L2', book: 'A', level: '2' },
  { pinyin: 'yí yàng', characters: '一樣', english: 'same, like, the same as, just like', lesson: 'L2', book: 'A', level: '2' },
  { pinyin: 'yín háng', characters: '銀行', english: 'bank', lesson: 'L1', book: 'A', level: '2' },
  { pinyin: 'yóu yǒng', characters: '游泳', english: 'to swim, swimming', lesson: 'L3', book: 'A', level: '2' },
  { pinyin: 'yú', characters: '魚', english: 'fish', lesson: 'L3', book: 'A', level: '2' },
  { pinyin: 'yù mǐ', characters: '玉米', english: 'corn', lesson: 'L4', book: 'A', level: '2' },
  { pinyin: 'yuàn zi', characters: '院子', english: 'yard', lesson: 'L5', book: 'A', level: '2' },
  { pinyin: 'zài', characters: '再', english: 'then', lesson: 'L4', book: 'A', level: '2' },
  { pinyin: 'zhāng lì', characters: '張莉', english: 'Lily Zhang', lesson: 'L1', book: 'A', level: '2' },
  { pinyin: 'zhōng wén', characters: '中文', english: 'Chinese', lesson: 'L1', book: 'A', level: '2' },
  { pinyin: 'zhōu mò', characters: '週末', english: 'weekend', lesson: 'L4', book: 'A', level: '2' },
  { pinyin: 'zì jǐ', characters: '自己', english: 'oneself, one\'s own', lesson: 'L1', book: 'A', level: '2' },
  { pinyin: 'zuì', characters: '最', english: 'the most', lesson: 'L1', book: 'A', level: '2' },
  { pinyin: 'zuò shēng yì', characters: '做生意', english: 'to do business', lesson: 'L2', book: 'A', level: '2' },
  // Level 2 Book A Test 01 Page 1 (level_02_book_a_test_01_01.jpg)
  { pinyin: 'lǎo shī', characters: '老師', english: 'teacher', lesson: 'Test1', book: 'A', level: '2' },
  { pinyin: 'yī shēng', characters: '醫生', english: 'doctor', lesson: 'Test1', book: 'A', level: '2' },
  { pinyin: 'yín háng', characters: '銀行', english: 'bank', lesson: 'Test1', book: 'A', level: '2' },
  { pinyin: 'diàn nǎo', characters: '電腦', english: 'computer', lesson: 'Test1', book: 'A', level: '2' },
  { pinyin: 'gōng sī', characters: '公司', english: 'company', lesson: 'Test1', book: 'A', level: '2' },
  { pinyin: 'yí yàng', characters: '一樣', english: 'the same', lesson: 'Test1', book: 'A', level: '2' },
  { pinyin: 'wài gōng', characters: '外公', english: 'maternal grandpa', lesson: 'Test1', book: 'A', level: '2' },
  { pinyin: 'yé ye', characters: '爺爺', english: 'paternal grandpa', lesson: 'Test1', book: 'A', level: '2' },
  { pinyin: 'yǐ hòu', characters: '以後', english: 'in the future', lesson: 'Test1', book: 'A', level: '2' },
  { pinyin: 'yǐ qián', characters: '以前', english: 'previously', lesson: 'Test1', book: 'A', level: '2' },
  { pinyin: 'bà ba', characters: '爸爸', english: 'dad', lesson: 'Test1', book: 'A', level: '2' },
  { pinyin: 'mā ma', characters: '媽媽', english: 'mom', lesson: 'Test1', book: 'A', level: '2' },
  { pinyin: 'xīn', characters: '新', english: 'new', lesson: 'Test1', book: 'A', level: '2' },
  { pinyin: 'dà jiā hǎo', characters: '大家好', english: 'hello everyone', lesson: 'Test1', book: 'A', level: '2' },
  { pinyin: 'zì jǐ', characters: '自己', english: 'oneself', lesson: 'Test1', book: 'A', level: '2' },
  // Level 2 Book A Test 01 Page 2 (level_02_book_a_test_01_02.jpg)
  { pinyin: 'zhōng wén', characters: '中文', english: 'Chinese', lesson: 'Test1', book: 'A', level: '2' },
  { pinyin: 'bǐ jiào', characters: '比較', english: 'compare', lesson: 'Test1', book: 'A', level: '2' },
  { pinyin: 'nǐ hǎo', characters: '你好', english: 'how are you', lesson: 'Test1', book: 'A', level: '2' },
  { pinyin: 'sì shí wǔ', characters: '四十五', english: 'forty-five', lesson: 'Test1', book: 'A', level: '2' },
  { pinyin: 'sān shí bā', characters: '三十八', english: 'thirty-eight', lesson: 'Test1', book: 'A', level: '2' },
  { pinyin: 'liù shí jiǔ', characters: '六十九', english: 'sixty-nine', lesson: 'Test1', book: 'A', level: '2' },
  { pinyin: 'jīn tiān', characters: '今天', english: 'today', lesson: 'Test1', book: 'A', level: '2' },
  { pinyin: 'xǐ huān', characters: '喜歡', english: 'like', lesson: 'Test1', book: 'A', level: '2' },
  { pinyin: 'yī qǐ', characters: '一起', english: 'together', lesson: 'Test1', book: 'A', level: '2' },
  { pinyin: 'dà xiǎo', characters: '大小', english: 'size', lesson: 'Test1', book: 'A', level: '2' },
  { pinyin: 'pǎo bù', characters: '跑步', english: 'run', lesson: 'Test1', book: 'A', level: '2' },
  { pinyin: 'tīng yīn yuè', characters: '聽音樂', english: 'listen to music', lesson: 'Test1', book: 'A', level: '2' },
  { pinyin: 'shú shu', characters: '叔叔', english: 'uncle', lesson: 'Test1', book: 'A', level: '2' },
  { pinyin: 'gū gu', characters: '姑姑', english: 'aunt', lesson: 'Test1', book: 'A', level: '2' },
  { pinyin: 'nǎi nai', characters: '奶奶', english: 'paternal grandma', lesson: 'Test1', book: 'A', level: '2' },
  { pinyin: 'wài pó', characters: '外婆', english: 'maternal grandma', lesson: 'Test1', book: 'A', level: '2' },
  // Level 2 Book A Test 01 Page 3 (level_02_book_a_test_01_03.jpg)
  { pinyin: 'zài jiàn', characters: '再見', english: 'good bye', lesson: 'Test1', book: 'A', level: '2' },
  { pinyin: 'xiè xie', characters: '謝謝', english: 'thank you', lesson: 'Test1', book: 'A', level: '2' },
  { pinyin: 'tóng xué', characters: '同學', english: 'classmate', lesson: 'Test1', book: 'A', level: '2' },
  { pinyin: 'shàng bān', characters: '上班', english: 'work', lesson: 'Test1', book: 'A', level: '2' },
  { pinyin: 'wǒ men', characters: '我們', english: 'we', lesson: 'Test1', book: 'A', level: '2' },
  { pinyin: 'yǎn jīng', characters: '眼睛', english: 'eye', lesson: 'Test1', book: 'A', level: '2' },
  { pinyin: 'dǎ qiú', characters: '打球', english: 'play ball', lesson: 'Test1', book: 'A', level: '2' },
  { pinyin: 'tiào wǔ', characters: '跳舞', english: 'dance', lesson: 'Test1', book: 'A', level: '2' },
  { pinyin: 'xià kè', characters: '下課', english: 'class dismisses', lesson: 'Test1', book: 'A', level: '2' },
  { pinyin: 'chàng gē', characters: '唱歌', english: 'sing', lesson: 'Test1', book: 'A', level: '2' },
  { pinyin: 'gē ge', characters: '哥哥', english: 'big brother', lesson: 'Test1', book: 'A', level: '2' },
  { pinyin: 'jiě jie', characters: '姊姊', english: 'big sister', lesson: 'Test1', book: 'A', level: '2' },
  { pinyin: 'mèi mei', characters: '妹妹', english: 'little sister', lesson: 'Test1', book: 'A', level: '2' },
  { pinyin: 'dì di', characters: '弟弟', english: 'little brother', lesson: 'Test1', book: 'A', level: '2' },
  // Level K2 Book A Page 91 (level_k2_book_a_01.jpg)
  { pinyin: 'bā', characters: '八', english: 'eight', lesson: 'L3', book: 'A', level: 'K2' },
  { pinyin: 'bà ba', characters: '爸爸', english: 'dad', lesson: 'L2', book: 'A', level: 'K2' },
  { pinyin: 'bā yuè', characters: '八月', english: 'August', lesson: 'L6', book: 'A', level: 'K2' },
  { pinyin: 'bān', characters: '班', english: 'class', lesson: 'L3', book: 'A', level: 'K2' },
  { pinyin: 'bù', characters: '不', english: 'no', lesson: 'L5', book: 'A', level: 'K2' },
  { pinyin: 'chén xīn měi', characters: '陳心美', english: 'May Chen', lesson: 'L1', book: 'A', level: 'K2' },
  { pinyin: 'chī', characters: '吃', english: 'to eat', lesson: 'L4', book: 'A', level: 'K2' },
  { pinyin: 'chūn tiān', characters: '春天', english: 'spring', lesson: 'L5', book: 'A', level: 'K2' },
  { pinyin: 'dàn', characters: '蛋', english: 'egg', lesson: 'L4', book: 'A', level: 'K2' },
  { pinyin: 'de', characters: '的', english: "'s (possessive particle)", lesson: 'L6', book: 'A', level: 'K2' },
  { pinyin: 'dì di', characters: '弟弟', english: 'younger brother', lesson: 'L2', book: 'A', level: 'K2' },
  { pinyin: 'dōng tiān', characters: '冬天', english: 'winter', lesson: 'L5', book: 'A', level: 'K2' },
  { pinyin: 'èr', characters: '二', english: 'two', lesson: 'L2', book: 'A', level: 'K2' },
  { pinyin: 'èr shí', characters: '二十', english: 'twenty', lesson: 'L6', book: 'A', level: 'K2' },
  { pinyin: 'èr yuè', characters: '二月', english: 'February', lesson: 'L6', book: 'A', level: 'K2' },
  { pinyin: 'gè', characters: '個', english: '(measure word)', lesson: 'L2', book: 'A', level: 'K2' },
  { pinyin: 'gē ge', characters: '哥哥', english: 'older brother', lesson: 'L2', book: 'A', level: 'K2' },
  { pinyin: 'hàn', characters: '和', english: 'with, and', lesson: 'L2', book: 'A', level: 'K2' },
  { pinyin: 'hàn bǎo', characters: '漢堡', english: 'hamburger', lesson: 'L4', book: 'A', level: 'K2' },
  { pinyin: 'hào', characters: '號', english: 'day of the month, ordinal number', lesson: 'L6', book: 'A', level: 'K2' },
  { pinyin: 'hē', characters: '喝', english: 'to drink', lesson: 'L4', book: 'A', level: 'K2' },
  { pinyin: 'hěn', characters: '很', english: 'very', lesson: 'L5', book: 'A', level: 'K2' },
  // Level K2 Book A Page 92 (level_k2_book_a_02.jpg)
  { pinyin: 'jǐ', characters: '幾', english: 'how much, how many, several, a few', lesson: 'L2', book: 'A', level: 'K2' },
  { pinyin: 'jiā', characters: '家', english: 'family, home', lesson: 'L2', book: 'A', level: 'K2' },
  { pinyin: 'jiào', characters: '叫', english: 'to be called (by the name of), to call', lesson: 'L1', book: 'A', level: 'K2' },
  { pinyin: 'jiě jie', characters: '姊姊', english: 'older sister', lesson: 'L2', book: 'A', level: 'K2' },
  { pinyin: 'jīn tiān', characters: '今天', english: 'today', lesson: 'L4', book: 'A', level: 'K2' },
  { pinyin: 'jiǔ', characters: '九', english: 'nine', lesson: 'L3', book: 'A', level: 'K2' },
  { pinyin: 'jiǔ yuè', characters: '九月', english: 'September', lesson: 'L6', book: 'A', level: 'K2' },
  { pinyin: 'lǎo shī', characters: '老師', english: 'teacher', lesson: 'L3', book: 'A', level: 'K2' },
  { pinyin: 'lěng', characters: '冷', english: 'cold', lesson: 'L5', book: 'A', level: 'K2' },
  { pinyin: 'lǐ dà wén', characters: '李大文', english: 'Devin Li', lesson: 'L1', book: 'A', level: 'K2' },
  { pinyin: 'liǎng', characters: '兩', english: 'two', lesson: 'L3', book: 'A', level: 'K2' },
  { pinyin: 'lín dōng míng', characters: '林東明', english: 'Tony Lin', lesson: 'L1', book: 'A', level: 'K2' },
  { pinyin: 'liù', characters: '六', english: 'six', lesson: 'L3', book: 'A', level: 'K2' },
  { pinyin: 'liù yuè', characters: '六月', english: 'June', lesson: 'L6', book: 'A', level: 'K2' },
  { pinyin: 'ma', characters: '嗎', english: 'question particle for "yes-no" questions', lesson: 'L5', book: 'A', level: 'K2' },
  { pinyin: 'mā ma', characters: '媽媽', english: 'mom', lesson: 'L2', book: 'A', level: 'K2' },
  { pinyin: 'mèi mei', characters: '妹妹', english: 'younger sister', lesson: 'L2', book: 'A', level: 'K2' },
  { pinyin: 'miàn bāo', characters: '麵包', english: 'bread', lesson: 'L4', book: 'A', level: 'K2' },
  { pinyin: 'míng tiān', characters: '明天', english: 'tomorrow', lesson: 'L4', book: 'A', level: 'K2' },
  { pinyin: 'míng zi', characters: '名字', english: 'name', lesson: 'L1', book: 'A', level: 'K2' },
  { pinyin: 'nán shēng', characters: '男生', english: 'boy', lesson: 'L3', book: 'A', level: 'K2' },
  { pinyin: 'nǐ', characters: '你', english: 'you', lesson: 'L1', book: 'A', level: 'K2' },
  // Level K2 Book A Page 93 (level_k2_book_a_03.jpg)
  { pinyin: 'nǐ hǎo', characters: '你好', english: 'hello', lesson: 'L1', book: 'A', level: 'K2' },
  { pinyin: 'nǐ men', characters: '你們', english: 'you (plural)', lesson: 'L3', book: 'A', level: 'K2' },
  { pinyin: 'niú nǎi', characters: '牛奶', english: 'milk', lesson: 'L4', book: 'A', level: 'K2' },
  { pinyin: 'nǚ shēng', characters: '女生', english: 'girl', lesson: 'L3', book: 'A', level: 'K2' },
  { pinyin: 'pī sà', characters: '披薩', english: 'pizza', lesson: 'L4', book: 'A', level: 'K2' },
  { pinyin: 'píng guǒ', characters: '蘋果', english: 'apple', lesson: 'L4', book: 'A', level: 'K2' },
  { pinyin: 'qī', characters: '七', english: 'seven', lesson: 'L3', book: 'A', level: 'K2' },
  { pinyin: 'qī yuè', characters: '七月', english: 'July', lesson: 'L6', book: 'A', level: 'K2' },
  { pinyin: 'qiū tiān', characters: '秋天', english: 'autumn, fall', lesson: 'L5', book: 'A', level: 'K2' },
  { pinyin: 'rè', characters: '熱', english: 'hot', lesson: 'L5', book: 'A', level: 'K2' },
  { pinyin: 'rén', characters: '人', english: 'people, person', lesson: 'L2', book: 'A', level: 'K2' },
  { pinyin: 'sān', characters: '三', english: 'three', lesson: 'L2', book: 'A', level: 'K2' },
  { pinyin: 'sān shí', characters: '三十', english: 'thirty', lesson: 'L6', book: 'A', level: 'K2' },
  { pinyin: 'sān yuè', characters: '三月', english: 'March', lesson: 'L6', book: 'A', level: 'K2' },
  { pinyin: 'shén me', characters: '什麼', english: 'what', lesson: 'L1', book: 'A', level: 'K2' },
  { pinyin: 'shēng rì', characters: '生日', english: 'birthday', lesson: 'L6', book: 'A', level: 'K2' },
  { pinyin: 'shí', characters: '十', english: 'ten', lesson: 'L3', book: 'A', level: 'K2' },
  { pinyin: 'shì', characters: '是', english: 'to be (am, are, is)', lesson: 'L6', book: 'A', level: 'K2' },
  { pinyin: 'shí bā', characters: '十八', english: 'eighteen', lesson: 'L6', book: 'A', level: 'K2' },
  { pinyin: 'shí èr', characters: '十二', english: 'twelve', lesson: 'L6', book: 'A', level: 'K2' },
  { pinyin: 'shí èr yuè', characters: '十二月', english: 'December', lesson: 'L6', book: 'A', level: 'K2' },
  { pinyin: 'shí jiǔ', characters: '十九', english: 'nineteen', lesson: 'L6', book: 'A', level: 'K2' },
  { pinyin: 'shí liù', characters: '十六', english: 'sixteen', lesson: 'L6', book: 'A', level: 'K2' },
  { pinyin: 'shí qī', characters: '十七', english: 'seventeen', lesson: 'L6', book: 'A', level: 'K2' },
  // Level K2 Book A Page 94 (level_k2_book_a_04.jpg)
  { pinyin: 'shí sān', characters: '十三', english: 'thirteen', lesson: 'L6', book: 'A', level: 'K2' },
  { pinyin: 'shí sì', characters: '十四', english: 'fourteen', lesson: 'L6', book: 'A', level: 'K2' },
  { pinyin: 'shí wǔ', characters: '十五', english: 'fifteen', lesson: 'L6', book: 'A', level: 'K2' },
  { pinyin: 'shí yī', characters: '十一', english: 'eleven', lesson: 'L6', book: 'A', level: 'K2' },
  { pinyin: 'shí yī yuè', characters: '十一月', english: 'November', lesson: 'L6', book: 'A', level: 'K2' },
  { pinyin: 'shí yuè', characters: '十月', english: 'October', lesson: 'L6', book: 'A', level: 'K2' },
  { pinyin: 'shuǐ guǒ', characters: '水果', english: 'fruit', lesson: 'L4', book: 'A', level: 'K2' },
  { pinyin: 'sì', characters: '四', english: 'four', lesson: 'L2', book: 'A', level: 'K2' },
  { pinyin: 'sì yuè', characters: '四月', english: 'April', lesson: 'L6', book: 'A', level: 'K2' },
  { pinyin: 'tā', characters: '他', english: 'he, him', lesson: 'L1', book: 'A', level: 'K2' },
  { pinyin: 'tā', characters: '她', english: 'she, her', lesson: 'L1', book: 'A', level: 'K2' },
  { pinyin: 'tóng xué', characters: '同學', english: 'classmate', lesson: 'L3', book: 'A', level: 'K2' },
  { pinyin: 'wǎn fàn', characters: '晚飯', english: 'dinner', lesson: 'L4', book: 'A', level: 'K2' },
  { pinyin: 'wǒ', characters: '我', english: 'I, me', lesson: 'L1', book: 'A', level: 'K2' },
  { pinyin: 'wǒ men', characters: '我們', english: 'we', lesson: 'L3', book: 'A', level: 'K2' },
  { pinyin: 'wǔ', characters: '五', english: 'five', lesson: 'L2', book: 'A', level: 'K2' },
  { pinyin: 'wǔ fàn', characters: '午飯', english: 'lunch', lesson: 'L4', book: 'A', level: 'K2' },
  { pinyin: 'wǔ yuè', characters: '五月', english: 'May', lesson: 'L6', book: 'A', level: 'K2' },
  { pinyin: 'xǐ huān', characters: '喜歡', english: 'to like', lesson: 'L5', book: 'A', level: 'K2' },
  { pinyin: 'xià tiān', characters: '夏天', english: 'summer', lesson: 'L5', book: 'A', level: 'K2' },
  { pinyin: 'xiāng jiāo', characters: '香蕉', english: 'banana', lesson: 'L4', book: 'A', level: 'K2' },
  { pinyin: 'xiǎo péng yǒu', characters: '小朋友', english: 'kids, children', lesson: 'L3', book: 'A', level: 'K2' },
  // Level K2 Book A Page 95 (level_k2_book_a_05.jpg)
  { pinyin: 'yī', characters: '一', english: 'one', lesson: 'L2', book: 'A', level: 'K2' },
  { pinyin: 'yī yuè', characters: '一月', english: 'January', lesson: 'L6', book: 'A', level: 'K2' },
  { pinyin: 'yǒu', characters: '有', english: 'there is / are', lesson: 'L2', book: 'A', level: 'K2' },
  { pinyin: 'yuè', characters: '月', english: 'month', lesson: 'L6', book: 'A', level: 'K2' },
  { pinyin: 'zǎo fàn', characters: '早飯', english: 'breakfast', lesson: 'L4', book: 'A', level: 'K2' },
  { pinyin: 'zuó tiān', characters: '昨天', english: 'yesterday', lesson: 'L6', book: 'A', level: 'K2' },
  // Level 1 Book B - Page 104 (level_01_book_b_01.jpg)
  { pinyin: 'ā yí', characters: '阿姨', english: 'aunt', lesson: 'L12', book: 'B', level: '1' },
  { pinyin: 'bā', characters: '八', english: 'eight', lesson: 'L3', book: 'B', level: '1' },
  { pinyin: 'ba', characters: '吧', english: 'sentence-final particle for suggestions', lesson: 'L7', book: 'B', level: '1' },
  { pinyin: 'bà ba', characters: '爸爸', english: 'dad', lesson: 'L3', book: 'B', level: '1' },
  { pinyin: 'bān', characters: '班', english: 'class', lesson: 'L3', book: 'B', level: '1' },
  { pinyin: 'bí zi', characters: '鼻子', english: 'nose', lesson: 'L7', book: 'B', level: '1' },
  { pinyin: 'cháng cháng', characters: '常常', english: 'often', lesson: 'L8', book: 'B', level: '1' },
  { pinyin: 'chàng gē', characters: '唱歌', english: 'to sing a song', lesson: 'L8', book: 'B', level: '1' },
  { pinyin: 'chén xīn měi', characters: '陳心美', english: 'May Chen', lesson: 'L1', book: 'B', level: '1' },
  { pinyin: 'chī', characters: '吃', english: 'to eat', lesson: 'L4', book: 'B', level: '1' },
  { pinyin: 'dà', characters: '大', english: 'big, large', lesson: 'L2', book: 'B', level: '1' },
  { pinyin: 'dǎ', characters: '打', english: 'to call, to beat, to strike', lesson: 'L12', book: 'B', level: '1' },
  { pinyin: 'dǎ qiú', characters: '打球', english: 'to play ball', lesson: 'L8', book: 'B', level: '1' },
  { pinyin: 'dàn gāo', characters: '蛋糕', english: 'cake', lesson: 'L6', book: 'B', level: '1' },
  { pinyin: 'dào', characters: '到', english: 'to (a place), until (a time)', lesson: 'L6', book: 'B', level: '1' },
  { pinyin: 'de', characters: '的', english: "'s (possessive particle)", lesson: 'L6', book: 'B', level: '1' },
  { pinyin: 'dì di', characters: '弟弟', english: 'younger brother', lesson: 'L2', book: 'B', level: '1' },
  { pinyin: 'dōng tiān', characters: '冬天', english: 'winter', lesson: 'L5', book: 'B', level: '1' },
  { pinyin: 'dōu', characters: '都', english: 'all, both, neither, none', lesson: 'L9', book: 'B', level: '1' },
  { pinyin: 'duì', characters: '對', english: 'right?, correct?', lesson: 'L10', book: 'B', level: '1' },
  { pinyin: 'èr shí bā', characters: '二十八', english: 'twenty-eight', lesson: 'L6', book: 'B', level: '1' },
  { pinyin: 'fáng jiān', characters: '房間', english: 'room', lesson: 'L9', book: 'B', level: '1' },
  // Level 1 Book B - Page 105 (level_01_book_b_02.jpg)
  { pinyin: 'gè', characters: '個', english: 'a measure word', lesson: 'L2', book: 'B', level: '1' },
  { pinyin: 'gē ge', characters: '哥哥', english: 'older brother', lesson: 'L2', book: 'B', level: '1' },
  { pinyin: 'gū gu', characters: '姑姑', english: "aunt, father's sister", lesson: 'L10', book: 'B', level: '1' },
  { pinyin: 'guǒ zhī', characters: '果汁', english: 'juice', lesson: 'L4', book: 'B', level: '1' },
  { pinyin: 'hái yào', characters: '還要', english: 'also want', lesson: 'L4', book: 'B', level: '1' },
  { pinyin: 'hái yǒu', characters: '還有', english: 'also have, in addition', lesson: 'L4', book: 'B', level: '1' },
  { pinyin: 'hǎo', characters: '好', english: 'good, fine', lesson: 'L5', book: 'B', level: '1' },
  { pinyin: 'hào', characters: '號', english: 'day of the month', lesson: 'L6', book: 'B', level: '1' },
  { pinyin: 'hàn', characters: '和', english: 'with, and', lesson: 'L6', book: 'B', level: '1' },
  { pinyin: 'hē', characters: '喝', english: 'to drink', lesson: 'L4', book: 'B', level: '1' },
  { pinyin: 'hěn', characters: '很', english: 'very', lesson: 'L5', book: 'B', level: '1' },
  { pinyin: 'hòu miàn', characters: '後面', english: 'behind', lesson: 'L9', book: 'B', level: '1' },
  { pinyin: 'huà tú', characters: '畫圖', english: 'to draw a picture', lesson: 'L7', book: 'B', level: '1' },
  { pinyin: 'huì', characters: '會', english: 'can, to be able to', lesson: 'L6', book: 'B', level: '1' },
  { pinyin: 'jǐ', characters: '幾', english: 'how many', lesson: 'L2', book: 'B', level: '1' },
  { pinyin: 'jiā', characters: '家', english: 'family, home', lesson: 'L2', book: 'B', level: '1' },
  { pinyin: 'jiào', characters: '叫', english: 'to be called (by the name of), to call', lesson: 'L1', book: 'B', level: '1' },
  { pinyin: 'jiě jie', characters: '姊姊', english: 'old sister', lesson: 'L2', book: 'B', level: '1' },
  { pinyin: 'jìn', characters: '近', english: 'close, near', lesson: 'L1', book: 'B', level: '1' },
  { pinyin: 'jīn tiān', characters: '今天', english: 'today', lesson: 'L4', book: 'B', level: '1' },
  { pinyin: 'jiǔ', characters: '九', english: 'nine', lesson: 'L3', book: 'B', level: '1' },
  { pinyin: 'jué de', characters: '覺得', english: 'to think, to feel', lesson: 'L5', book: 'B', level: '1' },
  { pinyin: 'kāi chē', characters: '開車', english: 'to drive', lesson: 'L11', book: 'B', level: '1' },
  { pinyin: 'kàn', characters: '看', english: 'to look', lesson: 'L7', book: 'B', level: '1' },
  { pinyin: 'kàn diàn shì', characters: '看電視', english: 'to watch television', lesson: 'L8', book: 'B', level: '1' },
  { pinyin: 'kě shì', characters: '可是', english: 'but, however', lesson: 'L5', book: 'B', level: '1' },
  { pinyin: 'kuài', characters: '快', english: 'nearly', lesson: 'L6', book: 'B', level: '1' },
  // Level 1 Book B - Page 106 (level_01_book_b_03.jpg)
  { pinyin: 'lái', characters: '來', english: 'to come', lesson: 'L4', book: 'B', level: '1' },
  { pinyin: 'lǎo shī', characters: '老師', english: 'teacher', lesson: 'L2', book: 'B', level: '1' },
  { pinyin: 'lěng', characters: '冷', english: 'cold', lesson: 'L5', book: 'B', level: '1' },
  { pinyin: 'lǐ dà wén', characters: '李大文', english: 'Devin Li', lesson: 'L1', book: 'B', level: '1' },
  { pinyin: 'lǐ miàn', characters: '裡面', english: 'inside', lesson: 'L9', book: 'B', level: '1' },
  { pinyin: 'lǐ wù', characters: '禮物', english: 'gift', lesson: 'L6', book: 'B', level: '1' },
  { pinyin: 'liǎng', characters: '兩', english: 'two', lesson: 'L3', book: 'B', level: '1' },
  { pinyin: 'lín dōng míng', characters: '林東明', english: 'Tony Lin', lesson: 'L1', book: 'B', level: '1' },
  { pinyin: 'liù', characters: '六', english: 'six', lesson: 'L3', book: 'B', level: '1' },
  { pinyin: 'ma', characters: '嗎', english: 'question particle for yes-no questions', lesson: 'L7', book: 'B', level: '1' },
  { pinyin: 'mā ma', characters: '媽媽', english: 'mom', lesson: 'L2', book: 'B', level: '1' },
  { pinyin: 'mān huà', characters: '漫畫', english: 'comic', lesson: 'L4', book: 'B', level: '1' },
  { pinyin: 'mèi mei', characters: '妹妹', english: 'younger sister', lesson: 'L2', book: 'B', level: '1' },
  { pinyin: 'méi yǒu', characters: '沒有', english: "to not have, there isn't / aren't, no", lesson: 'L9', book: 'B', level: '1' },
  { pinyin: 'miàn bāo', characters: '麵包', english: 'bread', lesson: 'L4', book: 'B', level: '1' },
  { pinyin: 'míng zi', characters: '名字', english: 'name', lesson: 'L1', book: 'B', level: '1' },
  { pinyin: 'nǎ lǐ', characters: '哪裡', english: 'where', lesson: 'L9', book: 'B', level: '1' },
  { pinyin: 'nà shí hòu', characters: '那時候', english: 'at that time', lesson: 'L10', book: 'B', level: '1' },
  { pinyin: 'nǎi nai', characters: '奶奶', english: 'grandma, grandmother', lesson: 'L10', book: 'B', level: '1' },
  { pinyin: 'nán shēng', characters: '男生', english: 'boy', lesson: 'L3', book: 'B', level: '1' },
  { pinyin: 'ne', characters: '呢', english: 'question particle', lesson: 'L2', book: 'B', level: '1' },
  { pinyin: 'nǐ hǎo', characters: '你好', english: 'hello', lesson: 'L1', book: 'B', level: '1' },
  { pinyin: 'nǐ men', characters: '你們', english: 'you (plural)', lesson: 'L3', book: 'B', level: '1' },
  { pinyin: 'nín', characters: '您', english: 'you (polite)', lesson: 'L12', book: 'B', level: '1' },
  { pinyin: 'niú nǎi', characters: '牛奶', english: 'milk', lesson: 'L4', book: 'B', level: '1' },
  { pinyin: 'nǚ shēng', characters: '女生', english: 'girl', lesson: 'L3', book: 'B', level: '1' },
  { pinyin: 'pǎo bù', characters: '跑步', english: 'to run, to jog', lesson: 'L8', book: 'B', level: '1' },
  { pinyin: 'péng yǒu', characters: '朋友', english: 'friend(s)', lesson: 'L3', book: 'B', level: '1' },
  { pinyin: 'píng cháng', characters: '平常', english: 'usually', lesson: 'L11', book: 'B', level: '1' },
  { pinyin: 'píng guǒ', characters: '蘋果', english: 'apple', lesson: 'L4', book: 'B', level: '1' },
  // Level 1 Book B - Page 107 (level_01_book_b_04.jpg)
  { pinyin: 'qī', characters: '七', english: 'seven', lesson: 'L3', book: 'B', level: '1' },
  { pinyin: 'qí', characters: '騎', english: 'to ride', lesson: 'L2', book: 'B', level: '1' },
  { pinyin: 'qǐng wèn', characters: '請問', english: 'Excuse me, May I ask you a question?', lesson: 'L12', book: 'B', level: '1' },
  { pinyin: 'qù', characters: '去', english: 'to go, to go to (a place)', lesson: 'L9', book: 'B', level: '1' },
  { pinyin: 'rè', characters: '熱', english: 'hot', lesson: 'L5', book: 'B', level: '1' },
  { pinyin: 'rén', characters: '人', english: 'people, person', lesson: 'L2', book: 'B', level: '1' },
  { pinyin: 'sān', characters: '三', english: 'three', lesson: 'L2', book: 'B', level: '1' },
  { pinyin: 'sān shí', characters: '三十', english: 'thirty', lesson: 'L6', book: 'B', level: '1' },
  { pinyin: 'shā fā', characters: '沙發', english: 'couch, sofa', lesson: 'L6', book: 'B', level: '1' },
  { pinyin: 'shàng miàn', characters: '上面', english: 'on', lesson: 'L9', book: 'B', level: '1' },
  { pinyin: 'shéi', characters: '誰', english: 'who (also plural)', lesson: 'L10', book: 'B', level: '1' },
  { pinyin: 'shén me', characters: '什麼', english: 'what', lesson: 'L1', book: 'B', level: '1' },
  { pinyin: 'shēn tǐ', characters: '身體', english: 'body', lesson: 'L7', book: 'B', level: '1' },
  { pinyin: 'shēng rì', characters: '生日', english: 'birthday', lesson: 'L6', book: 'B', level: '1' },
  { pinyin: 'shí', characters: '十', english: 'ten', lesson: 'L3', book: 'B', level: '1' },
  { pinyin: 'shì', characters: '是', english: 'to be (am, are, is)', lesson: 'L1', book: 'B', level: '1' },
  { pinyin: 'shí yī', characters: '十一', english: 'eleven', lesson: 'L6', book: 'B', level: '1' },
  { pinyin: 'shǒu', characters: '手', english: 'hand(s)', lesson: 'L7', book: 'B', level: '1' },
  { pinyin: 'shǒu jī', characters: '手機', english: 'cell phone, mobile phone', lesson: 'L12', book: 'B', level: '1' },
  { pinyin: 'shū', characters: '書', english: 'book', lesson: 'L6', book: 'B', level: '1' },
  { pinyin: 'shū shu', characters: '叔叔', english: "uncle, father's younger brother", lesson: 'L10', book: 'B', level: '1' },
  { pinyin: 'shuǐ guǒ', characters: '水果', english: 'fruit', lesson: 'L4', book: 'B', level: '1' },
  { pinyin: 'sì', characters: '四', english: 'four', lesson: 'L2', book: 'B', level: '1' },
  { pinyin: 'sòng', characters: '送', english: 'to send, to deliver', lesson: 'L11', book: 'B', level: '1' },
  { pinyin: 'suì', characters: '歲', english: 'years old (classifier of age in years)', lesson: 'L10', book: 'B', level: '1' },
  { pinyin: 'tā', characters: '他', english: 'he, him', lesson: 'L1', book: 'B', level: '1' },
  { pinyin: 'tā', characters: '她', english: 'she, her', lesson: 'L1', book: 'B', level: '1' },
  { pinyin: 'tā men', characters: '他們', english: 'they', lesson: 'L5', book: 'B', level: '1' },
  { pinyin: 'tài ... le', characters: '太⋯⋯了', english: 'too...', lesson: 'L5', book: 'B', level: '1' },
  // Level 1 Book B - Page 108 (level_01_book_b_05.jpg)
  { pinyin: 'tài tai', characters: '太太', english: 'Mrs., wife, woman', lesson: 'L12', book: 'B', level: '1' },
  { pinyin: 'tiào wǔ', characters: '跳舞', english: 'to dance', lesson: 'L8', book: 'B', level: '1' },
  { pinyin: 'tīng yīn yuè', characters: '聽音樂', english: 'to listen to music', lesson: 'L8', book: 'B', level: '1' },
  { pinyin: 'tóng xué', characters: '同學', english: 'classmate', lesson: 'L3', book: 'B', level: '1' },
  { pinyin: 'tóu', characters: '頭', english: 'head', lesson: 'L7', book: 'B', level: '1' },
  { pinyin: 'wǎn fàn', characters: '晚飯', english: 'dinner', lesson: 'L4', book: 'B', level: '1' },
  { pinyin: 'wán jù', characters: '玩具', english: 'toy', lesson: 'L6', book: 'B', level: '1' },
  { pinyin: 'wáng', characters: '王', english: 'Wang (a surname)', lesson: 'L2', book: 'B', level: '1' },
  { pinyin: 'wéi', characters: '喂', english: 'hello (when answering the phone)', lesson: 'L12', book: 'B', level: '1' },
  { pinyin: 'wǒ', characters: '我', english: 'I, me', lesson: 'L1', book: 'B', level: '1' },
  { pinyin: 'wǒ men', characters: '我們', english: 'we, us', lesson: 'L3', book: 'B', level: '1' },
  { pinyin: 'wǔ', characters: '五', english: 'five', lesson: 'L2', book: 'B', level: '1' },
  { pinyin: 'wǔ fàn', characters: '午飯', english: 'lunch', lesson: 'L4', book: 'B', level: '1' },
  { pinyin: 'xià kè', characters: '下課', english: 'to finish class, to get out of class', lesson: 'L8', book: 'B', level: '1' },
  { pinyin: 'xià miàn', characters: '下面', english: 'under, below', lesson: 'L9', book: 'B', level: '1' },
  { pinyin: 'xià tiān', characters: '夏天', english: 'summer', lesson: 'L5', book: 'B', level: '1' },
  { pinyin: 'xiǎng', characters: '想', english: 'to want, to think', lesson: 'L11', book: 'B', level: '1' },
  { pinyin: 'xiāng jiāo', characters: '香蕉', english: 'banana', lesson: 'L4', book: 'B', level: '1' },
  { pinyin: 'xiǎo', characters: '小', english: 'small', lesson: 'L7', book: 'B', level: '1' },
  { pinyin: 'xiào chē', characters: '校車', english: 'school bus', lesson: 'L11', book: 'B', level: '1' },
  { pinyin: 'xiǎo hái', characters: '小孩', english: 'child', lesson: 'L10', book: 'B', level: '1' },
  { pinyin: 'xiè xie', characters: '謝謝', english: 'thank you', lesson: 'L12', book: 'B', level: '1' },
  { pinyin: 'xǐ huān', characters: '喜歡', english: 'to like', lesson: 'L5', book: 'B', level: '1' },
  { pinyin: 'xìng', characters: '姓', english: 'family name, surname', lesson: 'L1', book: 'B', level: '1' },
  { pinyin: 'xuě rén', characters: '雪人', english: 'snowman', lesson: 'L7', book: 'B', level: '1' },
  { pinyin: 'xué xiào', characters: '學校', english: 'school', lesson: 'L11', book: 'B', level: '1' },
  { pinyin: 'yǎn jīng', characters: '眼睛', english: 'eye(s)', lesson: 'L7', book: 'B', level: '1' },
  { pinyin: 'yě', characters: '也', english: 'also', lesson: 'L3', book: 'B', level: '1' },
  { pinyin: 'yé ye', characters: '爺爺', english: 'grandpa, grandfather', lesson: 'L10', book: 'B', level: '1' },
  { pinyin: 'yǐ hòu', characters: '以後', english: 'after, afterwards', lesson: 'L8', book: 'B', level: '1' },
  // Level 1 Book B - Page 109 (level_01_book_b_06.jpg)
  { pinyin: 'yì qǐ', characters: '一起', english: 'together', lesson: 'L7', book: 'B', level: '1' },
  { pinyin: 'yí xià', characters: '一下', english: '(used after a verb) a bit, a little while', lesson: 'L9', book: 'B', level: '1' },
  { pinyin: 'yǒu', characters: '有', english: 'to have, there is / are, is / are there', lesson: 'L2', book: 'B', level: '1' },
  { pinyin: 'yòu biān', characters: '右邊', english: 'to the right, right side', lesson: 'L10', book: 'B', level: '1' },
  { pinyin: 'yǒu yì diǎn', characters: '有一點', english: 'a little', lesson: 'L5', book: 'B', level: '1' },
  { pinyin: 'yuǎn', characters: '遠', english: 'far, distant', lesson: 'L11', book: 'B', level: '1' },
  { pinyin: 'yuè', characters: '月', english: 'month', lesson: 'L6', book: 'B', level: '1' },
  { pinyin: 'yùn dòng', characters: '運動', english: 'sport, to exercise', lesson: 'L8', book: 'B', level: '1' },
  { pinyin: 'zài', characters: '在', english: 'to be in', lesson: 'L12', book: 'B', level: '1' },
  { pinyin: 'zài', characters: '在', english: 'located at', lesson: 'L9', book: 'B', level: '1' },
  { pinyin: 'zài jiàn', characters: '再見', english: 'Goodbye, See you again', lesson: 'L12', book: 'B', level: '1' },
  { pinyin: 'zǎo fàn', characters: '早飯', english: 'breakfast', lesson: 'L4', book: 'B', level: '1' },
  { pinyin: 'zěn me', characters: '怎麼', english: 'how? why?', lesson: 'L8', book: 'B', level: '1' },
  { pinyin: 'zhāng', characters: '張', english: 'sheet, piece (flat objects like paper)', lesson: 'L10', book: 'B', level: '1' },
  { pinyin: 'zhǎo', characters: '找', english: 'to look for, to find, to seek', lesson: 'L9', book: 'B', level: '1' },
  { pinyin: 'zhào piàn', characters: '照片', english: 'photograph', lesson: 'L10', book: 'B', level: '1' },
  { pinyin: 'zhè', characters: '這', english: 'this', lesson: 'L10', book: 'B', level: '1' },
  { pinyin: 'zhōng jiān', characters: '中間', english: 'middle, between', lesson: 'L10', book: 'B', level: '1' },
  { pinyin: 'zhuō zi', characters: '桌子', english: 'table', lesson: 'L9', book: 'B', level: '1' },
  { pinyin: 'zì xíng chē', characters: '自行車', english: 'bicycle', lesson: 'L11', book: 'B', level: '1' },
  { pinyin: 'zǒu lù', characters: '走路', english: 'to walk', lesson: 'L11', book: 'B', level: '1' },
  { pinyin: 'zuǐ ba', characters: '嘴巴', english: 'mouth', lesson: 'L7', book: 'B', level: '1' },
  { pinyin: 'zuò', characters: '坐', english: 'to sit', lesson: 'L11', book: 'B', level: '1' },
  { pinyin: 'zuò', characters: '做', english: 'to do', lesson: 'L8', book: 'B', level: '1' },
  { pinyin: 'zuǒ biān', characters: '左邊', english: 'to the left, left side', lesson: 'L10', book: 'B', level: '1' },
];

const ChineseLearningApp = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [kidMode, setKidMode] = useState<boolean>(false);
  const [selectedLevel, setSelectedLevel] = useState<string>(ALL_OPTION);
  const [selectedBook, setSelectedBook] = useState<string>(ALL_OPTION);
  const [selectedLesson, setSelectedLesson] = useState<string>(ALL_OPTION);
  const [studyMode, setStudyMode] = useState<'sequential' | 'random'>('sequential');
  const [cardOrder, setCardOrder] = useState<number[]>([]);
  const [studyStats, setStudyStats] = useState<StudyStats>({ correct: 0, total: 0 });

  // Persist Kid Mode; default ON for first-time visitors
  useEffect(() => {
    try {
      const saved = localStorage.getItem('kidMode');
      if (saved === null) {
        setKidMode(true);
      } else {
        setKidMode(saved === 'true');
      }
    } catch {
      setKidMode(true);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('kidMode', String(kidMode));
    } catch {
      // ignore
    }
  }, [kidMode]);

  const levelOptions = useMemo(
    () => getUniqueSortedValues(VOCABULARY.map(word => word.level)),
    []
  );

  const bookOptions = useMemo(() => {
    if (selectedLevel === ALL_OPTION) {
      return [] as string[];
    }

    return getUniqueSortedValues(
      VOCABULARY.filter(word => word.level === selectedLevel).map(word => word.book)
    );
  }, [selectedLevel]);

const lessonOptions = useMemo(() => {
    if (selectedLevel === ALL_OPTION || selectedBook === ALL_OPTION) {
      return [] as string[];
    }

    const lessonsByLevelAndBook = getUniqueSortedValues(
      VOCABULARY.filter(
        word => word.level === selectedLevel && word.book === selectedBook
      ).map(word => word.lesson)
    );

    if (lessonsByLevelAndBook.length > 0) {
      return lessonsByLevelAndBook;
    }

    return getUniqueSortedValues(
      VOCABULARY.filter(word => word.level === selectedLevel).map(word => word.lesson)
    );
  }, [selectedLevel, selectedBook]);

  const filteredVocabulary = useMemo(() => {
    return VOCABULARY.filter(word => {
      if (selectedLevel !== ALL_OPTION && word.level !== selectedLevel) {
        return false;
      }
      if (selectedBook !== ALL_OPTION && word.book !== selectedBook) {
        return false;
      }
      if (selectedLesson !== ALL_OPTION && word.lesson !== selectedLesson) {
        return false;
      }
      return true;
    });
  }, [selectedLevel, selectedBook, selectedLesson]);

  useEffect(() => {
    setSelectedBook(ALL_OPTION);
    setSelectedLesson(ALL_OPTION);
  }, [selectedLevel]);

  useEffect(() => {
    setSelectedLesson(ALL_OPTION);
  }, [selectedBook]);

  const filterSummary = useMemo(() => {
    if (selectedLevel === ALL_OPTION) {
      return 'All Levels 所有程度';
    }

    const parts = [`Level ${selectedLevel} 程度`];

    if (selectedBook !== ALL_OPTION) {
      parts.push(`Book ${selectedBook} 冊`);
    } else if (bookOptions.length > 0) {
      parts.push('All Books 所有冊別');
    }

    if (selectedLesson !== ALL_OPTION) {
      parts.push(formatLessonLabel(selectedLesson));
    } else if (lessonOptions.length > 0) {
      parts.push('All Lessons 所有課程');
    }

    return parts.join(' • ');
  }, [selectedLevel, selectedBook, selectedLesson, bookOptions.length, lessonOptions.length]);

  // Initialize card order when vocabulary changes
  useEffect(() => {
    const indices = filteredVocabulary.map((_, index) => index);
    if (studyMode === 'random') {
      setCardOrder(indices.sort(() => Math.random() - 0.5));
    } else {
      setCardOrder(indices);
    }
    setCurrentCardIndex(0);
    setShowAnswer(false);
  }, [filteredVocabulary, studyMode]);

  const hasCards = filteredVocabulary.length > 0 && cardOrder.length > 0;
  const currentWordIndex = hasCards ? cardOrder[currentCardIndex] : 0;
  const currentWord = hasCards ? filteredVocabulary[currentWordIndex] : undefined;

  const nextCard = () => {
    if (!hasCards) {
      return;
    }
    const nextIndex = (currentCardIndex + 1) % cardOrder.length;
    setCurrentCardIndex(nextIndex);
    setShowAnswer(false);
  };

  const prevCard = () => {
    if (!hasCards) {
      return;
    }
    const prevIndex = (currentCardIndex - 1 + cardOrder.length) % cardOrder.length;
    setCurrentCardIndex(prevIndex);
    setShowAnswer(false);
  };

  const resetCards = () => {
    const confirmed = window.confirm('Reset your progress? 確認重設進度？');
    if (!confirmed) {
      return;
    }
    setCurrentCardIndex(0);
    setShowAnswer(false);
    setStudyStats({ correct: 0, total: 0 });
  };

  const shuffleCards = () => {
    if (!hasCards) {
      return;
    }
    const shuffled = [...cardOrder].sort(() => Math.random() - 0.5);
    setCardOrder(shuffled);
    setCurrentCardIndex(0);
    setShowAnswer(false);
  };

  const markAnswer = (isCorrect: boolean) => {
    if (!hasCards) {
      return;
    }
    setStudyStats(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));
    setTimeout(nextCard, 500);
  };

  const generateWorksheet = () => {
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
          <p><strong>課程 Lesson:</strong> ${selectedLesson === 'all' ? 'All Lessons 所有課程' : `Lesson ${selectedLesson} 第${selectedLesson.slice(1)}課`}</p>
          <p><strong>練習說明 Instructions:</strong> Trace the red example character in the first box, then practice writing it in the remaining boxes</p>
          <p><strong>日期 Date:</strong> _________________ <strong>姓名 Name:</strong> _________________</p>
        </div>

        ${filteredVocabulary.map((word, wordIndex) => `
          ${wordIndex > 0 && wordIndex % 3 === 0 ? '<div class="page-break"></div>' : ''}
          <div class="word-section">
            <div class="word-info">
              <div class="characters">${word.characters}</div>
              <div class="details">
                <span class="pinyin">${word.pinyin}</span>
                <span class="english">${word.english}</span>
                <span class="lesson-tag">${word.lesson}</span>
              </div>
            </div>

            ${word.characters.split('').map((char, charIndex) => `
              <div class="grid-container">
                <div class="char-label">Character ${charIndex + 1}: ${char}</div>
                <div class="practice-grid">
                  <div class="grid-cell">
                    <span class="example">${char}</span>
                  </div>
                  ${Array.from({length: 9}, () => '<div class="grid-cell"></div>').join('')}
                </div>
              </div>
            `).join('')}
          </div>
        `).join('')}

        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
          <p>Generated by Traditional Chinese Learning App • 傳統中文學習應用程式</p>
          <p>Practice Tips: Write slowly and carefully • Follow the stroke order • Use proper posture</p>
        </div>
      </body>
      </html>
    `;

    // Create a new window/tab with the worksheet
    const newWindow = window.open('', '_blank');
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
      alert('Please allow pop-ups to generate the worksheet. Then try again.');
    }
  };

  const playAudio = () => {
    if (!currentWord) return;
    try {
      const utterance = new SpeechSynthesisUtterance(currentWord.characters);
      utterance.lang = 'zh-TW';
      utterance.rate = 0.75; // 15% slower for elementary learners
      // Prefer zh-TW voice if available
      const voices = window.speechSynthesis?.getVoices?.() || [];
      const zhVoice = voices.find(v => v.lang?.toLowerCase?.().startsWith('zh'));
      if (zhVoice) {
        utterance.voice = zhVoice;
      }
      window.speechSynthesis?.speak(utterance);
    } catch {
      // no-op if speech synthesis not available
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-orange-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-red-800 mb-3 tracking-wide">
            傳統中文學習 Traditional Chinese Learning
          </h1>
          <p className="text-red-600 text-lg">索引：生詞／短語 - Index: Vocabulary Words / Phrases</p>

          {/* Kid Mode toggle */}
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              data-testid="kid-mode-toggle"
              aria-pressed={kidMode}
              onClick={() => setKidMode(prev => !prev)}
              className={`px-5 py-2 rounded-full text-sm font-semibold shadow transition-colors ${
                kidMode ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Kid Mode {kidMode ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Controls Panel */}
        {!kidMode && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8" data-testid="filter-panel">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            {/* Level Filter */}
            <div className="space-y-2">
              <label htmlFor="level-filter" className="block text-sm font-medium text-gray-700">Select Level:</label>
              <select
                id="level-filter"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-3 py-2 border border-red-300 rounded-lg bg-white text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value={ALL_OPTION}>All Levels 所有程度</option>
                {levelOptions.map(level => (
                  <option key={level} value={level}>
                    Level {level}
                  </option>
                ))}
              </select>
            </div>

            {/* Book Filter */}
            <div className="space-y-2">
              <label htmlFor="book-filter" className="block text-sm font-medium text-gray-700">Select Book:</label>
              <select
                id="book-filter"
                value={selectedBook}
                onChange={(e) => setSelectedBook(e.target.value)}
                disabled={selectedLevel === ALL_OPTION}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  selectedLevel === ALL_OPTION
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-red-800 border-red-300'
                }`}
              >
                <option value={ALL_OPTION}>All Books 所有冊別</option>
                {bookOptions.map(book => (
                  <option key={book} value={book}>
                    Book {book}
                  </option>
                ))}
              </select>
            </div>

            {/* Lesson Filter */}
            <div className="space-y-2">
              <label htmlFor="lesson-filter" className="block text-sm font-medium text-gray-700">Select Lesson:</label>
              <select
                id="lesson-filter"
                value={selectedLesson}
                onChange={(e) => setSelectedLesson(e.target.value)}
                disabled={selectedLevel === ALL_OPTION || selectedBook === ALL_OPTION}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  selectedLevel === ALL_OPTION || selectedBook === ALL_OPTION
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-red-800 border-red-300'
                }`}
              >
                <option value={ALL_OPTION}>All Lessons 所有課程</option>
                {lessonOptions.map(lesson => (
                  <option key={lesson} value={lesson}>
                    {formatLessonLabel(lesson)}
                  </option>
                ))}
              </select>
            </div>

            {/* Study Mode */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Study Mode:</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setStudyMode('sequential')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                    studyMode === 'sequential'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Sequential
                </button>
                <button
                  onClick={() => setStudyMode('random')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                    studyMode === 'random'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Random
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div
              className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-800 px-3 py-2 rounded-lg"
              data-testid="filter-summary"
            >
              <span className="font-semibold">Current Filter:</span>
              <span>{filterSummary}</span>
            </div>
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 px-3 py-2 rounded-lg justify-between">
              <span className="font-semibold">Matching Words:</span>
              <span data-testid="filter-count" className="text-lg font-bold">{filteredVocabulary.length}</span>
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={generateWorksheet}
              className="w-full md:w-auto bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              <Printer size={18} />
              Print Worksheet
            </button>
          </div>
        </div>
        )}

        {/* Study Stats */}
        {!kidMode && studyStats.total > 0 && (
          <div className="bg-white rounded-lg p-4 mb-8 shadow-lg text-center max-w-4xl mx-auto">
            <div className="text-lg font-semibold text-gray-700">
              Study Progress: {studyStats.correct}/{studyStats.total} correct
              <span className="text-green-600 ml-2">
                ({studyStats.total > 0 ? Math.round((studyStats.correct / studyStats.total) * 100) : 0}%)
              </span>
            </div>
          </div>
        )}

        {/* Flashcard */}
        {currentWord && (
          <section
            className="bg-white rounded-2xl shadow-2xl px-4 py-6 sm:px-8 sm:py-8 max-w-4xl mx-auto mb-8"
            data-testid="flashcard-section"
          >
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1 space-y-6">
                {/* Progress */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <span className="text-sm text-gray-600 text-center sm:text-left">
                    Card {currentCardIndex + 1} of {filteredVocabulary.length} • {currentWord.lesson} •
                    Mode: {studyMode === 'random' ? 'Random 隨機' : 'Sequential 順序'}
                  </span>
                  <div className="w-full sm:w-64">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-2 bg-gradient-to-r from-red-600 to-orange-500 rounded-full transition-all duration-500"
                        style={{ width: `${((currentCardIndex + 1) / filteredVocabulary.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div
                  className="relative text-center cursor-pointer min-h-[260px] sm:min-h-[340px] flex flex-col justify-center border-2 border-dashed border-red-100 rounded-2xl bg-gradient-to-b from-white to-red-50 hover:border-red-300 transition-colors shadow-inner"
                  data-testid="flashcard-card"
                  role="button"
                  tabIndex={0}
                  aria-label="Flashcard"
                  onClick={() => setShowAnswer(!showAnswer)}
                >
                  {!showAnswer ? (
                    <div className="space-y-6 sm:space-y-8">
                      <div className="text-7xl sm:text-8xl font-bold text-red-800 tracking-wide" data-testid="flashcard-character">
                        {currentWord.characters}
                      </div>
                      <p className="text-gray-500 text-base sm:text-lg flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 animate-pulse">
                        <span>Click to reveal pinyin & meaning • 點擊顯示拼音和含義</span>
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-5 sm:space-y-6">
                      <div className="text-7xl sm:text-8xl font-bold text-red-800 tracking-wide" data-testid="flashcard-character">
                        {currentWord.characters}
                      </div>
                      <div className="text-2xl sm:text-3xl text-red-600 font-medium tracking-wider">
                        {currentWord.pinyin}
                      </div>
                      <div className="text-3xl sm:text-4xl text-gray-800 font-semibold px-4 py-2 bg-yellow-100 rounded-lg inline-block">
                        {currentWord.english}
                      </div>
                      <p className="text-gray-500 text-base sm:text-lg">
                        Click to hide answer • 點擊隱藏答案
                      </p>
                    </div>
                  )}
                </div>

                {/* Kid Mode Primary Controls */}
                {kidMode && (
                  <div
                    className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                    data-testid="kid-mode-primary-controls"
                  >
                    <button
                      onClick={playAudio}
                      className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg w-full"
                      aria-label="Play audio"
                      data-testid="play-audio-button"
                    >
                      <Volume2 size={20} />
                      Play Audio
                    </button>
                    <button
                      onClick={() => setShowAnswer(prev => !prev)}
                      className="bg-yellow-500 text-white px-5 py-3 rounded-xl hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2 shadow-lg w-full"
                      aria-label="Toggle answer"
                      data-testid="toggle-answer-button"
                    >
                      {showAnswer ? <EyeOff size={20} /> : <Eye size={20} />}
                      {showAnswer ? 'Hide Answer' : 'Reveal Answer'}
                    </button>
                    <button
                      onClick={nextCard}
                      className="bg-green-600 text-white px-5 py-3 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-lg w-full"
                      aria-label="Next"
                      data-testid="next-button"
                    >
                      <ChevronRight size={20} />
                      Next
                    </button>
                  </div>
                )}

                {/* Answer Buttons (when answer is shown) */}
                {showAnswer && !kidMode && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => markAnswer(false)}
                      className="bg-red-500 text-white px-5 py-3 rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2 shadow-lg w-full"
                    >
                      <X size={20} />
                      Need Practice
                    </button>
                    <button
                      onClick={() => markAnswer(true)}
                      className="bg-green-500 text-white px-5 py-3 rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center gap-2 shadow-lg w-full"
                    >
                      <Check size={20} />
                      Got It!
                    </button>
                  </div>
                )}
              </div>

              {!kidMode && (
              <div className="flex flex-col justify-between lg:w-64 space-y-4">
                <div className="bg-red-50 border border-red-100 rounded-2xl p-4 space-y-3 shadow-inner">
                  <h4 className="text-sm font-semibold text-red-700 text-center">Quick Actions</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={prevCard}
                      className="flex flex-col items-center justify-center bg-white text-red-600 border border-red-200 rounded-xl py-3 px-2 hover:bg-red-100 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                      disabled={filteredVocabulary.length <= 1}
                      aria-label="Previous card"
                    >
                      <ChevronLeft size={20} />
                      <span className="mt-1 text-xs font-medium">Prev</span>
                    </button>
                    <button
                      onClick={nextCard}
                      className="flex flex-col items-center justify-center bg-white text-red-600 border border-red-200 rounded-xl py-3 px-2 hover:bg-red-100 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                      disabled={filteredVocabulary.length <= 1}
                      aria-label="Next card"
                    >
                      <ChevronRight size={20} />
                      <span className="mt-1 text-xs font-medium">Next</span>
                    </button>
                    <button
                      onClick={shuffleCards}
                      className="flex flex-col items-center justify-center bg-white text-purple-600 border border-purple-200 rounded-xl py-3 px-2 hover:bg-purple-50 transition-colors shadow-sm"
                      aria-label="Shuffle cards"
                    >
                      <Shuffle size={18} />
                      <span className="mt-1 text-xs font-medium">Shuffle</span>
                    </button>
                    <button
                      onClick={resetCards}
                      className="flex flex-col items-center justify-center bg-white text-gray-700 border border-gray-200 rounded-xl py-3 px-2 hover:bg-gray-100 transition-colors shadow-sm"
                      aria-label="Reset progress"
                      data-testid="quick-actions-reset"
                    >
                      <RotateCcw size={18} />
                      <span className="mt-1 text-xs font-medium">Reset</span>
                    </button>
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 space-y-3 shadow-inner">
                  <h4 className="text-sm font-semibold text-orange-700 text-center">Card Details</h4>
                  <div className="text-sm text-gray-700 space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Lesson</span>
                      <span className="text-red-600">{formatLessonLabel(currentWord.lesson)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Book</span>
                      <span>{currentWord.book}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Level</span>
                      <span>{currentWord.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Characters</span>
                      <span>{currentWord.characters.length}</span>
                    </div>
                  </div>
                </div>
              </div>
              )}
            </div>
          </section>
        )}

        {/* Vocabulary Overview Grid */}
        {!kidMode && (
        <div className="bg-white rounded-xl shadow-lg p-6" data-testid="vocab-overview-section">
          <h3 className="text-2xl font-bold text-red-800 mb-6 text-center">
            詞彙總覽 Vocabulary Overview
            <span className="text-lg text-gray-600 ml-3">
              ({selectedLesson === 'all' ? 'All Lessons' : `Lesson ${selectedLesson}`})
            </span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredVocabulary.map((word, index) => (
              <div
                key={index}
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 transform hover:scale-105 ${
                  cardOrder[currentCardIndex] === index
                    ? 'bg-red-100 border-red-400 shadow-lg'
                    : 'bg-gray-50 hover:bg-blue-50 border-gray-200 hover:border-blue-300 shadow-md'
                }`}
                onClick={() => {
                  const newIndex = cardOrder.findIndex(i => i === index);
                  if (newIndex === -1) {
                    return;
                  }
                  setCurrentCardIndex(newIndex);
                  setShowAnswer(false);
                }}
              >
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-red-800">{word.characters}</div>
                  <div className="text-sm text-red-600 font-medium">{word.pinyin}</div>
                  <div className="text-sm text-gray-700">{word.english}</div>
                  <div className="inline-block bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                    {word.lesson}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}

        {!hasCards && (
          <div className="mt-8 bg-yellow-100 text-yellow-800 text-center p-4 rounded-lg">
            尚未找到符合條件的卡片，請選擇其他課程。
          </div>
        )}

        {/* Instructions */}
        {!kidMode && (
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-red-800 mb-4 text-center">
            使用說明 How to Use This App
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-red-700 mb-2">🎴 Flashcard Study:</h4>
              <ul className="space-y-1 text-gray-700 text-sm">
                <li>• Click cards to reveal/hide pinyin and English translations</li>
                <li>• Use arrow buttons to navigate between cards</li>
                <li>• Mark answers as correct/incorrect to track progress</li>
                <li>• Choose sequential or random study modes</li>
                <li>• Filter by specific lesson numbers</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-red-700 mb-2">📝 Writing Practice:</h4>
              <ul className="space-y-1 text-gray-700 text-sm">
                <li>• Generate printable worksheets with practice grids</li>
                <li>• Each character gets individual practice boxes</li>
                <li>• Traditional Chinese grid format with guidelines</li>
                <li>• Includes pinyin and English for reference</li>
                <li>• Perfect for handwriting practice</li>
              </ul>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default ChineseLearningApp;
