const filtersContainer = document.querySelector('.filters-container');


export function renderFilters(results) {
  const markup = results
    .map(
      ({ name, filter, imgURL }) => `
      <li class="filter-card" style="background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${imgURL}');">
        <div class="filter-card-content">
          <p class="filter-category">${filter}</p>
          <p class="filter-name">${name}</p>
        </div>
      </li>
    `
    )
    .join('');

  filtersContainer.innerHTML = `
    <ul class="filters-card-list">
      ${markup}
    </ul>
    <div class="pagination-container"></div>
  `;
}


export function renderExercises(results, categoryTitle) {
  const titleElement = document.querySelector('.section-exercises .title');
  if (titleElement) {
    titleElement.innerHTML = `Exercises <span class="exercises-subtitle">/ ${categoryTitle}</span>`;
  }

  const markup = results
    .map(
      ({ _id, burnedCalories, name, bodyPart, target, rating }) => `
      <li class="exercise-card" data-id="${_id}">
        <div class="exercise-card-header">
          <div class="exercise-card-header-workout">
            <div class="exercise-card-badge">WORKOUT</div>
            <div class="exercise-card-rating">
              <span>${rating.toFixed(1)}</span>
              <svg width="12" height="12" class="exercise-star-icon">
                <use href="./img/sprite.svg#star-icon"></use>
              </svg>
            </div>
          </div>
          <button class="exercise-start-btn" type="button">
            Start <svg width="16" height="16" class="arrow-icon-exercises-catalog"><use href="./img/sprite.svg#arrow-icon-exercises-catalog"></use></svg>
          </button>
        </div>
        <div class="exercise-card-body">
          <div class="exercise-icon-container">
            <svg width="18" height="20" class="exercise-running-man-icon">
              <use href="./img/sprite.svg#running-man-icon"></use>
            </svg>
          </div>
          <h3 class="exercise-name">${name.charAt(0).toUpperCase() + name.slice(1)}</h3>
        </div>
        <div class="exercise-card-footer">
          <p class="exercise-info">Burned calories: <span>${burnedCalories}</span></p>
          <p class="exercise-info">Body part: <span>${bodyPart.charAt(0).toUpperCase() + bodyPart.slice(1)}</span></p>
          <p class="exercise-info">Target: <span>${target.charAt(0).toUpperCase() + target.slice(1)}</span></p>
        </div>
      </li>
    `
    )
    .join('');

  filtersContainer.innerHTML = `
  <ul class="exercises-card-list">
      ${markup}
    </ul>
    <div class="pagination-container"></div>
  `;
}


export function renderPagination(totalPages, currentPage) {
  const paginationContainer = document.querySelector('.pagination-container');
  if (!paginationContainer) return;

  // Якщо лише 1 сторінка або менше, пагінація не потрібна
  if (totalPages <= 1) {
    paginationContainer.innerHTML = '';
    return;
  }

  let paginationMarkup = '';

  // Функція створення кнопки
  const createBtn = (page, isActive = false, isDisabled = false) => `
    <button class="pagination-btn ${isActive ? 'active-mode' : ''}"
            type="button"
            data-page="${page}"
            ${isDisabled ? 'disabled' : ''}>
      ${page}
    </button>
  `;

  // Логіка розумного відображення сторінок
  let pages = [];

  if (totalPages <= 7) {
    // Якщо сторінок мало (до 7), показуємо все
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Якщо сторінок багато, показуємо першу, останню, поточну та сусідів
    if (currentPage <= 4) {
      pages = [1, 2, 3, 4, 5, '...', totalPages];
    } else if (currentPage >= totalPages - 3) {
      pages = [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    } else {
      pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
    }
  }

  // Збираємо розмітку
  paginationMarkup = pages.map(page => {
    if (page === '...') {
      return `<span class="pagination-dots">...</span>`;
    }
    return createBtn(page, page === currentPage);
  }).join('');

  paginationContainer.innerHTML = paginationMarkup;
}