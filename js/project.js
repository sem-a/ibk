class ProjectSlider {
  constructor(options) {
    this.container = document.querySelector(options.container);
    this.slidesContainer = this.container.querySelector(options.slidesContainer);
    this.slides = this.container.querySelectorAll(options.slideClass);
    this.prevBtn = this.container.querySelector(options.prevBtn);
    this.nextBtn = this.container.querySelector(options.nextBtn);
    this.dots = this.container.querySelectorAll(options.dotClass);
    this.slidesToScroll = options.slidesToScroll || 1;
    
    this.currentIndex = 0;
    this.isDragging = false;
    this.startX = 0;
    this.currentTranslate = 0;
    this.prevTranslate = 0;
    
    this.init();
  }
  
  init() {
    // Установка начальной позиции
    this.updateSlider();
    
    // Обработчики кнопок
    this.prevBtn.addEventListener('click', () => this.prevSlide());
    this.nextBtn.addEventListener('click', () => this.nextSlide());
    
    // Обработчики точек
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToSlide(index * this.slidesToScroll));
    });
    
    // Обработчики для свайпа
    this.slidesContainer.addEventListener('mousedown', this.touchStart.bind(this));
    this.slidesContainer.addEventListener('touchstart', this.touchStart.bind(this));
    this.slidesContainer.addEventListener('mouseup', this.touchEnd.bind(this));
    this.slidesContainer.addEventListener('touchend', this.touchEnd.bind(this));
    this.slidesContainer.addEventListener('mousemove', this.touchMove.bind(this));
    this.slidesContainer.addEventListener('touchmove', this.touchMove.bind(this));
    this.slidesContainer.addEventListener('mouseleave', this.touchEnd.bind(this));
    
    // Адаптация к изменению размера окна
    window.addEventListener('resize', () => {
      this.updateSlider();
    });
  }
  
  updateSlider() {
    const slideWidth = this.slides[0].offsetWidth;
    this.slidesContainer.style.transform = `translateX(-${this.currentIndex * slideWidth}px)`;
    this.updateDots();
  }
  
  nextSlide() {
    this.currentIndex += this.slidesToScroll;
    if (this.currentIndex >= this.slides.length) {
      this.currentIndex = 0;
    }
    this.updateSlider();
  }
  
  prevSlide() {
    this.currentIndex -= this.slidesToScroll;
    if (this.currentIndex < 0) {
      this.currentIndex = this.slides.length - this.slidesToScroll;
    }
    this.updateSlider();
  }
  
  goToSlide(index) {
    this.currentIndex = index;
    this.updateSlider();
  }
  
  updateDots() {
    const activeDotIndex = Math.floor(this.currentIndex / this.slidesToScroll);
    this.dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === activeDotIndex);
    });
  }
  
  // Методы для свайпа
  touchStart(e) {
    if (e.type === 'touchstart') {
      this.startX = e.touches[0].clientX;
    } else {
      this.startX = e.clientX;
      e.preventDefault();
    }
    
    this.isDragging = true;
    this.slidesContainer.style.transition = 'none';
  }
  
  touchEnd(e) {
    if (!this.isDragging) return;
    this.isDragging = false;
    
    const movedBy = this.currentTranslate - this.prevTranslate;
    this.slidesContainer.style.transition = 'transform 0.5s ease';
    
    if (movedBy < -50) {
      this.nextSlide();
    } else if (movedBy > 50) {
      this.prevSlide();
    } else {
      this.updateSlider();
    }
  }
  
  touchMove(e) {
    if (!this.isDragging) return;
    
    let currentX;
    if (e.type === 'touchmove') {
      currentX = e.touches[0].clientX;
    } else {
      currentX = e.clientX;
    }
    
    const diff = currentX - this.startX;
    this.currentTranslate = diff;
    const slideWidth = this.slides[0].offsetWidth;
    this.slidesContainer.style.transform = `translateX(calc(-${this.currentIndex * slideWidth}px + ${diff}px))`;
  }
}

// Инициализация слайдера
document.addEventListener('DOMContentLoaded', () => {
  const slider = new ProjectSlider({
    container: '.project__slider',
    slidesContainer: '.project__slider-content',
    slideClass: '.project__slider-slide',
    prevBtn: '.project__slider-prev',
    nextBtn: '.project__slider-next',
    dotClass: '.project__slider-btn',
    slidesToScroll: 1 // Можно изменить на 2 или 3 для прокрутки нескольких слайдов
  });
  
  // Адаптация количества отображаемых слайдов
  function handleResize() {
    const width = window.innerWidth;
    if (width >= 1024) {
      slider.slidesToScroll = 3;
    } else if (width >= 768) {
      slider.slidesToScroll = 2;
    } else {
      slider.slidesToScroll = 1;
    }
    slider.updateSlider();
  }
  
  window.addEventListener('resize', handleResize);
  handleResize();
});