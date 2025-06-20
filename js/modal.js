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

  function openModal(slide) {
    const title = slide.querySelector(".project__slide-title").textContent;
    const imageSrc = slide.querySelector(".project__slide-image").src;
    const description = slide.querySelector("p").textContent;

    modalContent.innerHTML = `
                    <button class="modal-close">&times;</button>
                    <h3 class="modal-title">${title}</h3>
                    <img src="${imageSrc}" alt="${title}" class="modal-image">
                    <div class="modal-description">${description}</div>
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
    slide.addEventListener("click", function () {
      openModal(this);
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
