document.addEventListener('DOMContentLoaded', function() {
  const slider = document.querySelector('.project__slider');
  const content = document.querySelector('.project__slider-content');
  const slides = document.querySelectorAll('.project__slider-slide');
  const prevBtn = document.querySelector('.project__slider-btn.prev');
  const nextBtn = document.querySelector('.project__slider-btn.next');
  const stepBtns = document.querySelectorAll('.step-btn');
  
  let currentIndex = 0;
  let step = 1;
  let touchStartX = 0;
  let touchEndX = 0;
  
  // Клонируем первые и последние слайды для бесшовного перехода
  const firstSlide = slides[0].cloneNode(true);
  const lastSlide = slides[slides.length - 1].cloneNode(true);
  
  content.insertBefore(lastSlide, slides[0]);
  content.appendChild(firstSlide);
  
  currentIndex = 1;
  updateSlider();
  
  // Обработчики кнопок
  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - step + slides.length) % slides.length;
    if (currentIndex === 0) currentIndex = slides.length;
    updateSlider();
  });
  
  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + step) % (slides.length + 1);
    if (currentIndex === slides.length + 1) currentIndex = 1;
    updateSlider();
  });
  
  // Обработчики выбора шага
  stepBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      stepBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      step = parseInt(btn.dataset.step);
    });
  });
  
  // Обработчики свайпа
  slider.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  });
  
  slider.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });
  
  function handleSwipe() {
    const threshold = 50;
    if (touchEndX < touchStartX - threshold) {
      // Свайп влево
      currentIndex = (currentIndex + 1) % (slides.length + 1);
      if (currentIndex === slides.length + 1) currentIndex = 1;
      updateSlider();
    } else if (touchEndX > touchStartX + threshold) {
      // Свайп вправо
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      if (currentIndex === 0) currentIndex = slides.length;
      updateSlider();
    }
  }
  
  function updateSlider() {
    const slideWidth = slider.offsetWidth;
    content.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    
    // Бесшовный переход
    setTimeout(() => {
      if (currentIndex >= slides.length) {
        currentIndex = 1;
        content.style.transition = 'none';
        content.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        setTimeout(() => {
          content.style.transition = 'transform 0.5s ease';
        });
      } else if (currentIndex <= 0) {
        currentIndex = slides.length - 1;
        content.style.transition = 'none';
        content.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        setTimeout(() => {
          content.style.transition = 'transform 0.5s ease';
        });
      }
    }, 500);
  }
  
  // Адаптация к изменению размера окна
  window.addEventListener('resize', () => {
    updateSlider();
  });
});