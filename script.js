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
    var text = document.getElementById("bibtex-text").innerText;
    navigator.clipboard.writeText(text).then(function () {
      alert("BibTeX copied to clipboard!");
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

/* --- Smooth scroll for anchor links --- */
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    var target = document.querySelector(this.getAttribute("href"));
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });
});
