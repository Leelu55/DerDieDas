import ttsLibrary from 'react-native-tts';
import voiceLibrary from '@react-native-community/voice';

import extractArticle from './extractArticle';
import {LessonState} from '../stores/UIStore';
import processAnswer from './processAnswer';

console.log('import audiovoice.ts');
// callbacks for ttsLibrary events to be modified on setup and cleanup
let onTtsStart = null;
let onTtsFinish = null;
let onTtsCancel = null;
let onTtsError = null;

export function setup(uiStore, wordsStore) {
  console.log('AudioVoice::setup');

  onTtsFinish = () => {
    function startUserInteraction() {
      if (uiStore.autoMode) {
        voiceStart();
      } else {
        uiStore.setLessonState(LessonState.IsWaitingForUserAction);
      }
    }

    console.log(
      '# tts-finish',
      wordsStore.lessonWords[uiStore.wordIndex].value,
    );
    startUserInteraction();
  };

  onTtsStart = () => {
    console.log('# tts-start', wordsStore.lessonWords[uiStore.wordIndex].value);
  };

  onTtsCancel = () => {
    console.log(
      '# tts-cancel',
      wordsStore.lessonWords[uiStore.wordIndex].value,
    );
  };

  onTtsError = () => {
    console.log('# tts-error', wordsStore.lessonWords[uiStore.wordIndex].value);
  };

  ttsLibrary.addEventListener('tts-finish', onTtsFinish);
  ttsLibrary.addEventListener('tts-cancel', onTtsCancel);
  ttsLibrary.addEventListener('tts-start', onTtsStart);
  ttsLibrary.addEventListener('tts-error', onTtsError);

  voiceLibrary.onSpeechStart = () => {
    uiStore.setLessonState(LessonState.IsListening);
  };

  voiceLibrary.onSpeechResults = (event) => {
    const currentArticle = extractArticle(event.value);

    if (currentArticle === null) {
      uiStore.setLessonState(LessonState.IsRepeating);
      return;
    }
    processAnswer(wordsStore, uiStore, currentArticle);
  };

  voiceLibrary.onSpeechError = () => {
    if (uiStore.lessonState !== LessonState.IsSpeaking) {
      uiStore.setLessonState(LessonState.IsRepeating);
    }
  };
}

export function cleanup() {
  ttsLibrary.stop();
  ttsLibrary.removeEventListener('tts-finish', onTtsFinish);
  ttsLibrary.removeEventListener('tts-start', onTtsStart);
  ttsLibrary.removeEventListener('tts-error', onTtsError);
  ttsLibrary.removeEventListener('tts-cancel', onTtsCancel);
  voiceLibrary.destroy();
  console.log('AudioVoice::cleanup');
}

export function voiceStart() {
  voiceLibrary.start('de-DE');
}

export function voiceStop() {
  voiceLibrary.destroy();
}

export function stopSpeakWord() {
  ttsLibrary.stop();
}

export function speakWord(wordValue) {
  ttsLibrary.speak(wordValue);
}

export function repeatWord(prefixText, wordValue) {
  ttsLibrary.speak(prefixText + ',,' + wordValue);
}
