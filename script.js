// Smooth interactions, animations on scroll, nav toggle, contact form handling
// Updated: set --header-height so header is fixed and content not pulled under it.

document.addEventListener('DOMContentLoaded', () => {
  // Year in footer
  document.getElementById('year').textContent = new Date().getFullYear();

  const header = document.querySelector('.site-header');
  const navbar = document.querySelector('.navbar');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  // set CSS variable for header height so main padding and mobile nav top are correct
  function updateHeaderHeightVar(){
    const h = header ? header.offsetHeight : (navbar ? navbar.offsetHeight : 72);
    document.documentElement.style.setProperty('--header-height', `${h}px`);
  }
  updateHeaderHeightVar();
  // update on resize (debounced)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateHeaderHeightVar, 120);
  });

  // Nav toggle for mobile
  navToggle && navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('show');
  });

  // Close mobile menu on link click
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('show'));
  });

  // IntersectionObserver for fade-in / slide-up
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        // animate skill bars when in view
        if (entry.target.classList.contains('skills') || entry.target.id === 'skills') {
          animateSkillBars();
        }
      }
    });
  }, { threshold: 0.12 });

  // Observe elements
  document.querySelectorAll('.fade-in, .slide-up, .card, .project-item').forEach(el => io.observe(el));

  // Skill bar animation
  function animateSkillBars(){
    document.querySelectorAll('.skill-fill').forEach(fill => {
      const percent = fill.dataset.percent || 0;
      fill.style.width = percent + '%';
    });
  }

  // Smooth scroll offset for fixed header
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      if (href.length > 1 && href.startsWith('#')) {
        e.preventDefault();
        const el = document.querySelector(href);
        if (!el) return;
        // compute header height dynamically
        const headerOffset = (header ? header.offsetHeight : (navbar ? navbar.offsetHeight : 72)) + 8;
        const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    });
  });

  // Contact form submit (frontend demo)
  const form = document.getElementById('contact-form');
  form && form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = fd.get('name');
    const email = fd.get('email');
    const message = fd.get('message');

    if(!name || !email || !message){
      alert('Mohon lengkapi semua field.');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Terkirim ✓';
    setTimeout(()=>{
      submitBtn.disabled = false;
      submitBtn.textContent = 'Kirim';
      form.reset();
      alert('Pesan berhasil dikirim (demo). Untuk integrasi nyata, tambahkan backend atau layanan pihak ketiga seperti Formspree / Netlify Forms / Email API.');
    }, 900);
  });

  // Accessibility: keyboard close nav
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') navLinks.classList.remove('show');
  });
});