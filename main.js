/* ── main.js — Animations & Interactivity ── */

/* === Custom Cursor === */
const cursor = document.getElementById('cursor-glow');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
});
document.addEventListener('mousedown', () => cursor.style.transform = 'translate(-50%,-50%) scale(0.7)');
document.addEventListener('mouseup',   () => cursor.style.transform = 'translate(-50%,-50%) scale(1)');

/* === Particle Canvas === */
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function createParticle() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    r: Math.random() * 1.5 + 0.3,
    alpha: Math.random() * 0.5 + 0.1,
    color: Math.random() > 0.5 ? '#06b6d4' : '#2563eb',
  };
}

for (let i = 0; i < 120; i++) particles.push(createParticle());

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  /* Draw connection lines */
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(6,182,212,${0.08 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }

  /* Draw particles */
  for (const p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.alpha;
    ctx.fill();
    ctx.globalAlpha = 1;

    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
  }

  requestAnimationFrame(drawParticles);
}
drawParticles();

/* === Typing Effect === */
const typedEl = document.getElementById('typed-text');
const phrases = [
  '商業經營 × 電子商務 × 智慧科技',
  '南山中學未來商管新星 🌟',
  '打造數位時代的商業創新力',
  '學習 · 成長 · 超越自我 🚀',
  'Business × Tech × Innovation',
];
let phrIdx = 0, charIdx = 0, deleting = false;

function typeLoop() {
  const phrase = phrases[phrIdx];
  if (!deleting) {
    typedEl.textContent = phrase.slice(0, ++charIdx);
    if (charIdx === phrase.length) {
      deleting = true;
      setTimeout(typeLoop, 2200);
      return;
    }
  } else {
    typedEl.textContent = phrase.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      phrIdx = (phrIdx + 1) % phrases.length;
    }
  }
  setTimeout(typeLoop, deleting ? 40 : 80);
}
typeLoop();

/* === Counter Animation === */
function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const dur = 1800;
  const start = performance.now();
  function step(now) {
    const t = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(eased * target);
    if (t < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

/* === Scroll Reveal + Trigger Counters & Bars === */
const revealEls = document.querySelectorAll('.reveal');
const metricNums = document.querySelectorAll('.metric-num');
const progressFills = document.querySelectorAll('.progress-fill');
let countersTriggered = false;

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      /* Animate progress bars */
      entry.target.querySelectorAll('.progress-fill').forEach(bar => {
        bar.style.width = bar.dataset.w + '%';
      });
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => observer.observe(el));

/* Counters triggered by hero section visibility */
const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersTriggered) {
      countersTriggered = true;
      metricNums.forEach(animateCounter);
    }
  });
}, { threshold: 0.3 });
const heroSection = document.getElementById('hero');
if (heroSection) heroObserver.observe(heroSection);

/* === Active Nav Link === */
const sections = document.querySelectorAll('section[id], footer[id]');
const navLinks = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const link = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (link) link.classList.add('active');
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => navObserver.observe(s));

/* Active nav style */
const navStyle = document.createElement('style');
navStyle.textContent = `.nav-link.active { color: var(--c-neon) !important; }`;
document.head.appendChild(navStyle);

/* === Navbar Scroll Style === */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.style.background = 'rgba(3,7,18,0.97)';
    navbar.style.boxShadow  = '0 4px 30px rgba(0,0,0,0.5)';
  } else {
    navbar.style.background = 'rgba(3,7,18,0.8)';
    navbar.style.boxShadow  = 'none';
  }
});

/* === Smooth Section Scroll Offset (for fixed nav) === */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* === Parallax tilt on skill cards === */
document.querySelectorAll('.skill-block, .about-card, .passion-card, .timeline-content, .contact-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width  / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `perspective(800px) rotateY(${dx * 4}deg) rotateX(${-dy * 4}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s ease';
    setTimeout(() => card.style.transition = '', 500);
  });
});

/* === Glitch on hover (hero name) === */
const heroName = document.querySelector('.glitch');
if (heroName) {
  heroName.addEventListener('mouseenter', () => {
    heroName.style.animation = 'glitch1 0.3s steps(2) 3';
  });
  heroName.addEventListener('animationend', () => {
    heroName.style.animation = '';
  });
}
