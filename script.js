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
/* GALLERY CATEGORY COUNTS */
const galleryCategoriesEl = document.getElementById("galleryCategories");

if (galleryCategoriesEl && typeof galleryData !== "undefined") {
  const categoryOrder = ["camp", "weekly", "events", "field-trips"];

  galleryCategoriesEl.innerHTML = categoryOrder.map((key) => {
    const gallery = galleryData[key];
    const count = gallery.images.length;
    const subText = count > 0 ? `${count} photo${count === 1 ? "" : "s"}` : "Coming soon";

    const coverStyle =
      key === "field-trips"
        ? `background-image:linear-gradient(rgba(0,0,0,.35),rgba(0,0,0,.65)), url('${gallery.cover}');`
        : `background-image:url('${gallery.cover}');`;

    return `
      <a class="gallery-card" href="${key}.html">
        <div class="gallery-card-media" style="${coverStyle}"></div>
        <div class="gallery-card-body">
          <div class="gallery-card-title">${gallery.title}</div>
          <div class="gallery-card-sub">${subText}</div>
        </div>
      </a>
    `;
  }).join("");
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