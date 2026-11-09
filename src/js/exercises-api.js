import axios from 'axios';

axios.defaults.baseURL = 'https://your-energy.b.goit.study/api';


export async function getQuoteOfTheDay() {
  try {
    const response = await axios.get('/quote');
    return response.data;
  }
  catch (error) {
    console.error('Помилка при завантаженні цитати дня:', error);
    throw error;
  }
}


export async function fetchFilters({ filter, page = 1, limit = 12 }) {
  try {
    const response = await axios.get('/filters', {
      params: {
        filter,
        page,
        limit,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching filters:', error);
    throw error;
  }
}


export async function fetchExercises({ filterName, categoryName, page = 1, limit = 10 }) {
  const normalizedFilter = filterName.toLowerCase();
  let params = { page, limit };

  if (normalizedFilter.includes('muscle')) {
    params.muscles = categoryName;
  } else if (normalizedFilter.includes('body')) {
    params.bodypart = categoryName;
  } else if (normalizedFilter.includes('equipment')) {
    params.equipment = categoryName;
  }

  try {
    const response = await axios.get('/exercises', { params });
    return response.data;
  }
  catch (error) {
    console.error('Error fetching exercises:', error);
    throw error;
  }
}