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


export function renderPagination(totalPages, currentPage) {
  const paginationContainer = document.querySelector('.pagination-container');
  if (!paginationContainer) return;

  let paginationMarkup = '';
  for (let i = 1; i <= totalPages; i++) {
    paginationMarkup += `
      <button class="pagination-btn ${currentPage === i ? 'active-mode' : ''}" type="button" data-page="${i}">
        ${i}
      </button>
    `;
  }

  paginationContainer.innerHTML = paginationMarkup;
}