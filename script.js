<script>
  document.addEventListener("DOMContentLoaded", () => {
    /* YEAR */
    const yearEl = document.getElementById("year");
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }

    /* HAMBURGER MENU */
    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".nav");
    const navLinks = document.querySelectorAll(".nav a");

    if (menuToggle && nav) {
      menuToggle.addEventListener("click", (event) => {
        event.stopPropagation();
        nav.classList.toggle("nav-open");

        const expanded = nav.classList.contains("nav-open");
        menuToggle.setAttribute("aria-expanded", expanded ? "true" : "false");
      });

      navLinks.forEach((link) => {
        link.addEventListener("click", () => {
          nav.classList.remove("nav-open");
          menuToggle.setAttribute("aria-expanded", "false");
        });
      });

      document.addEventListener("click", (event) => {
        const clickedToggle = menuToggle.contains(event.target);
        const clickedNav = nav.contains(event.target);

        if (!clickedToggle && !clickedNav) {
          nav.classList.remove("nav-open");
          menuToggle.setAttribute("aria-expanded", "false");
        }
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          nav.classList.remove("nav-open");
          menuToggle.setAttribute("aria-expanded", "false");
        }
      });
    }

    /* GALLERY LIGHTBOX */
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

    function updateLightboxImage(index) {
      if (!images.length || !lightboxImage || !lightbox) return;

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

    function openLightbox(index) {
      updateLightboxImage(index);
    }

    function closeLightbox() {
      if (!lightbox) return;
      lightbox.classList.remove("active");
    }

    function showPrevImage() {
      if (!images.length) return;
      const newIndex = (currentIndex - 1 + images.length) % images.length;
      updateLightboxImage(newIndex);
    }

    function showNextImage() {
      if (!images.length) return;
      const newIndex = (currentIndex + 1) % images.length;
      updateLightboxImage(newIndex);
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
        }

        if (event.key === "ArrowLeft") {
          showPrevImage();
        }

        if (event.key === "ArrowRight") {
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
</script>