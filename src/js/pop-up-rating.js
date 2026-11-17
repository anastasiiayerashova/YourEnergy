import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { addExerciseRating } from './exercises-api.js';

const EMAIL_PATTERN = /^\w+(\.\w+)?@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
const MAX_STARS = 5;

// Дані поточного відкриття: id вправи + колбеки від модалки вправи
let exerciseId = null;
let onCloseCallback = null;
let onSuccessCallback = null;
let selectedRate = 0;

// ==========================================
// 1. Створюємо backdrop один раз і додаємо в body
// ==========================================
const backdrop = document.createElement('div');
backdrop.className = 'modal-backdrop is-hidden';
backdrop.innerHTML = `
  <div class="modal-rating" role="dialog" aria-modal="true" aria-label="Give a rating">
    <button class="modal-close-btn" type="button" aria-label="Close modal">
      <svg width="24" height="24" class="modal-close-icon">
        <use href="./img/sprite.svg#icon-x-close"></use>
      </svg>
    </button>

    <form class="rating-form" novalidate>
      <p class="rating-form-label">Rating</p>
      <div class="rating-form-stars-wrapper">
        <span class="rating-form-value">0.0</span>
        <div class="rating-form-stars">${createStarButtons()}</div>
      </div>

      <input
        class="rating-form-input"
        type="email"
        name="email"
        placeholder="Email"
        autocomplete="email"
      />
      <textarea
        class="rating-form-textarea"
        name="review"
        placeholder="Your comment"
      ></textarea>

      <button class="rating-form-submit" type="submit">Send</button>
    </form>
  </div>
`;
document.body.append(backdrop);

const form = backdrop.querySelector('.rating-form');
const closeBtn = backdrop.querySelector('.modal-close-btn');
const starsContainer = backdrop.querySelector('.rating-form-stars');
const starButtons = backdrop.querySelectorAll('.rating-star-btn');
const rateValueEl = backdrop.querySelector('.rating-form-value');
const submitBtn = backdrop.querySelector('.rating-form-submit');

// ==========================================
// 2. Відкриття / закриття (експортуємо для модалки вправи)
// ==========================================
export function openRatingModal({ id, onClose, onSuccess }) {
  exerciseId = id;
  onCloseCallback = onClose;
  onSuccessCallback = onSuccess;

  resetForm();
  backdrop.classList.remove('is-hidden');
  document.body.classList.add('no-scroll');
  document.addEventListener('keydown', onEscPress);
}

// result === null -> користувач просто закрив модалку
// result === оновлена вправа -> рейтинг успішно відправлено
function closeRatingModal(result = null) {
  backdrop.classList.add('is-hidden');
  document.body.classList.remove('no-scroll');
  document.removeEventListener('keydown', onEscPress);

  const callback = result ? onSuccessCallback : onCloseCallback;
  exerciseId = null;
  onCloseCallback = null;
  onSuccessCallback = null;

  if (typeof callback === 'function') callback(result);
}

function onEscPress(event) {
  if (event.key === 'Escape') closeRatingModal();
}

closeBtn.addEventListener('click', () => closeRatingModal());

backdrop.addEventListener('click', event => {
  if (event.target === backdrop) closeRatingModal();
});

// ==========================================
// 3. Зірки: клік обирає оцінку, наведення - підсвічує
// ==========================================
starsContainer.addEventListener('click', event => {
  const star = event.target.closest('.rating-star-btn');
  if (!star) return;

  selectedRate = Number(star.dataset.value);
  paintStars(selectedRate);
});

starsContainer.addEventListener('mouseover', event => {
  const star = event.target.closest('.rating-star-btn');
  if (star) paintStars(Number(star.dataset.value));
});

starsContainer.addEventListener('mouseleave', () => paintStars(selectedRate));

function paintStars(value) {
  rateValueEl.textContent = value.toFixed(1);

  starButtons.forEach(btn => {
    const isActive = Number(btn.dataset.value) <= value;
    btn.classList.toggle('is-active', isActive);
    btn.setAttribute('aria-pressed', Number(btn.dataset.value) === selectedRate);
  });
}

function createStarButtons() {
  let markup = '';
  for (let i = 1; i <= MAX_STARS; i++) {
    markup += `
      <button class="rating-star-btn" type="button" data-value="${i}"
              aria-label="Rate ${i} out of ${MAX_STARS}" aria-pressed="false">
        <svg width="24" height="24" class="rating-star-icon">
          <use href="./img/sprite.svg#star-icon"></use>
        </svg>
      </button>
    `;
  }
  return markup;
}

// ==========================================
// 4. Відправка форми
// ==========================================
form.addEventListener('submit', onSubmit);

async function onSubmit(event) {
  event.preventDefault();

  const email = form.elements.email.value.trim();
  const review = form.elements.review.value.trim();

  if (!selectedRate) {
    showToast('Please select a rating from 1 to 5.');
    return;
  }

  if (!EMAIL_PATTERN.test(email)) {
    showToast('Please enter a valid email, e.g. test@gmail.com');
    return;
  }

  if (!review) {
    showToast('Please write a comment.');
    return;
  }

  submitBtn.disabled = true;

  try {
    const updatedExercise = await addExerciseRating(exerciseId, {
      rate: selectedRate,
      email,
      review,
    });

    iziToast.success({
      title: 'Success',
      message: 'Thank you! Your rating has been sent.',
      position: 'topRight',
    });

    closeRatingModal(updatedExercise);
  }
  catch (error) {
    handleError(error);
  }
  finally {
    submitBtn.disabled = false;
  }
}

function handleError(error) {
  if (!error.response) {
    showToast('Network error. Please check your connection and try again.');
    return;
  }

  const { status, data } = error.response;

  switch (status) {
    case 400:
      showToast(data?.message || 'Invalid data. Please check the form and try again.');
      break;
    case 404:
      showToast('Such exercise not found.');
      break;
    case 409:
      showToast(data?.message || 'You have already rated this exercise with this email.', 'warning');
      break;
    default:
      showToast('Server error. Please try again later.');
  }
}

function showToast(message, type = 'error') {
  iziToast[type]({
    title: type === 'warning' ? 'Warning' : 'Error',
    message,
    position: 'topRight',
  });
}

function resetForm() {
  form.reset();
  selectedRate = 0;
  paintStars(0);
}