(function() {
  var toggle = document.querySelector(".menu-toggle");
  var panel = document.querySelector(".mobile-panel");

  if (toggle && panel) {
    toggle.addEventListener("click", function() {
      panel.classList.toggle("is-open");
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
  var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
  var activeSlide = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    activeSlide = (index + slides.length) % slides.length;
    slides.forEach(function(slide, i) {
      slide.classList.toggle("is-active", i === activeSlide);
    });
    dots.forEach(function(dot, i) {
      dot.classList.toggle("is-active", i === activeSlide);
    });
  }

  dots.forEach(function(dot) {
    dot.addEventListener("click", function() {
      var target = parseInt(dot.getAttribute("data-target-slide") || "0", 10);
      showSlide(target);
    });
  });

  if (slides.length > 1) {
    setInterval(function() {
      showSlide(activeSlide + 1);
    }, 5200);
  }

  var params = new URLSearchParams(window.location.search);
  var query = params.get("q") || "";
  var searchInputs = Array.prototype.slice.call(document.querySelectorAll(".page-search"));
  var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-list .movie-card"));
  var empty = document.querySelector(".empty-state");
  var chips = Array.prototype.slice.call(document.querySelectorAll(".filter-chip"));
  var chipValue = "";

  function normalize(value) {
    return (value || "").toString().trim().toLowerCase();
  }

  function applyFilter() {
    if (!cards.length) {
      return;
    }
    var term = normalize(searchInputs[0] ? searchInputs[0].value : query);
    var chip = normalize(chipValue);
    var visible = 0;

    cards.forEach(function(card) {
      var text = normalize(card.getAttribute("data-search-text") || card.textContent);
      var matched = (!term || text.indexOf(term) !== -1) && (!chip || text.indexOf(chip) !== -1);
      card.hidden = !matched;
      if (matched) {
        visible += 1;
      }
    });

    if (empty) {
      empty.classList.toggle("is-visible", visible === 0);
    }
  }

  if (query && searchInputs.length) {
    searchInputs.forEach(function(input) {
      input.value = query;
    });
  }

  searchInputs.forEach(function(input) {
    input.addEventListener("input", applyFilter);
  });

  chips.forEach(function(chip) {
    chip.addEventListener("click", function() {
      chips.forEach(function(item) {
        item.classList.remove("is-active");
      });
      chip.classList.add("is-active");
      chipValue = chip.getAttribute("data-chip") || "";
      applyFilter();
    });
  });

  applyFilter();
}());
