import { fetchExercises, fetchFilters } from './exercises-api.js';
import { renderFilters, renderExercises, renderPagination } from './filters.js';

const state = {
  filter: 'Muscles',
  page: 1,
  limit: 12,
  totalPages: 1,

  currentView: 'filters',
  selectedCategory: null
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


async function loadExercisesData() {
  try {
    const data = await fetchExercises({
      filterName: state.filter,
      categoryName: state.selectedCategory,
      page: state.page,
      limit: 10
    });

    state.totalPages = data.totalPages;
    renderExercises(data.results, state.selectedCategory);
    renderPagination(state.totalPages, state.page);
  }
  catch (error) {
    console.error('Error in loadExercisesData:', error);
  }
}


if (buttonsList) {
  buttonsList.addEventListener('click', (event) => {
    const clickedButton = event.target.closest('.exercises-btn');
    if (!clickedButton) return;

    document.querySelectorAll('.exercises-btn').forEach(btn => btn.classList.remove('active'));
    clickedButton.classList.add('active');

    state.filter = clickedButton.dataset.filter || clickedButton.textContent.trim();
    state.page = 1;
    state.currentView = 'filters';
    state.selectedCategory = null;

    const titleElement = document.querySelector('.section-exercises .title');
    if (titleElement) {
      titleElement.innerHTML = 'Exercises';
    }

    loadFiltersData();
  });
}

// if (filtersContainer) {
//   filtersContainer.addEventListener('click', (event) => {
//     const pageButton = event.target.closest('.pagination-btn');
//     if (!pageButton) return;

//     state.page = Number(pageButton.dataset.page);
//     loadFiltersData();

//     if (sectionExercises) {
//       sectionExercises.scrollIntoView({ behavior: 'smooth' });
//     }
//   });
// }


if (filtersContainer) {
  filtersContainer.addEventListener('click', (event) => {
    // Клик по карточке категории -> переходим к списку упражнений
    const filterCard = event.target.closest('.filter-card');
    if (filterCard) {
      const nameElement = filterCard.querySelector('.filter-name');
      if (!nameElement) return;

      state.selectedCategory = nameElement.textContent.trim();
      state.currentView = 'exercises';
      state.page = 1;

      loadExercisesData();

      if (sectionExercises) {
        sectionExercises.scrollIntoView({ behavior: 'smooth' });
      }

      return;
    }

    const pageButton = event.target.closest('.pagination-btn');
    if (pageButton) {
      state.page = Number(pageButton.dataset.page);

      if (state.currentView === 'filters') {
        loadFiltersData();
      } else {
        loadExercisesData();
      }

      if (sectionExercises) {
        sectionExercises.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
}


loadFiltersData();