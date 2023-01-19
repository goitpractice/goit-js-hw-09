/*
Напиши скрипт, який після натискання кнопки «Start», 
раз на секунду змінює колір фону <body> на випадкове значення, використовуючи інлайн стиль.
Натисканням на кнопку «Stop» зміна кольору фону повинна зупинятися.
*/

let activeInterval;
const changeIntervalMs = 1000;
const [startBtn, stopBtn] = document.querySelectorAll('button');

document.body.addEventListener('click', ev => {
  if ('start' in ev.target.dataset) {
    startColorChange();
    startBtn.disabled = true;
    stopBtn.disabled = false;
  }

  if ('stop' in ev.target.dataset) {
    stopColorChange();
    startBtn.disabled = false;
    stopBtn.disabled = true;
  }
});

function startColorChange() {
  activeInterval = setInterval(
    () =>
      document.body.setAttribute(
        'style',
        `background-color: ${getRandomHexColor()};`
      ),
    changeIntervalMs
  );
}

function stopColorChange() {
  clearInterval(activeInterval);
}

function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}
