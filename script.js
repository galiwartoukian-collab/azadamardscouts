const galleryImages = document.querySelectorAll(".gallery-img");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");
const lightboxCounter = document.getElementById("lightboxCounter");

let currentIndex = 0;
const images = Array.from(galleryImages);

let touchStartX = 0;
let touchEndX = 0;

function showImage(index) {
  if (!images.length) return;

  currentIndex = index;
  lightboxImage.classList.remove("is-visible");

  setTimeout(() => {
    lightboxImage.src = images[currentIndex].src;
    lightboxImage.alt = images[currentIndex].alt;
    if (lightboxCounter) {
      lightboxCounter.textContent = `${currentIndex + 1} / ${images.length}`;
    }
    lightbox.classList.add("active");
    requestAnimationFrame(() => {
      lightboxImage.classList.add("is-visible");
    });
  }, 120);
}

function closeLightbox() {
  lightbox.classList.remove("active");
}

function showPrevImage() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  showImage(currentIndex);
}

function showNextImage() {
  currentIndex = (currentIndex + 1) % images.length;
  showImage(currentIndex);
}

if (
  images.length &&
  lightbox &&
  lightboxImage &&
  lightboxClose &&
  lightboxPrev &&
  lightboxNext
) {
  images.forEach((img, index) => {
    img.addEventListener("click", () => {
      showImage(index);
    });
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", showPrevImage);
  lightboxNext.addEventListener("click", showNextImage);

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;

    if (e.key === "Escape") {
      closeLightbox();
    }

    if (e.key === "ArrowLeft") {
      showPrevImage();
    }

    if (e.key === "ArrowRight") {
      showNextImage();
    }
  });

  lightboxImage.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  lightboxImage.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const swipeDistance = touchEndX - touchStartX;

    if (swipeDistance > 50) {
      showPrevImage();
    } else if (swipeDistance < -50) {
      showNextImage();
    }
  });
}