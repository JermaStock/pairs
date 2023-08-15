export default class Timer {
  constructor(container, endGame) {
    this.endGame = endGame;
    this.container = container;
    this.countDown = 60;
    this.timeLeft = 60;
    this.displayTimer();
    this.start();
  }

  set countDown(value) {
    this._countDown = value;
    if (this.timerDisplay) {
      this.timerDisplay.textContent = `Осталось времени: ${value} сек.`;
    }
  }

  get countDown() {
    return this._countDown;
  }

  start() {
    this.timer = setInterval(() => {
      this.countDown--;
      if (this.countDown <= 0) {
        clearInterval(this.timer);
        this.endGame();
        return;
      }
    }, 1000);
  }

  stop() {
    clearInterval(this.timer);
  }

  diff() {
    return (this.timeLeft = this.timeLeft - (this.timeLeft - this.countDown));
  }

  displayTimer() {
    const timerDisplay = document.createElement('div');
    // timerDisplay.style.minWidth = '490px';
    // timerDisplay.style.position = 'absolute';
    // timerDisplay.style.top = '0px';
    // timerDisplay.style.userSelect = 'none';
    timerDisplay.classList.add('timer', 'text-center');

    this.container.prepend(timerDisplay);

    this.timerDisplay = timerDisplay;
    this.timerDisplay.textContent = `Осталось времени: ${this.countDown} сек.`;

    return timerDisplay;
  }
}
