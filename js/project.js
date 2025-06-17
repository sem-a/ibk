class ProjectSlider {
  constructor(options) {
    this.container = document.querySelector(options.container);
    this.slidesContainer = this.container.querySelector(
      options.slidesContainer
    );

    this.slides = this.container.querySelectorAll(options.slideClass);
    this.prevBtn = this.container.querySelector(options.prevBtn);
    this.nextBtn = this.container.querySelector(options.nextBtn);

    this.slidesToScroll = options.slidesToScrool || 1;

    this.currentIndex = 0;
    this.isDragging = false;
    this.startX = 0;
    this.currentTranslate = 0;
    this.prevTranslate = 0;

    this.init();
  }

  init() {
    this.updateSlider();

    this.prevBtn.addEventListener("click", () => this.prevSlide());
    this.nextBtn.addEventListener("click", () => this.nextSlide());
    
  }
}
