/**
 * ARES VOYAGER | Space Tourism & Mars Landing Page
 * Interactive Logic, Starfield Canvas, Glass Tilt & Audio Synthesizer
 */

document.addEventListener('DOMContentLoaded', () => {
  initStarfieldCanvas();
  initHeaderAndNav();
  initGlassCardTilt();
  initContactForm();
  initCosmicAudioSynthesizer();
});

/* ==========================================================================
   1. Interactive Cosmic Canvas: Stars, Nebulas, & Martian Dust
   ========================================================================== */
function initStarfieldCanvas() {
  const canvas = document.getElementById('space-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let stars = [];
  let dustParticles = [];
  let mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };

  const STAR_COUNT = 180;
  const DUST_COUNT = 35;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    createCosmos();
  }

  function createCosmos() {
    stars = [];
    dustParticles = [];

    // Stars
    for (let i = 0; i < STAR_COUNT; i++) {
      const isRedStar = Math.random() < 0.15;
      const isCyanStar = Math.random() < 0.08;
      let color = 'rgba(255, 255, 255, ';
      if (isRedStar) color = 'rgba(255, 110, 90, ';
      else if (isCyanStar) color = 'rgba(120, 240, 255, ';

      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.4,
        alpha: Math.random() * 0.8 + 0.2,
        twinkleSpeed: (Math.random() * 0.02 + 0.005) * (Math.random() < 0.5 ? 1 : -1),
        colorBase: color,
        depth: Math.random() * 0.6 + 0.4
      });
    }

    // Floating Martian dust particles
    for (let j = 0; j < DUST_COUNT; j++) {
      dustParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.2 + 0.8,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: -Math.random() * 0.4 - 0.1,
        alpha: Math.random() * 0.4 + 0.1,
        color: Math.random() < 0.6 ? '255, 80, 60' : '255, 140, 60'
      });
    }
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
  });

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Smooth mouse interpolation for parallax
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    const offsetX = (mouse.x - width / 2) * 0.02;
    const offsetY = (mouse.y - height / 2) * 0.02;

    // Draw and animate stars
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];

      s.alpha += s.twinkleSpeed;
      if (s.alpha > 0.95 || s.alpha < 0.15) {
        s.twinkleSpeed = -s.twinkleSpeed;
      }

      const px = s.x - offsetX * s.depth;
      const py = s.y - offsetY * s.depth;

      ctx.beginPath();
      ctx.arc(px, py, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${s.colorBase}${s.alpha})`;
      ctx.fill();

      // Subtle glow on larger stars
      if (s.radius > 1.4) {
        ctx.beginPath();
        ctx.arc(px, py, s.radius * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `${s.colorBase}${s.alpha * 0.25})`;
        ctx.fill();
      }
    }

    // Draw and animate Martian dust
    for (let j = 0; j < dustParticles.length; j++) {
      const d = dustParticles[j];
      d.x += d.speedX;
      d.y += d.speedY;

      if (d.y < -10) {
        d.y = height + 10;
        d.x = Math.random() * width;
      }
      if (d.x < -10) d.x = width + 10;
      if (d.x > width + 10) d.x = -10;

      ctx.beginPath();
      ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${d.color}, ${d.alpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = `rgba(${d.color}, 0.6)`;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    requestAnimationFrame(render);
  }

  resize();
  render();
}

/* ==========================================================================
   2. Header, Navigation & Smooth Active Scroll Watcher
   ========================================================================== */
function initHeaderAndNav() {
  const header = document.getElementById('site-header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const sections = document.querySelectorAll('section[id]');

  // Header scroll blur effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile menu toggle
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileToggle.classList.toggle('active', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu on clicking any link
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Active section observer
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));
}

/* ==========================================================================
   3. Glassmorphism 3D Interactive Card Tilt
   ========================================================================== */
function initGlassCardTilt() {
  const cards = document.querySelectorAll('[data-tilt]');

  cards.forEach(card => {
    const glow = card.querySelector('.card-glow-layer');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6; // max 6 deg
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;

      if (glow) {
        glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 51, 68, 0.22), transparent 70%)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      if (glow) {
        glow.style.background = '';
      }
    });
  });
}

/* ==========================================================================
   4. Minimalist Astronaut Contact Form & Boarding Pass Generator
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('astronaut-form');
  const nameInput = document.getElementById('full-name');
  const emailInput = document.getElementById('email');
  const dateInput = document.getElementById('launch-date');
  const classInput = document.getElementById('travel-class');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const dateError = document.getElementById('date-error');
  const submitBtn = document.getElementById('submit-application-btn');

  // Modal elements
  const modal = document.getElementById('ticket-modal');
  const modalClose = document.getElementById('modal-close-btn');
  const modalConfirm = document.getElementById('modal-confirm-btn');

  const ticketName = document.getElementById('ticket-passenger-name');
  const ticketDate = document.getElementById('ticket-date');
  const ticketClass = document.getElementById('ticket-class');
  const ticketEmailTarget = document.getElementById('ticket-email-target');

  // Pre-fill min date as 1 year from now
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 2);
  const minDateStr = nextYear.toISOString().split('T')[0];
  if (dateInput) {
    dateInput.min = minDateStr;
    dateInput.value = '2030-08-15';
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function clearErrors() {
    nameInput.classList.remove('input-error');
    emailInput.classList.remove('input-error');
    dateInput.classList.remove('input-error');
    nameError.classList.remove('visible');
    emailError.classList.remove('visible');
    dateError.classList.remove('visible');
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();

      let hasError = false;

      // Validate Name
      const nameVal = nameInput.value.trim();
      if (!nameVal || nameVal.length < 3) {
        nameInput.classList.add('input-error');
        nameError.classList.add('visible');
        hasError = true;
      }

      // Validate Email
      const emailVal = emailInput.value.trim();
      if (!validateEmail(emailVal)) {
        emailInput.classList.add('input-error');
        emailError.classList.add('visible');
        hasError = true;
      }

      // Validate Date
      const dateVal = dateInput.value;
      if (!dateVal) {
        dateInput.classList.add('input-error');
        dateError.classList.add('visible');
        hasError = true;
      }

      if (hasError) return;

      // Submit loading state
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;

        // Populate Boarding Pass Modal
        if (ticketName) ticketName.textContent = nameVal;
        if (ticketDate) ticketDate.textContent = dateVal;
        if (ticketClass && classInput) {
          const selectedText = classInput.options[classInput.selectedIndex].text;
          ticketClass.textContent = selectedText.split('(')[0].trim();
        }
        if (ticketEmailTarget) ticketEmailTarget.textContent = emailVal;

        // Show Modal
        openModal();
        showToast('🚀 განაცხადი წარმატებით გაიგზავნა! ბორტ-ბარათი მზადაა.');
        form.reset();
        if (dateInput) dateInput.value = '2030-08-15';
      }, 900);
    });
  }

  function openModal() {
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalConfirm) modalConfirm.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   5. Toast Notification System
   ========================================================================== */
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span class="toast-icon">✨</span>
    <span class="toast-message">${message}</span>
  `;

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 400);
  }, 4500);
}

/* ==========================================================================
   6. Cosmic Ambient Audio Synthesizer (Web Audio API)
   ========================================================================== */
function initCosmicAudioSynthesizer() {
  const audioBtn = document.getElementById('audio-toggle-btn');
  if (!audioBtn) return;

  let audioCtx = null;
  let isPlaying = false;
  let oscillators = [];
  let masterGain = null;

  function startCosmicAudio() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!audioCtx) {
        audioCtx = new AudioContext();
      }

      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.01, audioCtx.currentTime);
      // Soft fade in
      masterGain.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 3);

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, audioCtx.currentTime);
      filter.Q.setValueAtTime(2, audioCtx.currentTime);

      masterGain.connect(filter);
      filter.connect(audioCtx.destination);

      // Deep cosmic hum frequencies (Root, 5th, Octave, and gentle harmonic shimmer)
      const freqs = [55, 82.4, 110, 164.8];

      oscillators = freqs.map((freq, index) => {
        const osc = audioCtx.createOscillator();
        const oscGain = audioCtx.createGain();

        osc.type = index === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        // Gentle frequency modulation (LFO) for cosmic drift
        const lfo = audioCtx.createOscillator();
        const lfoGain = audioCtx.createGain();
        lfo.frequency.setValueAtTime(0.1 + index * 0.05, audioCtx.currentTime);
        lfoGain.gain.setValueAtTime(1.5, audioCtx.currentTime);
        lfo.connect(osc.frequency);
        lfo.start();

        oscGain.gain.setValueAtTime(0.3 / (index + 1), audioCtx.currentTime);
        osc.connect(oscGain);
        oscGain.connect(masterGain);
        osc.start();

        return { osc, lfo };
      });

      isPlaying = true;
      audioBtn.classList.add('active');
      showToast('🔊 კოსმოსური ატმოსფერული აუდიო გააქტიურებულია');
    } catch (err) {
      console.warn('Web Audio could not start:', err);
    }
  }

  function stopCosmicAudio() {
    if (!masterGain || !audioCtx) return;

    masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);

    setTimeout(() => {
      oscillators.forEach(({ osc, lfo }) => {
        try {
          osc.stop();
          osc.disconnect();
          lfo.stop();
          lfo.disconnect();
        } catch (_) {}
      });
      oscillators = [];
      isPlaying = false;
      audioBtn.classList.remove('active');
    }, 1300);
  }

  audioBtn.addEventListener('click', () => {
    if (isPlaying) {
      stopCosmicAudio();
    } else {
      startCosmicAudio();
    }
  });
}
