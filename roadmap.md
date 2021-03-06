# Articulus

## Roadmap

### Specification & Implementation FROZEN 4.12.2020 DON'T ADD MORE

### Modifications

### Bugs

### Content Creation

- [ ] INPROGRESS write grammar rules and grammar hint texts ("Words ending on 'schaft' are feminin")
- [ ] INPROGRESS write manual and usage hints ("Use DDD in a quiet surrounding for better results")
- [ ] write About content (Legal Notice) for FaqScreen

### Appearance

- [ ] choose and use fonts
- [ ] use color palette consistently
- [ ] make all screens responsive to screen size
- [ ] check paddings, margins, positions, sizes. make sure they are used consistently on all screens, also cleanUp sharedStyles
- [ ] check all buttons, links, views (functionality and usability)

### Documentation and Pre-Release Tasks

- [ ] set the correct deployment version in bitrise workflow
- [ ] content creation for about page, imprint, etc.
- [ ] more code testing
- [ ] refactor code (https://mobx.js.org/react-optimizations.html)
- [ ] update state diagram
- [ ] write documentation for open source code reusability (document installation process, packages, tools etc)
- [ ] create a good README

### Done

#### Features

- [x] build script to add article data
      call this script in your shell by executing the command below:
      \$ node modelTransformer.ts > ../model/model.json
- [x] set up continous integration (possibly Circle CI)
- [x] prevent unallowed state transitions by using a map of allowedStateTransitions when setting state
- [x] deployments to PlayStore
- [x] specify and implement statistics screen features
- [x] speed up animations and transitions
- [x] implement goBack with BackButton in StartModal, disable BackButton on FinishedScreen
- [x] https://github.com/ak1394/react-native-tts#no-text-to-speech-engine-installed-on-android
- [x] setup CDN and cloud storage for images with Statically as CDN and GitHub for storage
- [x] move sparkle feedback (correct&wrong) animation starting point from ProgressBar to SelectorViews (aka article buttons)
- [x] include calculated success rate and streak in FinishedScreen
- [x] manage disabled/enabled status of ControlButtons according to LessonState
- [x] specify and implement GrammarHints and GrammarScreen
- [x] specify and reimplement IntroSlider Screens
- [x] implement SplashScreen to prevent flickering on App start (IntroSlider/Startscreen show condition)
- [x] show preview or loading indicator for images while not visible
- [x] specify and implement FaqScreen
- [x] reimplement StartScreen
- [x] reimplement EmptyWordsScreen
- [x] specify & implement ConfigScreen
- [x] delete badly pronounced or ambiguous words: "Kassettenrekorder", "Erwachsene", "Formular", "Beamte", 'CD-ROM', "Bekannte", "Geburtsort"
- [x] INPROGRESS specify app usage hints (ControlBar, LessonStateIndicator, AutoModeButton)
- [x] modify ButtonBar style on FinishedScreen

#### Modifications

- [x] Skip Icon with text and ripple effect
- [x] change appearance of SplashScreen (Text Articulus)
- [x] use thumbnails/preview images for FlatList on start page using statically.io url with "?w=SMALLERWIDTH"
- [x] optimizing image display time in lessons
- [x] change TabNavigation library
- [x] PlayerScreen: next word should slide in from the right instead of just be replaced
- [x] PlayerScreen: show user the right article and give feedback for each chosen article
- [x] include share button in FinishedScreen with android intent to share results in messenger
- [x] make list items on StartCreen clickable, onClick show article
- [x] don't show hints more than once
- [x] prettify "Lektionen" section on StatisticsScreen

#### Content Creation

- [x] add more words

#### Bugs

- [x] pressing articleButton between speaking and listening in autoMode doesn't logIn the answer. app continues listening instead of showing next word
- [x] if no words in lessonWords clicking on start lesson shoudn't generate a new lessonHistory
- [x] on articleButton pressed, answer is counted, but wordIndex not incremented. If pressed again, answer is counted twice, then the wordIndex is incremented.
      [x] clicking startLesson() on FinishedScreen with no more words with dueDate==today or new words leads to a crash because emptyLesson() is called and the PlayerScreen component being still
      mounted in the background (React.navigation!) is rerendered with empty lessonWords.
- [x] FinishedScreen: number text in AnimatedNumber counter not centered with number >=10
- [x] TTS Error: Error: Language data is missing on muted sound
- [x] cancel after clicking article SelectorButton, then returning to lesson and clicking SelectorButton again -> answer is being counted twice
- [x] navigating from FinishedScreen to StartScreen is to slow
- [x] SelectorButton reaction onPress not instant
- [x] Fix animate SelectorButtons onChosenArticle
- [x] (DONE with preventing selector button animations triggering processAnswer to run twice) When GrammarHints are shown, LessonState should not change as long as HintModal is visible or the app continues with next word. Also errors are countet twice, the number of played words is too high in the end also the number of errors
- [x] FIXED BY FIXING SELECTORBUTTON ANIMATION nextWord is too fast if correct
- [x] speed up LessonState Indicator Animation
- [x] ripple on Selector buttons borderRadius not correct (sharp instead of rounded edges)
- [x] check Unique Words before pushing to model
- [x] year LineChart no data displayed
- [x] adding or modifying words can not be done by running the script as it deletes all the grammar rules. so either include grammar rules in csv already and extend the script to include these in model or add words only directly to model or ?
- [x] Fix GrammarScreen scroll bug
- [x] on Samsung A Galaxy Tab Android 9 TTS and STT don't work initially because the Google Speech engine is not used by default -> implement at least an explanation how to enable it

### Appearance

- [x] new logo
- [x] change android StatusBar appearence according to our colors

### Next Features after first Open Release

- [ ] Learning Stats Animated header for StartScreen
- [ ] FinishedScreen Articulus display SpeechBubbles with messages for the user ('well done', 'try again', 'good progress' etc)
- [ ] implement savedLessons as dropdown list with dropdown items to show in StatisticsScreen
- [ ] Streaks ("X correct answers in a row")
- [ ] Badges
  - [ ] "Lesson passed without mistakes"
  - [ ] "Finalized learning X Words"
  - [ ] "Record streak"
  - [ ] show badges on statistics page
  - [ ] specify modified StartScreen when there are no words with dueDate == today or new words
- [ ] implement GrammarHint engine to choose grammar hints according to previous behaviour (not show the same hints all the time) IDEA: Show the reminder hint of the grammar rule when the user makes the same mistake twice in one lesson
- [ ] implement search for GrammarRules and FAQs
- [ ] enhance and refactor ConfigScreen with Animations and better redirecting
- [ ] implement 'don't show hints again' with setting updateHintDateString to date in the far future
- [ ] implement sound for SelectorButton click (success/fail)
- [ ] animate skip word in ProgessBar

# react-native-animated-miclevel
