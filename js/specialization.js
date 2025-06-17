class CenteredButtonSlider {
  constructor(options) {
    this.buttonsContainer = document.querySelector(options.buttonsContainer);
    this.slidesContainer = document.querySelector(options.slidesContainer);
    this.buttons = this.buttonsContainer.querySelectorAll(options.buttonClass);
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
    this.setActiveButton(this.currentIndex);

    this.buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const buttonIndex = parseInt(button.dataset.slide) - 1;
        this.goToButton(buttonIndex);
      });
    });

    this.addDragHandlers();

    if (this.intervalTime) {
      this.startAutoSlide();
    }
  }

  setActiveButton(index) {
    this.currentIndex = index;

    this.buttons.forEach((button, i) => {
      button.classList.remove(this.activeClass);
      if (i === index) {
        button.classList.add(this.activeClass);
      }
    });

    this.slides.forEach((slide, i) => {
      slide.classList.remove(this.activeClass);
      if (i === index) {
        slide.classList.add(this.activeClass);
      }
    });

    this.centerActiveButton();
  }

  centerActiveButton() {
    const activeButton = this.buttons[this.currentIndex];
    const containerWidth = this.buttonsContainer.offsetWidth;
    const buttonWidth = activeButton.offsetWidth;
    const buttonLeft = activeButton.offsetLeft;

    const scrollTo = buttonLeft - containerWidth / 2 + buttonWidth / 2;

    this.buttonsContainer.scrollTo({
      left: scrollTo,
      behavior: "smooth",
    });
  }

  goToButton(index) {
    if (index < 0) {
      index = this.buttons.length - 1;
    } else if (index >= this.buttons.length) {
      index = 0;
    }

    this.setActiveButton(index);
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
    this.buttonsContainer.addEventListener("mousedown", (e) => {
      this.isDragging = true;
      this.startX = e.pageX - this.buttonsContainer.offsetLeft;
      this.scrollLeft = this.buttonsContainer.scrollLeft;
    });

    this.buttonsContainer.addEventListener("mouseleave", () => {
      this.isDragging = false;
    });

    this.buttonsContainer.addEventListener("mouseup", () => {
      this.isDragging = false;
    });

    this.buttonsContainer.addEventListener("mousemove", (e) => {
      if (!this.isDragging) return;
      e.preventDefault();
      const x = e.pageX - this.buttonsContainer.offsetLeft;
      const walk = (x - this.startX) * 2;
      this.buttonsContainer.scrollLeft = this.scrollLeft - walk;
    });

    this.buttonsContainer.addEventListener("touchstart", (e) => {
      this.isDragging = true;
      this.startX = e.touches[0].pageX - this.buttonsContainer.offsetLeft;
      this.scrollLeft = this.buttonsContainer.scrollLeft;
    });

    this.buttonsContainer.addEventListener("touchend", () => {
      this.isDragging = false;
    });

    this.buttonsContainer.addEventListener("touchmove", (e) => {
      if (!this.isDragging) return;
      e.preventDefault();
      const x = e.touches[0].pageX - this.buttonsContainer.offsetLeft;
      const walk = (x - this.startX) * 2;
      this.buttonsContainer.scrollLeft = this.scrollLeft - walk;
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const buttonSlider = new CenteredButtonSlider({
    buttonsContainer: ".specialization__slider-buttons",
    slidesContainer: ".specialization__slider-content",
    buttonClass: ".specialization__btn",
    slideClass: ".specialization__slider-slide",
    activeClass: "specialization-active",
    intervalTIME: 7000,
  });
});
