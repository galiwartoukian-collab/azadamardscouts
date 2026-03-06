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

  /* NEXT EVENT CARD */
  async function loadNextEvent() {
    const nextEventEl = document.getElementById("nextEvent");
    if (!nextEventEl) return;

    const calendarId = "galiwartoukian@gmail.com";
    const apiKey = "AIzaSyCEXzb-KFDyiOzauHjCqh5suF5tORp0feQ";

    const now = new Date().toISOString();

    const url =
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events` +
      `?key=${apiKey}` +
      `&singleEvents=true` +
      `&orderBy=startTime` +
      `&timeMin=${encodeURIComponent(now)}` +
      `&maxResults=1`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (!data.items || !data.items.length) {
        nextEventEl.innerHTML = `
          <strong>No upcoming events yet</strong><br>
          Check back soon.
        `;
        return;
      }

      const event = data.items[0];
      const title = event.summary || "Upcoming Event";
      const location = event.location || "";

      const startRaw = event.start?.dateTime || event.start?.date;
      const endRaw = event.end?.dateTime || event.end?.date;

      const startDate = new Date(startRaw);
      const endDate = endRaw ? new Date(endRaw) : null;

      const dateText = startDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric"
      });

      let timeText = "All day";

      if (event.start?.dateTime) {
        const startTime = startDate.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit"
        });

        const endTime = endDate
          ? endDate.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit"
            })
          : "";

        timeText = endTime ? `${startTime} – ${endTime}` : startTime;
      }

      nextEventEl.innerHTML = `
        <strong>${title}</strong><br>
        <span>${dateText}</span><br>
        <span>${timeText}</span>
        ${location ? `<br><span>${location}</span>` : ""}
      `;
    } catch (error) {
      console.error("Error loading next event:", error);
      nextEventEl.innerHTML = `
        <strong>Unable to load next event</strong><br>
        Please check the full calendar.
      `;
    }
  }

  loadNextEvent();
});