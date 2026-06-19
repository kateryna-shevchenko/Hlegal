import "../scss/style.scss";
import { initI18n } from "./i18n/index.js";

initI18n();

const burgerOpenMenu = document.querySelector(".header__box-burger");
const navigationMenu = document.querySelector(".header__nav");
const burgerCloseMenu = document.querySelector(".header__nav-close");
if (burgerOpenMenu && navigationMenu) {
  burgerOpenMenu.addEventListener("click", () => {
    navigationMenu.classList.add("active");
  });
}

if (burgerCloseMenu && navigationMenu) {
  burgerCloseMenu.addEventListener("click", () => {
    navigationMenu.classList.remove("active");
  });
}
const tabItems = document.querySelectorAll(".tabs__list-item");
const tabPanels = document.querySelectorAll(".tabs__content-item");
tabItems.forEach((tab, index) => {
  tab.addEventListener("click", () => {
    tabItems.forEach((item) => item.classList.remove("active"));
    tabPanels.forEach((panel) => panel.classList.remove("active"));
    tab.classList.add("active");
    tabPanels[index].classList.add("active");
  });
});