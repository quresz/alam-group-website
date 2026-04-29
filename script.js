const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const yearNode = document.getElementById("year");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
    });
  });
}

if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

// Reliable scroll-to-top for in-page #top links (avoids hash + sticky header quirks in some browsers).
document.querySelectorAll('a[href="#top"]').forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo(0, 0);
  });
});

