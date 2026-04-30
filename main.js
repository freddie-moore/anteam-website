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
      form.innerHTML = `
        <div style="text-align:center;padding:4rem 2rem;display:flex;flex-direction:column;align-items:center;gap:1rem">
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none" style="margin-bottom:.25rem">
            <circle cx="22" cy="22" r="21" stroke="#ffba37" stroke-width="1.5" opacity="0.4"/>
            <polyline points="13,22 20,29 31,15" stroke="#ffba37" stroke-width="2" stroke-linecap="square"/>
          </svg>
          <p style="font-family:'Barlow Condensed',sans-serif;font-size:1.5rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#e5e2e1">Message Received</p>
          <p style="font-family:'IBM Plex Sans',sans-serif;font-size:.875rem;color:#c4c7c7;font-weight:300;max-width:300px;line-height:1.75">Thank you for reaching out — we'll be in touch within 24 hours.</p>
        </div>
      `;
    } else {
      form.innerHTML = `
        <div style="text-align:center;padding:4rem 2rem;display:flex;flex-direction:column;align-items:center;gap:1rem">
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none" style="margin-bottom:.25rem">
            <circle cx="22" cy="22" r="21" stroke="#ffb4ab" stroke-width="1.5" opacity="0.4"/>
            <line x1="15" y1="15" x2="29" y2="29" stroke="#ffb4ab" stroke-width="2" stroke-linecap="square"/>
            <line x1="29" y1="15" x2="15" y2="29" stroke="#ffb4ab" stroke-width="2" stroke-linecap="square"/>
          </svg>
          <p style="font-family:'Barlow Condensed',sans-serif;font-size:1.5rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#e5e2e1">Something Went Wrong</p>
          <p style="font-family:'IBM Plex Sans',sans-serif;font-size:.875rem;color:#c4c7c7;font-weight:300;max-width:300px;line-height:1.75">Please email us directly at <a href="mailto:info@anteam.ai" style="color:#ffb4ab;text-decoration:underline">info@anteam.ai</a></p>
        </div>
      `;
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
