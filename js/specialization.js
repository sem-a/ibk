class InfiniteButtonCarousel {
  constructor(options) {
    this.buttonsContainer = document.querySelector(options.buttonsContainer);
    this.buttons = Array.from(this.buttonsContainer.querySelectorAll(options.buttonClass));
    this.activeClass = options.activeClass;
    this.intervalTime = options.intervalTIME || 7000;
    
    this.currentIndex = 0;
    this.isDragging = false;
    this.startX = 0;
    this.scrollLeft = 0;
    this.autoSlideInterval = null;
    
    // Клонируем элементы для бесконечного эффекта
    this.setupInfiniteItems();
    this.init();
  }
  
  setupInfiniteItems() {
    // Клонируем первые и последние элементы
    const firstClone = this.buttons[0].cloneNode(true);
    const lastClone = this.buttons[this.buttons.length - 1].cloneNode(true);
    
    firstClone.dataset.clone = "true";
    lastClone.dataset.clone = "true";
    
    // Добавляем клоны в конец и начало
    this.buttonsContainer.appendChild(firstClone);
    this.buttonsContainer.insertBefore(lastClone, this.buttonsContainer.firstChild);
    
    // Обновляем список кнопок
    this.buttons = Array.from(this.buttonsContainer.querySelectorAll(options.buttonClass));
  }
  
  init() {
    // Устанавливаем начальную позицию (первый оригинальный элемент)
    this.scrollToButton(this.currentIndex + 1); // +1 потому что добавили клон в начале
    
    // Обработчики кликов
    this.buttons.forEach(button => {
      button.addEventListener('click', () => {
        const buttonIndex = parseInt(button.dataset.slide) - 1;
        this.goToButton(buttonIndex);
      });
    });
    
    // Обработчики для бесконечной прокрутки
    this.buttonsContainer.addEventListener('scroll', this.handleScroll.bind(this));
    
    // Drag & touch события
    this.addDragHandlers();
    
    // Автопрокрутка
    if (this.intervalTime) {
      this.startAutoSlide();
    }
  }
  
  handleScroll() {
    const container = this.buttonsContainer;
    const containerWidth = container.offsetWidth;
    const scrollWidth = container.scrollWidth;
    
    // Если прокрутили до клона в начале
    if (container.scrollLeft < containerWidth / 2) {
      container.scrollLeft = scrollWidth - containerWidth * 1.5;
    } 
    // Если прокрутили до клона в конце
    else if (container.scrollLeft > scrollWidth - containerWidth * 1.5) {
      container.scrollLeft = containerWidth / 2;
    }
    
    // Определяем текущий активный элемент
    this.updateActiveButton();
  }
  
  updateActiveButton() {
    const container = this.buttonsContainer;
    const containerWidth = container.offsetWidth;
    const scrollLeft = container.scrollLeft;
    
    // Находим элемент ближайший к центру
    let closestButton = null;
    let minDistance = Infinity;
    
    this.buttons.forEach(button => {
      if (button.dataset.clone) return; // Игнорируем клоны
      
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
      if (buttonIndex !== this.currentIndex) {
        this.currentIndex = buttonIndex;
        this.updateButtonClasses();
      }
    }
  }
  
  updateButtonClasses() {
    this.buttons.forEach(button => {
      if (button.dataset.clone) return;
      
      const buttonIndex = parseInt(button.dataset.slide) - 1;
      button.classList.remove(this.activeClass);
      
      if (buttonIndex === this.currentIndex) {
        button.classList.add(this.activeClass);
      }
    });
  }
  
  scrollToButton(index) {
    const button = this.buttons[index + 1]; // +1 из-за клона в начале
    if (!button) return;
    
    const container = this.buttonsContainer;
    const containerWidth = container.offsetWidth;
    const buttonRect = button.getBoundingClientRect();
    const buttonCenter = buttonRect.left + buttonRect.width / 2 - container.getBoundingClientRect().left;
    
    container.scrollTo({
      left: container.scrollLeft + buttonCenter - containerWidth / 2,
      behavior: 'smooth'
    });
  }
  
  goToButton(index) {
    if (index < 0) index = this.buttons.length - 3; // -3 из-за 2 клонов и индексации с 0
    if (index >= this.buttons.length - 2) index = 0; // -2 из-за клонов
    
    this.currentIndex = index;
    this.scrollToButton(index);
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
    // ... (такой же код для drag & touch как в предыдущем примере)
  }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  const carousel = new InfiniteButtonCarousel({
    buttonsContainer: '.specialization__slider-buttons',
    buttonClass: '.specialization__btn',
    activeClass: 'specialization-active',
    intervalTIME: 7000
  });
});