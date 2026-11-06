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