import {observable, action} from 'mobx';
import {persist, create} from 'mobx-persist';
import {createContext} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import model from '../model/model.json';

export interface WordType {
  value: string;
  slot: number;
  article: string;
  timestamp: Date;
  imageUrl: string;
}

export interface LessonWordType {
  value: string;
  article: string;
  answerArticle: string;
  imageUrl: string;
}

//app data state
class WordsStore {
  @persist('object') @observable words: WordType[] = [];

  //load initial words array into WordsStore
  constructor() {
    if (this.words.length === 0) {
      let i = 0;
      for (const word of model.words) {
        this.words[i++] = word;
      }
    }
  }

  @persist('object') @observable lessonWords: LessonWordType[] = [];

  @action populateLesson = () => {
    for (const word of this.words) {
      this.lessonWords.push({
        value: word.value,
        article: word.article,
        answerArticle: null,
        imageUrl: word.imageUrl,
      });
    }
  };

  @action emptyLesson = () => {
    this.lessonWords = [];
  };

  @action setAnswerArticleForLessonWord = (
    value: string,
    answerArticle: string,
  ) => {
    const index = this.lessonWords.findIndex(
      (lessonWord) => lessonWord.value === value,
    );
    this.lessonWords[index].answerArticle = answerArticle;
  };

  @action incrementSlotForWord = (value: string) => {
    const index = this.words.findIndex((word) => word.value === value);
    this.words[index].slot++;
  };
  @action updateTimeStampForWord = (value: string) => {
    const index = this.words.findIndex((word) => word.value === value);
    this.words[index].timestamp = new Date();
  };
}

//create state instance
const wordsStore = new WordsStore();

//configure persiting data
const hydrate = create({
  storage: AsyncStorage,
  jsonify: true,
});

hydrate('WordsStore', wordsStore).then(() =>
  console.log('WordsStore has been hydrated'),
);

//create react context for my store
export default createContext(wordsStore);