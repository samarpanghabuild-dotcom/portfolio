/* ═══════════════════════════════════════════════
   SAMARPAN GORLEWAR — PORTFOLIO JS  v2
   ═══════════════════════════════════════════════ */

/* ─── CURSOR GLOW ─── */
const glow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top  = e.clientY + 'px';
});

/* ─── TYPED TEXT ─── */
const roles = [
  "Customer Support Executive",
  "Technical Chat Support",
  "Voice & Chat Support Agent",
  "CRM & CSAT Champion",
];
let roleIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById("typedText");

function typeLoop() {
  const current = roles[roleIdx];
  if (!deleting) {
    typedEl.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) { deleting = true; setTimeout(typeLoop, 1800); return; }
  } else {
    typedEl.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; }
  }
  setTimeout(typeLoop, deleting ? 45 : 80);
}
typeLoop();

/* ─── PARTICLES CANVAS ─── */
(function () {
  const container = document.getElementById("particles");
  const canvas = document.createElement("canvas");
  container.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener("resize", resize);

  const dots = Array.from({ length: 80 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.8 + 0.4,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    alpha: Math.random() * 0.45 + 0.15,
  }));

  let mx = null, my = null;
  window.addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; });

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    dots.forEach(d => {
      // slight mouse repulsion
      if (mx !== null) {
        const dx = d.x - mx, dy = d.y - my;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 100) { d.vx += dx * 0.0002; d.vy += dy * 0.0002; }
      }
      d.x += d.vx; d.y += d.vy;
      if (d.x < 0 || d.x > canvas.width)  d.vx *= -1;
      if (d.y < 0 || d.y > canvas.height) d.vy *= -1;

      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(46,134,193,${d.alpha})`;
      ctx.fill();
    });

    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x, dy = dots[i].y - dots[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.strokeStyle = `rgba(46,134,193,${0.1 * (1 - dist/130)})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ─── NAVBAR ─── */
const navbar  = document.getElementById("navbar");
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 60);

  let current = "";
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 130) current = s.id; });
  navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${current}`));

  document.getElementById("backTop").classList.toggle("visible", window.scrollY > 400);
});

/* ─── HAMBURGER ─── */
document.getElementById("hamburger").addEventListener("click", () => {
  document.getElementById("navLinks").classList.toggle("open");
});

/* ─── BACK TO TOP ─── */
document.getElementById("backTop").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ─── SMOOTH SCROLL ─── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", e => {
    const target = document.querySelector(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    document.getElementById("navLinks").classList.remove("open");
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

/* ─── TIMELINE REVEAL ─── */
function revealItem(el) {
  el.classList.remove("anim-ready");
  el.classList.add("visible");
}

const revealObs = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) revealItem(e.target); }),
  { threshold: 0.05, rootMargin: "0px 0px 60px 0px" }
);

document.querySelectorAll(".timeline-item").forEach(el => {
  el.classList.add("anim-ready");
  revealObs.observe(el);
});

// Fallback: reveal anything still in viewport after 500ms
setTimeout(() => {
  document.querySelectorAll(".timeline-item.anim-ready").forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) revealItem(el);
  });
}, 500);

/* ─── SKILL BARS ─── */
const skillObs = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.width = e.target.dataset.width + "%";
      skillObs.unobserve(e.target);
    }
  }),
  { threshold: 0.4 }
);
document.querySelectorAll(".sb-fill").forEach(f => skillObs.observe(f));

/* ─── ANIMATED COUNTERS ─── */
function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || "";
  const isFloat = target % 1 !== 0;
  const duration = 1800;
  let start = null;

  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const val = target * eased;
    el.textContent = (isFloat ? val.toFixed(1) : Math.floor(val)) + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = (isFloat ? target.toFixed(1) : target) + suffix;
  }
  requestAnimationFrame(step);
}

const counterObs = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) { animateCount(e.target); counterObs.unobserve(e.target); }
  }),
  { threshold: 0.5 }
);
document.querySelectorAll(".stat-num[data-count]").forEach(el => counterObs.observe(el));

/* ─── SCROLL FADE (cards) ─── */
const fadeObs = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.style.opacity = "1"; e.target.style.transform = "translateY(0) scale(1)"; }
  }),
  { threshold: 0.12 }
);
document.querySelectorAll(".edu-card, .why-card, .skill-category, .about-card, .contact-form").forEach(el => {
  el.style.opacity = "0";
  el.style.transform = "translateY(28px) scale(0.98)";
  el.style.transition = "opacity 0.65s ease, transform 0.65s ease";
  fadeObs.observe(el);
});

/* ─── 3D TILT ON CARDS ─── */
document.querySelectorAll("[data-tilt]").forEach(card => {
  card.addEventListener("mousemove", e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
    card.style.transition = "transform 0.5s ease";
  });
  card.addEventListener("mouseenter", () => { card.style.transition = "transform 0.1s ease"; });
});

/* ─── CONTACT FORM ─── */
document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const note = document.getElementById("formNote");
  const btn  = this.querySelector("button[type=submit]");
  btn.textContent = "Sending...";
  setTimeout(() => {
    btn.innerHTML = 'Send Message <i class="fa fa-paper-plane"></i>';
    note.textContent = "✓ Thank you! Samarpan will get back to you soon.";
    this.reset();
    setTimeout(() => note.textContent = "", 6000);
  }, 1000);
});

/* ─── DATA-REVEAL (hero text) ─── */
const revealTextObs = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = "1"; e.target.style.transform = "translateY(0)";
    }
  }),
  { threshold: 0.1 }
);
document.querySelectorAll("[data-reveal]").forEach(el => {
  el.style.opacity = "0";
  el.style.transform = "translateY(30px)";
  el.style.transition = "opacity 0.8s ease, transform 0.8s ease";
  revealTextObs.observe(el);
});
