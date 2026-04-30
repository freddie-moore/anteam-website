function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const duration = 1200;
  let startTime = null;

  function tick(now) {
    if (!startTime) startTime = now;
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = prefix + Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counters = entry.target.querySelectorAll('.counter');
      counters.forEach((el, i) => {
        setTimeout(() => animateCounter(el), i * 200);
      });
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.7 });

document.querySelectorAll('[id^="metrics-panel"]').forEach(panel => observer.observe(panel));

const toastParam = new URLSearchParams(window.location.search).get('submitted');
if (toastParam) {
  const success = toastParam === 'success';

  const form = document.querySelector('#contact form');
  if (form) {
    if (success) {
      form.innerHTML = '<div class="text-center py-16 space-y-4"><p class="text-primary font-headline font-bold uppercase tracking-widest text-sm">Message Received</p><p class="text-on-surface-variant font-body text-base">Thank you for reaching out — we\'ll be in touch shortly.</p></div>';
    } else {
      const errBanner = document.createElement('div');
      errBanner.className = 'mb-6 px-6 py-4 border border-red-500/40 text-red-400 font-body text-sm';
      errBanner.textContent = 'Something went wrong. Please email info@anteam.ai directly.';
      form.prepend(errBanner);
    }
  }

  document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  window.history.replaceState({}, '', window.location.pathname);
}

const nav = document.querySelector('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav-scrolled', window.scrollY > 60);
  }, { passive: true });
}
