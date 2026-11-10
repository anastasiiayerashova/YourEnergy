import { fetchExercises } from './exercises-api.js';
import { renderExercises, renderPagination } from './filters.js';

export function initSearch(state) {
  const searchFormContainer = document.querySelector('.exercises-search-form-container');
  const searchForm = document.querySelector('.exercises-search-form');
  const searchInput = document.querySelector('.search-input');
  const sectionExercises = document.querySelector('.section-exercises');

  if (!searchForm || !searchFormContainer) return;

  window.updateSearchFormVisibility = function (currentView) {
    if (currentView === 'exercises') {
      searchFormContainer.style.display = 'block';
    }
    else {
      searchFormContainer.style.display = 'none';
      searchInput.value = '';
    }
  };

  searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const keyword = searchInput.value.trim();
    if (!keyword) return;

    state.page = 1;

    try {
      const data = await fetchExercises({
        filterName: state.filter,
        categoryName: state.selectedCategory,
        keyword: keyword,
        page: state.page,
        limit: 10
      });

      state.totalPages = data.totalPages;

      renderExercises(data.results, state.selectedCategory);
      renderPagination(state.totalPages, state.page);

      if (sectionExercises) {
        sectionExercises.scrollIntoView({ behavior: 'smooth' });
      }
    }
    catch (error) {
      console.error('Error searching exercises:', error);
    }
  });
}