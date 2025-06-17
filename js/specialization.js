class CenteredButtonSlider {
  constructor(options) {
    this.buttonsContainer = document.querySelector(options.buttonsContainer);
    this.buttons = this.buttonsContainer.querySelectorAll(options.buttonClass);
    this.slidesContainer = document.querySelector(options.slidesContainer);
    this.slides = this.slidesContainer.querySelectorAll(options.slideClass);
    this.activeClass = options.activeClass;
    this.intervalTime = options.intervalTIME || 7000;
    this.centerButtons = true;
    
    this.currentIndex = 0;
    this.isDragging = false;
    this.startX = 0;
    this.scrollLeft = 0;
    this.autoSlideInterval = null;
    
    this.init();
  }
  
  init() {
    // Set initial active button and slide
    this.setActiveButton(this.currentIndex);
    this.setActiveSlide(this.currentIndex);
    
    // Add click handlers
    this.buttons.forEach(button => {
      button.addEventListener('click', () => {
        const buttonIndex = parseInt(button.dataset.slide) - 1;
        this.goToButton(buttonIndex);
      });
    });
    
    // Add drag functionality
    this.addDragHandlers();
    
    // Start auto-rotation
    if (this.intervalTime) {
      this.startAutoSlide();
    }
  }
  
  setActiveButton(index) {
    // Update current index
    this.currentIndex = index;
    
    // Update button classes
    this.buttons.forEach((button, i) => {
      button.classList.remove(this.activeClass);
      if (i === index) {
        button.classList.add(this.activeClass);
      }
    });
    
    // Center the active button
    this.centerActiveButton();
  }
  
  setActiveSlide(index) {
    // Update slides visibility
    this.slides.forEach((slide, i) => {
      slide.style.display = i === index ? 'flex' : 'none';
    });
  }
  
  centerActiveButton() {
    const activeButton = this.buttons[this.currentIndex];
    const containerWidth = this.buttonsContainer.offsetWidth;
    const buttonWidth = activeButton.offsetWidth;
    const buttonLeft = activeButton.offsetLeft;
    
    const scrollTo = buttonLeft - (containerWidth / 2) + (buttonWidth / 2);
    
    this.buttonsContainer.scrollTo({
      left: scrollTo,
      behavior: 'smooth'
    });
  }
  
  goToButton(index) {
    // Handle cyclic navigation
    if (index < 0) {
      index = this.buttons.length - 1;
    } else if (index >= this.buttons.length) {
      index = 0;
    }
    
    this.setActiveButton(index);
    this.setActiveSlide(index);
    this.resetAutoSlide();
  }
  
  nextButton() {
    this.goToButton(this.currentIndex + 1);
  }
  
  prevButton() {
    this.goToButton(this.currentIndex - 1);
  }
  
  startAutoSlide() {
    this.autoSlideInterval = setInterval(() => {
      this.nextButton();
    }, this.intervalTime);
  }
  
  resetAutoSlide() {
    clearInterval(this.autoSlideInterval);
    this.startAutoSlide();
  }
  
  addDragHandlers() {
    this.buttonsContainer.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.startX = e.pageX - this.buttonsContainer.offsetLeft;
      this.scrollLeft = this.buttonsContainer.scrollLeft;
    });
    
    this.buttonsContainer.addEventListener('mouseleave', () => {
      this.isDragging = false;
    });
    
    this.buttonsContainer.addEventListener('mouseup', () => {
      this.isDragging = false;
      // После завершения перетаскивания активируем ближайший слайд
      this.updateActiveOnDragEnd();
    });
    
    this.buttonsContainer.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      e.preventDefault();
      const x = e.pageX - this.buttonsContainer.offsetLeft;
      const walk = (x - this.startX) * 2;
      this.buttonsContainer.scrollLeft = this.scrollLeft - walk;
    });
    
    // Touch events for mobile
    this.buttonsContainer.addEventListener('touchstart', (e) => {
      this.isDragging = true;
      this.startX = e.touches[0].pageX - this.buttonsContainer.offsetLeft;
      this.scrollLeft = this.buttonsContainer.scrollLeft;
    });
    
    this.buttonsContainer.addEventListener('touchend', () => {
      this.isDragging = false;
      // После завершения перетаскивания активируем ближайший слайд
      this.updateActiveOnDragEnd();
    });
    
    this.buttonsContainer.addEventListener('touchmove', (e) => {
      if (!this.isDragging) return;
      e.preventDefault();
      const x = e.touches[0].pageX - this.buttonsContainer.offsetLeft;
      const walk = (x - this.startX) * 2;
      this.buttonsContainer.scrollLeft = this.scrollLeft - walk;
    });
  }
  
  updateActiveOnDragEnd() {
    const container = this.buttonsContainer;
    const containerWidth = container.offsetWidth;
    const scrollLeft = container.scrollLeft;
    
    // Находим кнопку, ближайшую к центру
    let closestButton = null;
    let minDistance = Infinity;
    
    this.buttons.forEach((button, index) => {
      const buttonRect = button.getBoundingClientRect();
      const buttonCenter = buttonRect.left + buttonRect.width / 2 - container.getBoundingClientRect().left;
      const distance = Math.abs(buttonCenter - containerWidth / 2);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestButton = button;
      }
    });
    
    if (closestButton) {
      const buttonIndex = parseInt(closestButton.dataset.slide) - 1;
      this.goToButton(buttonIndex);
    }
  }
}

// Инициализация слайдера
document.addEventListener('DOMContentLoaded', () => {
  const buttonSlider = new CenteredButtonSlider({
    buttonsContainer: '.specialization__slider-buttons',
    buttonClass: '.specialization__btn',
    slidesContainer: '.specialization__slider-content',
    slideClass: '.specialization__slider-slide',
    activeClass: 'specialization-active',
    intervalTIME: 7000
  });
});