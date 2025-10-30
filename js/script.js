// ===============================
// 🌗 THEME MANAGER
// ===============================
class ThemeManager {
  constructor() {
    this.STORAGE_KEY = 'eduhack-theme';
    this.LIGHT_CLASS = 'light';
    this.DARK_CLASS = 'dark';
    this.init();
  }

  init() {
    // Forzar modo oscuro siempre
    this.setTheme('dark');
    this.setupThemeToggle();
  }

  loadSavedTheme() {
    // Siempre cargar modo oscuro
    this.setTheme('dark');
  }

  setTheme(theme) {
    // Forzar siempre modo oscuro
    theme = 'dark';
    
    const html = document.documentElement;
    
    html.classList.add('theme-transition');
    setTimeout(() => html.classList.remove('theme-transition'), 400);
    
    html.classList.remove(this.LIGHT_CLASS, this.DARK_CLASS);
    html.classList.add(this.DARK_CLASS);
    
    localStorage.setItem(this.STORAGE_KEY, theme);
    
    this.updateThemeAttribute(theme);
    this.updateToggleButton();
    this.dispatchThemeChangeEvent(theme);
  }

  toggleTheme() {
    // No hacer nada, mantener oscuro
    this.setTheme('dark');
  }

  getCurrentTheme() {
    return 'dark';
  }

  updateThemeAttribute(theme) {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.style.colorScheme = 'dark';
  }

  updateToggleButton() {
    const toggleButton = document.getElementById('theme-toggle');
    if (!toggleButton) return;

    const sunIcon = toggleButton.querySelector('#sun-icon');
    const moonIcon = toggleButton.querySelector('#moon-icon');

    if (sunIcon && moonIcon) {
      sunIcon.classList.remove('hidden');
      moonIcon.classList.add('hidden');
    }
  }

  setupThemeToggle() {
    const toggleButton = document.getElementById('theme-toggle');
    if (toggleButton) {
      toggleButton.addEventListener('click', () => this.toggleTheme());
      this.updateToggleButton();
    }
  }

  watchSystemPreference() {
    // No hacer nada, mantener oscuro
  }

  dispatchThemeChangeEvent(theme) {
    const event = new CustomEvent('themeChange', {
      detail: { theme },
      bubbles: true
    });
    document.dispatchEvent(event);
  }
}

// ===============================
// 🧭 NAVIGATION MANAGER
// ===============================
class NavigationManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupScrollSpy();
    this.setupSmoothScroll();
    this.setupMobileMenu();
  }

  setupScrollSpy() {
    // Corregido: Seleccionar enlaces del navbar con href que empiecen con #
    const navLinks = document.querySelectorAll('#navbar a[href^="#"]');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset;

      sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            // Corregido: Usar href en lugar de onclick
            const linkHref = link.getAttribute('href');
            if (linkHref && linkHref === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    });
  }

  scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
      const navOffset = window.innerWidth < 768 ? 80 : 100;
      const elementTop = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementTop - navOffset,
        behavior: 'smooth'
      });
      
      // Cerrar menú móvil después de navegar
      const mobileMenu = document.getElementById('mobile-menu');
      const menuIcon = document.getElementById('menu-icon');
      const closeIcon = document.getElementById('close-icon');
      if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        if (menuIcon) menuIcon.classList.remove('hidden');
        if (closeIcon) closeIcon.classList.add('hidden');
      }
    }
  }

  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href').substring(1);
        if (targetId) this.scrollToSection(targetId);
      });
    });
  }

  setupMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');

    if (mobileMenuButton && mobileMenu) {
      mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        if (menuIcon) menuIcon.classList.toggle('hidden');
        if (closeIcon) closeIcon.classList.toggle('hidden');
      });
    }

    // Cerrar menú al hacer click en un link
    const mobileLinks = mobileMenu?.querySelectorAll('a');
    if (mobileLinks) {
      mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
          mobileMenu.classList.add('hidden');
          if (menuIcon) menuIcon.classList.remove('hidden');
          if (closeIcon) closeIcon.classList.add('hidden');
        });
      });
    }
  }
}

// ===============================
// ⏳ COUNTDOWN TIMER
// ===============================
class CountdownTimer {
  constructor(targetDate, elementId) {
    this.targetDate = new Date(targetDate).getTime();
    this.element = document.getElementById(elementId);
    this.interval = null;
    this.init();
  }

  init() {
    this.update();
    this.interval = setInterval(() => this.update(), 1000);
  }

  update() {
    const now = new Date().getTime();
    const difference = this.targetDate - now;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      this.render({ days, hours, minutes, seconds });
    } else {
      this.render({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      clearInterval(this.interval);
    }
  }

  render(timeLeft) {
    if (!this.element) return;
    this.element.innerHTML = `
      <div class="time-unit">
        <div class="time-value text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">${String(timeLeft.days).padStart(2, '0')}</div>
        <div class="time-label text-xs sm:text-sm text-gray-600 dark:text-gray-400">Días</div>
      </div>
      <div class="time-unit">
        <div class="time-value text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">${String(timeLeft.hours).padStart(2, '0')}</div>
        <div class="time-label text-xs sm:text-sm text-gray-600 dark:text-gray-400">Horas</div>
      </div>
      <div class="time-unit">
        <div class="time-value text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">${String(timeLeft.minutes).padStart(2, '0')}</div>
        <div class="time-label text-xs sm:text-sm text-gray-600 dark:text-gray-400">Min</div>
      </div>
      <div class="time-unit">
        <div class="time-value text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">${String(timeLeft.seconds).padStart(2, '0')}</div>
        <div class="time-label text-xs sm:text-sm text-gray-600 dark:text-gray-400">Seg</div>
      </div>
    `;
  }
}

// ===============================
// 🔍 SEARCH MANAGER
// ===============================
class SearchManager {
  constructor() {
    this.pageContent = [];
    this.searchResults = [];
    this.init();
  }

  init() {
    this.indexPageContent();
    this.setupSearch();
  }

  indexPageContent() {
    const selectors = ['h1, h2, h3, h4, h5, h6', 'p', 'li', '[data-searchable]', '.searchable'];

    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        const text = element.textContent?.trim();
        if (text && text.length > 2) {
          const section = element.closest('section') || element.closest('[id]');
          const sectionTitle = section?.id || section?.querySelector('h1, h2, h3')?.textContent || 'Contenido general';
          const sectionId = section?.id || '';
          this.pageContent.push({ element, text, sectionTitle, sectionId, score: 0 });
        }
      });
    });
  }

  calculateScore(text, query) {
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    let score = 0;
    if (lowerText.includes(lowerQuery)) score += 100;
    if (lowerText.startsWith(lowerQuery)) score += 50;
    return score;
  }

  performSearch(query) {
    if (!query.trim() || query.length < 2) {
      this.searchResults = [];
      this.renderResults();
      return;
    }

    this.searchResults = this.pageContent
      .map(item => ({ ...item, score: this.calculateScore(item.text, query) }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);

    this.renderResults();
  }

  renderResults() {
    const resultsContainer = document.getElementById('search-results');
    if (!resultsContainer) return;

    if (this.searchResults.length === 0) {
      resultsContainer.innerHTML = '<p class="text-sm text-gray-500 dark:text-gray-400 px-2 py-4 text-center">No se encontraron resultados</p>';
      return;
    }

    resultsContainer.innerHTML = this.searchResults.map(result => `
      <button onclick="searchManager.goToResult('${result.sectionId || ''}')" 
        class="block text-sm text-left w-full px-3 py-2 rounded-md hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-colors text-gray-800 dark:text-gray-200">
        <span class="font-medium text-blue-600 dark:text-blue-400">${result.sectionTitle}</span>
        <div class="truncate text-xs opacity-70 mt-1">${result.text.substring(0, 100)}...</div>
      </button>
    `).join('');
  }

  goToResult(elementId) {
    if (elementId && window.navigationManager) {
      window.navigationManager.scrollToSection(elementId);
    }
    this.toggleSearch(false);
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';
  }

  toggleSearch(show = null) {
    const searchBox = document.getElementById('search-box');
    if (!searchBox) return;
    const isVisible = !searchBox.classList.contains('hidden');
    if (show === null) searchBox.classList.toggle('hidden');
    else if (show !== isVisible) searchBox.classList.toggle('hidden', !show);
    if (!searchBox.classList.contains('hidden')) document.getElementById('search-input')?.focus();
  }

  setupSearch() {
    const searchButton = document.getElementById('search-toggle');
    const searchInput = document.getElementById('search-input');

    if (searchButton) searchButton.addEventListener('click', () => this.toggleSearch());
    if (searchInput) searchInput.addEventListener('input', (e) => this.performSearch(e.target.value));

    document.addEventListener('click', (e) => {
      const searchContainer = document.querySelector('.search-container');
      if (searchContainer && !searchContainer.contains(e.target)) this.toggleSearch(false);
    });
  }
}

// ===============================
// ✨ PARTICLES MANAGER
// ===============================
class ParticlesManager {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.particles = [];
    this.init();
  }

  init() {
    if (!this.container) return;
    this.createParticles();
  }

  createParticles() {
    const particleCount = 20;
    const colors = ['from-purple-400 to-blue-400', 'from-blue-400 to-cyan-400', 'from-cyan-400 to-purple-400'];
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'floating-particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 10 + 's';
      particle.innerHTML = `<div class="w-1 h-1 bg-gradient-to-r ${colors[i % 3]} rounded-full opacity-60"></div>`;
      this.container.appendChild(particle);
      this.particles.push(particle);
    }
  }
}

// ===============================
// 🚀 INITIALIZATION
// ===============================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all managers
  const themeManager = new ThemeManager();
  const navigationManager = new NavigationManager();
  const searchManager = new SearchManager();
  const countdownTimer = new CountdownTimer('2025-11-01T09:00:00', 'countdown');

  // Make managers globally accessible
  window.themeManager = themeManager;
  window.navigationManager = navigationManager;
  window.searchManager = searchManager;
});

// ===============================
// 🌐 GLOBAL UTILITY FUNCTIONS
// ===============================
function toggleTheme() {
  if (window.themeManager) {
    window.themeManager.toggleTheme();
  }
}

function scrollToSection(sectionId) {
  if (window.navigationManager) {
    window.navigationManager.scrollToSection(sectionId);
  }
}

function toggleSearch() {
  if (window.searchManager) {
    window.searchManager.toggleSearch();
  }
}

function toggleMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');
  const closeIcon = document.getElementById('close-icon');
  
  if (mobileMenu) {
    mobileMenu.classList.toggle('hidden');
    if (menuIcon) menuIcon.classList.toggle('hidden');
    if (closeIcon) closeIcon.classList.toggle('hidden');
  }
}
