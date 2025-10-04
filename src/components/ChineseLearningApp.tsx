import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Printer, Shuffle, Check, X } from 'lucide-react';
import { VocabularyWord, StudyStats } from '../types';

const LESSONS = ['all', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'L10', 'L11', 'L12'];

const VOCABULARY: VocabularyWord[] = [
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
];

const ChineseLearningApp = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState('all');
  const [studyMode, setStudyMode] = useState<'sequential' | 'random'>('sequential');
  const [cardOrder, setCardOrder] = useState<number[]>([]);
  const [studyStats, setStudyStats] = useState<StudyStats>({ correct: 0, total: 0 });

  const filteredVocabulary = useMemo(() => {
    return selectedLesson === 'all'
      ? VOCABULARY
      : VOCABULARY.filter(word => word.lesson === selectedLesson);
  }, [selectedLesson]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-orange-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-red-800 mb-3 tracking-wide">
            傳統中文學習 Traditional Chinese Learning
          </h1>
          <p className="text-red-600 text-lg">索引：生詞／短語 - Index: Vocabulary Words / Phrases</p>
        </div>

        {/* Study Stats */}
        {studyStats.total > 0 && (
          <div className="bg-white rounded-lg p-4 mb-6 shadow-lg text-center">
            <div className="text-lg font-semibold text-gray-700">
              Study Progress: {studyStats.correct}/{studyStats.total} correct
              <span className="text-green-600 ml-2">
                ({studyStats.total > 0 ? Math.round((studyStats.correct / studyStats.total) * 100) : 0}%)
              </span>
            </div>
          </div>
        )}

        {/* Controls Panel */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Lesson Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Select Lesson:</label>
              <select
                value={selectedLesson}
                onChange={(e) => setSelectedLesson(e.target.value)}
                className="w-full px-3 py-2 border border-red-300 rounded-lg bg-white text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {LESSONS.map(lesson => (
                  <option key={lesson} value={lesson}>
                    {lesson === 'all' ? 'All Lessons 所有課程' : `Lesson ${lesson} 第${lesson.slice(1)}課`}
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
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    studyMode === 'sequential'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Sequential
                </button>
                <button
                  onClick={() => setStudyMode('random')}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    studyMode === 'random'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Random
                </button>
              </div>
            </div>

            {/* Print Worksheet */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Writing Practice:</label>
              <button
                onClick={generateWorksheet}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <Printer size={18} />
                Print Worksheet
              </button>
            </div>
          </div>
        </div>

        {/* Flashcard */}
        {currentWord && (
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-3xl mx-auto mb-8" data-testid="flashcard-section">
            {/* Progress */}
            <div className="text-center mb-6">
              <span className="text-sm text-gray-600">
                Card {currentCardIndex + 1} of {filteredVocabulary.length} • {currentWord.lesson} •
                Mode: {studyMode === 'random' ? 'Random 隨機' : 'Sequential 順序'}
              </span>
              <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
                <div
                  className="bg-gradient-to-r from-red-600 to-orange-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentCardIndex + 1) / filteredVocabulary.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Card Content */}
            <div
              className="text-center cursor-pointer min-h-[350px] flex flex-col justify-center border-2 border-dashed border-gray-200 rounded-lg hover:border-red-300 transition-colors"
              data-testid="flashcard-card"
              role="button"
              tabIndex={0}
              aria-label="Flashcard"
              onClick={() => setShowAnswer(!showAnswer)}
            >
              {!showAnswer ? (
                <div className="space-y-8">
                  <div className="text-8xl font-bold text-red-800 mb-6 tracking-wide" data-testid="flashcard-character">
                    {currentWord.characters}
                  </div>
                  <p className="text-gray-500 text-lg mt-12 animate-pulse">
                    🎯 Click to reveal pinyin & meaning • 點擊顯示拼音和含義
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="text-8xl font-bold text-red-800 mb-6 tracking-wide" data-testid="flashcard-character">
                    {currentWord.characters}
                  </div>
                  <div className="text-3xl text-red-600 font-medium tracking-wider">
                    {currentWord.pinyin}
                  </div>
                  <div className="text-4xl text-gray-800 font-semibold px-4 py-2 bg-yellow-100 rounded-lg inline-block">
                    {currentWord.english}
                  </div>
                  <p className="text-gray-500 text-lg mt-12">
                    ✅ Click to hide answer • 點擊隱藏答案
                  </p>
                </div>
              )}
            </div>

            {/* Answer Buttons (when answer is shown) */}
            {showAnswer && (
              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={() => markAnswer(false)}
                  className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 shadow-lg"
                >
                  <X size={20} />
                  Need Practice
                </button>
                <button
                  onClick={() => markAnswer(true)}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 shadow-lg"
                >
                  <Check size={20} />
                  Got It!
                </button>
              </div>
            )}

            {/* Navigation Controls */}
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={prevCard}
                className="bg-red-600 text-white p-4 rounded-full hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
                disabled={filteredVocabulary.length <= 1}
                aria-label="Previous card"
              >
                <ChevronLeft size={24} />
              </button>

              <div className="flex gap-3">
                <button
                  onClick={shuffleCards}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 shadow-lg"
                  aria-label="Shuffle cards"
                >
                  <Shuffle size={18} />
                  Shuffle
                </button>
                <button
                  onClick={resetCards}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 shadow-lg"
                  aria-label="Reset progress"
                >
                  <RotateCcw size={18} />
                  Reset
                </button>
              </div>

              <button
                onClick={nextCard}
                className="bg-red-600 text-white p-4 rounded-full hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
                disabled={filteredVocabulary.length <= 1}
                aria-label="Next card"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        )}

        {/* Vocabulary Overview Grid */}
        <div className="bg-white rounded-xl shadow-lg p-6">
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

        {!hasCards && (
          <div className="mt-8 bg-yellow-100 text-yellow-800 text-center p-4 rounded-lg">
            尚未找到符合條件的卡片，請選擇其他課程。
          </div>
        )}

        {/* Instructions */}
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
      </div>
    </div>
  );
};

export default ChineseLearningApp;
