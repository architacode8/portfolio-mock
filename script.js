/**
 * ==============================================================================
 * ARCHITA PANDEY // INTERDIMENSIONAL PORTFOLIO JAVASCRIPT
 * Complete Vanilla JS implementation handling all 12 key interactions:
 * 1. Animated Portal Interaction & 3D Tilt
 * 2. Cosmic Starfield / Particle Canvas System
 * 3. Scroll Reveal via IntersectionObserver
 * 4. Smooth Scrolling & Active Nav Highlighting
 * 5. Responsive Mobile Drawer Navigation
 * 6. Interactive Personality-Dimension Tabs
 * 7. Hover Card Micro-interactions
 * 8. Functioning Copy-Email System with Clipboard API & Visual Feedback
 * 9. Custom Fluid Cursor Trailing Effect (Desktop only)
 * 10. Dynamic Humorous Terminal Message Cycling
 * 11. Top Scroll Progress Indicator
 * 12. Return to Orbit (Back to Top) Control
 * Extra: Graceful Modal for Unconfigured Placeholder Links
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Check user preference for motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================================
     1. COSMIC STARFIELD & PARTICLE CANVAS
     ========================================================================== */
  const initCosmicCanvas = () => {
    const canvas = document.getElementById('cosmic-canvas');
    if (!canvas || prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle pool
    const particleCount = Math.min(Math.floor((width * height) / 14000), 100);
    const particles = [];
    const colors = [
      'rgba(182, 255, 0, ',    // Portal Green
      'rgba(83, 246, 255, ',   // Electric Cyan
      'rgba(155, 112, 255, ',  // Purple Anomaly
      'rgba(232, 236, 231, '   // Muted White
    ];

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.8 + 0.4;
        this.baseAlpha = Math.random() * 0.6 + 0.2;
        this.alpha = this.baseAlpha;
        this.colorPrefix = colors[Math.floor(Math.random() * colors.length)];
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.pulseSpeed = Math.random() * 0.02 + 0.005;
        this.pulseAngle = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around bounds
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        // Subtle twinkling
        this.pulseAngle += this.pulseSpeed;
        this.alpha = this.baseAlpha + Math.sin(this.pulseAngle) * 0.25;
        if (this.alpha < 0.1) this.alpha = 0.1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.colorPrefix + this.alpha + ')';
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let animationFrameId;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw faint interconnecting cosmic lines between close nodes
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 85) {
            const lineAlpha = (1 - dist / 85) * 0.12;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(83, 246, 255, ${lineAlpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Draw and update particles
      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Debounced resize handler
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }, 150);
    });
  };

  /* ==========================================================================
     2. TOP SCROLL PROGRESS INDICATOR
     ========================================================================== */
  const initScrollProgress = () => {
    const progressBar = document.getElementById('scroll-progress-bar');
    const header = document.getElementById('header');
    if (!progressBar) return;

    const updateScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = `${progress}%`;

      // Header shadow toggle
      if (header) {
        if (scrollTop > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
    };

    window.addEventListener('scroll', updateScroll, { passive: true });
    updateScroll();
  };

  /* ==========================================================================
     3. SMOOTH SCROLLING & ACTIVE NAVIGATION LINK HIGHLIGHTING
     ========================================================================== */
  const initNavigation = () => {
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Smooth scroll click handler
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({
            behavior: prefersReducedMotion ? 'auto' : 'smooth'
          });

          // If mobile drawer was open, close it
          closeMobileDrawer();
        }
      });
    });

    // Active link highlighting on scroll
    const updateActiveSection = () => {
      const scrollY = window.pageYOffset + 140;

      sections.forEach((current) => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop;
        const sectionId = current.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          document.querySelectorAll('.nav-link').forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    };

    window.addEventListener('scroll', updateActiveSection, { passive: true });
  };

  /* ==========================================================================
     4. RESPONSIVE MOBILE NAVIGATION DRAWER
     ========================================================================== */
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');

  const openMobileDrawer = () => {
    if (!mobileToggle || !mobileDrawer) return;
    mobileToggle.classList.add('active');
    mobileToggle.setAttribute('aria-expanded', 'true');
    mobileDrawer.classList.add('open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Lock background scroll
  };

  const closeMobileDrawer = () => {
    if (!mobileToggle || !mobileDrawer) return;
    mobileToggle.classList.remove('active');
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileDrawer.classList.remove('open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Restore background scroll
  };

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('open');
      if (isOpen) {
        closeMobileDrawer();
      } else {
        openMobileDrawer();
      }
    });

    // Close on Escape key press
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        closeMobileDrawer();
      }
    });
  }

  /* ==========================================================================
     5. DYNAMIC TERMINAL / STATUS TEXT CYCLING
     ========================================================================== */
  const initTerminalStatus = () => {
    const textElement = document.getElementById('dynamic-terminal-text');
    if (!textElement) return;

    const messages = [
      'curiosity.exe is running...',
      'scanning multiverse for interesting questions...',
      'python syntax verified: 0 bugs detected (suspicious)...',
      'literature engine: book backlog infinite...',
      'portal stability: 98.7% // containment secure...',
      'seeking intersection of code and physical machines...',
      'status: human mind exploring AI architectures...'
    ];

    let currentIdx = 0;

    const changeMessage = () => {
      textElement.style.opacity = '0';
      textElement.style.transform = 'translateY(4px)';
      textElement.style.transition = 'opacity 0.25s ease, transform 0.25s ease';

      setTimeout(() => {
        currentIdx = (currentIdx + 1) % messages.length;
        textElement.textContent = messages[currentIdx];
        textElement.style.opacity = '1';
        textElement.style.transform = 'translateY(0)';
      }, 250);
    };

    setInterval(changeMessage, 4500);
  };

  /* ==========================================================================
     6. INTERACTIVE PERSONALITY DIMENSION TABS
     ========================================================================== */
  const initDimensionTabs = () => {
    const tabs = document.querySelectorAll('.dimension-tab');
    const panels = document.querySelectorAll('.dim-panel');

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const targetPanelId = tab.getAttribute('aria-controls');

        // Deactivate all tabs
        tabs.forEach((t) => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });

        // Hide all panels
        panels.forEach((p) => {
          p.classList.remove('active');
          p.setAttribute('hidden', 'true');
        });

        // Activate selected tab & panel
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        const activePanel = document.getElementById(targetPanelId);
        if (activePanel) {
          activePanel.classList.add('active');
          activePanel.removeAttribute('hidden');
        }
      });
    });
  };

  /* ==========================================================================
     7. FUNCTIONING EMAIL COPY WITH CLIPBOARD & TOAST FEEDBACK
     ========================================================================== */
  const initCopyEmail = () => {
    const copyBtn = document.getElementById('copy-email-btn');
    const emailSpan = document.getElementById('display-email');
    const copyBtnText = document.getElementById('copy-btn-text');
    const copyAlert = document.getElementById('copy-alert');

    if (!copyBtn || !emailSpan) return;

    copyBtn.addEventListener('click', async () => {
      // Get the email from data-email or inner text
      const emailToCopy = emailSpan.getAttribute('data-email') || emailSpan.textContent.trim();

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(emailToCopy);
        } else {
          // Fallback for older contexts
          const textArea = document.createElement('textarea');
          textArea.value = emailToCopy;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          textArea.remove();
        }

        // Visual feedback on button
        const originalText = copyBtnText.textContent;
        copyBtnText.textContent = 'COPIED TO TRANSMITTER!';
        copyBtn.style.borderColor = 'var(--acid-green)';
        copyBtn.style.color = 'var(--acid-green)';

        // Toast alert
        if (copyAlert) {
          copyAlert.classList.add('show');
          setTimeout(() => {
            copyAlert.classList.remove('show');
          }, 3200);
        }

        setTimeout(() => {
          copyBtnText.textContent = originalText;
          copyBtn.style.borderColor = '';
          copyBtn.style.color = '';
        }, 2500);

      } catch (err) {
        console.error('Failed to copy text: ', err);
        copyBtnText.textContent = 'FAILED TO ACCESS CLIPBOARD';
        setTimeout(() => {
          copyBtnText.textContent = 'COPY TRANSMISSION ADDR';
        }, 2000);
      }
    });
  };

  /* ==========================================================================
     8. CUSTOM CURSOR ON DESKTOP (FLUID LERP)
     ========================================================================== */
  const initCustomCursor = () => {
    // Only initialize on devices with fine pointer (mouse/trackpad)
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');
    if (!cursorDot || !cursorRing) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    // Smooth lerp loop for the outer ring
    const renderCursor = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
      requestAnimationFrame(renderCursor);
    };

    renderCursor();

    // Hover effect on links and buttons
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .containment-unit, .skill-card, .robo-bay-card');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
      });
    });
  };

  /* ==========================================================================
     9. SCROLL-TRIGGERED REVEAL ANIMATIONS (INTERSECTION OBSERVER)
     ========================================================================== */
  const initScrollReveals = () => {
    if (prefersReducedMotion) return;

    // Elements to reveal as user scrolls
    const targets = document.querySelectorAll(
      '.report-box, .classification-panel, .specimen-orb-card, .skill-card, ' +
      '.interests-banner-container, .containment-unit, .robo-bay-card, ' +
      '.dimension-display-card, .common-room-module, .transmission-console'
    );

    targets.forEach((el) => el.classList.add('reveal-item'));

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            obs.unobserve(entry.target); // Reveal once
          }
        });
      },
      {
        root: null,
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    targets.forEach((el) => observer.observe(el));
  };

  /* ==========================================================================
     10. HERO PORTAL SUBTLE 3D PARALLAX / TILT ON MOUSEMOVE
     ========================================================================== */
  const initPortalParallax = () => {
    const portalScene = document.getElementById('portal-scene');
    if (!portalScene || prefersReducedMotion || !window.matchMedia('(pointer: fine)').matches) return;

    let targetRotateX = 0;
    let targetRotateY = 0;
    let currentRotateX = 0;
    let currentRotateY = 0;

    window.addEventListener('mousemove', (e) => {
      const rect = portalScene.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) / (window.innerWidth / 2);
      const deltaY = (e.clientY - centerY) / (window.innerHeight / 2);

      targetRotateY = deltaX * 12; // degrees
      targetRotateX = -deltaY * 12;
    });

    const updateTilt = () => {
      currentRotateX += (targetRotateX - currentRotateX) * 0.08;
      currentRotateY += (targetRotateY - currentRotateY) * 0.08;

      portalScene.style.transform = `perspective(800px) rotateX(${currentRotateX.toFixed(2)}deg) rotateY(${currentRotateY.toFixed(2)}deg)`;
      requestAnimationFrame(updateTilt);
    };

    updateTilt();
  };

  /* ==========================================================================
     11. MODAL DIALOG FOR UNCONFIGURED PLACEHOLDER LINKS
     ========================================================================== */
  const initPlaceholderModal = () => {
    const modal = document.getElementById('link-modal');
    const modalClose = document.getElementById('modal-close');
    const modalOkBtn = document.getElementById('modal-ok-btn');
    const modalBody = document.getElementById('modal-body');
    const placeholderLinks = document.querySelectorAll('.placeholder-link');

    if (!modal) return;

    const showModal = (networkName) => {
      if (modalBody) {
        modalBody.innerHTML = `Your <strong>${networkName}</strong> profile link is currently a placeholder.<br><br>To link your real account, open <code>portfolio.html</code> and update the <code>href</code> and <code>data-url</code> attributes in the Contact section!`;
      }
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    };

    const hideModal = () => {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    };

    placeholderLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const network = link.getAttribute('data-network') || 'External';
        showModal(network);
      });
    });

    if (modalClose) modalClose.addEventListener('click', hideModal);
    if (modalOkBtn) modalOkBtn.addEventListener('click', hideModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) hideModal();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        hideModal();
      }
    });
  };

  /* ==========================================================================
     12. INITIALIZE ALL PROTOCOLS
     ========================================================================== */
  initCosmicCanvas();
  initScrollProgress();
  initNavigation();
  initTerminalStatus();
  initDimensionTabs();
  initCopyEmail();
  initCustomCursor();
  initScrollReveals();
  initPortalParallax();
  initPlaceholderModal();

  console.log('%c[PORTFOLIO PROTOCOL]%c ARCHITA.EXE INITIALIZED // ALL SYSTEMS ONLINE', 
    'color: #B6FF00; font-family: monospace; font-weight: bold;', 
    'color: #53F6FF; font-family: monospace;'
  );
});
