<h1 align="center">
  <img src="./doc/README/CssInjector.svg" width="350" alt="Articulus" />
  <h2 align="center">A <u>Development Guide</u> for React Native Coders</h2>
</h1>

---

Articulus is a pet project programmed with **TypeScript** and built on top of **React Native**. Currently it is only tested on **Android** phones and available on the **<a href="https://play.google.com/store/apps/details?id=com.derdiedas">Google Play Store</a>**. With little effort though it should also run on iOS.

---

## :wrench: Setting up the Development Project

Make sure React Native is available by following <a href="https://reactnative.dev/docs/environment-setup">RN Environment Setup guide</a>

**Clone and Install the Articulus GitHub Project**

1. `cd <my-development-directory>`
2. `git clone https://github.com/Leelu55/Articulus.git`
3. `cd Articulus`
4. `npm install`

**Run it on your virtual or physical Device**

1. Run `npm start` to start the Metro JS bundler
2. In a second terminal run `npm run android` inside the project folder or run the app directly from Android Studio

_Feel free to Contribute and Reuse._

## :telescope: App Structure, Screens & Entry Points

![App Structure](./doc/appStructure.svg)

- The entry file for the app is [:link:/index.js](./index.js)
- The entry component is [:link:/components/App.tsx](./components/App.tsx)
- All components are stored in [:link:/components/](./components) folder
- **React Navigation** is used to navigate between Stacks and Screens on user input and depending on UI state variables
- [:link:MainApp](./components/MainApp.tsx) renders a _\<NavigationContainer />_ with [:link:IntroSlider](./components/IntroSlider.tsx), [:link:ConfigStack](./components/MainApp.tsx) & [:link:AppStack](./components/MainApp.tsx)
- [:link:ConfigStack](./components/MainApp.tsx) renders [:link:CheckAudioVoiceConfig](./components/CheckAudioVoiceConfig.tsx) & [:link:ConfigScreen](./components/ConfigScreen.tsx)
- [:link:AppStack](./components/MainApp.tsx) navigates between [:link:HomeStack](./components/MainApp.tsx), [:link:PlayerScreen](./components/PlayerScreen.tsx), [:link:FinishedScreen](./components/FinishedScreen.tsx) & [:link:EmptyWordsScreen](./components/EmptyWordsScreen.tsx) by user interaction or LessonState change
- [:link:HomeStack](./components/MainApp.tsx) renders a _\<Tab.Navigator />_ with the tabs [:link:StartScreen](./components/StartScreen.tsx), [:link:StatisticsScreen](./components/StatisticsScreen.tsx), [:link:GrammarScreen](./components/GrammarScreen.tsx) & [:link:FaqScreen](./components/FaqScreen.tsx)

## :bulb: Learning Algorithm

**Spaced repition learning**
Articulus implements a [spaced repition based algorithm](https://en.wikipedia.org/wiki/Leitner_system) for teaching german articles for the most common words. Words not answered correctly will reappear in the lesson more often, correctly answered ones will be repeated less frequently. Once a word article was chosen correctly, it moves up one learning level (slot 0-6). If answered wrongly, it moves down a level. Each word once answered gets a due date based on its slot and the current date.

**Implementation of the algorithm**
The algorithm is implemented in the [:link:populateLesson](./libs/populateLesson.ts) function.
Each word starts out with slot 0. If there are no words with a due date corresponding to the current day, "new" words are being added from the pool up to the lesson size defined in the [:link:settings](./libs/settings.json). Once a word reached final slot count (see [:link:settings](./libs/settings.json)), it is considered learned and will not be included into lessons again.

**The due date calculation**
Due date is calculated woth the [:link:updateDueDateTimeForWord](./stores/WordsStore.ts) action defined in WordsStore. It uses the slot as the power of 2 for calculating the number of days to add to current date.

For example a word with a slot of 1 will be repeated the day after tomorrow, a word with slot 4 already 16 days from today. The concrete date for the reappearance is computed using a bunch of [:link:helper functions](./libs/dateMethods.ts) to deal with JS Date type issues.

```javascript
  @action updateDueDateTimeForWord = (value: string) => {
    const index = this.words.findIndex((word) => word.value === value);
    this.words[index].dueDateTime = dateMethods.articulusDateToJsDate(
      dateMethods.getFutureDate(Math.pow(2, this.words[index].slot)),
    );
  };

```

## :vertical_traffic_light: State Engine

**Lesson Flow**
In Articulus the user starts so-called **lessons** to learn correct articles for german nouns. In a lesson each word is being shown on screen with its corresponding image and being read aloud. Then the user can choose the correct answer either saying it aloud or clicking on an article button. Then the next word is presented. Words can be skipped, the lesson can be paused or canceled. If the speech recognition fails to identify a valid answer the word is repeated. Once all words of the particular lesson have been shown, a [:link:FinishedScreen](./components/FinishedScreen/FinishedScreen.tsx) appears and the user can start another lesson or stop learning.

<p align="center">
<img src="./assets/articulus_lesson_flow.gif" width="200" height="400" />
</p>

**Controlling State Change**  
Text-to-speech output of lesson words, speech recognition of user answers and the processing of those answers happen asynchronously. In the same time the user can interact with the app directly by touch interface thus interrupting the flow. This can lead to a wide range of bugs and unexpected behaviour if not managed. To prevent this a simple state engine makes sure only valid state transitions happen:

![State Engine](./doc/stateTransitions.svg)

Look inside the implementation of the state engine <a href="https://github.com/Leelu55/Articulus/blob/99ec9166bd0d1331d684998d30879f7bffea8528/stores/UIStore.ts#L6">here</a>, <a href="https://github.com/Leelu55/Articulus/blob/99ec9166bd0d1331d684998d30879f7bffea8528/stores/UIStore.ts#L19">here</a> and <a href="https://github.com/Leelu55/Articulus/blob/99ec9166bd0d1331d684998d30879f7bffea8528/stores/UIStore.ts#L128">here</a>.

## :red_circle::small_orange_diamond::large_blue_diamond: State Management with MobX

To provide and persist state for components, the state management library [MobX](https://mobx.js.org/README.html) is used:

```javascript
<Provider {...stores}>
  <MainApp />
  ...
</Provider>
```

The app state is split into two stores:

- [:link:UIStore](./stores/UIStore.ts) for UI state including the state engine
- [:link:WordsStore](./stores/WordsStore.ts) for app data state and keeping track of learning progress

## :speech_balloon: Word Data

Articulus is used to learn articles for the most common german words. Around 1000 german words were manually selected and added to [:link:wordList.csv](./model/wordList.csv) file. The csv file has 4 columns:

- **word**
- **article**
- **source image URL** (chosen from the free images platform [Pixabay](https://pixabay.com/))
- **grammar ruleId** (optional)

A manually triggered compilation step is necessary to convert the csv data to a format that can be used by the app:

```bash
$ cd model
$ node wordListToModel.ts > model.json
```

As a result, [:link:model.json](./model/model.json) stores word objects in the following format:

```javascript
export interface WordType {
  value: string;
  slot: number;
  article: string;
  timestamp: Date;
  imageUrl: string;
  dueDateTime: Date;
  ruleId: string;
}
```

Example entry:

```javascript
{
   "value":"Ärger",
   "slot":0,
   "article":"der",
   "timestamp":null,
   "dueDateTime":null,
   "imageUrl":"https://cdn.statically.io/img/raw.githubusercontent.com/Leelu55/Articulus/master/model/images/boy-3617648__340.jpg",
   "ruleId":"FAQ_RULES_ER"
}
```

The [:link:wordListToModel.ts](./model/wordListToModel.ts) script checks uniqueness and correctness of words and takes care of downloading images from Pixabay to the [/model/images/](./model/images) folder.

Additions and changes to the images folder have to be pushed to the Articulus GitHub repo to make the image files available to the [CDN](#cdn-with-statically-and-github).

The generated [:link:model.json](./model/model.json) file is used in the MobX [WordsStore](./stores/WordsStore.ts) constructor to load the word data as a state into the app on initialization.

## :arrow_down: Image CDN with Statically and Github

To reduce app size, heavy word image files can not be delivered with the app. Instead they are dynamically loaded from the internet whenever a word is shown within the app.

To deliver those images fast, Articulus relies on the [Statically CDN](https://statically.io) which in turn uses the Articulus GitHub repository as it's storage backend.

**So the following image...**

![](https://cdn.statically.io/img/raw.githubusercontent.com/Leelu55/Articulus/master/model/images/cat-2143332__340.jpg)

**...is linked inside the App like this:**

https://cdn.statically.io/img/raw.githubusercontent.com/Leelu55/Articulus/master/model/images/cat-2143332__340.jpg

**...which in turn downloads the following image file from this GitHub Repo on demand:**

https://github.com/Leelu55/Articulus/blob/master/model/images/cat-2143332__340.jpg

For the current word image Statically checks if the image is already in its cache. If so, it is delivered directly from cache, otherwise it's downloaded from Github Articulus repo.

## :ear: :lips: Speech-To-Text and Text-To-Speech

As an audiobased learning app Articulus supports voice commands as answers. During a lesson each displayed word is pronounced by the app using the <a href="https://github.com/ak1394/react-native-tts#speaking">React Native TTS library</a>. The speech-to-text functionality was implemented using the <a href="https://github.com/react-native-voice/voice">React Native Voice library</a>. Listener methods for both libraries are configured inside [:link:audioVoice.ts](./libs/audioVoice.ts).

**Automatic and Manual Mode**
There are two modes to play a lesson: automatic and manual. Both modes allow spoken answers. In automatic mode after the word was pronounced the app listens for the vocal answer of the user. In manual mode the microphone symbol has to be clicked before speaking.

**Handling Errors and Evaluating Results**
The built-in error handling of the voice recognition library is implemented to allow the user two more tries in case the answer was not eligable because of background noise, low volume or other problems. If there is a speech result, the custom [:link:extractArticle](./libs/extractArticle.ts) function checks if the answer:

1. is not too long (maximum five words to reduce the time for checking the answer) and
2. includes an article ('der', 'die' or 'das').

If both conditions are met, it returns the article. The extracted article is then compared to the correct word article. Otherwise the word is again being repeated up to two times, then skipped.

## :boom: Animations

Animations were realized using both the built-in React Native [Animated](https://reactnative.dev/docs/animated) library and the [Reanimated](https://docs.swmansion.com/react-native-reanimated/) library.

A good example of Animation library use is the [:link:AnimatedNumber](./components/AnimatedNumber.tsx) component used to create a count up animation in the [:link:CatChatBubble](./components/FinishedScreen/CatChatBubble.tsx) on [:link:FinishedScreen](./components/FinishedScreen/FinishedScreen.tsx). It animates the count up of correct and wrong answers of a lesson.

Reanimated was used for animating [:link:HintBubbles](./components/HintBubble.tsx) for the tutorial view on initial lesson start.

<p align="center">
<img src="./assets/reanimated_animation.gif"  width="200" height="400" />
</p>

## :curly_loop: Usage of SVG Files

**Conversion of SVGs to React Native Component**

Articulus uses a bunch of nice Vector Graphics (SVGs), many of them taken from [freepik.com](https://www.freepik.com/). For use in the App, downloaded SVGs must be converted to RN Components first. We use an online tool called [react-svgr](https://react-svgr.com/playground/?native=true&typescript=true) to do so.

**Animating SVGs**

After converting an SVG to an ordinary RN Component, we can also apply complex RN Animations to those SVGs, like [:link:here](./components/SVGs/UnicornCat.tsx), [:link:here](./components/intro/Slide2.tsx) and [:link:here](./components/intro/Slide3.tsx).

## :hammer: Testing

Currently, there are only a handful of unit tests available, only for some of the most hairy parts of the app:

- [:link:/libs/dateMethods.test.ts](./libs/dateMethods.test.ts)
- [:link:/libs/extractArticle.test.ts](./libs/extractArticle.test.ts)
- [:link:/libs/populateLesson.test.ts](./libs/populateLesson.test.ts)
- [:link:/libs/utils.test.ts](./libs/utils.test.ts)

Although that's not nearly enough tests, the existing ones in conjunction with the [State Engine](#state-engine) make the Articulus development "feel" quiet stable at the moment.

Tests are run manually with `yarn test` or automatically during CI/CD.

## :articulated_lorry: CD and CI with Bitrise

Articulus uses [bitrise.io](https://www.bitrise.io/) as its continuous delivery platform. The following workflow is configured to automatically deploy committed changes to the Play Store:

1. Activate the ssh-key
2. Clone Articulus git repository
3. Install dependencies with `npm install`
4. Run tests with `npm test`
5. Create typedoc documentation
6. Change Android version code and version name
7. Build Android release
8. Sign the APK
9. Deploy to Google Play
