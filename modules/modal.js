export function modal({
  title,
  pair,
  timeLeft = 0,
  gameMode,
  restartGame,
  validGameMode,
}) {
  console.log(arguments);
  const modal = document.createElement('div');
  const modalDialog = document.createElement('div');
  const modalContent = document.createElement('div');
  const modalHeader = document.createElement('div');
  const modalTitle = document.createElement('h5');
  const modalBody = document.createElement('div');
  const modalFooter = document.createElement('div');
  const btnRetry = document.createElement('button');

  modal.classList.add('modal');
  modal.style.display = 'block';
  modal.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
  modalDialog.classList.add('modal-dialog');
  modalDialog.style.backgroundColor = 'white';
  modalContent.classList.add('modal-content');
  modalHeader.classList.add('modal-header');
  modalTitle.classList.add('modal-title');
  modalBody.classList.add('modal-body');
  modalFooter.classList.add('modal-footer');
  btnRetry.classList.add('btn', 'btn-primary');
  btnRetry.type = 'button';

  modalTitle.innerHTML = title;
  modalBody.innerHTML = `Режим игры: ${
    gameMode ? 'Amazing Cards' : 'Обычный'
  } </br> Режим правил: ${validGameMode}
    </br> Найдено пар: ${pair} </br> Осталось времени: ${timeLeft} сек.`;
  btnRetry.textContent = 'Сыграть ещё раз';

  modal.append(modalDialog);
  modalDialog.append(modalContent);
  modalContent.append(modalHeader);
  modalHeader.append(modalTitle);
  modalContent.append(modalBody);
  modalContent.append(modalFooter);
  modalFooter.append(btnRetry);

  btnRetry.addEventListener('click', () => {
    modal.remove();
    restartGame();
  });

  return modal;
}
