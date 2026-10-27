/**
 * Peter Cadimas Portfolio — Animation System
 * Built on Lenis, GSAP 3, and Breems (bramvanvugt.com) design principles
 */

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  // -------------------------------------------------------------
  // 1. Initialize Lenis Smooth Scrolling
  // -------------------------------------------------------------
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0, 16);

  // -------------------------------------------------------------
  // 2. Custom Follower Cursor Bubble (Breems style)
  // -------------------------------------------------------------
  const cursor = document.getElementById('cursorFollower');
  const cursorText = cursor.querySelector('.cursor-text');
  
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (mouseX > window.innerWidth - 120) {
      cursor.classList.add('edge-flipped');
    } else {
      cursor.classList.remove('edge-flipped');
    }
  });

  gsap.ticker.add(() => {
    const dt = 1 - Math.pow(0.2, gsap.ticker.deltaRatio());
    cursorX += (mouseX - cursorX) * dt;
    cursorY += (mouseY - cursorY) * dt;
    gsap.set(cursor, { x: cursorX - 45, y: cursorY - 45 });
  });

  document.querySelectorAll('[data-cursor]').forEach((elem) => {
    elem.addEventListener('mouseenter', () => {
      const label = elem.getAttribute('data-cursor') || 'VIEW';
      cursorText.textContent = label;
      cursor.classList.add('is-active');
    });
    elem.addEventListener('mouseleave', () => {
      cursor.classList.remove('is-active');
    });
  });

  // -------------------------------------------------------------
  // 3. Hero Line-Mask Slide Reveal (Breems split-line animation)
  // -------------------------------------------------------------
  function animateHeroLines() {
    const splitLines = document.querySelectorAll('.hero .split-line');

    gsap.fromTo(
      splitLines,
      {
        y: '100%',
        opacity: 0,
      },
      {
        y: '0%',
        opacity: 1,
        duration: 1.25,
        ease: 'cubic-bezier(0.625, 0.05, 0, 1)',
        stagger: 0.12,
        delay: 0.15,
      }
    );

    // Koffie button slide-in/fade-in
    const koffieBtn = document.querySelector('.get-in-touch-button');
    if (koffieBtn) {
      gsap.fromTo(
        koffieBtn,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: 'back.out(1.7)', delay: 0.6 }
      );
    }
  }
  animateHeroLines();

  // -------------------------------------------------------------
  // 4. Word / Heading Reveal on Scroll
  // -------------------------------------------------------------
  document.querySelectorAll('[data-word-reveal]').forEach((heading) => {
    gsap.fromTo(
      heading,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.1,
        ease: 'cubic-bezier(0.625, 0.05, 0, 1)',
        scrollTrigger: {
          trigger: heading,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  // -------------------------------------------------------------
  // 5. Card Parallax & Scroll Fade
  // -------------------------------------------------------------
  gsap.utils.toArray('.card').forEach((card) => {
    gsap.fromTo(
      card,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
        },
      }
    );
  });

  // -------------------------------------------------------------
  // 6. Pillars Carousel Controller
  // -------------------------------------------------------------
  (function () {
    const track = document.getElementById('track');
    const carousel = document.getElementById('carousel');
    const dots = Array.from(document.querySelectorAll('.dot'));
    if (!track || !carousel) return;

    const realCount = 4;
    let index = 0;
    let timer = null;
    const AUTOPLAY_MS = 4500;
    const TRANSITION_MS = 700;

    track.style.transition = `transform ${TRANSITION_MS}ms cubic-bezier(0.65,0,0.35,1)`;

    function render(withTransition) {
      track.style.transition = withTransition
        ? `transform ${TRANSITION_MS}ms cubic-bezier(0.65,0,0.35,1)`
        : 'none';
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === (index % realCount)));
    }

    function next() {
      index = (index + 1) % realCount;
      render(true);
    }

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        index = parseInt(dot.dataset.i, 10);
        render(true);
        restart();
      });
    });

    function start() { timer = setInterval(next, AUTOPLAY_MS); }
    function stop() { clearInterval(timer); }
    function restart() { stop(); start(); }

    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);

    render(false);
    start();
  })();
});
