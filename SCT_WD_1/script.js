const menuIcon = document.querySelector('.menuicon');
const navItems = document.querySelector('.navItems');

menuIcon.addEventListener('click', () => {
  navItems.classList.toggle('show');
});

navItems.addEventListener('click', () => {
  if (window.innerWidth < 768) {
    navItems.classList.toggle('show');
  }
});

let currentSlide = 0;
const slides = document.querySelectorAll(".slide");
const totalSlides = slides.length;

function changeSlide(direction = 1) {
  slides[currentSlide].classList.remove("active");
  currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
  slides[currentSlide].classList.add("active");
}

setInterval(() => changeSlide(), 5000);
document.querySelector(".next").addEventListener("click", () => {
  changeSlide(1);
});

document.querySelector(".prev").addEventListener("click", () => {
  changeSlide(-1);
});
