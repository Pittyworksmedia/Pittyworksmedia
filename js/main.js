// ============================================
// PITTWORKS MEDIA — MAIN JS (vanilla, no deps)
// ============================================
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Loader ---------- */
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => loader.classList.add('done'), 900);
  });
  setTimeout(() => document.getElementById('loader')?.classList.add('done'), 2500);

  /* ---------- Custom cursor ---------- */
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let mx = 0, my = 0, rx = 0, ry = 0;
  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  });
  function animateRing(){
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();
  document.querySelectorAll('a, button, .magnetic, .why-card, .about-card, .portfolio-card, .industry-card').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });

  /* ---------- Magnetic buttons ---------- */
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.3}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });

  /* ---------- Scroll progress + back to top ---------- */
  const progress = document.getElementById('scrollProgress');
  const toTop = document.getElementById('toTop');
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    if (progress) progress.style.width = scrolled + '%';
    if (toTop) toTop.classList.toggle('show', h.scrollTop > 600);
  });
  if (toTop) toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Mobile nav ---------- */
  const burger = document.getElementById('navBurger');
  const navMobile = document.getElementById('navMobile');
  burger.addEventListener('click', () => navMobile.classList.toggle('open'));
  navMobile.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navMobile.classList.remove('open')));

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-mask');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  /* ---------- Hero floating production icons ---------- */
  const iconWrap = document.getElementById('heroIcons');
  if (iconWrap) {
    const icons = ['🎬', '📷', '✂️', '💡', '📝', '🎥', '🌐', '🎞️', '📸', '🔊', '🎤', '💻'];
    const NUM_ICONS = window.innerWidth < 768 ? 8 : 14;
    for (let i = 0; i < NUM_ICONS; i++) {
      const el = document.createElement('span');
      el.className = 'hero-float-icon';
      el.textContent = icons[i % icons.length];
      el.style.left = Math.random() * 100 + '%';
      el.style.bottom = (Math.random() * -30) + '%';
      el.style.animationDuration = (Math.random() * 12 + 10) + 's';
      el.style.animationDelay = (Math.random() * 10) + 's';
      iconWrap.appendChild(el);
    }
  }

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('.stat-num');
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        let current = 0;
        const duration = 1600;
        const start = performance.now();
        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          current = Math.round(target * eased);
          el.textContent = current + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        counterIO.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(el => counterIO.observe(el));

  /* ---------- Timeline fill on scroll ---------- */
  const timelineFill = document.getElementById('timelineFill');
  const timeline = document.querySelector('.timeline');
  if (timeline) {
    window.addEventListener('scroll', () => {
      const rect = timeline.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height;
      const visible = Math.min(Math.max(vh * 0.7 - rect.top, 0), total);
      const pct = Math.min((visible / total) * 100, 100);
      timelineFill.style.height = pct + '%';
    });
  }

  /* ==========================================
     DATA-DRIVEN: Clients Marquee
     ========================================== */
  fetch('data/clients.json')
    .then(r => r.json())
    .then(clients => {
      const track1 = document.getElementById('marqueeTrack1');
      const track2 = document.getElementById('marqueeTrack2');
      if (!track1 || !track2) return;
      const html = clients.map(name => `<span class="client-logo">${name}</span>`).join('');
      track1.innerHTML = html;
      track2.innerHTML = html;
    })
    .catch(() => {
      // Fallback if fetch fails
      const fallback = ['CLIENT 1','CLIENT 2','CLIENT 3','CLIENT 4','CLIENT 5','CLIENT 6','CLIENT 7','CLIENT 8'];
      const track1 = document.getElementById('marqueeTrack1');
      const track2 = document.getElementById('marqueeTrack2');
      if (!track1 || !track2) return;
      const html = fallback.map(name => `<span class="client-logo">${name}</span>`).join('');
      track1.innerHTML = html;
      track2.innerHTML = html;
    });

  /* ==========================================
     DATA-DRIVEN: Testimonials
     ========================================== */
  fetch('data/testimonials.json')
    .then(r => r.json())
    .then(testimonials => {
      initTestimonials(testimonials);
    })
    .catch(() => {
      // Fallback
      initTestimonials([
        { quote: "TODO: Add real testimonial.", name: "Client Name", initials: "CN", title: "Title", company: "Company" }
      ]);
    });

  function initTestimonials(testimonials) {
    const track = document.getElementById('testiTrack');
    const dotsWrap = document.getElementById('testiDots');
    if (!track || !dotsWrap) return;

    track.innerHTML = testimonials.map(t => `
      <div class="testi-card">
        <span class="testi-quote">\u201C</span>
        <p>${t.quote}</p>
        <div class="testi-person">
          <div class="testi-avatar">${t.initials}</div>
          <div><strong>${t.name}</strong><span>${t.title}, ${t.company}</span></div>
        </div>
      </div>
    `).join('');

    const cards = track.children.length;
    let current = 0;
    dotsWrap.innerHTML = '';
    for (let i = 0; i < cards; i++) {
      const b = document.createElement('button');
      b.setAttribute('aria-label', `Show testimonial ${i + 1}`);
      if (i === 0) b.classList.add('active');
      b.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(b);
    }
    function goTo(i) {
      current = i;
      track.style.transform = `translateX(-${i * 100}%)`;
      [...dotsWrap.children].forEach((d, idx) => d.classList.toggle('active', idx === i));
    }
    let autoplay = setInterval(() => goTo((current + 1) % cards), 5500);
    track.addEventListener('mouseenter', () => clearInterval(autoplay));
    track.addEventListener('mouseleave', () => { autoplay = setInterval(() => goTo((current + 1) % cards), 5500); });
  }

  /* ==========================================
     PORTFOLIO: Case Study Modal
     ========================================== */
  const caseStudies = {
    'december-delights': {
      tag: 'Cafe · Organic Growth',
      title: 'December Delights — 0 to 100K',
      body: `
        <p><strong>The Client:</strong> December Delights — a cafe brand looking to build an audience from scratch through organic-first storytelling.</p>
        <p><strong>What We Did:</strong> We built a storytelling-first content strategy focused on high-retention content and consistent narrative-driven posts. We also built a strong personal brand for Supraja (the founder), increasing relatability and customer trust.</p>
        <p><strong>The Results:</strong></p>
        <ul>
          <li>Scaled from 0 to 100K followers purely through organic growth, zero ad spend</li>
          <li>Generated 110M+ reach within 3 months using high-retention content</li>
          <li>Positioned the brand as a household name across Telugu states</li>
          <li>Built a strong personal brand for the founder, increasing relatability and trust</li>
        </ul>
        <p><strong>Scope:</strong> Content Strategy · Storytelling Videos · Personal Branding · Social Media Management</p>
      `
    },
    'bbc': {
      tag: 'Biryani Restaurant · Franchise',
      title: 'BBC (Bagara Biryani Cafe) — 21 Franchises',
      body: `
        <p><strong>The Client:</strong> Bagara Biryani Cafe — a biryani restaurant brand looking to expand through franchising in a competitive market.</p>
        <p><strong>What We Did:</strong> We crafted a unique regional positioning strategy that made BBC the only Telugu-promoted restaurant brand in the Bangalore market, creating a niche identity. We built a marketing framework that enabled the brand to understand and execute growth independently.</p>
        <p><strong>The Results:</strong></p>
        <ul>
          <li>Drove the sale of 21 franchises in Bangalore</li>
          <li>Created the only Telugu-promoted restaurant brand positioning in Bangalore</li>
          <li>Built a niche identity that stood out in a saturated market</li>
          <li>Delivered a marketing framework the brand uses independently beyond our involvement</li>
        </ul>
        <p><strong>Scope:</strong> Brand Positioning · Regional Strategy · Franchise Marketing · Content Production</p>
      `
    },
    'chai-resto': {
      tag: 'Food Chain · D2B + D2C',
      title: 'Chai Resto (BBC Group) — Brand Positioning',
      body: `
        <p><strong>The Client:</strong> Chaai Resto (part of the BBC Group) — a food-tech company supplying to PVR, HP, Qualcomm, Mindspace, and Cyber Park.</p>
        <p><strong>What We Did:</strong> We streamlined their communication and content strategy to successfully enter both D2B and D2C segments within 3 months. Focused on clarity in messaging, product visibility, and scalable outreach.</p>
        <p><strong>The Results:</strong></p>
        <ul>
          <li>Strengthened brand positioning as a food-tech company</li>
          <li>Successfully entered both D2B and D2C segments within 3 months</li>
          <li>Improved clarity in messaging and product visibility</li>
          <li>Built scalable outreach systems</li>
        </ul>
        <p><strong>Scope:</strong> Brand Positioning · Content Strategy · Messaging · Scalable Outreach</p>
      `
    },
    'ng-ghee': {
      tag: 'Ghee Company · Brand Revival',
      title: 'NG Ghee (Nand Gokul Ghee) — Legacy to Modern',
      body: `
        <p><strong>The Client:</strong> Nand Gokul Ghee — a legacy ghee brand from the 1990s with strong product quality but minimal market visibility.</p>
        <p><strong>What We Did:</strong> We transformed NG Ghee into a modern, visible brand through storytelling-driven content and strategic positioning. We focused on bridging the gap between legacy trust and modern digital presence.</p>
        <p><strong>The Results:</strong></p>
        <ul>
          <li>Transformed a 1990s legacy brand into a modern, visible digital presence</li>
          <li>Built strong audience awareness and increased customer demand</li>
          <li>Scaled both local distribution and online sales</li>
          <li>Successfully bridged legacy trust with modern digital presence</li>
        </ul>
        <p><strong>Scope:</strong> Brand Transformation · Storytelling Content · Strategic Positioning · D2B + D2C Growth</p>
      `
    },
    'hotel-vamshi': {
      tag: '3-Star Hotel · Repositioning',
      title: 'Hotel Vamshi International — Perception Shift',
      body: `
        <p><strong>The Client:</strong> Hotel Vamshi International — a 17-year-old 3-star hotel undergoing renovation, needing to reposition as premium.</p>
        <p><strong>What We Did:</strong> We led a complete perception shift during the hotel's renovation phase. Through purely organic marketing, we built anticipation, repositioned the brand as premium, and created strong market buzz — all without ad spend.</p>
        <p><strong>The Results:</strong></p>
        <ul>
          <li>Achieved full city-wide reach across Nizamabad within one month</li>
          <li>All results achieved purely through organic marketing — zero ad spend</li>
          <li>Repositioned the brand as premium in the local market</li>
          <li>Created strong market buzz and anticipation for the renovated property</li>
        </ul>
        <p><strong>Scope:</strong> Brand Repositioning · Organic Marketing · Content Strategy · Market Buzz Building</p>
      `
    },
    'monoro': {
      tag: 'Brand Building',
      title: 'MonoRo',
      body: `
        <p><strong>The Client:</strong> MonoRo — a brand partner we helped grow through strategic, story-driven content and organic marketing.</p>
        <p><strong>What We Did:</strong> We applied our storytelling-first approach to build brand awareness, audience connection, and organic visibility.</p>
        <p><strong>Scope:</strong> Content Strategy · Storytelling Videos · Brand Building · Organic Growth</p>
      `
    },
    'aaraa-couture': {
      tag: 'Fashion · Branding',
      title: 'Aaraa Couture',
      body: `
        <p><strong>The Client:</strong> Aaraa Couture — a fashion brand that partnered with us for storytelling-driven content and brand positioning.</p>
        <p><strong>What We Did:</strong> We crafted narrative-driven content to build audience connection, brand recognition, and market presence in the fashion space.</p>
        <p><strong>Scope:</strong> Fashion Storytelling · Content Production · Brand Positioning · Social Media</p>
      `
    },
    'kurnool-oils': {
      tag: 'Oils · Brand Growth',
      title: 'Kurnool Oils',
      body: `
        <p><strong>The Client:</strong> Kurnool Oils — building brand visibility and market presence through storytelling-first content strategy.</p>
        <p><strong>What We Did:</strong> We developed a content-driven marketing approach to increase brand visibility, customer trust, and market reach for a traditional oils brand.</p>
        <p><strong>Scope:</strong> Brand Strategy · Content Production · Market Visibility · Organic Growth</p>
      `
    }
  };

  const modal = document.getElementById('caseStudyModal');
  if (modal) {
    const modalOverlay = modal.querySelector('.case-study-overlay');
    const modalClose = modal.querySelector('.case-study-close');
    const modalTag = document.getElementById('caseStudyTag');
    const modalTitle = document.getElementById('caseStudyTitle');
    const modalBody = document.getElementById('caseStudyBody');

    document.querySelectorAll('.portfolio-read-more').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const card = e.target.closest('[data-case-study]');
        const key = card.dataset.caseStudy;
        const study = caseStudies[key];
        if (!study) return;
        modalTag.textContent = study.tag;
        modalTitle.textContent = study.title;
        modalBody.innerHTML = study.body;
        modal.hidden = false;
        document.body.style.overflow = 'hidden';
        modalClose.focus();
      });
    });

    function closeModal() {
      modal.hidden = true;
      document.body.style.overflow = '';
    }
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.hidden) closeModal();
    });
  }

  /* ==========================================
     CONTACT FORM: Validation & Submit
     ========================================== */
  const form = document.getElementById('contactForm');
  if (form) {
    const formStatus = document.getElementById('formStatus');

    // Contact form endpoint - using FormSubmit.co (sends directly to info@pittworks.com)
    const FORM_ENDPOINT = 'https://formsubmit.co/info@pittworks.com';

  function validateField(field) {
    const errorEl = field.parentElement.querySelector('.form-error');
    let message = '';

    if (field.required && !field.value.trim()) {
      message = 'This field is required.';
    } else if (field.type === 'email' && field.value) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(field.value)) {
        message = 'Please enter a valid email address.';
      }
    } else if (field.type === 'tel' && field.value) {
      const phonePattern = /^[\+\d\s\-\(\)]{7,20}$/;
      if (!phonePattern.test(field.value)) {
        message = 'Please enter a valid phone number.';
      }
    }

    if (errorEl) errorEl.textContent = message;
    field.classList.toggle('has-error', !!message);
    return !message;
  }

  // Live validation on blur
  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('has-error')) validateField(field);
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    formStatus.textContent = '';
    formStatus.className = 'form-status';

    // Validate all fields (skip hidden)
    const fields = form.querySelectorAll('input:not([type="hidden"]), select, textarea');
    let allValid = true;
    fields.forEach(field => {
      if (!validateField(field)) allValid = false;
    });

    if (!allValid) {
      formStatus.textContent = 'Please fix the errors above.';
      formStatus.classList.add('error');
      return;
    }

    // Gather form data
    const data = new FormData(form);
    const submitBtn = document.getElementById('contactSubmit');
    submitBtn.disabled = true;
    submitBtn.querySelector('span').textContent = 'Sending...';

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        body: data
      });

      if (response.ok) {
        formStatus.textContent = 'Message sent! We\u2019ll be in touch within 24 hours.';
        formStatus.classList.add('success');
        form.reset();
        fields.forEach(f => {
          f.classList.remove('has-error');
          const err = f.parentElement.querySelector('.form-error');
          if (err) err.textContent = '';
        });
      } else {
        throw new Error('Server error');
      }
    } catch (err) {
      formStatus.textContent = 'Something went wrong. Please email us at hello@pittworksmedia.com instead.';
      formStatus.classList.add('error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.querySelector('span').textContent = 'Start Your Story';
    }
  });
  } // end if (form)

}); // end DOMContentLoaded


// ============================================
// PREMIUM MOTION — PERFORMANCE OPTIMIZED
// ============================================

(function() {
  // Use requestAnimationFrame for all scroll-based animations (no jank)
  let ticking = false;
  let scrollY = 0;

  /* ---------- Nav hide/show on scroll ---------- */
  const nav = document.getElementById('nav');
  let lastScroll = 0;
  let navHidden = false;

  /* ---------- Parallax hero elements on scroll ---------- */
  const heroContent = document.querySelector('.hero-content');
  const heroBg = document.querySelector('.hero-bg');
  const vh = window.innerHeight;

  function onScroll() {
    scrollY = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(updateScroll);
      ticking = true;
    }
  }

  function updateScroll() {
    // Nav hide/show
    if (nav) {
      if (scrollY > 200 && scrollY > lastScroll + 5 && !navHidden) {
        nav.classList.add('nav-hidden');
        navHidden = true;
      } else if (scrollY < lastScroll - 5 && navHidden) {
        nav.classList.remove('nav-hidden');
        navHidden = false;
      }
      lastScroll = scrollY;
    }

    // Parallax - GPU accelerated with will-change
    if (heroContent && heroBg && scrollY < vh) {
      const ratio = scrollY / vh;
      heroContent.style.transform = `translate3d(0, ${scrollY * 0.25}px, 0)`;
      heroContent.style.opacity = 1 - ratio * 1.2;
      heroBg.style.transform = `translate3d(0, ${scrollY * 0.1}px, 0)`;
    }

    ticking = false;
  }

  // Passive scroll listener for best performance
  window.addEventListener('scroll', onScroll, { passive: true });

  // Set will-change hints for GPU layers
  if (heroContent) heroContent.style.willChange = 'transform, opacity';
  if (heroBg) heroBg.style.willChange = 'transform';

  /* ---------- 3D Tilt on why-cards (throttled) ---------- */
  document.querySelectorAll('.why-card').forEach(card => {
    let rafId = null;
    card.addEventListener('mousemove', (e) => {
      if (rafId) return; // skip if already scheduled
      rafId = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(800px) rotateX(${y * -6}deg) rotateY(${x * 6}deg) translateY(-6px) translate3d(0,0,0)`;
        rafId = null;
      });
    });
    card.addEventListener('mouseleave', () => {
      cancelAnimationFrame(rafId);
      rafId = null;
      card.style.transform = '';
    });
  });

  /* ---------- Button ripple position (no reflow) ---------- */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      btn.style.setProperty('--ripple-x', ((e.clientX - rect.left) / rect.width * 100) + '%');
      btn.style.setProperty('--ripple-y', ((e.clientY - rect.top) / rect.height * 100) + '%');
    }, { passive: true });
  });

  /* ---------- Stat items glow on reveal ---------- */
  document.querySelectorAll('.stat-item').forEach(item => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    observer.observe(item);
  });

  /* ---------- Remove will-change after animations settle ---------- */
  setTimeout(() => {
    if (heroContent) heroContent.style.willChange = 'auto';
    if (heroBg) heroBg.style.willChange = 'auto';
  }, 3000);

})();
