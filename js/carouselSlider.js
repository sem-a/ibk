class CarouselSlider {
    constructor(selector, options = {}) {
        this.container = document.querySelector(selector);
        if (!this.container) return;

        // Настройки по умолчанию
        const defaults = {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
            autoplay: false,
            autoplaySpeed: 3000
        };

        this.settings = { ...defaults, ...options };
        this.wrapper = this.container.querySelector('.slider-wrapper');
        this.slides = Array.from(this.container.querySelectorAll('.slider-slide'));
        this.prevBtn = this.container.querySelector('.slider-prev');
        this.nextBtn = this.container.querySelector('.slider-next');
        this.dotsContainer = this.container.querySelector('.slider-dots');
        this.currentIndex = 0;
        this.isTransitioning = false;
        this.autoplayInterval = null;

        this.init();
    }

    init() {
        // Устанавливаем ширину слайдов
        this.setSlideWidth();

        // Создаем точки навигации
        this.createDots();

        // Добавляем обработчики событий
        this.addEventListeners();

        // Запускаем автоплей, если включен
        if (this.settings.autoplay) {
            this.startAutoplay();
        }

        // Показываем первый слайд
        this.goToSlide(0);
    }

    setSlideWidth() {
        const slideWidth = 100 / this.settings.slidesToShow;
        this.slides.forEach(slide => {
            slide.style.flex = `0 0 ${slideWidth}%`;
        });
    }

    createDots() {
        this.dotsContainer.innerHTML = '';
        const dotsCount = this.settings.infinite 
            ? this.slides.length 
            : this.slides.length - this.settings.slidesToShow + 1;

        for (let i = 0; i < dotsCount; i++) {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
        }
    }

    addEventListeners() {
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());

        // Ресайз окна
        window.addEventListener('resize', () => {
            this.setSlideWidth();
            this.goToSlide(this.currentIndex);
        });
    }

    startAutoplay() {
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, this.settings.autoplaySpeed);
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    prevSlide() {
        if (this.isTransitioning) return;
        
        let newIndex;
        if (this.settings.infinite) {
            newIndex = (this.currentIndex - this.settings.slidesToScroll + this.slides.length) % this.slides.length;
        } else {
            newIndex = Math.max(0, this.currentIndex - this.settings.slidesToScroll);
        }
        
        this.goToSlide(newIndex);
    }

    nextSlide() {
        if (this.isTransitioning) return;
        
        let newIndex;
        if (this.settings.infinite) {
            newIndex = (this.currentIndex + this.settings.slidesToScroll) % this.slides.length;
        } else {
            newIndex = Math.min(
                this.slides.length - this.settings.slidesToShow,
                this.currentIndex + this.settings.slidesToScroll
            );
        }
        
        this.goToSlide(newIndex);
    }

    goToSlide(index) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.currentIndex = index;

        // Вычисляем смещение
        const offset = -this.currentIndex * (100 / this.settings.slidesToShow);
        this.wrapper.style.transform = `translateX(${offset}%)`;

        // Обновляем активную точку
        this.updateDots();

        // Завершаем переход после анимации
        setTimeout(() => {
            this.isTransitioning = false;
        }, 500);
    }

    updateDots() {
        const dots = this.dotsContainer.querySelectorAll('.slider-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }
}