import createGameSettings from '../modules/settings.js';

const game = document.getElementById('game');
const desk = document.createElement('div');
desk.id = 'game-desk';
game.append(desk);
game.append(createGameSettings(game));
