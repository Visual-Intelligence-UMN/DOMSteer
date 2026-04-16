/* --- Scroll fade-in animation --- */
(function () {
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(".fade-in").forEach(function (el) {
    observer.observe(el);
  });
})();

/* --- Progress bar (inverted: gray cover shrinks as you scroll) --- */
(function () {
  var bar = document.getElementById("progressbar");
  if (!bar) return;

  var raf = null;

  function update() {
    var doc = document.documentElement;
    var body = document.body;
    var scrollTop = doc.scrollTop || body.scrollTop || 0;
    var max = (doc.scrollHeight || body.scrollHeight) - doc.clientHeight;
    var progress = max > 0 ? scrollTop / max : 0;
    bar.style.width = (progress * 100) + "%";
  }

  function onScroll() {
    if (raf) return;
    raf = requestAnimationFrame(function () {
      raf = null;
      update();
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", update);
  update();
})();

/* --- BibTeX copy to clipboard --- */
var copyBtn = document.getElementById("copy-button");
if (copyBtn) {
  copyBtn.addEventListener("click", function () {
    var btn = this;
    var text = document.getElementById("bibtex-text").innerText;
    navigator.clipboard.writeText(text).then(function () {
      btn.innerHTML = '<i class="fa fa-check" aria-hidden="true"></i> Copied';
      setTimeout(function () {
        btn.innerHTML = '<i class="fa fa-clipboard" aria-hidden="true"></i> Copy';
      }, 2000);
    });
  });
}

/* --- Tabs --- */
document.querySelectorAll(".tab").forEach(function (tab) {
  tab.addEventListener("click", function () {
    var group = this.closest(".operation-group");
    group.querySelectorAll(".tab").forEach(function (t) { t.classList.remove("active"); });
    group.querySelectorAll(".tab-panel").forEach(function (p) { p.classList.remove("active"); });
    this.classList.add("active");
    document.getElementById(this.getAttribute("data-tab")).classList.add("active");
  });
});


/* --- Carousel: shuffle + slow auto-scroll --- */
(function () {
  var track = document.querySelector(".carousel-track");
  if (!track) return;

  // Shuffle cards randomly
  var cards = Array.from(track.children);
  for (var i = cards.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    track.appendChild(cards[j]);
    cards.splice(j, 1, cards[i]);
  }

  var speed = 0.5;
  var direction = 1;
  var paused = false;

  function autoScroll() {
    if (!paused) {
      track.scrollLeft += speed * direction;
      var maxScroll = track.scrollWidth - track.clientWidth;
      if (track.scrollLeft >= maxScroll) direction = -1;
      if (track.scrollLeft <= 0) direction = 1;
    }
    requestAnimationFrame(autoScroll);
  }

  track.addEventListener("mouseenter", function () { paused = true; });
  track.addEventListener("mouseleave", function () { paused = false; });
  track.addEventListener("touchstart", function () { paused = true; }, { passive: true });
  track.addEventListener("touchend", function () {
    setTimeout(function () { paused = false; }, 3000);
  });

  requestAnimationFrame(autoScroll);
})();

/* --- Gallery (auto-rotate figure / video) --- */
(function () {
  var items = document.querySelectorAll(".gallery-media");
  var dots = document.querySelectorAll(".gallery-dot");
  if (!items.length) return;

  var current = 0;
  var timer = null;

  function show(index) {
    if (index === current) return;
    var prev = current;

    items[prev].classList.remove("active");
    items[prev].classList.add("exit-left");
    if (items[prev].tagName === "VIDEO") items[prev].pause();

    setTimeout(function () {
      items[prev].classList.remove("exit-left");
    }, 600);

    items[index].classList.add("active");
    dots.forEach(function (d) { d.classList.remove("active"); });
    dots[index].classList.add("active");
    if (items[index].tagName === "VIDEO") items[index].play();
    current = index;
  }

  function next() {
    show((current + 1) % items.length);
  }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(next, 8000);
  }

  dots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      show(parseInt(this.getAttribute("data-index")));
      startAuto();
    });
  });

  startAuto();
})();

/* --- Smooth scroll for anchor links --- */
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    var href = this.getAttribute("href");
    if (href === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      var target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: "smooth" });
    }
  });
});
