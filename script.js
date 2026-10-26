(function () {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  const toggle = document.getElementById("theme-toggle");
  const stored = window.localStorage.getItem("profile-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const startDark = stored ? stored === "dark" : prefersDark;

  function applyTheme(isDark) {
    document.body.classList.toggle("theme-dark", isDark);
    if (toggle) {
      toggle.setAttribute("aria-pressed", String(isDark));
      toggle.textContent = isDark ? "Light mode" : "Dark mode";
    }
  }

  applyTheme(startDark);

  if (toggle) {
    toggle.addEventListener("click", function () {
      const nextDark = !document.body.classList.contains("theme-dark");
      applyTheme(nextDark);
      window.localStorage.setItem("profile-theme", nextDark ? "dark" : "light");
    });
  }

  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll('nav a[href^="#"]');

  function setActiveLink() {
    let current = "";
    sections.forEach(function (section) {
      const top = section.getBoundingClientRect().top;
      if (top <= 120) {
        current = section.id;
      }
    });

    navLinks.forEach(function (link) {
      const href = link.getAttribute("href");
      link.classList.toggle("is-active", href === "#" + current);
    });
  }

  window.addEventListener("scroll", setActiveLink, { passive: true });
  setActiveLink();

  const searchInput = document.getElementById("project-search");
  const filterButtons = document.querySelectorAll(".filter-chip");
  const projectCards = document.querySelectorAll(".project-card");
  const statusEl = document.getElementById("project-status");
  let activeFilter = "all";

  function matchesSearch(card, query) {
    if (!query) {
      return true;
    }
    const haystack = [
      card.dataset.name || "",
      card.dataset.tech || "",
      card.textContent || ""
    ].join(" ").toLowerCase();
    return haystack.includes(query);
  }

  function matchesFilter(card, filter) {
    if (filter === "all") {
      return true;
    }
    const tech = (card.dataset.tech || "").toLowerCase();
    return tech.split(/\s+/).includes(filter);
  }

  function filterProjects() {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    let visible = 0;

    projectCards.forEach(function (card) {
      const show = matchesSearch(card, query) && matchesFilter(card, activeFilter);
      card.classList.toggle("is-hidden", !show);
      if (show) {
        visible += 1;
      }
    });

    if (statusEl) {
      if (visible === 0) {
        statusEl.textContent = "No projects match that search.";
      } else if (query || activeFilter !== "all") {
        statusEl.textContent = visible + " project" + (visible === 1 ? "" : "s") + " shown.";
      } else {
        statusEl.textContent = "";
      }
    }
  }

  if (searchInput) {
    searchInput.addEventListener("input", filterProjects);
    searchInput.addEventListener("change", filterProjects);
    searchInput.addEventListener("search", filterProjects);
  }

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      activeFilter = (button.getAttribute("data-filter") || "all").toLowerCase();
      filterButtons.forEach(function (chip) {
        const selected = chip === button;
        chip.classList.toggle("is-active", selected);
        chip.setAttribute("aria-pressed", String(selected));
      });
      filterProjects();
    });
  });
})();
