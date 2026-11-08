import { fetchFilters } from './exercises-api.js';
import { renderFilters, renderPagination } from './filters.js';

const state = {
  filter: 'Muscles',
  page: 1,
  limit: 12,
  totalPages: 1,
};

const buttonsList = document.querySelector('.buttons-list');
const filtersContainer = document.querySelector('.filters-container');
const sectionExercises = document.querySelector('.section-exercises');

document.addEventListener('DOMContentLoaded', () => {
  const exercisesBtns = document.querySelectorAll('.exercises-btn');

  exercisesBtns.forEach(btn => {
  btn.addEventListener('click', (event) => {
    // Знімаємо клас active з усіх кнопок
    exercisesBtns.forEach(b => b.classList.remove('active'));

    // Додаємо клас active тільки тій кнопці, на яку клікнули
    event.currentTarget.classList.add('active');
  });
});
});


// Главная функция для загрузки и отрисовки данных
async function loadFiltersData() {
  try {
    const data = await fetchFilters({
      filter: state.filter,
      page: state.page,
      limit: state.limit,
    });

    state.totalPages = data.totalPages;

    renderFilters(data.results);
    renderPagination(state.totalPages, state.page);
  } catch (error) {
    console.error(error);
  }
}

// Слушатель кликов по кнопкам категорий (Muscles, Body parts, Equipment)
if (buttonsList) {
  buttonsList.addEventListener('click', (event) => {
    const clickedButton = event.target.closest('.exercises-btn');
    if (!clickedButton) return;

    document.querySelectorAll('.exercises-btn').forEach(btn => btn.classList.remove('active'));
    clickedButton.classList.add('active');

    // Безопаснее брать значение из data-атрибута, либо textContent
    state.filter = clickedButton.dataset.filter || clickedButton.textContent.trim();
    state.page = 1; // Сбрасываем на 1-ю страницу

    loadFiltersData();
  });
}

if (filtersContainer) {
  filtersContainer.addEventListener('click', (event) => {
    const pageButton = event.target.closest('.pagination-btn');
    if (!pageButton) return;

    state.page = Number(pageButton.dataset.page);
    loadFiltersData();

    if (sectionExercises) {
      sectionExercises.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

loadFiltersData();