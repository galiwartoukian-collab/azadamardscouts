const galleryImages = document.querySelectorAll(".gallery-img");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");

let currentIndex = 0;
const images = Array.from(galleryImages);

function showImage(index) {
  currentIndex = index;
  lightboxImage.src = images[currentIndex].src;
  lightboxImage.alt = images[currentIndex].alt;
  lightbox.classList.add("active");
}

if (galleryImages.length && lightbox && lightboxImage && lightboxClose && lightboxPrev && lightboxNext) {
  galleryImages.forEach((img, index) => {
    img.addEventListener("click", () => {
      showImage(index);
    });
  });

  lightboxClose.addEventListener("click", () => {
    lightbox.classList.remove("active");
  });

  lightboxPrev.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex);
  });

  lightboxNext.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
  });

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove("active");
    }
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;

    if (e.key === "Escape") {
      lightbox.classList.remove("active");
    }

    if (e.key === "ArrowLeft") {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      showImage(currentIndex);
    }

    if (e.key === "ArrowRight") {
      currentIndex = (currentIndex + 1) % images.length;
      showImage(currentIndex);
    }
  });
}