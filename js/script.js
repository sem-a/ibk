document.addEventListener("DOMContentLoaded", () => {
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

      this.slides = this.slider.querySelectorAll(
        `.${this.settings.slideClass}`
      );
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
      this.slides[this.currentSlide].classList.remove(
        this.settings.activeClass
      );
      this.buttons[this.currentSlide].classList.remove(
        this.settings.activeClass
      );
      console.log("fasdf");
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

  const clientSlider = new Slider({
    sliderContainer: "client__slider",
    slideClass: "client__slider-slide",
    buttonClass: "client__slider-btn",
    activeClass: "client-active",
    indicatorClass: "client__triangle",
    intervalTime: 5000,
    autoPlay: true,
    animation: true,
    enableSwipe: true
  });

  const mapSlider = new Slider({
    sliderContainer: "map__slider",
    slideClass: "map__slide",
    buttonClass: "map__slider-point",
    activeClass: "map-active",
    indicatorClass: "map__slider-triangle",
    intervalTime: 5000,
    autoPlay: true,
    animation: true,
  });
});
