import { validation, ValidationError } from '../modules/validation.js';
import startGame from '../modules/game.js';

export default function createGameSettings(container) {
  const wrapper = document.createElement('div');
  const form = document.createElement('form');
  const input = document.createElement('input');
  const inputCheckWrapper = document.createElement('div');
  const inputCheckLabel = document.createElement('label');
  const inputCheck = document.createElement('input');
  const errorBlock = document.createElement('div');
  const button = document.createElement('button');

  const tooltipMode = document.createElement('span');
  tooltipMode.classList.add('form__mode-tooltip');
  tooltipMode.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
  <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
  </svg>`;
  // eslint-disable-next-line no-undef
  tippy(tooltipMode, {
    content: 'AmazingCards - в этом режиме у карт вместо чисел будут картинки.',
  });

  const onThreeModeInput = document.createElement('input');
  const onTimeoutModeInput = document.createElement('input');
  onThreeModeInput.type = 'radio';
  onTimeoutModeInput.type = 'radio';
  onThreeModeInput.name = 'game-mode';
  onTimeoutModeInput.name = 'game-mode';
  onThreeModeInput.value = 'noTimeout';
  onTimeoutModeInput.value = 'timeout';
  onThreeModeInput.id = 'no-timeout-mode';
  onTimeoutModeInput.id = 'timeout-mode';
  onTimeoutModeInput.checked = true;

  const onThreeLabel = document.createElement('label');
  const onTimeoutLabel = document.createElement('label');
  onThreeLabel.setAttribute('for', 'no-timeout-mode');
  onTimeoutLabel.setAttribute('for', 'timeout-mode');
  onThreeLabel.textContent = 'Без таймера';
  onTimeoutLabel.textContent = 'По таймеру';

  const modeWrapper = document.createElement('div');
  const modeTitle = document.createElement('h5');
  const modeWrapperOnThreeModeInput = document.createElement('div');
  const modeWrapperOnTimeoutModeInput = document.createElement('div');
  modeTitle.textContent = 'Правила игры';
  modeWrapper.classList.add('form__rule-wrapper');
  modeTitle.classList.add('form__rule-title');

  const tooltipRule = document.createElement('span');
  tooltipRule.classList.add('form__mode-tooltip');
  tooltipRule.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
  <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
  </svg>`;
  // eslint-disable-next-line no-undef
  tippy(tooltipRule, {
    content:
      'Правила игры определяют как будут открываться карточки. "Без Таймера" - неугаданная пара закрывается при нажатии на третью. "По таймеру" - неугаданная пара закрывается автоматически',
  });

  modeTitle.append(tooltipRule);

  modeWrapper.append(
    modeTitle,
    modeWrapperOnThreeModeInput,
    modeWrapperOnTimeoutModeInput,
  );

  modeWrapperOnThreeModeInput.append(onThreeModeInput, onThreeLabel);
  modeWrapperOnTimeoutModeInput.append(onTimeoutModeInput, onTimeoutLabel);

  wrapper.classList.add('d-flex', 'justify-content-center');
  wrapper.style.width = '100%';
  form.classList.add('form', 'custom-form', 'text-center');
  inputCheckWrapper.classList.add('form-check', 'form-switch');
  inputCheckWrapper.style.paddingLeft = '1rem';
  inputCheckWrapper.style.textAlign = 'left';
  inputCheckLabel.classList.add('form-check-label');
  inputCheckLabel.style.color = 'whitesmoke';
  inputCheck.classList.add('form-check-input');
  inputCheck.style.float = 'none';
  inputCheck.style.marginLeft = '1rem';
  inputCheck.style.cursor = 'pointer';
  errorBlock.classList.add('mb-3');
  errorBlock.style.color = 'rgb(224, 10, 5)';
  errorBlock.style.fontWeight = '500';
  input.classList.add('form-control', 'mb-3');
  button.classList.add('btn', 'btn-primary');

  inputCheckLabel.for = 'flexSwitchCheckDefault';
  inputCheckLabel.textContent = 'Режим Amazing Cards';
  inputCheck.type = 'checkbox';
  inputCheck.id = 'flexSwitchCheckDefault';
  inputCheck.checked = true;
  input.name = 'card';
  input.type = 'number';
  input.placeholder = 'Количество карточек по вертикали/горизонтали';
  button.textContent = 'Начать игру';

  inputCheckLabel.append(tooltipMode);
  inputCheckWrapper.append(inputCheckLabel);
  inputCheckWrapper.append(inputCheck);
  form.append(input);
  form.append(inputCheckWrapper);
  form.append(modeWrapper);
  form.append(errorBlock);
  form.append(button);
  wrapper.append(form);

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    let validGameRules = [onThreeModeInput, onTimeoutModeInput]
      .filter((mode) => mode.checked)
      .map((input) => input.value)[0];

    errorBlock.textContent = '';
    try {
      validation(form);
    } catch (error) {
      if (error instanceof ValidationError) {
        errorBlock.textContent = error.fieldErros.name;
        return;
      } else {
        throw error;
      }
    }
    wrapper.remove();
    startGame(
      container,
      input.value || '4',
      createGameSettings,
      inputCheck.checked,
      validGameRules,
    );
  });

  return wrapper;
}
