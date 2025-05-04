const navMain = document.querySelector(".main-nav");
const navToggle = document.querySelector(".page-header__toggle");
const adrsMap = document.querySelector(".address__map--nojs");

navMain.classList.remove("main-nav--nojs");
adrsMap.classList.remove("address__map--nojs");

navToggle.addEventListener("click", function () {
  if (navMain.classList.contains("main-nav--closed")) {
    navMain.classList.remove("main-nav--closed");
    navMain.classList.add("main-nav--opend");
    navToggle.classList.remove("page-header__toggle--closed");
    navToggle.classList.add("page-header__toggle--opend");
  } else {
    navMain.classList.add("main-nav--closed");
    navMain.classList.remove("main-nav--opend");
    navToggle.classList.add("page-header__toggle--closed");
    navToggle.classList.remove("page-header__toggle--opend");
  }
});
