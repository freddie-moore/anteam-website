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
  const toast = document.getElementById('toast');
  const inner = document.getElementById('toast-inner');
  const msg = document.getElementById('toast-msg');
  const success = toastParam === 'success';
  msg.textContent = success ? 'Message sent — we\'ll be in touch.' : 'Something went wrong. Please email info@anteam.ai directly with your query.';
  inner.classList.add(success ? 'border-primary/40' : 'border-red-500/40');
  inner.classList.add(success ? 'text-primary' : 'text-red-400');
  toast.classList.remove('hidden');
  toast.style.cssText = 'opacity:0;transform:translateY(12px);transition:opacity 0.4s ease,transform 0.4s ease';
  requestAnimationFrame(() => { toast.style.opacity = '1'; toast.style.transform = 'translateY(0)'; });
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(12px)';
    setTimeout(() => toast.classList.add('hidden'), 400);
  }, 5000);
  window.history.replaceState({}, '', window.location.pathname);
}

const nav = document.querySelector('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav-scrolled', window.scrollY > 60);
  }, { passive: true });
}
