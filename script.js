// Theme Management
class ThemeManager {
  constructor() {
    this.init();
  }

  init() {
    this.loadSavedTheme();
    this.setupThemeToggle();
  }

  loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  setupThemeToggle() {
    const toggleButton = document.getElementById('theme-toggle');
    if (toggleButton) {
      toggleButton.addEventListener('click', () => this.toggleTheme());
    }
  }
}

// Navigation Manager
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
    const navLinks = document.querySelectorAll('.nav-link');
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
            if (link.getAttribute('href') === `#${sectionId}`) {
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
    }
  }

  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href').substring(1);
        this.scrollToSection(targetId);
      });
    });
  }

  setupMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
      mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });
    }
  }
}

// Countdown Timer
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
        <div class="time-value">${String(timeLeft.days).padStart(2, '0')}</div>
        <div class="time-label">Días</div>
      </div>
      <div class="time-unit">
        <div class="time-value">${String(timeLeft.hours).padStart(2, '0')}</div>
        <div class="time-label">Horas</div>
      </div>
      <div class="time-unit">
        <div class="time-value">${String(timeLeft.minutes).padStart(2, '0')}</div>
        <div class="time-label">Min</div>
      </div>
      <div class="time-unit">
        <div class="time-value">${String(timeLeft.seconds).padStart(2, '0')}</div>
        <div class="time-label">Seg</div>
      </div>
    `;
  }
}

// Search Functionality
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
    const selectors = [
      'h1, h2, h3, h4, h5, h6',
      'p',
      'li',
      '[data-searchable]',
      '.searchable'
    ];

    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        const text = element.textContent?.trim();
        if (text && text.length > 2) {
          const section = element.closest('section') || element.closest('[id]');
          const sectionTitle = section?.id ||
            section?.querySelector('h1, h2, h3')?.textContent ||
            'Contenido general';

          this.pageContent.push({
            element,
            text,
            sectionTitle,
            score: 0
          });
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
      .map(item => ({
        ...item,
        score: this.calculateScore(item.text, query)
      }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);

    this.renderResults();
  }

  renderResults() {
    const resultsContainer = document.getElementById('search-results');
    if (!resultsContainer) return;

    if (this.searchResults.length === 0) {
      resultsContainer.innerHTML = '<p class="text-sm text-muted-foreground px-2 py-4 text-center">No se encontraron resultados</p>';
      return;
    }

    resultsContainer.innerHTML = this.searchResults.map(result => `
      <button
        onclick="searchManager.goToResult('${result.element.id || ''}')"
        class="block text-sm text-left w-full px-3 py-2 rounded-md hover:bg-muted/70 text-gray-800 dark:text-gray-200 transition-colors"
      >
        <span class="font-medium text-blue-600 dark:text-blue-400">${result.sectionTitle}</span>
        <div class="truncate text-xs opacity-70 mt-1">${result.text}</div>
      </button>
    `).join('');
  }

  goToResult(elementId) {
    if (elementId) {
      navigationManager.scrollToSection(elementId);
    }
    this.toggleSearch(false);
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';
  }

  toggleSearch(show = null) {
    const searchBox = document.getElementById('search-box');
    if (!searchBox) return;

    const isVisible = !searchBox.classList.contains('hidden');

    if (show === null) {
      searchBox.classList.toggle('hidden');
    } else if (show && isVisible) {
      return;
    } else if (!show && !isVisible) {
      return;
    } else {
      searchBox.classList.toggle('hidden', !show);
    }

    if (searchBox.classList.contains('hidden') === false) {
      const searchInput = document.getElementById('search-input');
      if (searchInput) searchInput.focus();
    }
  }

  setupSearch() {
    const searchButton = document.getElementById('search-toggle');
    const searchInput = document.getElementById('search-input');

    if (searchButton) {
      searchButton.addEventListener('click', () => this.toggleSearch());
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.performSearch(e.target.value);
      });
    }

    // Close search on outside click
    document.addEventListener('click', (e) => {
      const searchContainer = document.querySelector('.search-container');
      if (searchContainer && !searchContainer.contains(e.target)) {
        this.toggleSearch(false);
      }
    });
  }
}

// Particles Effect
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

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'floating-particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 10 + 's';

      const colors = [
        'from-purple-400 to-blue-400',
        'from-blue-400 to-cyan-400',
        'from-cyan-400 to-purple-400'
      ];

      particle.innerHTML = `
        <div class="w-1 h-1 bg-gradient-to-r ${colors[i % 3]} rounded-full opacity-60"></div>
      `;

      this.container.appendChild(particle);
      this.particles.push(particle);
    }
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize managers
  const themeManager = new ThemeManager();
  const navigationManager = new NavigationManager();
  const searchManager = new SearchManager();
  const particlesManager = new ParticlesManager('particles');

  // Initialize countdown timer
  const countdownTimer = new CountdownTimer('2025-03-15T09:00:00', 'countdown');

  // Make managers globally accessible for onclick handlers
  window.themeManager = themeManager;
  window.navigationManager = navigationManager;
  window.searchManager = searchManager;

  // Setup theme toggle button
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => themeManager.toggleTheme());
  }

  // Setup search toggle
  const searchToggle = document.getElementById('search-toggle');
  if (searchToggle) {
    searchToggle.addEventListener('click', () => searchManager.toggleSearch());
  }

  // Setup mobile menu
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Setup navigation links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      navigationManager.scrollToSection(targetId);

      // Close mobile menu if open
      if (mobileMenu) {
        mobileMenu.classList.add('hidden');
      }
    });
  });
});

// Utility functions for global access
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
  if (mobileMenu) {
    mobileMenu.classList.toggle('hidden');
  }
}
