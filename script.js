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
  let isAnimating = false;

  function updateCounter() {
    if (lightboxCounter) {
      lightboxCounter.textContent = `${currentIndex + 1} / ${images.length}`;
    }
  }

  function openLightbox(index) {
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
    lightboxImage.classList.remove("is-pressing");
    lightboxImage.classList.remove("is-visible");

    lightboxImage.src = images[currentIndex].src;
    lightboxImage.alt = images[currentIndex].alt || "";
    updateCounter();
    lightbox.classList.add("active");

    requestAnimationFrame(() => {
      lightboxImage.classList.add("is-visible");
    });
  }

  function swapImage(nextIndex) {
    if (!images.length || isAnimating) return;

    isAnimating = true;
    lightboxImage.classList.add("is-pressing");

    setTimeout(() => {
      currentIndex = nextIndex;
      lightboxImage.classList.remove("is-visible");

      const newSrc = images[currentIndex].src;
      const newAlt = images[currentIndex].alt || "";

      lightboxImage.onload = () => {
        updateCounter();

        requestAnimationFrame(() => {
          lightboxImage.classList.add("is-visible");
          lightboxImage.classList.remove("is-pressing");
          isAnimating = false;
        });
      };

      lightboxImage.src = newSrc;
      lightboxImage.alt = newAlt;
    }, 120);
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("active");
    lightboxImage.classList.remove("is-pressing");
    lightboxImage.classList.remove("is-visible");
    isAnimating = false;
  }

  function showPrevImage() {
    if (!images.length) return;
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    swapImage(prevIndex);
  }

  function showNextImage() {
    if (!images.length) return;
    const nextIndex = (currentIndex + 1) % images.length;
    swapImage(nextIndex);
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
        openLightbox(index);
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