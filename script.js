const gallery = document.getElementById("gallery");
const categoryButtons = document.querySelectorAll(".category");

// Image data — paths match files under ./images/<folder>/
const imagesData = {
  birthday: [
    "images/Birthday/im1.jpg",
    "images/Birthday/im2.jpg",
    "images/Birthday/im3.jpg",
    "images/Birthday/im4.webp",
    "images/Birthday/im5.webp",
    "images/Birthday/im6.webp",
    "images/Birthday/im7.webp",
    "images/Birthday/im8.webp",
    "images/Birthday/im9.webp",
    "images/Birthday/im10.webp",
    "images/Birthday/im11.webp",
    "images/Birthday/im12.webp"
  ],
  wedding: [
    "images/Wedding/im1.webp",
    "images/Wedding/im2.webp",
    "images/Wedding/im3.webp",
    "images/Wedding/im4.webp",
    "images/Wedding/im5.webp",
    "images/Wedding/im6.webp",
    "images/Wedding/im7.webp",
    "images/Wedding/im8.webp",
    "images/Wedding/im9.webp",
    "images/Wedding/im10.webp"
  ],
  "baby-welcome": [
    "images/Baby welcome/im1.webp",
    "images/Baby welcome/im2.webp",
    "images/Baby welcome/im3.webp",
    "images/Baby welcome/im4.webp",
    "images/Baby welcome/im5.webp",
    "images/Baby welcome/im6.webp",
    "images/Baby welcome/im7.webp",
    "images/Baby welcome/im8.webp"
  ],
  naming: [
    "images/Naming/im1.webp",
    "images/Naming/im2.webp",
    "images/Naming/im3.webp",
    "images/Naming/im4.webp",
    "images/Naming/im5.webp",
    "images/Naming/im6.webp",
    "images/Naming/im7.webp",
    "images/Naming/im8.webp"
  ],
  haldi: [
    "images/Haldi/im1.webp",
    "images/Haldi/im2.webp",
    "images/Haldi/im3.webp",
    "images/Haldi/im4.webp",
    "images/Haldi/im5.webp",
    "images/Haldi/im6.webp"
  ]
};

const categoryAltLabel = {
  birthday: "Birthday party",
  wedding: "Wedding",
  "baby-welcome": "Baby welcome",
  naming: "Naming ceremony",
  haldi: "Haldi"
};

function altForGalleryImage(category, src) {
  const file = src.split("/").pop();
  const label = categoryAltLabel[category] || "Event";
  return `${label} decoration — ${file}`;
}

categoryButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const category = btn.getAttribute("data-filter");
    loadImages(category);
  });
});

function loadImages(category) {
  gallery.innerHTML = "";

  imagesData[category].forEach(src => {
    const card = document.createElement("article");
    card.className = "gallery-card";

    const media = document.createElement("div");
    media.className = "gallery-card__media";

    const img = document.createElement("img");
    img.src = src;
    img.alt = altForGalleryImage(category, src);

    img.addEventListener("click", () => {
      openLightbox(src, img.alt);
    });

    media.appendChild(img);
    card.appendChild(media);
    gallery.appendChild(card);
  });
}

// Lightbox (reuse your existing)
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const closeBtn = document.querySelector(".close");

function openLightbox(src, altText) {
  lightbox.style.display = "flex";
  lightboxImg.src = src;
  lightboxImg.alt = altText || "";
}

closeBtn.addEventListener("click", () => {
  lightbox.style.display = "none";
});

/* Hero carousel — auto-advance every 3s */
(function initHeroCarousel() {
  const slides = document.querySelectorAll(".hero-carousel__slide");
  const dots = document.querySelectorAll(".hero-carousel__dot");
  if (!slides.length || slides.length !== dots.length) return;

  let index = 0;
  const total = slides.length;
  const INTERVAL_MS = 3000;

  function goTo(i) {
    index = ((i % total) + total) % total;
    slides.forEach((slide, n) => {
      const on = n === index;
      slide.classList.toggle("is-active", on);
      slide.setAttribute("aria-hidden", on ? "false" : "true");
    });
    dots.forEach((dot, n) => {
      const on = n === index;
      dot.classList.toggle("is-active", on);
      dot.setAttribute("aria-selected", on ? "true" : "false");
    });
  }

  function next() {
    goTo(index + 1);
  }

  let timer = setInterval(next, INTERVAL_MS);

  dots.forEach((dot, n) => {
    dot.addEventListener("click", () => {
      goTo(n);
    });
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      clearInterval(timer);
      timer = null;
    } else if (!timer) {
      timer = setInterval(next, INTERVAL_MS);
    }


    // Testimonials Carousel Auto-Slide Logic
document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('reviewsTrack');
    const dots = document.querySelectorAll('#reviewsDots .dot');
    
    // Make sure the elements actually exist on the page before running
    if (!track || dots.length === 0) return;
  
    let currentIndex = 0;
    const totalSlides = dots.length;
  
    function updateReviewCarousel() {
      // Move the track left by 100% per slide
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      
      // Update the dots to show which slide is active
      dots.forEach(dot => dot.classList.remove('active'));
      dots[currentIndex].classList.add('active');
    }
  
    function nextReviewSlide() {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateReviewCarousel();
    }
  
    // Slide automatically every 3 seconds (3000 milliseconds)
    let reviewInterval = setInterval(nextReviewSlide, 3000);
  
    // Let users tap a dot to manually go to that slide
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        currentIndex = index;
        updateReviewCarousel();
        
        // Reset the timer so it doesn't immediately slide after tapping
        clearInterval(reviewInterval);
        reviewInterval = setInterval(nextReviewSlide, 3000);
      });
    });
  });
  });
})();
