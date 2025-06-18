document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".advantages__list-item");

  items.forEach((item) => {
    item.addEventListener("click", () => {
      items.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove("advantages-active");
        }
      });
    });
  });

  items.forEach((item) => {
    item.addEventListener("click", () => {
      item.classList.toggle("advantages-active");
    });
  });
});
