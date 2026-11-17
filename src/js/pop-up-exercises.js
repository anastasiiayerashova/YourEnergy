import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { fetchExerciseById } from './exercises-api.js';
import { openRatingModal } from './pop-up-rating.js';

const filtersContainer = document.querySelector('.filters-container');

// Поточна вправа в модалці - знадобиться для "Add to favorites" та "Give a rating"
export let currentExercise = null;

// ==========================================
// 1. Створюємо backdrop один раз і додаємо в body
// ==========================================
const backdrop = document.createElement('div');
backdrop.className = 'modal-backdrop is-hidden';
backdrop.innerHTML = `
  <div class="modal-exercise" role="dialog" aria-modal="true" aria-labelledby="modal-exercise-title">
    <button class="modal-close-btn" type="button" aria-label="Close modal">
      <svg width="24" height="24" class="modal-close-icon">
        <use href="./img/sprite.svg#icon-x-close"></use>
      </svg>
    </button>
    <div class="modal-exercise-content"></div>
  </div>
`;
document.body.append(backdrop);

const modalContent = backdrop.querySelector('.modal-exercise-content');
const closeBtn = backdrop.querySelector('.modal-close-btn');

// ==========================================
// 2. Відкриття по кліку на Start (делегування)
// ==========================================
if (filtersContainer) {
  filtersContainer.addEventListener('click', onStartBtnClick);
}

async function onStartBtnClick(event) {
  const startBtn = event.target.closest('.exercise-start-btn');
  if (!startBtn) return;

  const card = startBtn.closest('.exercise-card');
  const id = card?.dataset.id;
  if (!id) return;

  startBtn.disabled = true;

  try {
    const exercise = await fetchExerciseById(id);
    showExerciseModal(exercise);
  }
  catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Failed to load exercise. Please try again later.',
      position: 'topRight',
    });
  }
  finally {
    startBtn.disabled = false;
  }
}

// ==========================================
// 3. Відкриття / закриття
// ==========================================
function showExerciseModal(exercise) {
  currentExercise = exercise;
  modalContent.innerHTML = createModalMarkup(exercise);
  openModal();
}

function openModal() {
  backdrop.classList.remove('is-hidden');
  document.body.classList.add('no-scroll');
  document.addEventListener('keydown', onEscPress);
}

// Тимчасово ховає модалку (без скидання currentExercise) - для переходу в модалку рейтингу
function hideModal() {
  backdrop.classList.add('is-hidden');
  document.removeEventListener('keydown', onEscPress);
}

function closeModal() {
  backdrop.classList.add('is-hidden');
  document.body.classList.remove('no-scroll');
  document.removeEventListener('keydown', onEscPress);
  currentExercise = null;
}

function onEscPress(event) {
  if (event.key === 'Escape') closeModal();
}

closeBtn.addEventListener('click', closeModal);

// ==========================================
// Give a rating: ховаємо модалку вправи -> відкриваємо модалку рейтингу
// ==========================================
modalContent.addEventListener('click', event => {
  if (!event.target.closest('.modal-rating-btn') || !currentExercise) return;

  const exercise = currentExercise;
  hideModal();

  openRatingModal({
    id: exercise._id,
    // Закрили рейтинг без відправки -> повертаємось до тієї ж вправи
    onClose: () => showExerciseModal(exercise),
    // Рейтинг відправлено -> показуємо вправу з оновленим рейтингом
    onSuccess: updated => showExerciseModal({ ...exercise, ...updated }),
  });
});

// Клік по затемненню (але не по самій модалці)
backdrop.addEventListener('click', event => {
  if (event.target === backdrop) closeModal();
});

// ==========================================
// 4. Розмітка
// ==========================================
function createModalMarkup({
  name,
  gifUrl,
  rating,
  target,
  bodyPart,
  equipment,
  popularity,
  burnedCalories,
  time,
  description,
}) {
  return `
    <div class="modal-exercise-img-wrapper">
      <img class="modal-exercise-img" src="${gifUrl}" alt="${escapeHTML(name)}" />
    </div>

    <div class="modal-exercise-info">
      <h3 class="modal-exercise-title" id="modal-exercise-title">${escapeHTML(capitalize(name))}</h3>

      <div class="modal-exercise-rating">
        <span class="modal-exercise-rating-value">${Number(rating).toFixed(1)}</span>
        <div class="modal-exercise-stars">${createStarsMarkup(rating)}</div>
      </div>

      <ul class="modal-exercise-details">
        ${createDetailItem('Target', target)}
        ${createDetailItem('Body Part', bodyPart)}
        ${createDetailItem('Equipment', equipment)}
        ${createDetailItem('Popular', popularity)}
        ${createDetailItem('Burned Calories', `${burnedCalories}/${time} min`)}
      </ul>

      <p class="modal-exercise-desc">${escapeHTML(description)}</p>

      <div class="modal-exercise-btns">
        <button class="modal-exercise-btn modal-favorites-btn" type="button">
          Add to favorites
          <svg width="18" height="18" class="modal-heart-icon" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
        <button class="modal-exercise-btn modal-rating-btn" type="button">
          Give a rating
        </button>
      </div>
    </div>
  `;
}

function createDetailItem(label, value) {
  return `
    <li class="modal-exercise-details-item">
      <p class="modal-exercise-details-label">${label}</p>
      <p class="modal-exercise-details-value">${escapeHTML(capitalize(String(value)))}</p>
    </li>
  `;
}

// 5 зірок: перші Math.round(rating) - жовті, решта - сірі
function createStarsMarkup(rating) {
  const filled = Math.round(rating);
  let markup = '';

  for (let i = 1; i <= 5; i++) {
    markup += `
      <svg width="18" height="18" class="modal-star-icon ${i <= filled ? 'is-active' : ''}">
        <use href="./img/sprite.svg#star-icon"></use>
      </svg>
    `;
  }
  return markup;
}

function capitalize(str = '') {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function escapeHTML(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}