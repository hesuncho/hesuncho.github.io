(function () {
  "use strict";

  const TYPING_SPEED = 120;
  const THEME_KEY = "portfolio-theme";
  const HERO_LANG_KEY = "portfolio-hero-lang";

  const HERO_I18N = {
    ko: {
      greeting: "안녕하세요, 저는",
      name: "조혜선입니다.",
      subtitle1: "단국대학교 교육대학원 교수",
      subtitle2: "음운론·음성학·AI활용 언어학 및 영어교육 연구",
      desc:
        "MIT에서 언어학 박사(음운론·음성학)를 취득했으며, 영어교육과 언어학 연구, AI의 언어 능력 연구 및 AI 활용 영어교육에 대한 연구를 하고 있습니다.",
    },
    en: {
      greeting: "Hello, I am",
      name: "Hyesun Cho.",
      subtitle1: "Professor, Dankook University, Graduate School of Education",
      subtitle2: "Phonology, phonetics, AI-assisted linguistics research & English education",
      desc:
        "I earned my Ph.D. in Linguistics (phonology and phonetics) from MIT. My research focuses on English education, linguistics, AI language capabilities, and AI-enhanced English teaching.",
    },
  };

  const header = document.querySelector(".site-header");
  const navLogo = document.querySelector(".nav__logo");
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav__link");
  const isHomePage = Boolean(document.querySelector(".hero"));
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = themeToggle?.querySelector(".theme-toggle__icon");
  const typedName = document.getElementById("typedName");
  const heroGreeting = document.getElementById("heroGreeting");
  const heroSubtitle1 = document.getElementById("heroSubtitle1");
  const heroSubtitle2 = document.getElementById("heroSubtitle2");
  const heroDesc = document.getElementById("heroDesc");
  const heroLangBtns = document.querySelectorAll(".hero__lang-btn");
  const heroContent = document.getElementById("heroContent");
  const backToTop = document.getElementById("backToTop");
  const yearEl = document.getElementById("year");
  const contactForm = document.getElementById("contactForm");
  const formSuccess = document.getElementById("formSuccess");
  const revealEls = document.querySelectorAll(".reveal");
  const skillBars = document.querySelectorAll(".skill-bar");
  const statNumbers = document.querySelectorAll(".hero__stats strong[data-count]");

  /* ----- Theme ----- */
  function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    if (themeIcon) themeIcon.textContent = theme === "dark" ? "☀️" : "🌙";
    themeToggle?.setAttribute("aria-label", theme === "dark" ? "라이트 모드 전환" : "다크 모드 전환");
  }

  applyTheme(getPreferredTheme());

  themeToggle?.addEventListener("click", () => {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  });

  /* ----- Hero language toggle ----- */
  let typingTimeout = null;

  function clearTyping() {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
      typingTimeout = null;
    }
  }

  function typeName(text, index = 0) {
    if (!typedName) return;
    if (index <= text.length) {
      typedName.textContent = text.slice(0, index);
      typingTimeout = setTimeout(() => typeName(text, index + 1), TYPING_SPEED);
    }
  }

  function setHeroLang(lang) {
    const copy = HERO_I18N[lang];
    if (!copy || !heroGreeting) return;

    clearTyping();
    heroGreeting.textContent = copy.greeting;
    if (heroSubtitle1) heroSubtitle1.textContent = copy.subtitle1;
    if (heroSubtitle2) heroSubtitle2.textContent = copy.subtitle2;
    if (heroDesc) heroDesc.textContent = copy.desc;
    typeName(copy.name);

    heroContent?.setAttribute("lang", lang);
    localStorage.setItem(HERO_LANG_KEY, lang);

    heroLangBtns.forEach((btn) => {
      const isActive = btn.getAttribute("data-lang") === lang;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-pressed", String(isActive));
    });
  }

  if (heroGreeting) {
    const savedLang = localStorage.getItem(HERO_LANG_KEY);
    const initialLang = savedLang === "en" || savedLang === "ko" ? savedLang : "ko";
    setHeroLang(initialLang);

    heroLangBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const lang = btn.getAttribute("data-lang");
        if (lang === "ko" || lang === "en") setHeroLang(lang);
      });
    });
  } else if (typedName) {
    typeName(HERO_I18N.ko.name);
  }

  /* ----- Mobile menu ----- */
  function closeMenu() {
    navMenu?.classList.remove("is-open");
    menuToggle?.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "메뉴 열기");
  }

  menuToggle?.addEventListener("click", () => {
    const isOpen = navMenu?.classList.toggle("is-open");
    menuToggle.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "메뉴 닫기" : "메뉴 열기");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  navLogo?.addEventListener("click", (e) => {
    if (!isHomePage) return;
    e.preventDefault();
    scrollToTop();
    closeMenu();
  });

  backToTop?.addEventListener("click", (e) => {
    e.preventDefault();
    scrollToTop();
  });

  /* ----- Scroll: header, back-to-top, active nav ----- */
  const sections = [...document.querySelectorAll("main section[id]")];

  function onScroll() {
    const scrollY = window.scrollY;
    header?.classList.toggle("is-scrolled", scrollY > 40);
    backToTop?.classList.toggle("is-visible", scrollY > 400);

    let current = "";
    sections.forEach((section) => {
      const top = section.offsetTop - 120;
      if (scrollY >= top) current = section.id;
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute("href")?.slice(1);
      link.classList.toggle("is-active", href === current);
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ----- Reveal on scroll ----- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  /* ----- Skill bars ----- */
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const bar = entry.target;
        const level = bar.getAttribute("data-level") || "0";
        bar.style.setProperty("--level", `${level}%`);
        bar.classList.add("is-animated");
        skillObserver.unobserve(bar);
      });
    },
    { threshold: 0.5 }
  );

  skillBars.forEach((bar) => skillObserver.observe(bar));

  /* ----- Counter animation ----- */
  function animateCount(el) {
    const target = Number(el.getAttribute("data-count")) || 0;
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        statsObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.6 }
  );

  statNumbers.forEach((el) => statsObserver.observe(el));

  /* ----- Contact form (demo validation) ----- */
  const fields = {
    name: {
      el: document.getElementById("name"),
      error: document.getElementById("nameError"),
      validate(value) {
        if (!value.trim()) return "이름을 입력해 주세요.";
        if (value.trim().length < 2) return "이름은 2자 이상이어야 합니다.";
        return "";
      },
    },
    email: {
      el: document.getElementById("email"),
      error: document.getElementById("emailError"),
      validate(value) {
        if (!value.trim()) return "이메일을 입력해 주세요.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "올바른 이메일 형식이 아닙니다.";
        return "";
      },
    },
    message: {
      el: document.getElementById("message"),
      error: document.getElementById("messageError"),
      validate(value) {
        if (!value.trim()) return "메시지를 입력해 주세요.";
        if (value.trim().length < 10) return "메시지는 10자 이상 작성해 주세요.";
        return "";
      },
    },
  };

  function setFieldError(key, message) {
    const { el, error } = fields[key];
    el?.classList.toggle("is-invalid", Boolean(message));
    if (error) error.textContent = message;
  }

  contactForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    formSuccess.hidden = true;

    let valid = true;
    Object.entries(fields).forEach(([key, { el, validate }]) => {
      const msg = validate(el?.value || "");
      setFieldError(key, msg);
      if (msg) valid = false;
    });

    if (!valid) return;

    contactForm.reset();
    formSuccess.hidden = false;
    Object.keys(fields).forEach((key) => setFieldError(key, ""));
  });

  Object.values(fields).forEach(({ el, error }) => {
    el?.addEventListener("input", () => {
      if (el.classList.contains("is-invalid")) {
        const key = el.id;
        const msg = fields[key]?.validate(el.value) || "";
        setFieldError(key, msg);
      }
      if (error?.textContent && !el.classList.contains("is-invalid")) {
        error.textContent = "";
      }
    });
  });

  /* ----- Footer year ----- */
  const year = String(new Date().getFullYear());
  if (yearEl) yearEl.textContent = year;
  const yearFooter = document.getElementById("yearFooter");
  if (yearFooter) yearFooter.textContent = year;
})();
