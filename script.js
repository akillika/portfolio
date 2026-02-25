/* ============================================
   TIME-BASED TAMIL GREETING
   ============================================ */
(function () {
  const el = document.getElementById('tamilGreeting');
  if (!el) return;

  const hour = new Date().getHours();
  let greeting;

  if (hour >= 5 && hour < 12) {
    greeting = 'காலை வணக்கம்';       // Good morning
  } else if (hour >= 12 && hour < 17) {
    greeting = 'மதிய வணக்கம்';       // Good afternoon
  } else if (hour >= 17 && hour < 21) {
    greeting = 'மாலை வணக்கம்';       // Good evening
  } else {
    greeting = 'இரவு வணக்கம்';       // Good night
  }

  el.textContent = greeting;

  // Fade out on scroll
  let faded = false;
  window.addEventListener('scroll', function () {
    if (!faded && window.scrollY > 80) {
      el.classList.add('faded');
      faded = true;
    }
  }, { passive: true });
})();

/* ============================================
   LANGUAGE TOGGLE
   ============================================ */
(function () {
  const langBtns = document.querySelectorAll('.lang-btn');
  const body = document.body;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let switching = false;

  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      if (btn.classList.contains('active') || switching) return;
      switching = true;

      // Update button states immediately
      langBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      // Instant switch if reduced motion
      if (reducedMotion) {
        if (lang === 'ta') {
          body.classList.add('lang-ta');
          document.documentElement.lang = 'ta';
        } else {
          body.classList.remove('lang-ta');
          document.documentElement.lang = 'en';
        }
        switching = false;
        return;
      }

      // Phase 1: Fade out current content
      body.classList.add('lang-fading-out');

      setTimeout(() => {
        // Swap language (display toggles)
        if (lang === 'ta') {
          body.classList.add('lang-ta');
          document.documentElement.lang = 'ta';
        } else {
          body.classList.remove('lang-ta');
          document.documentElement.lang = 'en';
        }

        // Phase 2: Hold new content at opacity 0, then fade in
        body.classList.remove('lang-fading-out');
        body.classList.add('lang-fading-in');

        // Double rAF ensures browser has painted the display swap
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            body.classList.remove('lang-fading-in');
            switching = false;
          });
        });
      }, 200);
    });
  });
})();

/* ============================================
   SCROLL ANIMATIONS (Intersection Observer)
   ============================================ */
(function () {
  const elements = document.querySelectorAll('[data-animate]');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    elements.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all elements
    elements.forEach(el => el.classList.add('visible'));
  }
})();

/* ============================================
   PROJECT EXPAND/COLLAPSE
   ============================================ */
(function () {
  const projectHeaders = document.querySelectorAll('.project-header');

  projectHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.project-item');
      const isOpen = item.classList.contains('open');

      // Close all other projects
      document.querySelectorAll('.project-item.open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.project-header').setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      item.classList.toggle('open');
      header.setAttribute('aria-expanded', !isOpen);
    });
  });
})();