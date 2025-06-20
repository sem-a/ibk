class InfiniteSlider {
  constructor(options) {
    const defaults = {
      sliderSelector: "#projectSlider",
      trackSelector: ".project__slider-track",
      slideSelector: ".project__slider-slide",
      prevBtnSelector: ".prev",
      nextBtnSelector: ".next",
      visibleSlides: 1,
      clonesCount: 3,
      transitionDuration: "0.5s",
      transitionTiming: "ease-in-out",
    };

    this.config = { ...defaults, ...options };

    this.init();
  }

  init() {
    this.slider = document.querySelector(this.config.sliderSelector);
    if (!this.slider) return;

    this.track = this.slider.querySelector(this.config.trackSelector);
    this.slides = Array.from(
      this.track.querySelectorAll(this.config.slideSelector)
    );
    this.prevBtn = this.slider.querySelector(this.config.prevBtnSelector);
    this.nextBtn = this.slider.querySelector(this.config.nextBtnSelector);

    if (!this.track || !this.slides.length || !this.prevBtn || !this.nextBtn) {
      console.error("Slider elements not found!");
      return;
    }

    this.slideWidth = this.slides[0].getBoundingClientRect().width;
    this.currentIndex = 0;
    this.totalOriginalSlides = this.slides.length;

    this.cloneSlides();

    this.setInitialPosition();

    this.addEventListeners();
  }

  cloneSlides() {
    const firstClones = this.slides
      .slice(0, this.config.clonesCount)
      .map((slide) => slide.cloneNode(true));

    const lastClones = this.slides
      .slice(-this.config.clonesCount)
      .map((slide) => slide.cloneNode(true));

    firstClones.forEach((clone) => this.track.appendChild(clone));
    lastClones.forEach((clone) =>
      this.track.insertBefore(clone, this.track.firstChild)
    );

    this.allSlides = Array.from(this.track.children);
    this.totalSlides = this.allSlides.length;
  }

  setInitialPosition() {
    this.track.style.transition = "none";
    this.track.style.transform = `translateX(-${
      this.slideWidth * this.config.clonesCount
    }px)`;
  }

  moveToSlide(index) {
    this.currentIndex = index;
    this.track.style.transition = `transform ${this.config.transitionDuration} ${this.config.transitionTiming}`;
    this.track.style.transform = `translateX(-${
      this.slideWidth * (index + this.config.clonesCount)
    }px)`;

    this.handleInfiniteLoop();
  }

  handleInfiniteLoop() {
    if (this.currentIndex >= this.totalOriginalSlides) {
      setTimeout(() => {
        this.track.style.transition = "none";
        this.currentIndex = 0;
        this.track.style.transform = `translateX(-${
          this.slideWidth * this.config.clonesCount
        }px)`;
      }, parseFloat(this.config.transitionDuration) * 1000);
    } else if (this.currentIndex < 0) {
      setTimeout(() => {
        this.track.style.transition = "none";
        this.currentIndex = this.totalOriginalSlides - 1;
        this.track.style.transform = `translateX(-${
          this.slideWidth *
          (this.totalOriginalSlides + this.config.clonesCount - 1)
        }px)`;
      }, parseFloat(this.config.transitionDuration) * 1000);
    }
  }

  addEventListeners() {
    this.nextBtn.addEventListener("click", () => {
      this.moveToSlide(this.currentIndex + 1);
    });

    this.prevBtn.addEventListener("click", () => {
      this.moveToSlide(this.currentIndex - 1);
    });

    window.addEventListener("resize", () => {
      this.slideWidth = this.slides[0].getBoundingClientRect().width;
      this.track.style.transform = `translateX(-${
        this.slideWidth * (this.currentIndex + this.config.clonesCount)
      }px)`;
    });

    window.addEventListener("orientationchange", () => {
      setTimeout(() => {
        this.slideWidth = this.slides[0].getBoundingClientRect().width;
        this.setInitialPosition();
      }, 500);
    });
  }
}
