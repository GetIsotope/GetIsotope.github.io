const router = {
  currentPage: 'home',

  navigateTo(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

    const targetPage = document.getElementById('page-' + pageId);
    if (targetPage) {
      targetPage.classList.add('active');
    }

    const targetLink = document.querySelector('[data-page="' + pageId + '"]');
    if (targetLink) {
      targetLink.classList.add('active');
    }

    this.currentPage = pageId;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (pageId === 'docs') {
      setTimeout(() => docObserver.observe(), 100);
    }

    closeMobileNav();
    closeSearch();
  }
};

function closeMobileNav() {
  document.querySelector('.nav-links').classList.remove('mobile-open');
}

function closeSearch() {
  document.querySelector('.search-results').classList.remove('open');
  document.querySelector('.search-bar input').value = '';
}

const docObserver = {
  observer: null,

  observe() {
    if (this.observer) this.observer.disconnect();

    const sections = document.querySelectorAll('.doc-section');

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');

          const id = entry.target.getAttribute('id');
          document.querySelectorAll('.sidebar-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === id) {
              link.classList.add('active');
            }
          });
        }
      });
    }, { threshold: 0.1, rootMargin: '-60px 0px -40% 0px' });

    sections.forEach(section => this.observer.observe(section));
  }
};

const searchData = [
  { title: 'Getting Started', type: 'Docs', page: 'docs', section: 'getting-started' },
  { title: 'Installation', type: 'Docs', page: 'docs', section: 'installation' },
  { title: 'Theming', type: 'Docs', page: 'docs', section: 'theming' },
  { title: 'Window', type: 'Docs', page: 'docs', section: 'window' },
  { title: 'Button', type: 'Docs', page: 'docs', section: 'button' },
  { title: 'Toggle', type: 'Docs', page: 'docs', section: 'toggle' },
  { title: 'Slider', type: 'Docs', page: 'docs', section: 'slider' },
  { title: 'Dropdown', type: 'Docs', page: 'docs', section: 'dropdown' },
  { title: 'TextBox', type: 'Docs', page: 'docs', section: 'textbox' },
  { title: 'Bind', type: 'Docs', page: 'docs', section: 'bind' },
  { title: 'Colorpicker', type: 'Docs', page: 'docs', section: 'colorpicker' },
  { title: 'Label', type: 'Docs', page: 'docs', section: 'label' },
  { title: 'Paragraph', type: 'Docs', page: 'docs', section: 'paragraph' },
  { title: 'Section', type: 'Docs', page: 'docs', section: 'section' },
  { title: 'Notify', type: 'Docs', page: 'docs', section: 'notify' },
  { title: 'Topbar', type: 'Docs', page: 'docs', section: 'topbar' },
  { title: 'Radial Menu', type: 'Docs', page: 'docs', section: 'radial' },
  { title: 'Keybind List', type: 'Docs', page: 'docs', section: 'keybindlist' },
  { title: 'Flags & Config', type: 'Docs', page: 'docs', section: 'flags' },
  { title: 'Startup Animations', type: 'Docs', page: 'docs', section: 'startup' },
  { title: 'Destroy', type: 'Docs', page: 'docs', section: 'destroy' },
  { title: 'Heavenly UI Library', type: 'Project', page: 'portfolio' },
  { title: 'Heavenly Toolkit', type: 'Project', page: 'portfolio' },
  { title: 'Blox Fruits Script', type: 'Project', page: 'portfolio' },
  { title: 'Arsenal Script', type: 'Project', page: 'portfolio' },
  { title: 'Universal Script Hub', type: 'Project', page: 'portfolio' },
  { title: 'Pet Simulator 99', type: 'Project', page: 'portfolio' },
];

function handleSearch(query) {
  const resultsContainer = document.querySelector('.search-results');

  if (!query || query.trim().length < 1) {
    resultsContainer.classList.remove('open');
    return;
  }

  const filtered = searchData.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.type.toLowerCase().includes(query.toLowerCase())
  );

  if (filtered.length === 0) {
    resultsContainer.innerHTML = '<div class="search-empty">No results found</div>';
  } else {
    resultsContainer.innerHTML = filtered.map(item => `
      <div class="search-result-item" onclick="handleSearchSelect('${item.page}', '${item.section || ''}')">
        <span class="search-result-title">${item.title}</span>
        <span class="search-result-type">${item.type}</span>
      </div>
    `).join('');
  }

  resultsContainer.classList.add('open');
}

function handleSearchSelect(page, section) {
  router.navigateTo(page);
  closeSearch();

  if (section) {
    setTimeout(() => {
      const target = document.getElementById(section);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 350);
  }
}

function scrollToSection(sectionId) {
  const target = document.getElementById(sectionId);
  if (target) {
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

function copyCode(btn) {
  const pre = btn.closest('.code-block').querySelector('pre');
  navigator.clipboard.writeText(pre.textContent).then(() => {
    const original = btn.textContent;
    btn.textContent = 'Copied';
    setTimeout(() => btn.textContent = original, 1500);
  });
}

function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') !== 'light';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  const btn = document.querySelector('.theme-toggle');
  btn.textContent = isDark ? '☾' : '☀';
}

function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.mobile-sidebar-overlay');
  sidebar.classList.toggle('open');
  overlay.classList.toggle('open');
}

function closeSidebar() {
  document.querySelector('.sidebar').classList.remove('open');
  document.querySelector('.mobile-sidebar-overlay').classList.remove('open');
}

function setupProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const tags = card.getAttribute('data-tags') || '';
        if (filter === 'all' || tags.includes(filter)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

function init() {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      router.navigateTo(link.getAttribute('data-page'));
    });
  });

  document.querySelectorAll('[data-goto]').forEach(el => {
    el.addEventListener('click', () => {
      router.navigateTo(el.getAttribute('data-goto'));
    });
  });

  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', () => {
      const section = link.getAttribute('data-section');
      closeSidebar();
      setTimeout(() => scrollToSection(section), 100);
    });
  });

  const searchInput = document.querySelector('.search-bar input');
  searchInput.addEventListener('input', (e) => handleSearch(e.target.value));
  searchInput.addEventListener('focus', (e) => {
    if (e.target.value) handleSearch(e.target.value);
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-wrapper')) {
      closeSearch();
    }
    if (!e.target.closest('.nav-links') && !e.target.closest('.hamburger')) {
      closeMobileNav();
    }
  });

  document.querySelector('.hamburger').addEventListener('click', () => {
    if (router.currentPage === 'docs') {
      toggleSidebar();
    } else {
      document.querySelector('.nav-links').classList.toggle('mobile-open');
    }
  });

  document.querySelector('.mobile-sidebar-overlay').addEventListener('click', closeSidebar);

  document.querySelector('.theme-toggle').addEventListener('click', toggleTheme);

  setupProjectFilter();

  router.navigateTo('home');
}

document.addEventListener('DOMContentLoaded', init);
