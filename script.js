/* -------------------------------------------------------------
   SREEDHARAN SINGH PORTFOLIO CONTROLLER
   Libraries: GSAP, ScrollTrigger, Lucide Icons
   ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  const gsap = window.gsap || {
    registerPlugin() {},
    to() { return this; },
    from() { return this; },
    timeline() {
      return {
        to() { return this; },
        from() { return this; },
        eventCallback() { return this; },
        play() { return this; },
        pause() { return this; },
        kill() { return this; }
      };
    }
  };
  const ScrollTrigger = window.ScrollTrigger || {
    getAll: () => []
  };

  // Initialize Lucide Icons
  try {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  } catch (e) {
    console.warn('Lucide icons initialization failed:', e.message);
  }
  
  if (typeof emailjs !== 'undefined' && emailjs && typeof emailjs.init === 'function') {
    emailjs.init('ZVvOr694TaEWltgYF');
  }

  // Register GSAP ScrollTrigger
  if (window.gsap && window.ScrollTrigger) {
    window.gsap.registerPlugin(window.ScrollTrigger);
  }

  // Throttle helper for performance
  function throttle(fn, wait) {
    let last = 0;
    return function (...args) {
      const now = Date.now();
      if (now - last >= wait) {
        last = now;
        fn.apply(this, args);
      }
    };
  }

  // App State variables
  const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const cursor = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  /* -----------------------------------------------------------
     1. PRELOADER ANIMATION
     ----------------------------------------------------------- */
  const preloader = document.getElementById('preloader');
  const progressFill = document.getElementById('loader-progress');
  let progress = 0;
  let preloaderHidden = false;

  function hidePreloader() {
    if (!preloader || preloaderHidden) return;
    preloaderHidden = true;
    clearInterval(progressInterval);

    if (progressFill) {
      gsap.to(progressFill, {
        width: '100%',
        duration: 0.3,
        ease: 'power2.out'
      });
    }

    preloader.classList.add('hidden');
    setTimeout(() => {
      if (preloader) preloader.style.display = 'none';
      if (typeof runEntranceAnimations === 'function') runEntranceAnimations();
    }, 420);
  }
  if (typeof window.hidePreloaderSafely !== 'function') {
    window.hidePreloaderSafely = hidePreloader;
  }

  const progressInterval = setInterval(() => {
    progress += Math.floor(Math.random() * 15) + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(progressInterval);

      // Hide preloader and trigger entrance animations
      gsap.timeline()
        .to(progressFill, { width: '100%', duration: 0.2 })
        .to(preloader, {
          y: '-100%',
          opacity: 0,
          duration: 0.8,
          ease: 'power4.inOut',
          onComplete: hidePreloader
        });
    } else {
      progressFill.style.width = `${progress}%`;
    }
  }, 50);

  // FALLBACK: Force hide preloader after 5 seconds if progress animation hasn't completed
  setTimeout(() => {
    if (!preloaderHidden) {
      console.log('[Preloader] Force hiding after 5s timeout');
      hidePreloader();
    }
  }, 5000);

  // Ensure the page opens smoothly once all assets finish loading
  window.addEventListener('load', () => {
    if (!preloaderHidden) {
      hidePreloader();
    }
  });

  /* -----------------------------------------------------------
     2. CUSTOM CURSOR GLOW (Smooth trailing with Lerp)
     ----------------------------------------------------------- */
  const cursorGlow = document.getElementById('cursor-glow');
  
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  // Smooth trailing logic using linear interpolation (lerp)
  function updateCursor() {
    const lerpFactor = 0.08;
    cursor.x += (mouse.x - cursor.x) * lerpFactor;
    cursor.y += (mouse.y - cursor.y) * lerpFactor;

    // Use transform for GPU-accelerated movement
    cursorGlow.style.transform = `translate(${cursor.x}px, ${cursor.y}px)`;

    requestAnimationFrame(updateCursor);
  }
  updateCursor();

  // Scale cursor glow on button hover
  const interactiveElements = document.querySelectorAll('a, button, .social-badge, .project-card, .skills-category-card, .skill-orb');
  interactiveElements.forEach(elem => {
    elem.addEventListener('mouseenter', () => {
      cursorGlow.style.width = '550px';
      cursorGlow.style.height = '550px';
    });
    elem.addEventListener('mouseleave', () => {
      cursorGlow.style.width = '400px';
      cursorGlow.style.height = '400px';
    });
  });

  /* -----------------------------------------------------------
     3. ROLE TYPING EFFECT
     ----------------------------------------------------------- */
  const roleText = document.getElementById('role-text');
  const roles = [
    'AI/ML Engineer',
    'Backend Developer',
    'Python Developer'
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeRole() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      roleText.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      roleText.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      // Pause at full text
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500;
    }

    setTimeout(typeRole, typingSpeed);
  }
  
  // Start typing loop
  setTimeout(typeRole, 1000);

  /* -----------------------------------------------------------
     4. ENTRANCE ANIMATIONS (GSAP)
     ----------------------------------------------------------- */
  function runEntranceAnimations() {
    const heroTl = gsap.timeline();

    // Fade and slide header
    heroTl.from('.header', {
      y: -50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });

    // Reveal hero tags, titles, taglines staggered
    heroTl.from('.hero-tag', {
      opacity: 0,
      x: -30,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.6');

    heroTl.from('.hero-title', {
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.4');

    heroTl.from('.hero-tagline', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.6');

    heroTl.from('.hero-ctas .btn', {
      opacity: 0,
      y: 20,
      stagger: 0.15,
      duration: 0.8,
      ease: 'back.out(1.7)'
    }, '-=0.5');

    // Reveal right side image/frame container
    heroTl.from('.photo-frame-container', {
      opacity: 0,
      scale: 0.9,
      x: 50,
      duration: 1,
      ease: 'power4.out'
    }, '-=0.8');

    // Reveal floating tags sequentially
    heroTl.from('.floating-badge', {
      opacity: 0,
      y: 15,
      stagger: 0.2,
      duration: 0.8,
      ease: 'back.out(2)'
    }, '-=0.4');
  }

  /* -----------------------------------------------------------
     5. SCROLL TRIGGER ANIMATIONS (GSAP)
     ----------------------------------------------------------- */
  // Section Headers Reveal
  const sectionHeaders = document.querySelectorAll('.section-header');
  sectionHeaders.forEach(header => {
    gsap.from(header, {
      scrollTrigger: {
        trigger: header,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 45,
      duration: 0.8,
      ease: 'power3.out'
    });
  });

  // About Me Section Animations
  gsap.from('.about-text p', {
    scrollTrigger: {
      trigger: '.about-text',
      start: 'top 85%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    x: -40,
    stagger: 0.2,
    duration: 0.8,
    ease: 'power3.out'
  });


  // About network visual scale-in
  gsap.from('#about-canvas-container', {
    scrollTrigger: {
      trigger: '#about-canvas-container',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    scale: 0.95,
    duration: 1,
    ease: 'power3.out'
  });

  // 1. Scroll trigger to reveal the category cards staggered
  const skillCategoryCards = document.querySelectorAll('.skills-category-card');
  gsap.from(skillCategoryCards, {
    scrollTrigger: {
      trigger: '.skills-grid',
      start: 'top 85%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 35,
    stagger: 0.15,
    duration: 0.8,
    ease: 'power3.out'
  });

  // 2. Interactive Physics-based Technology Showcase
  skillCategoryCards.forEach(card => {
    const container = card.querySelector('.skills-interactive-container');
    if (!container) return;

    let orbs = [];
    let isHovered = false;
    let animId = null;

    // Mouse and Touch position tracking
    let mouseX = null;
    let mouseY = null;
    let prevMouseX = null;
    let prevMouseY = null;
    let mouseVx = 0;
    let mouseVy = 0;

    // Dynamically instantiate orbs at card center
    function initOrbs() {
      container.innerHTML = ''; // Clear DOM orbs
      orbs = [];

      const W = container.clientWidth || 300;
      const H = container.clientHeight || 220;
      const cx = W / 2;
      const cy = H / 2;

      const skills = JSON.parse(card.getAttribute('data-skills') || '[]');

      skills.forEach((skill, index) => {
        const el = document.createElement('div');
        el.className = 'skill-orb';
        el.innerHTML = `
          <span class="orb-emoji">${skill.emoji}</span>
          <span class="orb-label">${skill.name}</span>
        `;

        // Scale orb size with text length: 2 chars -> 56px, 12 chars -> 82px
        const textLen = skill.name.length;
        const size = Math.max(56, Math.min(82, 56 + ((textLen - 2) / 10) * 26));
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;

        const rx = size / 2;
        const ry = size / 2;

        // Position initially at the card center
        el.style.left = `${cx - rx}px`;
        el.style.top = `${cy - ry}px`;

        container.appendChild(el);

        // Add to active simulation
        orbs.push({
          element: el,
          x: cx,
          y: cy,
          vx: (Math.random() - 0.5) * 3, // Initial velocity for spreading outward
          vy: (Math.random() - 0.5) * 3,
          w: size,
          h: size,
          r: rx,
          rx: rx,
          ry: ry
        });

        // Spring pop-in staggered delay animation (60ms stagger)
        setTimeout(() => {
          if (isHovered) el.classList.add('active');
        }, index * 60);
      });
    }

    // Main frame update physics engine loop
    function updatePhysics() {
      if (!isHovered) return;

      const W = container.clientWidth;
      const H = container.clientHeight;

      // Track cursor velocity
      if (mouseX !== null && prevMouseX !== null) {
        mouseVx = mouseX - prevMouseX;
        mouseVy = mouseY - prevMouseY;
      } else {
        mouseVx = 0;
        mouseVy = 0;
      }
      prevMouseX = mouseX;
      prevMouseY = mouseY;

      const damping = 0.985;
      const restitution = 0.55;
      const repulsionRadius = 60;

      // Position updating and cursor repulsion
      orbs.forEach(orb => {
        // Ambient natural float drift
        orb.vx += (Math.random() - 0.5) * 0.06;
        orb.vy += (Math.random() - 0.5) * 0.06 - 0.01;

        // Apply friction drag damping
        orb.vx *= damping;
        orb.vy *= damping;

        // Integrate
        orb.x += orb.vx;
        orb.y += orb.vy;

        // Bouncing off wall boundaries (elastic collision)
        if (orb.x - orb.rx < 0) {
          orb.x = orb.rx;
          orb.vx = -orb.vx * restitution;
        } else if (orb.x + orb.rx > W) {
          orb.x = W - orb.rx;
          orb.vx = -orb.vx * restitution;
        }

        if (orb.y - orb.ry < 0) {
          orb.y = orb.ry;
          orb.vy = -orb.vy * restitution;
        } else if (orb.y + orb.ry > H) {
          orb.y = H - orb.ry;
          orb.vy = -orb.vy * restitution;
        }

        // Repel from cursor within 60px radius
        if (mouseX !== null && mouseY !== null) {
          const dx = orb.x - mouseX;
          const dy = orb.y - mouseY;
          const dist = Math.hypot(dx, dy);

          if (dist < repulsionRadius) {
            const force = (repulsionRadius - dist) / repulsionRadius;
            const push = force * (1.8 + Math.hypot(mouseVx, mouseVy) * 0.12);
            const angle = dist > 0 ? { x: dx / dist, y: dy / dist } : { x: 0, y: -1 };

            orb.vx += angle.x * push;
            orb.vy += angle.y * push;

            if (push > 1.1 && !orb.element.classList.contains('orb-pulse')) {
              orb.element.classList.add('orb-pulse');
              setTimeout(() => {
                orb.element && orb.element.classList.remove('orb-pulse');
              }, 400);
            }
          }
        }
      });

      // Soft circular orb-to-orb collisions
      for (let i = 0; i < orbs.length; i++) {
        for (let j = i + 1; j < orbs.length; j++) {
          const a = orbs[i];
          const b = orbs[j];

          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy);
          const minDist = a.r + b.r;

          if (dist < minDist && dist > 0) {
            const overlap = minDist - dist;
            const nx = dx / dist;
            const ny = dy / dist;

            // Push away to resolve overlap
            a.x -= nx * overlap * 0.5;
            a.y -= ny * overlap * 0.5;
            b.x += nx * overlap * 0.5;
            b.y += ny * overlap * 0.5;

            // Velocity exchange
            const kx = a.vx - b.vx;
            const ky = a.vy - b.vy;
            const p = nx * kx + ny * ky;

            if (p > 0) {
              a.vx -= p * nx * 0.8;
              a.vy -= p * ny * 0.8;
              b.vx += p * nx * 0.8;
              b.vy += p * ny * 0.8;
            }
          }
        }
      }

      // Update positions on elements
      orbs.forEach(orb => {
        const left = orb.x - orb.w / 2;
        const top = orb.y - orb.h / 2;
        orb.element.style.left = `${left}px`;
        orb.element.style.top = `${top}px`;
      });

      animId = requestAnimationFrame(updatePhysics);
    }

    // Touch handlers
    function handleTouchMove(e) {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = container.getBoundingClientRect();
        mouseX = touch.clientX - rect.left;
        mouseY = touch.clientY - rect.top;
      }
    }

    // Mouse events
    card.addEventListener('mouseenter', () => {
      isHovered = true;
      initOrbs();

      cancelAnimationFrame(animId);
      animId = requestAnimationFrame(updatePhysics);
    });

    card.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });

    card.addEventListener('mouseleave', () => {
      isHovered = false;
      mouseX = null;
      mouseY = null;
      prevMouseX = null;
      prevMouseY = null;

      // Staggered fade out & scale down
      const currentOrbs = Array.from(container.querySelectorAll('.skill-orb'));
      currentOrbs.forEach((el, index) => {
        setTimeout(() => {
          if (!isHovered) {
            el.classList.remove('active');
            // Remove DOM element
            setTimeout(() => {
              if (!isHovered && el.parentNode) el.remove();
            }, 400);
          }
        }, index * 40); // 40ms staggered exit delay
      });
      orbs = []; // Clear active simulation array

      setTimeout(() => {
        if (!isHovered) cancelAnimationFrame(animId);
      }, 500);
    });

    // Touch events for mobile compatibility
    card.addEventListener('touchstart', (e) => {
      isHovered = true;
      
      if (container.querySelectorAll('.skill-orb').length === 0) {
        initOrbs();
      }

      const touch = e.touches[0];
      const rect = container.getBoundingClientRect();
      mouseX = touch.clientX - rect.left;
      mouseY = touch.clientY - rect.top;

      cancelAnimationFrame(animId);
      animId = requestAnimationFrame(updatePhysics);
    });

    card.addEventListener('touchmove', handleTouchMove);

    card.addEventListener('touchend', () => {
      isHovered = false;
      mouseX = null;
      mouseY = null;
      prevMouseX = null;
      prevMouseY = null;

      const currentOrbs = Array.from(container.querySelectorAll('.skill-orb'));
      currentOrbs.forEach((el, index) => {
        setTimeout(() => {
          if (!isHovered) {
            el.classList.remove('active');
            setTimeout(() => {
              if (!isHovered && el.parentNode) el.remove();
            }, 400);
          }
        }, index * 40);
      });
      orbs = [];

      setTimeout(() => {
        if (!isHovered) cancelAnimationFrame(animId);
      }, 500);
    });
  });

  // Project Cards sequence reveal
  gsap.from('.project-card', {
    scrollTrigger: {
      trigger: '.projects-grid',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 50,
    stagger: 0.15,
    duration: 0.8,
    ease: 'power3.out'
  });

  // Education Timeline Animation
  gsap.from('.timeline-item', {
    scrollTrigger: {
      trigger: '.education-timeline',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    x: -30,
    stagger: 0.3,
    duration: 0.8,
    ease: 'power3.out'
  });

  // Contact Info cards staggered entry
  gsap.from('.contact-card', {
    scrollTrigger: {
      trigger: '.contact-info',
      start: 'top 85%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    x: -30,
    stagger: 0.15,
    duration: 0.8,
    ease: 'power3.out'
  });

  // Contact form reveal
  gsap.from('.contact-form-card', {
    scrollTrigger: {
      trigger: '.contact-form-card',
      start: 'top 85%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 40,
    duration: 0.8,
    ease: 'power3.out'
  });

  /* -----------------------------------------------------------
     6. INTERACTIVE NEURAL NETWORK CANVAS
     ----------------------------------------------------------- */
  const canvas = document.getElementById('neural-network-canvas');
  const ctx = canvas.getContext('2d');
  let canvasContainer = document.getElementById('about-canvas-container');

  let particles = [];
  let particleCount = window.innerWidth < 768 ? 20 : 45;
  const connectionDistance = 110;
  const mouseRadius = 140;

  let canvasMouse = { x: null, y: null };
  let canvasAnimId = null;

  function resizeCanvas() {
    canvas.width = canvasContainer.clientWidth;
    canvas.height = canvasContainer.clientHeight;
    initParticles();
  }

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.baseX = x;
      this.baseY = y;
      this.size = Math.random() * 2.5 + 1.5;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
    }

    update() {
      // Passive random movement
      this.x += this.vx;
      this.y += this.vy;

      // Bounce off walls
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

      // Mouse interactive push/pull physics
      if (canvasMouse.x !== null && canvasMouse.y !== null) {
        let dx = canvasMouse.x - this.x;
        let dy = canvasMouse.y - this.y;
        let distance = Math.hypot(dx, dy);

        if (distance < mouseRadius) {
          // Attract towards mouse representing "data flow gathering"
          let force = (mouseRadius - distance) / mouseRadius;
          this.x += (dx / distance) * force * 1.5;
          this.y += (dy / distance) * force * 1.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 90, 95, 0.75)';
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      let x = Math.random() * canvas.width;
      let y = Math.random() * canvas.height;
      particles.push(new Particle(x, y));
    }
  }

  function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        let dx = particles[a].x - particles[b].x;
        let dy = particles[a].y - particles[b].y;
        let dist = Math.hypot(dx, dy);

        if (dist < connectionDistance) {
          // Opacity decreases as distance increases
          let alpha = (connectionDistance - dist) / connectionDistance;
          ctx.strokeStyle = `rgba(255, 90, 95, ${alpha * 0.22})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  // Set listeners for canvas mouse tracking
  canvasContainer.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    canvasMouse.x = e.clientX - rect.left;
    canvasMouse.y = e.clientY - rect.top;
  });

  canvasContainer.addEventListener('mouseleave', () => {
    canvasMouse.x = null;
    canvasMouse.y = null;
  });

  // Pause canvas when not visible (saves CPU)
  let canvasVisible = true;
  const canvasObserver = new IntersectionObserver((entries) => {
    canvasVisible = entries[0].isIntersecting;
  }, { threshold: 0.1 });

  canvasObserver.observe(canvasContainer);

  function animateCanvas() {
    if (!canvasVisible) {
      canvasAnimId = requestAnimationFrame(animateCanvas);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    canvasAnimId = requestAnimationFrame(animateCanvas);
  }

  // Debounced resize handler (better than frequent calls)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resizeCanvas, 150);
  }, { passive: true });

  // Trigger initial network setup
  resizeCanvas();
  animateCanvas();

  /* -----------------------------------------------------------
     7. MAGNETIC BUTTON EFFECT
     ----------------------------------------------------------- */
  const magneticElements = document.querySelectorAll('.btn, .social-badge');
  magneticElements.forEach(elem => {
    elem.addEventListener('mousemove', (e) => {
      const rect = elem.getBoundingClientRect();
      const elemX = rect.left + rect.width / 2;
      const elemY = rect.top + rect.height / 2;
      
      // Calculate cursor vector relative to element center
      const pullX = e.clientX - elemX;
      const pullY = e.clientY - elemY;
      
      // Translate elements by a fraction of the distance (spring effect)
      const pullFactor = 0.35;
      gsap.to(elem, {
        x: pullX * pullFactor,
        y: pullY * pullFactor,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    elem.addEventListener('mouseleave', () => {
      // Elastic spring back to base placement
      gsap.to(elem, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1.1, 0.4)'
      });
    });
  });

  /* -----------------------------------------------------------
     8. 3D TILT EFFECT & SPOTLIGHT TRACKING
     ----------------------------------------------------------- */
  // Project Cards Tilt
  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      // Set CSS variables for pointer spotlight tracking
      card.style.setProperty('--mouse-x', `${mouseX}px`);
      card.style.setProperty('--mouse-y', `${mouseY}px`);

      // Tilt angle calculations
      const width = rect.width;
      const height = rect.height;
      const tiltX = ((mouseY / height) - 0.5) * 12; // Max 6deg
      const tiltY = (((mouseX / width) - 0.5) * -12) * 1; 

      gsap.to(card, {
        rotateX: tiltX,
        rotateY: tiltY,
        transformPerspective: 800,
        ease: 'power2.out',
        duration: 0.2
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        ease: 'power2.out',
        duration: 0.4
      });
    });
  });

  // Hero Photo Frame Tilt
  const photoFrame = document.getElementById('hero-photo-frame');
  if (photoFrame) {
    photoFrame.addEventListener('mousemove', (e) => {
      const rect = photoFrame.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const width = rect.width;
      const height = rect.height;
      const tiltX = ((mouseY / height) - 0.5) * 15;
      const tiltY = (((mouseX / width) - 0.5) * -15) * 1;

      gsap.to(photoFrame, {
        rotateX: tiltX,
        rotateY: tiltY,
        transformPerspective: 1000,
        ease: 'power2.out',
        duration: 0.2
      });
    });

    photoFrame.addEventListener('mouseleave', () => {
      gsap.to(photoFrame, {
        rotateX: 0,
        rotateY: 0,
        ease: 'power2.out',
        duration: 0.5
      });
    });
  }

  /* -----------------------------------------------------------
     9. SCROLL SCROLLBAR NAVIGATION & LOGIC
     ----------------------------------------------------------- */
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky header trigger
  window.addEventListener('scroll', throttle(() => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll active spy
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 160;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }, 16), { passive: true });

  // Mobile navigation trigger
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const menuIcon = document.getElementById('menu-icon');

  if (mobileToggle && navMenu && menuIcon) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      menuIcon.setAttribute('data-lucide', isOpen ? 'x' : 'menu');
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    });

    // Close menu when clicking nav links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        menuIcon.setAttribute('data-lucide', 'menu');
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
          window.lucide.createIcons();
        }
      });
    });
  }

  /* -----------------------------------------------------------
     10. CONTACT FORM — placeholder submission handler
     - Keeps the section visible and avoids submission errors
     ----------------------------------------------------------- */

  const contactForm       = document.getElementById('contact-form');
  const submitBtn         = contactForm ? document.getElementById('btn-submit-form') : null;
  const popupSuccess      = document.getElementById('popup-success');
  const popupError        = document.getElementById('popup-error');
  const emailInlineError  = document.getElementById('email-inline-error');
  const SERVICE_ID = 'service_y8q0ko4';
  const TEMPLATE_ID = 'template_mrwu16c';

  function showPopup(el) {
    if (!el) return;
    el.classList.add('show');
  }
  function hidePopup(el) {
    if (!el) return;
    el.classList.remove('show');
  }

  // Close buttons
  document.getElementById('popup-success-close')?.addEventListener('click', () => hidePopup(popupSuccess));
  document.getElementById('popup-error-close')?.addEventListener('click',   () => hidePopup(popupError));

  // Close on overlay click
  popupSuccess?.addEventListener('click', (e) => { if (e.target === popupSuccess) hidePopup(popupSuccess); });
  popupError?.addEventListener('click',   (e) => { if (e.target === popupError)   hidePopup(popupError); });

  function clearFormFields() {
    ['fname', 'femail', 'fsubj', 'fmsg'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
  }

  function handleSend(e) {
    if (e) e.preventDefault();

    const name    = document.getElementById('fname')?.value?.trim()  || '';
    const email   = document.getElementById('femail')?.value?.trim() || '';
    const subject = document.getElementById('fsubj')?.value?.trim()  || '';
    const message = document.getElementById('fmsg')?.value?.trim()   || '';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Show/hide inline email error
    if (email && !emailRegex.test(email)) {
      if (emailInlineError) emailInlineError.classList.add('show');
      document.getElementById('femail').style.borderColor = '#ff4444';
      return;
    } else {
      if (emailInlineError) emailInlineError.classList.remove('show');
      document.getElementById('femail').style.borderColor = '';
    }

    if (!name || !subject || !message) {
      if (contactForm) contactForm.reportValidity();
      return;
    }

    if (typeof emailjs === 'undefined' || !emailjs?.send) {
      showPopup(popupError);
      return;
    }

    // Loading state on button
    if (submitBtn) {
      submitBtn.disabled = true;
      const btnTextEls = submitBtn.querySelectorAll('.btn-text');
      const spinner    = submitBtn.querySelector('.btn-spinner');
      btnTextEls.forEach(el => el.style.opacity = '0');
      if (spinner) spinner.style.display = 'inline-block';
    }

    const time = new Date().toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    emailjs.send('service_y8q0ko4', 'template_mrwu16c', {
      from_name:  name,
      from_email: email,
      subject:    subject,
      message:    message,
      time:       time
    })
    .then(function(response) {
      console.log('EmailJS SUCCESS:', response.status, response.text);
      showPopup(popupSuccess);
      clearFormFields();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.querySelectorAll('.btn-text').forEach(el => el.style.opacity = '1');
        const spinner = submitBtn.querySelector('.btn-spinner');
        if (spinner) spinner.style.display = 'none';
      }
    })
    .catch(function(error) {
      console.error('EmailJS FAILED:', JSON.stringify(error));
      showPopup(popupError);
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.querySelectorAll('.btn-text').forEach(el => el.style.opacity = '1');
        const spinner = submitBtn.querySelector('.btn-spinner');
        if (spinner) spinner.style.display = 'none';
      }
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', handleSend);
  }

  document.getElementById('femail')?.addEventListener('input', function() {
    if (emailInlineError) emailInlineError.classList.remove('show');
    this.style.borderColor = '';
  });

  // Dynamically update footer year
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // Cleanup on page hide for battery saving
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      ScrollTrigger.getAll().forEach(t => t.disable());
    } else {
      ScrollTrigger.getAll().forEach(t => t.enable());
    }
  });
});