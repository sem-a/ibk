class CentredSlider {
  constructor(options) {
    const defaults = {
      sliderContainer: ".slider",
      buttonsContainer: ".slider-buttons",
      slideClass: ".slider-slide",
      buttonClass: ".slide-btn",
      activeClass: ".active",
      intervalTime: 5000,
      autoPlay: true,
      enableSwipe: true,
      centerButtons: true,
      buttonsScrollBehavior: "smooth",
    };

    this.settings = {
      ...defaults,
      ...options,
    };

    this.slider = document.querySelector(this.settings.sliderContainer);
    if (!this.slider) return;

    this.buttonsContainer = this.slider.querySelector(
      this.settings.buttonsContainer
    );
    this.slides = Array.from(
      this.slider.querySelectorAll(this.settings.slideClass)
    );
    this.buttons = Array.from(
      this.slider.querySelectorAll(this.settings.buttonClass)
    );

    this.currentSlide = 0;
    this.slideInterval = null;
    this.isDragging = false;
    this.startX = 0;
    this.currTranslate = 0;
    this.prevTranslate = 0;
    this.animationID = null;

    this.init();
  }

  init() {
    const activeSlide = this.slider.querySelector(
      `${this.settings.slideClass}${this.settings.activeClass}`
    );
    const activeButton = this.slider.querySelector(
      `${this.settings.buttonClass}${this.settings.activeClass}`
    );

    if (activeSlide) {
      this.currSlide = this.slides.indexOf(activeSlide);
    }
    if (activeButton && this.currSlide !== this.buttons.indexOf(activeButton)) {
      this.currSlide = this.buttons.indexOf(activeButton);
    }

    this.setupEventListners();
    this.goToSlide(this.currSlide);

    if (this.settings.autoPlay) {
      this.startAutoPlay();
    }
  }

  setupEventListners() {
    this.buttons.forEach((button, index) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        this.stopAutoPlay();
        this.goToSlide(index);
        this.startAutoPlay();
      });
    });

    if (this.settings.enableSwipe) {
      this.slides.forEach((slide) => {
        slide.addEventListener("touchstart", this.touchStart.bind(this), {
          passive: true,
        });
        slide.addEventListener("touchend", this.touchEnd.bind(this), {
          passive: false,
        });
        slide.addEventListener("touchmove", this.touchMove.bind(this), {
          passive: false,
        });

        slide.addEventListener("mousedown", this.touchStart.bind(this));
        slide.addEventListener("mouseup", this.touchEnd.bind(this));
        slide.addEventListener("mouseleave", this.touchEnd.bind(this));
        slide.addEventListener("mousemove", this.touchMove.bind(this));
      });
    }
  }

  touchStart(e) {
    if (e.type === "touchstart") {
      this.startX = e.touches[0].clientX;
    } else {
      this.startX = e.clientX;
      e.preventDefault();
    }

    this.isDragging = true;
    this.animationID = requestAnimationFrame(this.anumation.bind(this));
    this.stopAutoPlay();
  }

  touchEnd(e) {
    this.isDragging(false);
    cancelAnimationFrame(this.animationID);

    const movedBy = this.currTranslate - this.prevTranslate;
    if (movedBy < -100) {
      this.nextSlide();
    } else if (movedBy > 100) {
      this.prevSlide();
    } else {
      this.goToSlide(this.currSlide);
    }

    if (this.settings.autoPlay) {
      this.startAutoPlay();
    }
  }

  touchMove(e) {
    if (!this.isDragging) return;

    let currX;
    if (e.type === "touchmove") {
      currX = e.touches[0].clientX;
      e.preventDefault();
    } else {
      currX = e.clientX;
      e.preventDefault();
    }

    const movedBy = currX - this.startX;
    this.currTranslate = movedBy;
  }

  animation() {
    this.setSliderPosition();
    if (this.isDragging) {
      requestAnimationFrame(this.animation.bind(this));
    }
  }

  setSliderPosition() {
    this.slides.forEach((slide) => {
      slide.style.transform = `translateX(${this.currTranslate}px)`;
    });
  }

  goToSlide(n) {
    this.slides.forEach((slide) => {
      slide.classList.remove(this.settings.activeClass);
    });
    this.buttons.forEach((button) => {
      button.classList.remove(this.settings.activeClass);
    });

    this.currentSlide = (n + this.slides.length) % this.slides.length;

    this.slides[this.currSlide].classList.add(this.settings.activeClass);
    this.buttons[this.currSlide].classList.add(this.settings.activeClass);

    if (this.settings.centerButtons) {
      this.centerActiveButton();
    }

    this.currTranslate = 0;
    this.prevTranslate = 0;
    this.slides.forEach((slide) => {
      slide.style.transform = "translateX(0)";
    });
  }

  centerActiveButton() {
    const activeBtn = this.buttons[this.currSlide];
    const containerWidth = this.buttonsContainer.offsetWidth;
    const btnWidth = activeBtn.offsetWidth;
    const btnLeft = acctiveBtn.offsetLeft;

    const scrollTo = btnLeft - containerWidth / 2 + btnWidth / 2;

    this.buttonsContainer.scrollTo({
      left: scrollTo,
      behavior: this.settings.buttons.ScrollBehavior,
    });
  }

  nextSlide() {
    this.goToSlide(this.currSlide + 1);
  }

  prevSlide() {
    this.goToSlide(this.currSlide - 1);
  }

  startAutoPlay() {
    this.stopAutoPlay();

    if (this.settings.autoPlay) {
      this.slideInterval = setInterval(() => {
        this.nextSlide();
      }, this.settings.intervalTime);
    }
  }

  stopAutoPlay() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }
}
