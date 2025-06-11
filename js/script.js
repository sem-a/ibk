class Slider {
  constructor(options) {
    const defaults = {
      sliderContainer: ".slider",
      slideClass: "slider-slide",
      buttonClass: "slider-btn",
      activeClass: "active",
      indicatorClass: null,
      intervalTime: 5000,
      autoPlay: true,
      animation: true,
      enableSwipe: true,
    };

    this.settings = { ...defaults, ...options };
    this.slider =
      typeof this.settings.sliderContainer === "string"
        ? document.querySelector(`.${this.settings.sliderContainer}`)
        : this.settings.sliderContainer;

    this.slides = this.slider.querySelectorAll(`.${this.settings.slideClass}`);
    this.buttons = this.slider.querySelectorAll(
      `.${this.settings.buttonClass}`
    );

    this.indicator = this.settings.indicatorClass
      ? document.querySelector(`.${this.settings.indicatorClass}`)
      : null;

    this.currentSlide = 0;
    this.degIndicator = 0;
    this.slideInterval = null;
    this.touchStartX = 0;
    this.touchEndX = 0;

    this.init();
  }

  init() {
    this.goToSlide(this.currentSlide);

    this.buttons.forEach((button, index) => {
      button.addEventListener("click", () => {
        this.stopAutoPlay();
        this.goToSlide(index);
        this.startAutoPlay();
      });
    });

    if (this.settings.enableSwipe) {
      this.addSwipeHandlers();
    }

    if (this.settings.autoPlay) {
      this.startAutoPlay();
    }
  }

  addSwipeHandlers() {
    this.slider.addEventListener(
      "touchstart",
      (e) => {
        this.touchStartX = e.changedTouches[0].screenX;
        this.stopAutoPlay();
      },
      { passive: true }
    );

    this.slider.addEventListener(
      "touchend",
      (e) => {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
        this.startAutoPlay();
      },
      { passive: true }
    );
  }

  handleSwipe() {
    const minSwipeDistance = 50;

    if (this.touchStartX - this.touchEndX > minSwipeDistance) {
      this.goToSlide(this.currentSlide + 1);
    } else if (this.touchEndX - this.touchStartX > minSwipeDistance) {
      this.goToSlide(this.currentSlide - 1);
    }
  }

  goToSlide(n) {
    this.slides[this.currentSlide].classList.remove(this.settings.activeClass);
    this.buttons[this.currentSlide].classList.remove(this.settings.activeClass);
    this.currentSlide = (n + this.slides.length) % this.slides.length;

    if (this.indicator) {
      this.degIndicator =
        ((n + this.slides.length) % this.slides.length) * 20 +
        this.degIndicator;

      this.indicator.style.transform = `rotate(${this.degIndicator}deg)`;
    }

    this.slides[this.currentSlide].classList.add(this.settings.activeClass);
    this.buttons[this.currentSlide].classList.add(this.settings.activeClass);
  }

  nextSlide() {
    this.goToSlide(this.currentSlide + 1);
  }

  startAutoPlay() {
    this.stopAutoPlay();
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, this.settings.intervalTime);
  }

  stopAutoPlay() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const body = document.querySelector("body");
  const burgerButton = document.querySelector(".nav__burger");
  const navList = document.querySelector("header");

  burgerButton.addEventListener("click", () => {
    if (navList.classList.contains("nav-active")) {
      body.classList.remove("modal-open");
      navList.classList.remove("nav-active");
      burgerButton.children[0].classList.remove("nav-active");
    } else {
      body.classList.add("modal-open");
      navList.classList.add("nav-active");
      burgerButton.children[0].classList.add("nav-active");
    }
  });
});
