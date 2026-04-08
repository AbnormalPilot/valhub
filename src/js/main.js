export function initApp() {
  injectLayout();
  initTheme();
  initMenu();
}

function injectLayout() {
  const currentPath = window.location.pathname;
  const isActive = (path) => {
    if (path === '/' && (currentPath === '/' || currentPath.endsWith('index.html'))) return 'active';
    if (path !== '/' && currentPath.includes(path)) return 'active';
    return '';
  };

  const navHtml = `
    <nav class="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-10 h-[70px] bg-[#0f1923]/95 backdrop-blur-[12px] border-b border-white/10 max-md:px-5">
      <a href="/" class="font-teko text-[2rem] font-bold tracking-[2px] cursor-pointer">
        <span class="text-[#ff4655]">VAL</span><span class="text-[#ece8e1]">HUB</span>
      </a>

      <button id="mobile-menu-btn" class="hidden max-md:flex flex-col gap-1.5 cursor-pointer bg-transparent border-none p-1.5">
        <span class="w-6 h-0.5 bg-[#ece8e1] transition-all duration-300"></span>
        <span class="w-6 h-0.5 bg-[#ece8e1] transition-all duration-300"></span>
        <span class="w-6 h-0.5 bg-[#ece8e1] transition-all duration-300"></span>
      </button>

      <ul id="nav-links" class="nav-links">
        <li><a href="/" class="nav-link ${isActive('/')}">HOME</a></li>
        <li><a href="/agents.html" class="nav-link ${isActive('agents')}">AGENTS</a></li>
        <li><a href="/maps.html" class="nav-link ${isActive('maps')}">MAPS</a></li>
        <li><a href="/weapons.html" class="nav-link ${isActive('weapons')}">WEAPONS</a></li>
        <li><a href="/ranks.html" class="nav-link ${isActive('ranks')}">RANKS</a></li>
        <li>
          <button id="theme-toggle" class="w-10 h-10 flex items-center justify-center rounded-full bg-[#1c2b3a] border border-white/10 text-[#ece8e1] cursor-pointer transition-all duration-300 hover:border-[#ff4655] hover:text-[#ff4655]" title="Toggle Theme">
            <svg id="theme-icon-dark" class="w-5 h-5 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.95 16.95l.707.707M7.05 7.05l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
            </svg>
            <svg id="theme-icon-light" class="w-5 h-5 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  `;

  const footerHtml = `
    <footer class="text-center py-10 px-5 border-t border-white/10 text-[#5a6670] text-sm bg-[#0f1923]">
      <p>VALORANT INFO HUB — Built with ♥ using <a href="https://valorant-api.com" target="_blank" class="text-[#ff4655] hover:underline">valorant-api.com</a></p>
    </footer>
  `;

  const header = document.querySelector('header');
  if (header) header.outerHTML = navHtml;

  const footer = document.querySelector('footer');
  if (footer) footer.outerHTML = footerHtml;
}

function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle');
  const iconDark = document.getElementById('theme-icon-dark');
  const iconLight = document.getElementById('theme-icon-light');
  
  const currentTheme = localStorage.getItem('valorant-theme') || 'dark';
  
  // Set initial state
  if (currentTheme === 'light') {
    document.body.classList.add('light-mode');
    if (iconLight) iconLight.classList.remove('hidden');
  } else {
    document.body.classList.remove('light-mode');
    if (iconDark) iconDark.classList.remove('hidden');
  }

  // Toggle handler
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const isLight = document.body.classList.contains('light-mode');
      if (isLight) {
        document.body.classList.remove('light-mode');
        localStorage.setItem('valorant-theme', 'dark');
        iconDark.classList.remove('hidden');
        iconLight.classList.add('hidden');
        toggleBtn.title = 'Switch to light mode';
      } else {
        document.body.classList.add('light-mode');
        localStorage.setItem('valorant-theme', 'light');
        iconLight.classList.remove('hidden');
        iconDark.classList.add('hidden');
        toggleBtn.title = 'Switch to dark mode';
      }
    });
  }
}

function initMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });
  }
}

// Global favorites helpers
export function getFavorites() {
  const saved = localStorage.getItem('valorant-favs');
  return saved ? JSON.parse(saved) : [];
}

export function toggleFavorite(id) {
  let favs = getFavorites();
  if (favs.includes(id)) {
    favs = favs.filter(f => f !== id);
  } else {
    favs.push(id);
  }
  localStorage.setItem('valorant-favs', JSON.stringify(favs));
  return favs;
}

export function isFavorited(id) {
  return getFavorites().includes(id);
}
