import { Notify } from 'notiflix/build/notiflix-notify-aio';

const form = document.querySelector('form');
const promises = [];

form.addEventListener('submit', ev => {
  const { step, amount, delay, submit } = ev.target.elements;

  ev.preventDefault();

  submit.disabled = true; // avoid unexpected multiple promises creatin

  const stepMs = +step.value;
  const delayMs = +delay.value;

  for (let i = 1; i <= amount.value; i++) {
    promises.push(
      createPromise(i, i * stepMs + delayMs)
        .then(({ position, delay }) => {
          console.log(`✅ Fulfilled promise ${position} in ${delay}ms`);
          Notify.success(`✅ Fulfilled promise ${position} in ${delay}ms`);
        })
        .catch(({ position, delay }) => {
          console.log(`❌ Rejected promise ${position} in ${delay}ms`);
          Notify.failure(`❌ Rejected promise ${position} in ${delay}ms`);
        })
    );
  }

  Promise.allSettled(promises).then(() => {
    submit.disabled = false;
    promises.length = 0;
  });
});

function createPromise(position, delay) {
  return new Promise((resolve, reject) => {
    const shouldResolve = Math.random() > 0.3;

    setTimeout(() => {
      shouldResolve
        ? resolve({ position, delay })
        : reject({ position, delay });
    }, delay);
  });
}
