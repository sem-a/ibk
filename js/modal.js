document.addEventListener("DOMContentLoaded", function () {
  const sliderTrack = document.querySelector(".project__slider-track");
  const projectSlides = sliderTrack.querySelectorAll('.project__slider-slide');
  const modalOverlay = document.createElement("div");
  modalOverlay.className = "modal-overlay";
  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";
  const closeButton = document.createElement("button");
  closeButton.className = "modal-close";
  closeButton.innerHTML = "&times;";

  console.log(projectSlides);

  modalContent.appendChild(closeButton);
  modalOverlay.appendChild(modalContent);
  document.body.appendChild(modalOverlay);

  function truncateTextInCard(textElement) {
    const originalText = textElement.textContent;
    const maxLength = 300;

    if (originalText.length > maxLength) {
      textElement.setAttribute("data-full-text", originalText);
      textElement.textContent = originalText.substring(0, maxLength) + "...";
    }
  }

  function openModal(slide) {
    const title = slide.querySelector(".project__slide-title").textContent;
    const imageSrc = slide.querySelector(".project__slide-image").src;
    const textElement = slide.querySelector(".text");
    const fullText =
      textElement.getAttribute("data-full-text") || textElement.textContent;

    modalContent.innerHTML = `
      <button class="modal-close">&times;</button>
      <h3 class="modal-title">${title}</h3>
      <img src="${imageSrc}" alt="${title}" class="modal-image">
      <div class="modal-description">${fullText}</div>
    `;

    modalOverlay.style.display = "block";
    document.body.classList.add("modal-open");

    modalContent
      .querySelector(".modal-close")
      .addEventListener("click", closeModal);
  }

  function closeModal() {
    modalOverlay.style.display = "none";
    document.body.classList.remove("modal-open");
  }

  projectSlides.forEach((slide) => {
    const textElement = slide.querySelector(".text");
    if (textElement) {
      truncateTextInCard(textElement);
    }
  });

  projectSlides.forEach((slide) => {
    slide.addEventListener("click", function () {
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
