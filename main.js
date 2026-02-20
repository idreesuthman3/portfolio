// ===== DARK MODE =====
const darkToggle = document.getElementById('darkToggle');
const darkToggleMobile = document.getElementById('darkToggleMobile');
let isDark = false;
function toggleDark() {
  isDark = !isDark;
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  const icon = isDark ? 'fa-sun' : 'fa-moon';
  if (darkToggle) darkToggle.innerHTML = `<i class="fa ${icon}"></i>`;
  if (darkToggleMobile) darkToggleMobile.innerHTML = `<i class="fa ${icon}"></i>`;
}
if (darkToggle) darkToggle.addEventListener('click', toggleDark);
if (darkToggleMobile) darkToggleMobile.addEventListener('click', toggleDark);

// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger) hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
function closeMobile() { if (mobileMenu) mobileMenu.classList.remove('open'); }

// ===== TYPEWRITER =====
const roles = ['UI/UX Designer', 'Product Designer', 'Graphic Designer'];
let roleIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById('typedText');
if (typedEl) {
  function type() {
    const current = roles[roleIdx];
    if (!deleting) {
      typedEl.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) { deleting = true; setTimeout(type, 1800); return; }
    } else {
      typedEl.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; }
    }
    setTimeout(type, deleting ? 60 : 100);
  }
  type();
}

// ===== SCROLL ANIMATIONS =====
const fadeEls = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.15 });
fadeEls.forEach(el => observer.observe(el));

// ===== COUNTER =====
function animateCounter(el) {
  const target = parseInt(el.dataset.count);
  const suffix = el.dataset.suffix || '+';
  let current = 0;
  const step = Math.ceil(target / 50);
  const interval = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current + suffix;
    if (current >= target) clearInterval(interval);
  }, 30);
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

// ===== BACK TO TOP =====
const backBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (backBtn) backBtn.classList.toggle('show', window.scrollY > 300);
  const sections = ['home','services','about','experience','projects','why','contact'];
  let current = '';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 100) current = id;
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});

// ===== CONTACT MODAL =====
function openContactModal() {
  document.getElementById('contactFormView').style.display = 'block';
  document.getElementById('contactSuccessView').style.display = 'none';
  document.getElementById('contactModal').classList.add('show');
}
function closeContactModal() {
  document.getElementById('contactModal').classList.remove('show');
  setTimeout(() => {
    document.getElementById('contactFormView').style.display = 'block';
    document.getElementById('contactSuccessView').style.display = 'none';
    document.getElementById('cf-name').value = '';
    document.getElementById('cf-email').value = '';
    document.getElementById('cf-budget').value = '';
    document.getElementById('cf-service').value = '';
    document.getElementById('cf-desc').value = '';
  }, 400);
}
function submitForm() {
  const name = document.getElementById('cf-name').value.trim();
  const email = document.getElementById('cf-email').value.trim();
  if (!name || !email) { alert('Please fill in your name and email.'); return; }
  document.getElementById('contactFormView').style.display = 'none';
  document.getElementById('contactSuccessView').style.display = 'flex';
  document.getElementById('contactSuccessView').style.flexDirection = 'column';
}
const contactModal = document.getElementById('contactModal');
if (contactModal) {
  contactModal.addEventListener('click', function(e) {
    if (e.target === this) closeContactModal();
  });
}

// ===== PROJECT MODAL =====
const projects = [
  {
    title: 'Consulting Web Dashboard',
    subtitle: 'Admin Dashboard',
    bg: 'background:linear-gradient(135deg,#0d9488,#0f766e)',
    img: 'images/dashboard.png',
    desc1: 'The Admin Dashboard is designed to give administrators full control, visibility, and management of platform activities through a clean and intuitive interface.',
    desc2: 'This dashboard focuses on clarity, data organization, and ease of navigation, ensuring that complex information is presented in a simple and actionable way.'
  },
  {
    title: 'Hutride Mobile App',
    subtitle: 'Mobile Application UI',
    bg: 'background:linear-gradient(135deg,#6366f1,#4f46e5)',
    img: 'images/mobile.png',
    desc1: 'Hutride is a modern ride-hailing mobile app designed with a focus on ease of use and smooth user experience for both riders and drivers.',
    desc2: 'The design emphasizes clean navigation, minimal friction in booking flows, and real-time tracking with a bold, modern visual identity.'
  },
  {
    title: 'Consulting Landing Page',
    subtitle: 'Strategic Solutions for Business Growth',
    bg: 'background:linear-gradient(135deg,#0ea5e9,#0284c7)',
    img: 'images/landing2.png',
    desc1: 'A high-converting consulting landing page designed to communicate value, build trust, and drive client inquiries.',
    desc2: 'The layout follows conversion-focused principles with clear CTAs, social proof sections, and a responsive design across all devices.'
  }
];
function openProjectModal(idx) {
  const p = projects[idx];
  const pmImg = document.getElementById('pm-img');
  pmImg.style.cssText = `width:100%;height:220px;overflow:hidden;${p.bg}`;
  // Show actual image if available, fallback to icon
  pmImg.innerHTML = `<img src="${p.img}" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none'">`;
  document.getElementById('pm-title').textContent = p.title;
  document.getElementById('pm-subtitle').textContent = p.subtitle;
  document.getElementById('pm-desc1').textContent = p.desc1;
  document.getElementById('pm-desc2').textContent = p.desc2;
  document.getElementById('projectModal').classList.add('show');
}
function closeProjectModal() {
  document.getElementById('projectModal').classList.remove('show');
}
const projectModal = document.getElementById('projectModal');
if (projectModal) {
  projectModal.addEventListener('click', function(e) {
    if (e.target === this) closeProjectModal();
  });
}

// Mobile dark toggle visibility
function handleResize() {
  const isMobile = window.innerWidth <= 768;
  const mob = document.getElementById('darkToggleMobile');
  if (mob) mob.style.display = isMobile ? 'flex' : 'none';
}
handleResize();
window.addEventListener('resize', handleResize);

// ===== VISITOR TRACKING =====
// Fires once per page load — PHP logs the IP server-side
(function trackVisit() {
  fetch('visitor-tracker.php?action=track')
    .then(r => r.json())
    .then(data => {
      // Optionally expose the visitor count globally for other scripts
      window.__visitorStats = data;
    })
    .catch(() => {
      // Silently fail — tracking is non-critical
    });
})();