/* ═══════════════════════════════════════════════
   KRISTINE CASSANDRA — PORTFOLIO SCRIPT
   Interactions · Animations · UX enhancements
═══════════════════════════════════════════════ */

'use strict';

/* ═══ Utility ═══ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ══════════════════════════════════════════════
   NAVBAR
══════════════════════════════════════════════ */
(function initNavbar() {
    const navbar = $('#navbar');
    const hamburger = $('#hamburger');
    const navLinks = $('#navLinks');
    const links = $$('.nav-link');

    /* Scroll: add/remove .scrolled class */
    const onScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* Mobile hamburger toggle */
    hamburger.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        hamburger.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen);
    });

    /* Close menu on link click */
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            hamburger.classList.remove('open');
        });
    });

    /* Active link on scroll */
    const sections = $$('section[id]');
    const setActive = () => {
        const scrollY = window.scrollY + 80;
        let current = '';
        sections.forEach(sec => {
            if (sec.offsetTop <= scrollY) current = sec.id;
        });
        links.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });
    };
    window.addEventListener('scroll', setActive, { passive: true });
    setActive();
})();


/* ══════════════════════════════════════════════
   TYPEWRITER EFFECT
══════════════════════════════════════════════ */
(function initTypewriter() {
    const el = $('#typewriter');
    if (!el) return;

    const roles = [
        'Student',
        'Vibe Coder',
        'Problem Solver',
        'Web Developer',
        'App Developer',
    ];

    let roleIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let paused = false;

    const TYPING_SPEED = 80;
    const DELETING_SPEED = 45;
    const PAUSE_AFTER = 1800;
    const PAUSE_BETWEEN = 300;

    function type() {
        if (paused) return;
        const current = roles[roleIdx];

        if (!deleting) {
            el.textContent = current.slice(0, charIdx + 1);
            charIdx++;
            if (charIdx === current.length) {
                paused = true;
                setTimeout(() => { paused = false; deleting = true; schedule(DELETING_SPEED); }, PAUSE_AFTER);
                return;
            }
            schedule(TYPING_SPEED);
        } else {
            el.textContent = current.slice(0, charIdx - 1);
            charIdx--;
            if (charIdx === 0) {
                deleting = false;
                roleIdx = (roleIdx + 1) % roles.length;
                schedule(PAUSE_BETWEEN);
                return;
            }
            schedule(DELETING_SPEED);
        }
    }

    function schedule(ms) { setTimeout(type, ms); }
    schedule(800);
})();


/* ══════════════════════════════════════════════
   SCROLL REVEAL (IntersectionObserver)
══════════════════════════════════════════════ */
(function initReveal() {
    const classes = ['reveal', 'reveal-left', 'reveal-right', 'reveal-scale'];
    const els = $$(classes.map(c => `.${c}`).join(','));

    /* Add reveal classes to section children automatically */
    $$('.section').forEach(sec => {
        $$('.card-glass, .timeline-item, .project-card, .info-card, .skill-category', sec).forEach((el, i) => {
            if (!el.classList.contains('reveal')) {
                el.classList.add('reveal');
                if (i > 0) el.classList.add(`delay-${Math.min(i, 5)}`);
            }
        });
    });

    const allReveal = $$(classes.map(c => `.${c}`).join(','));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    allReveal.forEach(el => observer.observe(el));
})();


/* ══════════════════════════════════════════════
   SKILL BAR ANIMATION
══════════════════════════════════════════════ */
(function initSkillBars() {
    const fills = $$('.skill-fill');
    if (!fills.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    fills.forEach(fill => observer.observe(fill));
})();


/* ══════════════════════════════════════════════
   PROJECT FILTER
══════════════════════════════════════════════ */
(function initProjectFilter() {
    const btns = $$('.filter-btn');
    const cards = $$('.project-card');
    if (!btns.length) return;

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            cards.forEach(card => {
                const match = filter === 'all' || card.dataset.category === filter;
                card.classList.toggle('hidden', !match);
                card.style.display = match ? '' : 'none';
            });
        });
    });
})();


/* ══════════════════════════════════════════════
   CONTACT FORM  (EmailJS)
══════════════════════════════════════════════ */
(function initContactForm() {
    const form = $('#contactForm');
    if (!form) return;

    /* ── Initialise EmailJS ── */
    emailjs.init('ptf9Cvgp1DroqM5-W');

    const fields = {
        firstName: { el: $('#firstName'), err: $('#firstNameError'), label: 'First name' },
        lastName: { el: $('#lastName'), err: $('#lastNameError'), label: 'Last name' },
        email: { el: $('#email'), err: $('#emailError'), label: 'Email' },
        message: { el: $('#message'), err: $('#messageError'), label: 'Message' },
    };
    const success = $('#formSuccess');
    const btn = $('#sendMsgBtn');

    function validate(name, val) {
        if (!val.trim()) return `${fields[name].label} is required.`;
        if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
            return 'Please enter a valid email address.';
        if (name === 'message' && val.trim().length < 20)
            return 'Message must be at least 20 characters.';
        return '';
    }

    /* Real-time validation */
    Object.keys(fields).forEach(name => {
        const { el, err } = fields[name];
        el.addEventListener('blur', () => {
            const msg = validate(name, el.value);
            err.textContent = msg;
            el.classList.toggle('invalid', !!msg);
        });
        el.addEventListener('input', () => {
            if (el.classList.contains('invalid')) {
                const msg = validate(name, el.value);
                err.textContent = msg;
                el.classList.toggle('invalid', !!msg);
            }
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;

        Object.keys(fields).forEach(name => {
            const { el, err } = fields[name];
            const msg = validate(name, el.value);
            err.textContent = msg;
            el.classList.toggle('invalid', !!msg);
            if (msg) valid = false;
        });

        if (!valid) return;

        /* ── Send via EmailJS ── */
        btn.disabled = true;
        btn.querySelector('span').textContent = 'Sending…';

        emailjs.sendForm('service_88t2udl', 'template_telj3ya', form)
            .then(() => {
                form.reset();
                btn.disabled = false;
                btn.querySelector('span').textContent = 'Send Message';
                success.textContent = '✅ Message sent! I\'ll get back to you soon.';
                success.classList.add('visible');
                setTimeout(() => success.classList.remove('visible'), 5000);
            })
            .catch((error) => {
                btn.disabled = false;
                btn.querySelector('span').textContent = 'Send Message';
                success.textContent = '❌ Failed to send. Please try again or email directly.';
                success.style.color = '#f87171';
                success.classList.add('visible');
                setTimeout(() => {
                    success.classList.remove('visible');
                    success.style.color = '';
                }, 5000);
                console.error('EmailJS error:', error);
            });
    });
})();


/* ══════════════════════════════════════════════
   BACK TO TOP BUTTON
══════════════════════════════════════════════ */
(function initBackToTop() {
    const btn = $('#backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();


/* ══════════════════════════════════════════════
   ANIMATED STAT COUNTERS
══════════════════════════════════════════════ */
(function initCounters() {
    const statNums = $$('.stat-num');
    if (!statNums.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const raw = el.textContent.replace(/\D/g, '');
            const end = parseInt(raw, 10);
            const suffix = el.textContent.replace(/\d/g, '');
            let current = 0;
            const step = Math.ceil(end / 30);
            const timer = setInterval(() => {
                current += step;
                if (current >= end) {
                    el.textContent = end + suffix;
                    clearInterval(timer);
                } else {
                    el.textContent = current + suffix;
                }
            }, 40);
            observer.unobserve(el);
        });
    }, { threshold: 0.8 });

    statNums.forEach(el => observer.observe(el));
})();


/* ══════════════════════════════════════════════
   FLOATING CARDS PARALLAX ON MOUSE MOVE
══════════════════════════════════════════════ */
(function initParallax() {
    const hero = $('.hero');
    const cardTop = $('#cardTop');
    const cardBottom = $('#cardBottom');
    if (!hero || !cardTop) return;

    hero.addEventListener('mousemove', (e) => {
        const { left, top, width, height } = hero.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;
        cardTop.style.transform = `translate(${x * -18}px, ${y * -12}px)`;
        cardBottom.style.transform = `translate(${x * 15}px, ${y * 10}px)`;
    });
    hero.addEventListener('mouseleave', () => {
        cardTop.style.transform = '';
        cardBottom.style.transform = '';
    });
})();


/* ══════════════════════════════════════════════
   SMOOTH HOVER ON TIMELINE
══════════════════════════════════════════════ */
(function initTimelineHover() {
    $$('.timeline-item').forEach(item => {
        const dot = item.querySelector('.timeline-dot');
        item.addEventListener('mouseenter', () => {
            if (dot) dot.style.transform = 'scale(1.4)';
        });
        item.addEventListener('mouseleave', () => {
            if (dot) dot.style.transform = '';
        });
    });
})();


/* ══════════════════════════════════════════════
   PROFILE IMAGE LOAD FALLBACK
══════════════════════════════════════════════ */
(function initImageFallback() {
    $$('img.profile-photo, img.about-img').forEach(img => {
        img.addEventListener('error', () => {
            /* Generate SVG placeholder with initials */
            img.style.display = 'none';
            const div = document.createElement('div');
            div.style.cssText = `
        width:100%; height:100%; border-radius:inherit;
        background: linear-gradient(135deg,#6366f1,#8b5cf6);
        display:flex; align-items:center; justify-content:center;
        font-family:'Space Grotesk',sans-serif;
        font-size:clamp(2rem,8vw,5rem); font-weight:700; color:#fff;
      `;
            div.textContent = 'KC';
            img.parentNode.insertBefore(div, img);
        });
    });
})();

console.log('%c✨ Portfolio loaded — Kristine Cassandra', 'color:#6366f1;font-weight:bold;font-size:14px;');
