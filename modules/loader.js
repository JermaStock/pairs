export default function () {
  const spinner = document.createElement('div');
  const title = document.createElement('div');
  const icon = document.createElement('div');
  spinner.style.maxWidth = '320px';
  spinner.style.userSelect = 'none';
  spinner.classList.add('abs');
  icon.classList.add('spinner-border', 'text-primary');
  icon.style.width = '80px';
  icon.style.height = '80px';
  title.classList.add('mb-2');
  title.style.fontSize = '1.4rem';
  title.textContent = 'Готовим игровое поле ...';
  spinner.append(title);
  spinner.append(icon);
  return spinner;
}
