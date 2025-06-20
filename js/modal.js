document.addEventListener("DOMContentLoaded", function () {
  const body = document.querySelector("body");
  const projectSlides = document.querySelectorAll(".project__slider-slide");
  const modalOverlay = document.createElement("div");
  modalOverlay.className = "modal-overlay";
  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";
  const closeButton = document.createElement("button");
  closeButton.className = "modal-close";
  closeButton.innerHTML = "&times;";

  modalContent.appendChild(closeButton);
  modalOverlay.appendChild(modalContent);
  document.body.appendChild(modalOverlay);

  // Функция для обрезки/восстановления текста в конкретном элементе
  function handleTextTruncation(textElement, isModalOpen) {
    const originalText = textElement.getAttribute("data-full-text") || textElement.textContent;
    textElement.setAttribute("data-full-text", originalText);
    
    if (!isModalOpen) {
      const maxLength = 100; // Максимальная длина перед обрезкой
      if (originalText.length > maxLength) {
        textElement.textContent = originalText.substring(0, maxLength) + "...";
      }
    } else {
      textElement.textContent = originalText;
    }
  }

  function openModal(slide) {
    const title = slide.querySelector(".project__slide-title").textContent;
    const imageSrc = slide.querySelector(".project__slide-image").src;
    const textElement = slide.querySelector(".text");
    const description = textElement.getAttribute("data-full-text") || textElement.textContent;

    modalContent.innerHTML = `
      <button class="modal-close">&times;</button>
      <h3 class="modal-title">${title}</h3>
      <img src="${imageSrc}" alt="${title}" class="modal-image">
      <div class="modal-description">${description}</div>
    `;

    modalOverlay.style.display = "block";
    document.body.classList.add("modal-open");

    // Восстанавливаем полный текст в карточке при открытии модального окна
    handleTextTruncation(textElement, true);

    modalContent.querySelector(".modal-close").addEventListener("click", closeModal);
  }

  function closeModal() {
    modalOverlay.style.display = "none";
    document.body.classList.remove("modal-open");
    
    // Находим активную карточку (последнюю, по которой кликнули)
    const activeSlide = document.querySelector(".project__slider-slide.active");
    if (activeSlide) {
      const textElement = activeSlide.querySelector(".text");
      // Обрезаем текст в карточке при закрытии модального окна
      handleTextTruncation(textElement, false);
      activeSlide.classList.remove("active");
    }
  }

  // Инициализация - обрезаем текст во всех карточках при загрузке
  projectSlides.forEach(slide => {
    const textElement = slide.querySelector(".text");
    if (textElement) {
      handleTextTruncation(textElement, false);
    }
  });

  projectSlides.forEach((slide) => {
    slide.addEventListener("click", function () {
      // Помечаем текущую карточку как активную
      slide.classList.add("active");
      openModal(slide);
    });
  });

  modalOverlay.addEventListener("click", function (e) {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modalOverlay.style.display === "block") {
      closeModal();
    }
  });
});
