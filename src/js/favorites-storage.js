const FAVORITES_KEY = 'favorites';

export function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) ?? [];
  }
  catch {
    return [];
  }
}

function saveFavorites(favorites) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  window.dispatchEvent(new CustomEvent('favorites:change'));
}

export function isFavorite(id) {
  return getFavorites().some(item => item._id === id);
}

export function addToFavorites(exercise) {
  const favorites = getFavorites();
  if (favorites.some(item => item._id === exercise._id)) return;
  favorites.push(exercise);
  saveFavorites(favorites);
}

export function removeFromFavorites(id) {
  saveFavorites(getFavorites().filter(item => item._id !== id));
}