document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* LIGHTBOX */
  const galleryImages = document.querySelectorAll(".gallery-img");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");
  const lightboxCounter = document.getElementById("lightboxCounter");

  const images = Array.from(galleryImages);
  let currentIndex = 0;
  let touchStartX = 0;
  let touchEndX = 0;

  function showImage(index) {
    if (
      !images.length ||
      !lightbox ||
      !lightboxImage ||
      !lightboxClose ||
      !lightboxPrev ||
      !lightboxNext
    ) {
      return;
    }

    currentIndex = index;
    lightboxImage.classList.remove("is-visible");

    setTimeout(() => {
      lightboxImage.src = images[currentIndex].src;
      lightboxImage.alt = images[currentIndex].alt || "";

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
    if (!lightbox) return;
    lightbox.classList.remove("active");
  }

  function showPrevImage() {
    if (!images.length) return;
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex);
  }

  function showNextImage() {
    if (!images.length) return;
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

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (!lightbox.classList.contains("active")) return;

      if (event.key === "Escape") {
        closeLightbox();
      } else if (event.key === "ArrowLeft") {
        showPrevImage();
      } else if (event.key === "ArrowRight") {
        showNextImage();
      }
    });

    lightboxImage.addEventListener("touchstart", (event) => {
      touchStartX = event.changedTouches[0].screenX;
    });

    lightboxImage.addEventListener("touchend", (event) => {
      touchEndX = event.changedTouches[0].screenX;
      const swipeDistance = touchEndX - touchStartX;

      if (swipeDistance > 50) {
        showPrevImage();
      } else if (swipeDistance < -50) {
        showNextImage();
      }
    });
  }
});