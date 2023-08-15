export class loadImageError extends SyntaxError {
  constructor(message) {
    super('failed to load image');
    this.message = message;
  }
}

export class Card {
  constructor(container, cardNumber, flip) {
    this.open = false;
    this.success = false;
    this.container = container;
    this.cardNumber = cardNumber;
    this.flip = flip;

    this.createElement();
  }

  createElement() {
    const card = document.createElement('div');
    const cardBody = document.createElement('div');
    const cardFront = document.createElement('div');
    const cardBack = document.createElement('div');

    card.classList.add('custom-card', 'text-white', 'mb-3');
    cardBody.classList.add('card-body');
    cardFront.classList.add(
      'custom-card__front',
      'card-title',
      'd-flex',
      'justify-content-center',
      'align-items-center',
    );
    cardBack.classList.add(
      'custom-card__back',
      'card-title',
      'd-flex',
      'justify-content-center',
      'align-items-center',
    );

    card.addEventListener('click', () => {
      if (this.success) {
        return;
      }
      this.flip(this);
    });

    card.append(cardBody);
    cardBody.append(cardFront, cardBack);
    this.container.append(card);

    this.card = card;
    this.cardBody = cardBody;
    this.cardValue = cardBack;

    return card;
  }

  set cardNumber(value) {
    this._cardNumber = value;
    if (this.cardValue && this.open) {
      this.cardValue.textContent = value;
      this.card.classList.add('is-open');
    } else if (this.cardValue && !this.open) {
      this.card.classList.remove('is-open');
      this.cardValue.textContent = '';
    }
  }

  get cardNumber() {
    return this._cardNumber;
  }

  set open(value) {
    this._open = value;
  }

  get open() {
    return this._open;
  }

  set success(value) {
    this._success = value;
    if (this.cardValue) {
      this.card.classList.remove('is-open');
      this.card.classList.add('success');
    }
  }

  get success() {
    return this._success;
  }
}

export class AmazingCard extends Card {
  constructor(container, cardNumber, flip, cardsImgArray) {
    super(container, cardNumber, flip);
    this.cardsImgArray = cardsImgArray;
  }

  set cardNumber(value) {
    this._cardNumber = value;
    if (this.cardValue && this.open && !this.cardValue.children.length) {
      this.card.classList.add('is-open');
      this.cardValue.appendChild(this.cardsImgArray[value - 1].cloneNode(true));
    } else if (this.cardValue && !this.open) {
      this.card.classList.remove('is-open');
      this.cardValue.textContent = '';
    }
  }

  get cardNumber() {
    return this._cardNumber;
  }
}
