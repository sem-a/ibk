document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector("#projectSlider");
  const track = slider.querySelector(".project__slider-track");
  const slides = Array.from(track.children);
  const prevBtn = slider.querySelector(".prev");
  const nextBtn = slider.querySelector(".next");
  const slideWidth = slides[0].getBoundingClientRect().width;
  let currentIndex = 0;

  // Clone slides for infinite loop
  const firstClones = slides.slice(0, 3).map((slide) => slide.cloneNode(true));
  const lastClones = slides.slice(-3).map((slide) => slide.cloneNode(true));
  firstClones.forEach((clone) => track.appendChild(clone));
  lastClones.forEach((clone) => track.insertBefore(clone, track.firstChild));

  // Update slides array after cloning
  const allSlides = Array.from(track.children);
  const totalSlides = allSlides.length;

  // Set initial position
  track.style.transform = `translateX(-${slideWidth * 3}px)`;

  function moveToSlide(index) {
    track.style.transition = "transform 0.5s ease-in-out";
    track.style.transform = `translateX(-${slideWidth * (index + 3)}px)`;
    currentIndex = index;

    // Handle infinite loop
    if (currentIndex === slides.length) {
      setTimeout(() => {
        track.style.transition = "none";
        currentIndex = 0;
        track.style.transform = `translateX(-${slideWidth * 3}px)`;
      }, 500);
    } else if (currentIndex === -1) {
      setTimeout(() => {
        track.style.transition = "none";
        currentIndex = slides.length - 1;
        track.style.transform = `translateX(-${
          slideWidth * (slides.length + 2)
        }px)`;
      }, 500);
    }
  }

  nextBtn.addEventListener("click", () => {
    moveToSlide(currentIndex + 1);
  });

  prevBtn.addEventListener("click", () => {
    moveToSlide(currentIndex - 1);
  });

  // Handle window resize
  window.addEventListener("resize", () => {
    const newSlideWidth = slides[0].getBoundingClientRect().width;
    track.style.transform = `translateX(-${
      newSlideWidth * (currentIndex + 3)
    }px)`;
  });
});
