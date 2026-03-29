/* Home page: hero carousel + header search */
(function () {
  const searchToggle = document.getElementById("search-toggle");
  const searchPanel = document.getElementById("search-panel");
  const searchInput = document.getElementById("header-search-input");
  const suggestionsEl = document.getElementById("search-suggestions");
  const categories = window.AbhiEvents.searchCategories;

  function setSearchOpen(open) {
    if (!searchPanel || !searchToggle) return;
    searchPanel.hidden = !open;
    searchToggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (open && searchInput) {
      searchInput.focus();
      filterSuggestions((searchInput.value || "").trim());
    } else {
      hideSuggestions();
    }
  }

  function hideSuggestions() {
    if (!suggestionsEl) return;
    suggestionsEl.hidden = true;
    suggestionsEl.innerHTML = "";
    if (searchInput) searchInput.setAttribute("aria-expanded", "false");
  }

  function showSuggestions(items) {
    if (!suggestionsEl || !searchInput) return;
    suggestionsEl.innerHTML = "";
    if (!items.length) {
      hideSuggestions();
      return;
    }
    items.forEach(function (item) {
      const li = document.createElement("li");
      li.className = "search-suggestions__item";
      li.setAttribute("role", "option");
      li.textContent = item.label;
      li.addEventListener("click", function () {
        window.location.href =
          "category.html?c=" + encodeURIComponent(item.slug);
      });
      suggestionsEl.appendChild(li);
    });
    suggestionsEl.hidden = false;
    searchInput.setAttribute("aria-expanded", "true");
  }

  function filterSuggestions(query) {
    const q = query.toLowerCase();
    const matched = categories.filter(function (c) {
      return !q || c.label.toLowerCase().includes(q);
    });
    showSuggestions(matched);
  }

  if (searchToggle && searchPanel) {
    searchToggle.addEventListener("click", function () {
      const open = searchPanel.hidden;
      setSearchOpen(open);
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      filterSuggestions(searchInput.value.trim());
    });

    searchInput.addEventListener("focus", function () {
      if (!searchPanel.hidden) filterSuggestions(searchInput.value.trim());
    });

    searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        setSearchOpen(false);
        if (searchToggle) searchToggle.focus();
      }
    });
  }

  document.addEventListener("click", function (e) {
    if (!searchPanel || searchPanel.hidden) return;
    const t = e.target;
    if (
      searchPanel.contains(t) ||
      (searchToggle && searchToggle.contains(t))
    ) {
      return;
    }
    setSearchOpen(false);
  });

  /* Hero carousel — auto-advance every 3s */
  const slides = document.querySelectorAll(".hero-carousel__slide");
  const dots = document.querySelectorAll(".hero-carousel__dot");
  if (slides.length && dots.length && slides.length === dots.length) {
    let index = 0;
    const total = slides.length;
    const INTERVAL_MS = 3000;

    function goTo(i) {
      index = ((i % total) + total) % total;
      slides.forEach(function (slide, n) {
        const on = n === index;
        slide.classList.toggle("is-active", on);
        slide.setAttribute("aria-hidden", on ? "false" : "true");
      });
      dots.forEach(function (dot, n) {
        const on = n === index;
        dot.classList.toggle("is-active", on);
        dot.setAttribute("aria-selected", on ? "true" : "false");
      });
    }

    function next() {
      goTo(index + 1);
    }

    let timer = setInterval(next, INTERVAL_MS);

    dots.forEach(function (dot, n) {
      dot.addEventListener("click", function () {
        goTo(n);
      });
    });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        clearInterval(timer);
        timer = null;
      } else if (!timer) {
        timer = setInterval(next, INTERVAL_MS);
      }
    });
  }
})();
