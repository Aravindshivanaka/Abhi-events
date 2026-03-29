/* Category page: hero.* resolution, grid, premium fullscreen lightbox */
(function () {
  const {
    imagesData,
    folderBaseByCategory,
    categoryDisplayName,
    altForGalleryImage,
    buildWhatsappInquiryUrl,
    getGridImagesForCategory
  } = window.AbhiEvents;

  const params = new URLSearchParams(window.location.search);
  const categoryKey = params.get("c");
  if (!categoryKey || !imagesData[categoryKey]) {
    window.location.replace("index.html");
    return;
  }

  const displayName = categoryDisplayName[categoryKey] || categoryKey;
  const folderBase = folderBaseByCategory[categoryKey];
  let gridImages = getGridImagesForCategory(categoryKey);
  if (!gridImages.length) {
    gridImages = imagesData[categoryKey].slice();
  }

  let lightboxIndex = 0;
  let touchStartX = null;

  const titleEl = document.getElementById("category-page-title");
  const gridMeta = document.getElementById("category-grid-meta");
  const gridEl = document.getElementById("category-grid");
  const heroSection = document.getElementById("category-hero");
  const heroImg = document.getElementById("category-hero-img");
  const heroPlaceholder = document.getElementById("category-hero-placeholder");

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxWa = document.getElementById("lightbox-wa");
  const lightboxDl = document.getElementById("lightbox-download");
  const lightboxClose = document.getElementById("lightbox-close");
  const lightboxPrev = document.getElementById("lightbox-prev");
  const lightboxNext = document.getElementById("lightbox-next");
  const lightboxDismiss = document.getElementById("lightbox-dismiss");
  const lightboxCounter = document.getElementById("lightbox-counter");

  if (titleEl) titleEl.textContent = displayName;
  if (gridMeta) {
    gridMeta.textContent =
      gridImages.length +
      " photo" +
      (gridImages.length === 1 ? "" : "s") +
      " — tap to view";
  }

  function tryResolveHero(callback) {
    if (!folderBase) {
      callback(null);
      return;
    }
    const exts = ["webp", "jpg", "jpeg", "png"];
    let i = 0;
    function tryNext() {
      if (i >= exts.length) {
        callback(null);
        return;
      }
      const ext = exts[i++];
      const src = folderBase + "hero." + ext;
      const im = new Image();
      im.onload = function () {
        callback(src);
      };
      im.onerror = tryNext;
      im.src = src;
    }
    tryNext();
  }

  tryResolveHero(function (heroSrc) {
    if (heroSrc && heroImg && heroPlaceholder) {
      heroImg.src = heroSrc;
      heroImg.alt = displayName + " — featured decoration";
      heroImg.hidden = false;
      heroPlaceholder.hidden = true;
    } else if (heroPlaceholder) {
      heroPlaceholder.hidden = false;
      if (heroImg) heroImg.hidden = true;
    }
  });

  function openLightbox(index) {
    if (!gridImages.length) return;
    lightboxIndex =
      (index % gridImages.length + gridImages.length) % gridImages.length;
    updateLightboxView();
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
  }

  function updateLightboxView() {
    if (!gridImages.length) return;
    const src = gridImages[lightboxIndex];
    lightboxImg.src = src;
    lightboxImg.alt = altForGalleryImage(categoryKey, src);
    const n = lightboxIndex + 1;
    if (lightboxWa) {
      lightboxWa.href = buildWhatsappInquiryUrl(displayName, n);
    }
    if (lightboxCounter) {
      lightboxCounter.textContent = n + " / " + gridImages.length;
    }
  }

  function stepLightbox(delta) {
    if (!gridImages.length) return;
    lightboxIndex =
      (lightboxIndex + delta + gridImages.length) % gridImages.length;
    updateLightboxView();
  }

  function downloadCurrentImage() {
    const src = gridImages[lightboxIndex];
    const name = src.split("/").pop() || "decoration.jpg";
    const a = document.createElement("a");
    a.href = src;
    a.download = name;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  if (!gridImages.length) {
    gridEl.innerHTML =
      '<p class="category-page__empty">No gallery images in this category yet.</p>';
    if (gridMeta) gridMeta.textContent = "";
  }

  gridImages.forEach(function (src, idx) {
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "category-grid-cell";
    cell.setAttribute("aria-label", "View image " + (idx + 1));

    const wrap = document.createElement("div");
    wrap.className = "category-grid-cell__inner";

    const img = document.createElement("img");
    img.src = src;
    img.alt = altForGalleryImage(categoryKey, src);
    img.loading = "lazy";
    img.decoding = "async";

    wrap.appendChild(img);
    cell.appendChild(wrap);
    cell.addEventListener("click", function () {
      openLightbox(idx);
    });
    gridEl.appendChild(cell);
  });

  if (lightboxPrev) {
    lightboxPrev.addEventListener("click", function (e) {
      e.stopPropagation();
      stepLightbox(-1);
    });
  }
  if (lightboxNext) {
    lightboxNext.addEventListener("click", function (e) {
      e.stopPropagation();
      stepLightbox(1);
    });
  }
  if (lightboxClose) {
    lightboxClose.addEventListener("click", function (e) {
      e.stopPropagation();
      closeLightbox();
    });
  }
  if (lightboxDismiss) {
    lightboxDismiss.addEventListener("click", closeLightbox);
  }
  if (lightboxDl) {
    lightboxDl.addEventListener("click", function (e) {
      e.stopPropagation();
      downloadCurrentImage();
    });
  }

  lightbox.addEventListener("touchstart", function (e) {
    if (e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
    }
  }, { passive: true });

  lightbox.addEventListener("touchend", function (e) {
    if (touchStartX == null || !e.changedTouches.length) return;
    const endX = e.changedTouches[0].clientX;
    const dx = endX - touchStartX;
    touchStartX = null;
    if (Math.abs(dx) < 56) return;
    if (dx < 0) stepLightbox(1);
    else stepLightbox(-1);
  }, { passive: true });

  document.addEventListener("keydown", function (e) {
    if (lightbox.hidden) return;
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowLeft") stepLightbox(-1);
    else if (e.key === "ArrowRight") stepLightbox(1);
  });
})();
