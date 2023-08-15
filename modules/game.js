import { Card, AmazingCard, loadImageError } from '../modules/card.js';
import Timer from '../modules/timer.js';
import { modal } from '../modules/modal.js';
import loader from '../modules/loader.js';

const spinner = loader();
const cardsArray = [];
let buffer = [];
let pairs, maxPairs;
let timer;
let gameField;
let gameSettings;
let amazingCards;
let validGameMode;

export default function startGame(
  container,
  cardsCount,
  createGameSettings,
  gameMode,
  validGameRules,
) {
  let cardsNumberArray = [];
  let cardsImgArray = [];
  maxPairs = cardsCount ** 2 / 2;
  pairs = 0;
  gameField = container;
  gameSettings = createGameSettings;
  amazingCards = gameMode;
  validGameMode = validGameRules;

  for (let i = 1; i <= maxPairs; i++) {
    cardsNumberArray.push(i, i);
    if (gameMode) {
      cardsImgArray.push(`/img/${i}.jpg`);
    }
  }

  cardsNumberArray = shuffle(cardsNumberArray);
  changeSizeOfFields(cardsCount);

  const flipMode =
    validGameRules === 'timeout' ? debounceCards(timeoutFlip) : noTimeoutFlip;

  if (gameMode) {
    container.append(spinner);
    Promise.all(
      cardsImgArray.map((src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = function () {
            resolve(img);
          };
          img.onerror = function () {
            img.style.height = '100%';
            img.src = './img/default.jpg';
            reject(new loadImageError('Не удалось загрузить изображение'));
          };
          img.src = src;
        });
      }),
    )
      .then((cardsImgArray) => {
        for (const cardsNumber of cardsNumberArray) {
          const card = new AmazingCard(
            document.getElementById('game-desk'),
            cardsNumber,
            flipMode,
            cardsImgArray,
          );
          cardsArray.push(card);
        }
        timer = new Timer(container, endGame);
      })
      .catch((err) => {
        console.log(err);
        if (err instanceof loadImageError) {
          document.body.append(
            modal({
              title:
                'Упс, некоторые картинки не смогли загрузиться &#9785; </br> Попробуйте снова через некоторое время...',
              pair: pairs,
              gameMode: amazingCards,
              restartGame,
              validGameMode,
            }),
          );
        } else {
          throw err;
        }
      })
      .finally(() => {
        spinner.remove();
      });
  } else {
    for (const cardsNumber of cardsNumberArray) {
      const card = new Card(
        document.getElementById('game-desk'),
        cardsNumber,
        flipMode,
      );
      cardsArray.push(card);
    }
    timer = new Timer(container, endGame);
  }

  document.getElementById('game-title').style.display = 'none';
  gameField.classList.add('game-height-adjust');
}

function timeoutFlip(card) {
  card.open = true;
  card.cardNumber = card.cardNumber;

  if (buffer.length < 2 && !buffer.includes(card)) {
    buffer.push(card);
    if (buffer.length === 2 && buffer[0].cardNumber === buffer[1].cardNumber) {
      buffer[0].success = true;
      buffer[1].success = true;
      buffer = [];
      ++pairs;
      if (pairs === maxPairs) {
        setTimeout(() => {
          winGame();
        }, 200);
      }
    } else if (buffer.length === 2) {
      return {
        debounceState: true,
        debounceObject: {
          buffer,
        },
      };
    }
  }
  return {
    debounceState: false,
    debounceObject: {
      buffer,
    },
  };
}

function noTimeoutFlip(card) {
  if (buffer.length < 3 && !buffer.includes(card)) {
    buffer.push(card);
    if (buffer.length === 2 && buffer[0].cardNumber === buffer[1].cardNumber) {
      buffer[0].success = true;
      buffer[1].success = true;
      buffer = [];
      ++pairs;
      if (pairs === maxPairs) {
        winGame();
      }
    } else if (buffer.length === 3) {
      buffer[0].open = !buffer[0].open;
      buffer[0].cardNumber = buffer[0].cardNumber;
      buffer[1].open = !buffer[1].open;
      buffer[1].cardNumber = buffer[1].cardNumber;
      buffer.splice(0, 2);
    }
  }

  card.open = true;
  card.cardNumber = card.cardNumber;
}

function shuffle(arr) {
  let array = arr;
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

function changeSizeOfFields(cardsCount) {
  const deck = document.getElementById('game-desk');
  switch (cardsCount) {
    case '2': {
      deck.classList.add('game-desk-small');
      break;
    }
    case '4': {
      deck.classList.add('game-desk-medium');
      break;
    }
    case '6': {
      deck.classList.add('game-desk-big');
      break;
    }
    case '8': {
      deck.classList.add('game-desk-large');
      break;
    }
    case '10': {
      deck.classList.add('game-desk-xxl');
      break;
    }
  }
}

function endGame() {
  for (const card of cardsArray) {
    card.open = true;
    card.cardNumber = card.cardNumber;
  }
  document.body.append(
    modal({
      title: 'Вы проиграли!',
      pair: pairs,
      timeLeft: timer.diff(),
      amazingCards,
      restartGame,
      validGameMode,
    }),
  );
}

function winGame() {
  timer.stop();
  gameField.classList.add('game-complete');
  document.body.append(
    modal({
      title: 'Вы выиграли!',
      pair: pairs,
      timeLeft: timer.diff(),
      amazingCards,
      restartGame,
      validGameMode,
    }),
  );
}

function restartGame() {
  document.getElementById('game-title').style.display = '';
  gameField.classList.remove('game-complete', 'game-height-adjust');
  gameField.innerHTML = '';
  const desk = document.createElement('div');
  desk.id = 'game-desk';
  gameField.append(desk);
  gameField.append(gameSettings(gameField));
}

function debounceCards(func, ms = 350) {
  let isCooldown = false;
  let isCardOpenningDelayed = false;
  return function (...args) {
    if (isCooldown) {
      return;
    }

    let result = func.apply(this, args);
    if (result.debounceState) {
      isCardOpenningDelayed = true;
      isCooldown = true;
    }

    if (isCardOpenningDelayed) {
      setTimeout(() => {
        let innerBuffer = result.debounceObject.buffer;
        innerBuffer[0].open = !innerBuffer[0].open;
        innerBuffer[0].cardNumber = innerBuffer[0].cardNumber;
        innerBuffer[1].open = !innerBuffer[1].open;
        innerBuffer[1].cardNumber = innerBuffer[1].cardNumber;
        innerBuffer.splice(0, innerBuffer.length);
        isCardOpenningDelayed = false;
        isCooldown = false;
      }, ms);
    }
  };
}
