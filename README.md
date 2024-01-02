# Practical Functional Programming - Total recall project

## About this project
This is the first project of the practical FP course.

During the first module, we got familiar with the heart of functional programming: pure functions. This project's goal is to put the concepts we learned into practice in 2 aspects:
1. Technical - writing pure functions and avoiding mutations using the availabe JavaScript features
2. Architectural - how to split the code around side effects, create a functional core with an imperative shell

The project is written in plain TypeScript to avoid framework specific solutions or knowledge requirements.

## Getting started
It's recommended you fork this repo before clonning to be able to commit and push your progress to github as you work.

After you clone the project, run the following commands:
```bash
npm i
npm run dev
```
This will install the necessary depepndencies and start the development server. You can see the app by browsing to the URL: http://127.0.0.1:3000

You can import the "English - Portuguese.csv" deck in this repo to get started.

## The assignment
1. Refactor - start by refactoring the code in `main.ts` and `study.ts`. You goal here is to separate the app into a functional core and an imperative shell. You can extract the functional core into `model.ts` or separate to files as you please. Just make sure to have a clear distinction between the 2 concerns - some files are part of the shell and will contain all the impure code while others are part of the cure and should only contain pure code. The shell can call into the core but the core mustn't call into the shell.
2. Feature request - in the study page, the feedback buttons should indicate how much time (in days) will pass until the next review when you press the button. If the button looks too crammed with all the info, just still it in the button's title so it shows up on hover. Think about if it would have been easier or harder to implement before refactoring.
3. Bonus - write some tests, enjoy the easness of testing pure code :) Good candidates for testing are the SM-2 algorithm and the importing algorithm (which doesn't handle almost any edge case currently)

## What is SRS?
SRS stands for "Spaced Repetition System".

A SRS is used to help memorise and review learned information. It is designed to reduce the "forgetting curve" and optimizing the amount of required reviews. It does so by prompting a review right before the information is forgotten by the user. SRS usually use cards to hold the information - the front of a card usually has some kind of question or data associated with the reviewed information, and the back of the card has the information to be reviewd. The flow of study is: looking at the front of the card, trying to recall the info from the back of the card, flipping the card to check if you were right. After checking the answer, your effort to recall is graded and the grade decides on the interval until the next review.

While spaced repetition could be implemented phisically, it is naturally easier digitally - hence our app "Total recall".

## About this app
Total recall uses a famous SRS algorithm called Super Memo 2 (SM-2). You can easily find the full details in various sources. Basically, grading is subjective (done by the user) and the scale is 0 - 5; where 0 is "total blackout" and 5 is "perfect recall". Grades 0-2 represent failure to recall to various degrees, while 3-5 represnt successful recall with varying dificullty.

Our app divides cards to different decks. Every day, 5 new cards are added to the review session. Review is continued until all the cards are recalled succesfully and have more the one day until their next review.

There is no option to create decks and cards in the app, but it is possible to import a deck from a CSV file. All data is persisted to local storage.