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

const CONTACT_FORM_SUBMIT_ENDPOINT = "https://formsubmit.co/ajax/info@alamgroup.ca";

function initContactForm() {
  const form = document.getElementById("contactForm");
  const statusEl = document.getElementById("contactFormStatus");
  if (!form || !statusEl) return;

  /** @returns {HTMLElement | null} */
  function honeyEl() {
    try {
      return form.querySelector('[name="_honey"]');
    } catch {
      return null;
    }
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    statusEl.textContent = "";
    statusEl.classList.remove("is-error");

    const honeypot = honeyEl();
    if (honeypot && honeypot.value.trim()) {
      return;
    }

    /** @type {HTMLButtonElement | null} */
    const submitBtn = form.querySelector('button[type="submit"]');
    if (!submitBtn) return;

    const resetStatus = () => {
      submitBtn.disabled = false;
      submitBtn.textContent = submitBtn.dataset.labelDefault || submitBtn.textContent;
    };

    if (!submitBtn.dataset.labelDefault) {
      submitBtn.dataset.labelDefault = submitBtn.textContent;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";
    statusEl.textContent = "Sending…";

    const formData = new FormData(form);

    try {
      const response = await fetch(CONTACT_FORM_SUBMIT_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      const raw = await response.text();
      let body = {};
      try {
        body = JSON.parse(raw);
      } catch {
        /* Non-JSON error pages */
      }

      const msg =
        (body && typeof body.message === "string" && body.message) ||
        (body && typeof body.error === "string" && body.error) ||
        null;

      if (!response.ok) {
        statusEl.textContent =
          msg || "We could not send that just now. Please try again or email info@alamgroup.ca.";
        statusEl.classList.add("is-error");
        resetStatus();
        return;
      }

      form.reset();
      statusEl.textContent =
        msg || "Thank you—we received your note and typically reply within two business days.";
      statusEl.classList.remove("is-error");
      resetStatus();
    } catch {
      statusEl.textContent =
        "We could not send that just now (network error). Try again or reach us at info@alamgroup.ca.";
      statusEl.classList.add("is-error");
      resetStatus();
    }
  });
}

initContactForm();

// Reliable scroll-to-top for in-page #top links (avoids hash + sticky header quirks in some browsers).
document.querySelectorAll('a[href="#top"]').forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo(0, 0);
  });
});

