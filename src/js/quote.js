import { getQuoteOfTheDay } from './exercises-api.js';

const quoteTextEl = document.querySelector('.quote-text');
const quoteAuthorEl = document.querySelector('.quote-author')

async function renderQuote() {
  try {
    if (!quoteTextEl || !quoteAuthorEl) { return; }

    const data = await getQuoteOfTheDay();
    quoteTextEl.textContent = data.quote;
    quoteAuthorEl.textContent = data.author;
  }
  catch (error) {
    console.error('Помилка при відображенні цитати дня:', error);
    quoteTextEl.textContent = 'Не вдалося завантажити цитату дня. Спробуйте пізніше.';
    quoteAuthorEl.textContent = '';
  }
}

document.addEventListener('DOMContentLoaded', renderQuote);