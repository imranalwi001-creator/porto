/**
 * ENHANCED FEATURES - Professional UI/UX
 * Dark Mode, Animations, Toast Notifications, Accessibility
 */

'use strict';

/**
 * ============================================
 * 1. DARK MODE / THEME TOGGLE
 * ============================================
 */

class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem('theme') || 'dark-mode';
    this.toggleBtn = null;
    this.init();
  }

  init() {
    this.applyTheme(this.currentTheme);
    this.createToggleButton();
    this.addToggleListener();
  }

  createToggleButton() {
    if (document.querySelector('.theme-toggle-btn')) return;
    
    const btn = document.createElement('button');
    btn.className = 'theme-toggle-btn';
    btn.setAttribute('aria-label', 'Toggle dark/light mode');
    btn.setAttribute('title', 'Toggle Theme');
    btn.innerHTML = this.currentTheme === 'dark-mode' ? '☀️' : '🌙';
    document.body.appendChild(btn);
    this.toggleBtn = btn;
  }

  addToggleListener() {
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => this.toggleTheme());
    }
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'dark-mode' ? 'light-mode' : 'dark-mode';
    this.applyTheme(newTheme);
  }

  applyTheme(theme) {
    this.currentTheme = theme;
    document.body.classList.remove('dark-mode', 'light-mode');
    document.body.classList.add(theme);
    localStorage.setItem('theme', theme);
    
    if (this.toggleBtn) {
      this.toggleBtn.innerHTML = theme === 'dark-mode' ? '☀️' : '🌙';
    }
    
    this.showToast(`Theme changed to ${theme.replace('-', ' ')}`, 'info');
  }

  showToast(message, type) {
    const toast = new Toast(message, type);
    toast.show();
  }
}

/**
 * ============================================
 * 2. TOAST NOTIFICATIONS SYSTEM
 * ============================================
 */

class Toast {
  constructor(message, type = 'info') {
    this.message = message;
    this.type = type; // 'success', 'error', 'warning', 'info'
    this.duration = 3000;
    this.container = null;
  }

  show() {
    this.getContainer();
    const toast = this.create();
    this.container.appendChild(toast);
    
    setTimeout(() => this.hide(toast), this.duration);
  }

  getContainer() {
    if (!this.container) {
      this.container = document.querySelector('.toast-container');
      if (!this.container) {
        this.container = document.createElement('div');
        this.container.className = 'toast-container';
        document.body.appendChild(this.container);
      }
    }
  }

  create() {
    const toast = document.createElement('div');
    toast.className = `toast ${this.type}`;
    
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };

    toast.innerHTML = `
      <span class="toast-icon">${icons[this.type] || 'ℹ'}</span>
      <span class="toast-message">${this.message}</span>
      <button class="toast-close" aria-label="Close notification">×</button>
    `;

    toast.querySelector('.toast-close').addEventListener('click', () => this.hide(toast));
    
    return toast;
  }

  hide(toast) {
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 300);
  }
}

/**
 * ============================================
 * 3. SCROLL ANIMATIONS
 * ============================================
 */

class ScrollAnimationManager {
  constructor() {
    this.animatedElements = [];
    this.observer = null;
    this.init();
  }

  init() {
    this.markAnimatableElements();
    this.createObserver();
    this.observeElements();
  }

  markAnimatableElements() {
    // Add animation classes to existing elements
    document.querySelectorAll('.sidebar, article, .content-card').forEach((el, i) => {
      if (!el.classList.contains('scroll-fade-in')) {
        el.classList.add('scroll-fade-in');
      }
    });

    document.querySelectorAll('.project-item, .blog-post-item').forEach((el, i) => {
      const animClass = i % 2 === 0 ? 'scroll-slide-in-left' : 'scroll-slide-in-right';
      if (!el.classList.contains(animClass)) {
        el.classList.add(animClass);
      }
    });
  }

  createObserver() {
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          this.observer.unobserve(entry.target);
        }
      });
    }, options);
  }

  observeElements() {
    document.querySelectorAll('.scroll-fade-in, .scroll-slide-in-left, .scroll-slide-in-right').forEach(el => {
      this.observer.observe(el);
    });
  }
}

/**
 * ============================================
 * 4. IMAGE LAZY LOADING ENHANCEMENT
 * ============================================
 */

class ImageLazyLoader {
  constructor() {
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.setupIntersectionObserver();
    } else {
      this.loadAllImages();
    }
  }

  setupIntersectionObserver() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          this.loadImage(img);
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px'
    });

    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  loadImage(img) {
    img.addEventListener('load', () => {
      img.classList.add('loaded');
    });
    
    img.addEventListener('error', () => {
      img.classList.add('loaded');
    });

    if (img.dataset.src) {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    }
  }

  loadAllImages() {
    document.querySelectorAll('img[data-src]').forEach(img => {
      this.loadImage(img);
    });
  }
}

/**
 * ============================================
 * 5. ENHANCED FORM VALIDATION & FEEDBACK
 * ============================================
 */

class FormEnhancer {
  constructor() {
    this.form = document.querySelector('[data-form]');
    if (this.form) {
      this.init();
    }
  }

  init() {
    this.addValidationListeners();
    this.enhanceFormElements();
  }

  addValidationListeners() {
    const inputs = this.form.querySelectorAll('[data-form-input]');
    
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
          this.validateField(input);
        }
      });
    });

    this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
  }

  validateField(input) {
    const errorEl = input.nextElementSibling;
    let isValid = true;
    let errorMsg = '';

    // Check if field is empty
    if (!input.value.trim()) {
      isValid = false;
      errorMsg = 'This field is required';
    }

    // Email validation
    if (input.type === 'email' && input.value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value)) {
        isValid = false;
        errorMsg = 'Please enter a valid email address';
      }
    }

    if (isValid) {
      input.classList.remove('error');
      if (errorEl && errorEl.classList.contains('form-error-message')) {
        errorEl.classList.remove('show');
      }
    } else {
      input.classList.add('error');
      if (errorEl && errorEl.classList.contains('form-error-message')) {
        errorEl.textContent = errorMsg;
        errorEl.classList.add('show');
      }
    }

    return isValid;
  }

  handleFormSubmit(e) {
    e.preventDefault();

    const inputs = this.form.querySelectorAll('[data-form-input]');
    let formIsValid = true;

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        formIsValid = false;
      }
    });

    if (formIsValid) {
      this.submitForm();
    } else {
      new Toast('Please fix the errors in the form', 'error').show();
    }
  }

  submitForm() {
    const formData = new FormData(this.form);
    const message = [
      `Halo, saya ${formData.get("fullname")}.`,
      `Email: ${formData.get("email")}`,
      "",
      formData.get("message")
    ].join("\n");
    const whatsappUrl = `https://wa.me/6281355904897?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    new Toast('Message sent successfully! 🎉', 'success').show();
    this.form.reset();
  }

  enhanceFormElements() {
    const inputs = this.form.querySelectorAll('[data-form-input]');
    
    inputs.forEach(input => {
      // Create error message element if it doesn't exist
      if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('form-error-message')) {
        const errorEl = document.createElement('div');
        errorEl.className = 'form-error-message';
        input.parentNode.insertBefore(errorEl, input.nextSibling);
      }

      // Add aria attributes
      input.setAttribute('aria-required', 'true');
    });
  }
}

/**
 * ============================================
 * 6. ENHANCED SEARCH & FILTER
 * ============================================
 */

class SearchFilter {
  constructor() {
    this.filterItems = document.querySelectorAll('[data-filter-item]');
    this.init();
  }

  init() {
    if (document.querySelector('.filter-select-box')) {
      this.setupSearchBox();
    }
  }

  setupSearchBox() {
    const filterBox = document.querySelector('.filter-select-box');
    
    const searchBox = document.createElement('div');
    searchBox.className = 'search-box';
    searchBox.innerHTML = `
      <svg class="search-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
      </svg>
      <input type="text" class="search-input" placeholder="Search projects..." aria-label="Search projects">
    `;

    filterBox.parentNode.insertBefore(searchBox, filterBox);

    const input = searchBox.querySelector('.search-input');
    input.addEventListener('input', (e) => this.handleSearch(e.target.value));
  }

  handleSearch(query) {
    const term = query.toLowerCase().trim();
    let hasResults = false;

    this.filterItems.forEach(item => {
      const title = item.querySelector('.project-title, .blog-item-title');
      const category = item.querySelector('.project-category, .blog-category');
      
      if (!title) return;

      const titleText = title.textContent.toLowerCase();
      const categoryText = category ? category.textContent.toLowerCase() : '';

      if (titleText.includes(term) || categoryText.includes(term) || !term) {
        item.classList.add('active');
        hasResults = true;
      } else {
        item.classList.remove('active');
      }
    });

    if (!hasResults && term) {
      this.showNoResults();
    }
  }

  showNoResults() {
    const existing = document.querySelector('.no-results');
    if (!existing) {
      const noResults = document.createElement('div');
      noResults.className = 'no-results';
      noResults.textContent = 'No projects found matching your search';
      document.querySelector('[data-page="portfolio"]').appendChild(noResults);
    }
  }
}

/**
 * ============================================
 * 7. ACCESSIBILITY ENHANCEMENTS
 * ============================================
 */

class AccessibilityEnhancer {
  constructor() {
    this.init();
  }

  init() {
    this.addSkipLink();
    this.enhanceKeyboardNavigation();
    this.addAriaLabels();
  }

  addSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  enhanceKeyboardNavigation() {
    // Improve keyboard navigation for buttons and links
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const modal = document.querySelector('[data-modal-container].active');
        if (modal) {
          const closeBtn = modal.querySelector('[data-modal-close-btn]');
          if (closeBtn) closeBtn.click();
        }
      }
    });
  }

  addAriaLabels() {
    // Add aria-labels to interactive elements
    const buttons = document.querySelectorAll('button:not([aria-label])');
    buttons.forEach(btn => {
      if (!btn.textContent.trim()) {
        btn.setAttribute('aria-label', 'Button');
      }
    });

    // Add aria-current for active navigation
    const navLinks = document.querySelectorAll('[data-nav-link]');
    navLinks.forEach(link => {
      if (link.classList.contains('active')) {
        link.setAttribute('aria-current', 'page');
      }
    });
  }
}

/**
 * ============================================
 * 8. PERFORMANCE MONITORING
 * ============================================
 */

class PerformanceMonitor {
  constructor() {
    this.init();
  }

  init() {
    if (window.performance && window.performance.timing) {
      window.addEventListener('load', () => {
        this.logPerformanceMetrics();
      });
    }
  }

  logPerformanceMetrics() {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    const connectTime = perfData.responseEnd - perfData.requestStart;
    const renderTime = perfData.domComplete - perfData.domLoading;

    console.log('📊 Performance Metrics:');
    console.log(`Total Load Time: ${pageLoadTime}ms`);
    console.log(`Connection Time: ${connectTime}ms`);
    console.log(`DOM Render Time: ${renderTime}ms`);
  }
}

/**
 * ============================================
 * 9. SMOOTH SCROLL TO SECTIONS
 * ============================================
 */

class SmoothScrollManager {
  constructor() {
    this.init();
  }

  init() {
    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href !== '#') {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });
  }
}

/**
 * ============================================
 * 10. INITIALIZATION & INTEGRATION
 * ============================================
 */

class UIUXManager {
  constructor() {
    this.modules = [];
    this.init();
  }

  init() {
    // Initialize all modules
    this.modules = [
      new ThemeManager(),
      new ScrollAnimationManager(),
      new ImageLazyLoader(),
      new FormEnhancer(),
      new SearchFilter(),
      new AccessibilityEnhancer(),
      new PerformanceMonitor(),
      new SmoothScrollManager()
    ];

    this.setupMutationObserver();
    console.log('✨ Enhanced UI/UX Features Loaded');
  }

  setupMutationObserver() {
    // Re-observe new elements added dynamically
    const observer = new MutationObserver(() => {
      const scrollAnimManager = this.modules.find(m => m instanceof ScrollAnimationManager);
      if (scrollAnimManager) {
        scrollAnimManager.observeElements();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new UIUXManager();
  });
} else {
  new UIUXManager();
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { UIUXManager, ThemeManager, Toast, ScrollAnimationManager };
}
