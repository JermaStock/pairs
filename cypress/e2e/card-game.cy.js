/// <reference types="cypress" />

// function findPair(firstCard, nextCard, totalPairs) {
//   firstCard.click();
//   nextCard.click();

//   firstCard.then((card) => {
//     if (card[0].classList.contains('success')) {
//       nextCard.should('have.class', 'success');

//       totalPairs -= 1;

//       if (!totalPairs) {
//         cy.get('#game').should('have.class', 'game-complete');
//       } else {
//         findPair(
//           cy.get('#game>.card').not('.success').first(),
//           cy.get('#game>.card').not('.success').first().next(),
//           totalPairs,
//         );
//       }
//     } else if (!card[0].classList.contains('success')) {
//       nextCard.should('not.have.class', 'is-open');
//       findPair(firstCard, nextCard.next(), totalPairs);
//     }
//   });
// }

function findPair(firstCard, nextCard) {
  firstCard.click();
  nextCard.click();

  firstCard.then((card) => {
    if (!card[0].classList.contains('success')) {
      findPair(firstCard, nextCard.next());
    } else {
      nextCard.should('have.class', 'success');
    }
  });
}

function hidePair(firstCard, nextCard) {
  firstCard.click();
  nextCard.click();

  firstCard.then((card) => {
    if (card[0].classList.contains('success')) {
      hidePair(
        cy.get('#game>.card').not('.success').first(),
        cy.get('#game>.card').not('.success').first().next(),
      );
    } else {
      nextCard.should('not.have.class', 'success');
    }
  });
}

// const DEFAULT_PAIR_AMOUNT = 8;

describe('example to-do app', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
    cy.contains('Начать игру').click();
  });

  it('В начальном состоянии игра должна иметь поле четыре на четыре клетки, в каждой клетке цифра должна быть невидима.', () => {
    cy.get('#game>.card').not('.success').should('have.length', 16);
  });

  it('В каждой клетке цифра должна быть невидима.', () => {
    cy.get('#game>.card').each((el) => {
      cy.wrap(el).get('.card-body').should('have.text', '');
    });
  });

  it('Карточка открывается', () => {
    cy.get('#game>.card').first().click();
    cy.get('#game>.card').first().get('.card-body').should('not.have.text', '');
  });

  it('Найденная пара карточек открывается и остается видимой', () => {
    findPair(
      cy.get('#game>.card').first(),
      cy.get('#game>.card').first().next(),
    );
  });

  it('В случае ненахождения пары, открытые карточки закрываются', () => {
    hidePair(
      cy.get('#game>.card').first(),
      cy.get('#game>.card').first().next(),
    );
  });

  // it('Игра проходит согласно правилам', () => {
  //   findPair(
  //     cy.get('#game>.card').first(),
  //     cy.get('#game>.card').first().next(),
  //     DEFAULT_PAIR_AMOUNT,
  //   );
  // });
});
