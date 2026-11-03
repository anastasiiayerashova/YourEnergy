document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. Buttons Home / Favorites
  // ==========================================
  const homeBtn = document.getElementById('homeBtn');
  const favBtn = document.getElementById('favBtn');

  if (homeBtn && favBtn) {
    const currentPath = window.location.pathname;

    // Setting an active class based on the page
    const isFavorites = currentPath.includes('favorites.html');
    homeBtn.classList.toggle('active', !isFavorites);
    favBtn.classList.toggle('active', isFavorites);

    // Universal click handler for navigation buttons
    const handleNavClick = (event) => {
      const clickedBtn = event.currentTarget;

      if (clickedBtn.classList.contains('active')) {
        event.preventDefault();
      }
    };

    homeBtn.addEventListener('click', handleNavClick);
    favBtn.addEventListener('click', handleNavClick);
  }

  // ==========================================
  // 2. Mob menu
  // ==========================================
  const overlay = document.querySelector('[data-overlay]');
  const mobMenu = document.querySelector('#mob-menu');
  const openMenuBtn = document.querySelector('.js-open-menu-btn');
  const closeMenuBtn = document.querySelector('.js-close-menu-btn');
  const mobMenuNavLinks = document.querySelectorAll('.mob-menu-nav-link');

  if (!mobMenu || !overlay) return;

  const toggleMobMenu = (isOpen) => {
    mobMenu.classList.toggle('is-open', isOpen);
    overlay.classList.toggle('is-hidden', !isOpen);
    document.body.classList.toggle('no-scroll', isOpen);
  };

  if (openMenuBtn) {
    openMenuBtn.addEventListener('click', () => toggleMobMenu(true));
  }

  if (closeMenuBtn) {
    closeMenuBtn.addEventListener('click', () => toggleMobMenu(false));
  }

  overlay.addEventListener('click', () => toggleMobMenu(false));
});

