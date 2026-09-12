document.addEventListener('DOMContentLoaded', () => {
  /*==================== MENU SHOW & HIDDEN ====================*/
  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.getElementById('nav-toggle');
  const navClose = document.getElementById('nav-close');

  /*===== MENU SHOW =====*/
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.add('show-menu');
      document.body.classList.add('menu-open');
    });
  }

  /*===== MENU HIDDEN =====*/
  if (navClose && navMenu) {
    navClose.addEventListener('click', () => {
      navMenu.classList.remove('show-menu');
      document.body.classList.remove('menu-open');
    });
  }

  /*==================== REMOVE MENU MOBILE ====================*/
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navMenu?.classList.remove('show-menu');
      document.body.classList.remove('menu-open');
    });
  });

  /*==================== CHANGE BACKGROUND HEADER ====================*/
  const scrollHeader = () => {
    const header = document.getElementById('header');
    if (!header) return;

    window.scrollY >= 50
      ? header.classList.add('scroll-header')
      : header.classList.remove('scroll-header');
  };

  window.addEventListener('scroll', scrollHeader, { passive: true });
  scrollHeader();

  /*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
  const sections = document.querySelectorAll('section[id]');

  const setActiveLink = () => {
    const scrollPosition = window.scrollY + 140;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      const matchingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (!matchingLink) return;

      const sectionIsActive =
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight;

      matchingLink.classList.toggle('active-link', sectionIsActive);
    });
  };

  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  /*==================== GSAP SCROLL ANIMATIONS ====================*/
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from('.home-data', {
      opacity: 0,
      x: -50,
      duration: 1.1,
      ease: 'power3.out',
    });

    gsap.from('.home-img-wrapper', {
      opacity: 0,
      x: 50,
      duration: 1.1,
      delay: 0.15,
      ease: 'power3.out',
    });

    gsap.from('.about-container', {
      scrollTrigger: {
        trigger: '.about',
        start: 'top 78%',
      },
      opacity: 0,
      y: 60,
      duration: 1.1,
      ease: 'power3.out',
    });

    gsap.from('.achievement-img-wrapper', {
      scrollTrigger: {
        trigger: '.achievement',
        start: 'top 80%',
      },
      opacity: 0,
      x: -60,
      duration: 1,
      ease: 'power3.out',
    });

    gsap.from('.achievement-content', {
      scrollTrigger: {
        trigger: '.achievement',
        start: 'top 80%',
      },
      opacity: 0,
      x: 60,
      duration: 1,
      ease: 'power3.out',
    });

    gsap.from('.skills-card', {
      scrollTrigger: {
        trigger: '.skills',
        start: 'top 76%',
         once: true
      },
      opacity: 0,
  y: 50,
  duration: 0.9,
  ease: "power3.out",
  clearProps: "transform,opacity",
    });

 gsap.from(".projects-grid", {
  scrollTrigger: {
    trigger: ".projects",
    start: "top 76%",
    once: true,
  },
  opacity: 0,
  y: 50,
  duration: 0.9,
  ease: "power3.out",
  clearProps: "transform,opacity",
});

    gsap.from('.contact-container', {
      scrollTrigger: {
        trigger: '.contact',
        start: 'top 78%',
      },
      opacity: 0,
      y: 55,
      duration: 1,
      ease: 'power3.out',
    });
  }

  

  /*==================== DARK / LIGHT THEME ====================*/
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle?.querySelector('i');

  const applyTheme = (theme) => {
    const lightThemeIsActive = theme === 'light';

    document.body.classList.toggle('light-theme', lightThemeIsActive);
    themeIcon?.classList.toggle('ri-sun-line', !lightThemeIsActive);
    themeIcon?.classList.toggle('ri-moon-line', lightThemeIsActive);
    localStorage.setItem('marwan-portfolio-theme', theme);
  };

  const savedTheme = localStorage.getItem('marwan-portfolio-theme') || 'dark';
  applyTheme(savedTheme);

  themeToggle?.addEventListener('click', () => {
    const isLight = document.body.classList.contains('light-theme');
    applyTheme(isLight ? 'dark' : 'light');
  });

  /*==================== VIDEO SCROLL & PAGINATION ====================*/
  const videoSection = document.querySelector('.videos');

  if (videoSection) {
    const track = videoSection.querySelector('#video-track');
    const viewport = videoSection.querySelector('.video-viewport');
    const cards = Array.from(videoSection.querySelectorAll('.video-card'));
    const previousButton = videoSection.querySelector('#video-prev');
    const nextButton = videoSection.querySelector('#video-next');
    const pagination = videoSection.querySelector('#video-pagination');
    const counter = videoSection.querySelector('#video-counter');
    const progressBar = videoSection.querySelector('#video-progress-bar');

    let currentPage = 0;
    let touchStartX = 0;
    let touchStartedOnVideo = false;
    let resizeTimer;

    /* Cards displayed on each screen size */
    const cardsPerView = () => {
      if (window.innerWidth <= 700) return 1;
      if (window.innerWidth <= 1100) return 2;
      return 3;
    };

    /* Total number of carousel pages */
    const totalPages = () => Math.ceil(cards.length / cardsPerView());

    /* Stop videos outside the current page */
    const pauseHiddenVideos = () => {
      const visibleCards = cardsPerView();
      const firstVisibleIndex = currentPage * visibleCards;
      const lastVisibleIndex = firstVisibleIndex + visibleCards - 1;

      cards.forEach((card, index) => {
        if (index < firstVisibleIndex || index > lastVisibleIndex) {
          const video = card.querySelector('.portfolio-video');
          if (video && !video.paused) video.pause();
        }
      });
    };

    /* Create page dots */
    const createPagination = () => {
      if (!pagination) return;

      pagination.innerHTML = '';

      for (let page = 0; page < totalPages(); page += 1) {
        const dot = document.createElement('button');

        dot.type = 'button';
        dot.className = 'pagination-dot';
        dot.setAttribute('aria-label', `Go to video page ${page + 1}`);

        dot.addEventListener('click', () => {
          currentPage = page;
          updateCarousel();
        });

        pagination.appendChild(dot);
      }
    };

    /* Move cards and update controls */
    const updateCarousel = () => {
      if (!track || cards.length === 0) return;

      const visibleCards = cardsPerView();
      const pages = totalPages();

      currentPage = Math.max(0, Math.min(currentPage, pages - 1));

      const firstVisibleIndex = currentPage * visibleCards;
      const firstVisibleCard = cards[firstVisibleIndex];

      if (firstVisibleCard) {
        track.style.transform = `translate3d(-${firstVisibleCard.offsetLeft}px, 0, 0)`;
      }

      /* Arrow states */
      if (previousButton) previousButton.disabled = currentPage === 0;
      if (nextButton) nextButton.disabled = currentPage === pages - 1;

      /* Counter */
      const visibleStart = firstVisibleIndex + 1;
      const visibleEnd = Math.min(firstVisibleIndex + visibleCards, cards.length);

      if (counter) {
        const start = String(visibleStart).padStart(2, '0');
        const end = String(visibleEnd).padStart(2, '0');
        const total = String(cards.length).padStart(2, '0');

        counter.textContent = visibleCards === 1
          ? `${start} / ${total}`
          : `${start}–${end} / ${total}`;
      }

      /* Progress */
      if (progressBar) {
        const progress = ((currentPage + 1) / pages) * 100;
        progressBar.style.width = `${progress}%`;
      }

      /* Active dot */
      pagination?.querySelectorAll('.pagination-dot').forEach((dot, index) => {
        const isActive = index === currentPage;
        dot.classList.toggle('active', isActive);

        if (isActive) {
          dot.setAttribute('aria-current', 'true');
        } else {
          dot.removeAttribute('aria-current');
        }
      });

      pauseHiddenVideos();

      /* Reveal the track only once positions are correct — prevents refresh flash */
      track.classList.add('is-ready');
    };

    /* Previous page */
    previousButton?.addEventListener('click', () => {
      if (currentPage <= 0) return;
      currentPage -= 1;
      updateCarousel();
    });

    /* Next page */
    nextButton?.addEventListener('click', () => {
      if (currentPage >= totalPages() - 1) return;
      currentPage += 1;
      updateCarousel();
    });

    /* Mobile swipe */
    viewport?.addEventListener('touchstart', (event) => {
      touchStartX = event.touches[0].clientX;
      touchStartedOnVideo = event.target.closest('.portfolio-video') !== null;
    }, { passive: true });

    viewport?.addEventListener('touchend', (event) => {
      if (touchStartedOnVideo) return;

      const touchEndX = event.changedTouches[0].clientX;
      const distance = touchEndX - touchStartX;

      if (Math.abs(distance) < 50) return;

      if (distance < 0 && currentPage < totalPages() - 1) {
        currentPage += 1;
      }

      if (distance > 0 && currentPage > 0) {
        currentPage -= 1;
      }

      updateCarousel();
    }, { passive: true });

    /* Video settings */
    const videos = videoSection.querySelectorAll('.portfolio-video');

    videos.forEach((video) => {
      video.setAttribute('controlsList', 'nodownload noremoteplayback');
      video.setAttribute('disablePictureInPicture', '');
      video.setAttribute('disableRemotePlayback', '');
      video.setAttribute('playsinline', '');

      video.disablePictureInPicture = true;
      video.disableRemotePlayback = true;

      /* Disable right-click menu */
      video.addEventListener('contextmenu', (event) => {
        event.preventDefault();
      });

      /* Play only one video at a time */
      video.addEventListener('play', () => {
        videos.forEach((otherVideo) => {
          if (otherVideo !== video) {
            otherVideo.pause();
          }
        });
      });
    });

    /* Recalculate after resizing */
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);

      resizeTimer = setTimeout(() => {
        currentPage = 0;
        createPagination();
        updateCarousel();
      }, 150);
    });

    /* Initial layout pass */
    createPagination();
    updateCarousel();

    /* Recalculate once images/video posters/fonts have fully loaded —
       fixes the "cards jump on refresh" issue caused by measuring
       offsetLeft before final card widths were ready */
    window.addEventListener('load', () => {
      createPagination();
      updateCarousel();
    });

    /* Safe section animation */
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);

      gsap.from('.videos-container', {
        scrollTrigger: {
          trigger: '.videos',
          start: 'top 78%',
        },
        opacity: 0,
        y: 45,
        duration: 0.9,
        ease: 'power3.out',
      });
    }
  }

  /*==================== CONTACT FORM / EMAIL JS ====================*/
  const contactForm = document.getElementById('contact-form');
  const contactName = document.getElementById('contact-name');
  const contactEmail = document.getElementById('contact-email');
  const contactMessage = document.getElementById('contact-message');
  const formMessage = document.getElementById('message');

  // Add your EmailJS values here. Until then, the form uses a mailto fallback.
  const EMAILJS_SERVICE_ID = '';
  const EMAILJS_TEMPLATE_ID = '';
  const EMAILJS_PUBLIC_KEY = '';

  const showFormMessage = (text, color) => {
    if (!formMessage) return;
    formMessage.textContent = text;
    formMessage.style.color = color;
    setTimeout(() => { formMessage.textContent = ''; }, 5000);
  };

  contactForm?.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!contactName.value.trim() || !contactEmail.value.trim() || !contactMessage.value.trim()) {
      showFormMessage('Please fill in all fields.', '#ef5a2f');
      return;
    }

    const emailJsIsConfigured =
      window.emailjs &&
      EMAILJS_SERVICE_ID &&
      EMAILJS_TEMPLATE_ID &&
      EMAILJS_PUBLIC_KEY;

    if (!emailJsIsConfigured) {
      const subject = encodeURIComponent(`Portfolio message from ${contactName.value.trim()}`);
      const body = encodeURIComponent(
        `Name: ${contactName.value.trim()}\nEmail: ${contactEmail.value.trim()}\n\n${contactMessage.value.trim()}`
      );
      window.location.href = `mailto:marozaky66@gmail.com?subject=${subject}&body=${body}`;
      showFormMessage('Your email application has been opened.', '#22c55e');
      return;
    }

    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        '#contact-form',
        EMAILJS_PUBLIC_KEY
      );
      showFormMessage('Message sent successfully.', '#22c55e');
      contactForm.reset();
    } catch (error) {
      console.error('EmailJS failed:', error);
      showFormMessage('Message could not be sent. Please email Marwan directly.', '#ef5a2f');
    }
  });

  /*==================== FOOTER YEAR ====================*/
  const currentYear = document.getElementById('current-year');
  if (currentYear) currentYear.textContent = new Date().getFullYear();
});