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