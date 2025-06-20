class InfiniteSlider {
  constructor(options) {
    // Настройки по умолчанию
    const defaults = {
      sliderSelector: '#projectSlider',
      trackSelector: '.project__slider-track',
      slideSelector: '.project__slider-slide',
      prevBtnSelector: '.prev',
      nextBtnSelector: '.next',
      visibleSlides: 1,
      clonesCount: 3,
      transitionDuration: '0.5s',
      transitionTiming: 'ease-in-out'
    };

    // Объединяем переданные параметры с настройками по умолчанию
    this.config = { ...defaults, ...options };
    
    // Инициализация
    this.init();
  }

  init() {
    // Получаем элементы DOM
    this.slider = document.querySelector(this.config.sliderSelector);
    if (!this.slider) return;
    
    this.track = this.slider.querySelector(this.config.trackSelector);
    this.slides = Array.from(this.track.querySelectorAll(this.config.slideSelector));
    this.prevBtn = this.slider.querySelector(this.config.prevBtnSelector);
    this.nextBtn = this.slider.querySelector(this.config.nextBtnSelector);
    
    // Проверяем, что все элементы существуют
    if (!this.track || !this.slides.length || !this.prevBtn || !this.nextBtn) {
      console.error('Slider elements not found!');
      return;
    }

    // Рассчитываем ширину слайда
    this.slideWidth = this.slides[0].getBoundingClientRect().width;
    this.currentIndex = 0;
    this.totalOriginalSlides = this.slides.length;

    // Клонируем слайды для бесконечного цикла
    this.cloneSlides();
    
    // Устанавливаем начальную позицию
    this.setInitialPosition();
    
    // Добавляем обработчики событий
    this.addEventListeners();

    // Инициализируем модальные окна
    this.initModal();
  }

  initModal() {
    // Создаем элементы модального окна
    this.modalOverlay = document.createElement("div");
    this.modalOverlay.className = "modal-overlay";
    this.modalContent = document.createElement("div");
    this.modalContent.className = "modal-content";
    
    document.body.appendChild(this.modalOverlay);
    this.modalOverlay.appendChild(this.modalContent);

    // Делегирование событий для открытия модального окна
    this.track.addEventListener('click', (e) => {
      const slide = e.target.closest(this.config.slideSelector);
      if (slide) {
        this.openModal(slide);
      }
    });

    // Закрытие модального окна
    this.modalOverlay.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-close') || e.target === this.modalOverlay) {
        this.closeModal();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.modalOverlay.style.display === "block") {
        this.closeModal();
      }
    });
  }

  openModal(slide) {
    const title = slide.querySelector(".project__slide-title")?.textContent;
    const imageSrc = slide.querySelector(".project__slide-image")?.src;
    const textElement = slide.querySelector(".text");
    const fullText = textElement?.getAttribute("data-full-text") || textElement?.textContent;

    if (!title || !imageSrc || !fullText) return;

    this.modalContent.innerHTML = `
      <button class="modal-close">&times;</button>
      <h3 class="modal-title">${title}</h3>
      <img src="${imageSrc}" alt="${title}" class="modal-image">
      <div class="modal-description">${fullText}</div>
    `;

    this.modalOverlay.style.display = "block";
    document.body.classList.add("modal-open");
  }

  closeModal() {
    this.modalOverlay.style.display = "none";
    document.body.classList.remove("modal-open");
  }

  cloneSlides() {
    // Клонируем первые и последние слайды
    const firstClones = this.slides
      .slice(0, this.config.clonesCount)
      .map(slide => {
        const clone = slide.cloneNode(true);
        // Обрезаем текст в клонированных слайдах
        const textElement = clone.querySelector(".text");
        if (textElement) {
          this.truncateTextInCard(textElement);
        }
        return clone;
      });
    
    const lastClones = this.slides
      .slice(-this.config.clonesCount)
      .map(slide => {
        const clone = slide.cloneNode(true);
        // Обрезаем текст в клонированных слайдах
        const textElement = clone.querySelector(".text");
        if (textElement) {
          this.truncateTextInCard(textElement);
        }
        return clone;
      });

    // Добавляем клоны в трек
    firstClones.forEach(clone => this.track.appendChild(clone));
    lastClones.forEach(clone => this.track.insertBefore(clone, this.track.firstChild));

    // Обновляем массив всех слайдов
    this.allSlides = Array.from(this.track.children);
    this.totalSlides = this.allSlides.length;
  }

  truncateTextInCard(textElement) {
    const originalText = textElement.textContent;
    const maxLength = 100; // Максимальная длина перед обрезкой
    
    if (originalText.length > maxLength) {
      textElement.setAttribute("data-full-text", originalText);
      textElement.textContent = originalText.substring(0, maxLength) + "...";
    }
  }

  setInitialPosition() {
    this.track.style.transition = 'none';
    this.track.style.transform = `translateX(-${this.slideWidth * this.config.clonesCount}px)`;
  }

  moveToSlide(index) {
    this.currentIndex = index;
    this.track.style.transition = `transform ${this.config.transitionDuration} ${this.config.transitionTiming}`;
    this.track.style.transform = `translateX(-${this.slideWidth * (index + this.config.clonesCount)}px)`;

    // Обработка бесконечного цикла
    this.handleInfiniteLoop();
  }

  handleInfiniteLoop() {
    if (this.currentIndex >= this.totalOriginalSlides) {
      setTimeout(() => {
        this.track.style.transition = 'none';
        this.currentIndex = 0;
        this.track.style.transform = `translateX(-${this.slideWidth * this.config.clonesCount}px)`;
      }, parseFloat(this.config.transitionDuration) * 1000);
    } 
    else if (this.currentIndex < 0) {
      setTimeout(() => {
        this.track.style.transition = 'none';
        this.currentIndex = this.totalOriginalSlides - 1;
        this.track.style.transform = `translateX(-${this.slideWidth * (this.totalOriginalSlides + this.config.clonesCount - 1)}px)`;
      }, parseFloat(this.config.transitionDuration) * 1000);
    }
  }

  addEventListeners() {
    // Кнопки навигации
    this.nextBtn.addEventListener('click', () => {
      this.moveToSlide(this.currentIndex + 1);
    });

    this.prevBtn.addEventListener('click', () => {
      this.moveToSlide(this.currentIndex - 1);
    });

    // Обработка изменения размера окна
    window.addEventListener('resize', () => {
      this.slideWidth = this.slides[0].getBoundingClientRect().width;
      this.track.style.transform = `translateX(-${this.slideWidth * (this.currentIndex + this.config.clonesCount)}px)`;
    });

    // Переинициализация при изменении ориентации устройства
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.slideWidth = this.slides[0].getBoundingClientRect().width;
        this.setInitialPosition();
      }, 500);
    });
  }
}

// Пример использования
document.addEventListener("DOMContentLoaded", () => {
  // Инициализация слайдера с настройками по умолчанию
  const projectSlider = new InfiniteSlider();
  
  // Или с кастомными настройками
  const anotherSlider = new InfiniteSlider({
    sliderSelector: '#anotherSlider',
    trackSelector: '.custom-track',
    slideSelector: '.custom-slide',
    prevBtnSelector: '.custom-prev',
    nextBtnSelector: '.custom-next',
    visibleSlides: 2,
    clonesCount: 2,
    transitionDuration: '0.3s'
  });
});
