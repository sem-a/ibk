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
