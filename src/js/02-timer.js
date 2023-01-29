import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const COUNTDOWN_INTERVAL_MS = 1000;

const startBtn = document.querySelector('button');
const dateInput = document.querySelector('#datetime-picker');
const daysEl = document.querySelector('span[data-days]');
const hoursEl = document.querySelector('span[data-hours]');
const minutesEl = document.querySelector('span[data-minutes]');
const secondsEl = document.querySelector('span[data-seconds]');

let startTimeMs = 0;
let timeLeftMs = 0;

startBtn.disabled = true;

flatpickr('#datetime-picker', {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose: onDatepickerClose,
});
startBtn.addEventListener('click', startCountdown);

function startCountdown() {
  startBtn.disabled = true;
  dateInput.disabled = true;

  notifyTimerProgress('Countdown started!');

  timeLeftMs = startTimeMs - Date.now();
  updateCounter(convertMs(timeLeftMs));

  const interval = setInterval(() => {
    timeLeftMs -= COUNTDOWN_INTERVAL_MS;

    if (timeLeftMs <= 0) {
      startBtn.disabled = false;
      dateInput.disabled = false;

      notifyTimerProgress('Countdown completed!');

      clearInterval(interval);
    } else {
      updateCounter(convertMs(timeLeftMs));
    }
  }, COUNTDOWN_INTERVAL_MS);
}

function updateCounter({ days, hours, minutes, seconds }) {
  daysEl.innerText = days.toString().padStart(2, '0');
  hoursEl.innerText = hours.toString().padStart(2, '0');
  minutesEl.innerText = minutes.toString().padStart(2, '0');
  secondsEl.innerText = seconds.toString().padStart(2, '0');
}

function onDatepickerClose([date]) {
  startTimeMs = date.valueOf();
  timeLeftMs = startTimeMs - Date.now();

  if (timeLeftMs <= 0) {
    startBtn.disabled = true;

    updateCounter(convertMs(0));
    notifyPastDate();
  } else {
    startBtn.disabled = false;

    updateCounter(convertMs(timeLeftMs));
  }
}

function notifyPastDate() {
  const convertedTime = convertMs(timeLeftMs);
  const timeBehindStr = Object.entries(convertedTime).reduce(
    (str, [key, value]) => {
      if (value + 1 < 0) {
        str += `${Math.abs(value + 1)} ${key} `;
      }
      return str;
    },
    ''
  );

  Notify.failure(
    `Please choose a date in the future!\nSelected date/time is <b>${timeBehindStr}</b> in the past.`,
    {
      timeout: 15 * 1000,
      clickToClose: true,
      plainText: false,
      showOnlyTheLastOne: true,
    }
  );
}

function notifyTimerProgress(msg) {
  Notify.success(msg, {
    clickToClose: true,
    showOnlyTheLastOne: true,
  });
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
