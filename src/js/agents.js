import { initApp, isFavorited, toggleFavorite, getFavorites } from './main.js';

let agents = [];
let search = '';
let roleFilter = 'all';
let showFavsOnly = false;
let sortBy = 'name';
let selectedAgent = null;

const roles = ['all', 'Duelist', 'Initiator', 'Controller', 'Sentinel'];

async function loadData() {
  try {
    const res = await fetch('https://valorant-api.com/v1/agents?isPlayableCharacter=true');
    const data = await res.json();
    agents = data.data;
    render();
  } catch (err) {
    console.error('Error fetching agents:', err);
    document.getElementById('app-content').innerHTML = `
      <div class="text-center py-15 px-5 text-val-dim">
        <p class="font-teko text-[1.4rem] tracking-[3px] mt-2.5">Error Loading Agents</p>
      </div>
    `;
  }
}

function getFilteredAgents() {
  const favs = getFavorites();
  return agents
    .filter(agent => {
      const matchesSearch = agent.displayName.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === 'all' || agent.role?.displayName === roleFilter;
      const matchesFav = !showFavsOnly || favs.includes(agent.uuid);
      return matchesSearch && matchesRole && matchesFav;
    })
    .sort((a, b) => {
      if (sortBy === 'role') {
        const roleA = a.role?.displayName || '';
        const roleB = b.role?.displayName || '';
        if (roleA !== roleB) return roleA.localeCompare(roleB);
      }
      return a.displayName.localeCompare(b.displayName);
    });
}

function render() {
  const container = document.getElementById('app-content');
  const filteredAgents = getFilteredAgents();
  const favCount = agents.filter(a => isFavorited(a.uuid)).length;

  const roleBtns = roles.map(role => `
    <button class="role-btn font-teko text-sm tracking-[2px] py-2.5 px-5 cursor-pointer transition-all duration-300 clip-corner-sm max-[480px]:py-2 max-[480px]:px-3 max-[480px]:text-[0.8rem] ${
      roleFilter === role
        ? 'bg-val-red text-val-text border border-val-red'
        : 'text-val-muted bg-val-card border border-val-text/8 hover:text-val-text'
    }" data-role="${role}">
      ${role.toUpperCase()}
    </button>
  `).join('');

  const gridHtml = filteredAgents.length > 0 ? `
    <div class="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5 max-md:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] max-md:gap-3 max-[480px]:grid-cols-2 max-[480px]:gap-2.5">
      ${filteredAgents.map(agent => {
        const favorited = isFavorited(agent.uuid);
        const colors = agent.backgroundGradientColors || [];
        const gradientStyle = colors.length >= 2
          ? `background: linear-gradient(135deg, #${colors[0].slice(0,6)}, #${colors[1].slice(0,6)})`
          : 'background: var(--theme-card)';
        
        return `
          <div class="agent-card group relative bg-val-card border border-val-text/8 overflow-hidden cursor-pointer transition-all duration-300 clip-corner hover:-translate-y-1.5 hover:border-val-red hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)]" data-id="${agent.uuid}">
            <button class="fav-btn absolute top-2.5 right-2.5 z-[5] text-xl cursor-pointer bg-val-dark/50 border-none rounded-full w-9 h-9 flex items-center justify-center transition-all duration-300 hover:scale-[1.15] ${favorited ? 'opacity-100' : 'opacity-70 hover:opacity-100'}" data-id="${agent.uuid}">
              ${favorited ? '❤️' : '🤍'}
            </button>
            <div class="relative h-[260px] overflow-hidden flex items-center justify-center max-md:h-[200px] max-[480px]:h-[160px]">
              <div class="absolute inset-0 opacity-15 transition-opacity duration-300 group-hover:opacity-25" style="${gradientStyle}"></div>
              ${agent.displayIcon ? `<img src="${agent.displayIcon}" alt="${agent.displayName}" class="relative z-[1] h-[240px] object-contain transition-transform duration-300 group-hover:scale-105 max-md:h-[180px] max-[480px]:h-[140px]" />` : ''}
            </div>
            <div class="p-4">
              <div class="font-teko text-xs tracking-[3px] text-val-red uppercase mb-1">${agent.role?.displayName || 'Unknown'}</div>
              <div class="font-teko text-[1.6rem] font-semibold tracking-[2px] uppercase max-[480px]:text-[1.2rem]">${agent.displayName}</div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  ` : `
    <div class="text-center py-15 px-5 text-val-dim">
      <div class="text-5xl opacity-50">:/</div>
      <p class="font-teko text-[1.4rem] tracking-[3px] mt-2.5">${showFavsOnly ? 'NO FAVORITE AGENTS YET' : 'NO AGENTS FOUND'}</p>
    </div>
  `;

  container.innerHTML = `
    <div class="pt-[100px] px-10 pb-[60px] max-w-[1400px] mx-auto min-h-screen animate-page-fade max-md:pt-[90px] max-md:px-5 max-md:pb-10">
      <div class="text-center mb-10">
        <h1 class="font-teko text-[4rem] font-bold tracking-[6px] uppercase leading-none mb-2 max-md:text-[2.8rem]">AGENTS</h1>
        <p class="text-val-muted text-base tracking-[1px]">Choose your fighter. Master their abilities.</p>
      </div>

      <div class="flex flex-wrap items-center gap-4 mb-8 max-md:flex-col max-md:items-stretch">
        <div class="relative flex-[0_0_280px] max-md:flex-auto">
          <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-val-dim pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            id="search-input"
            type="text"
            placeholder="Search agents..."
            value="${search}"
            class="w-full py-3 pr-4 pl-[42px] bg-val-card border border-val-text/8 text-val-text text-sm rounded transition-all duration-300 placeholder:text-val-dim focus:border-val-red focus:shadow-[0_0_0_3px_rgba(255,70,85,0.3)] focus:outline-none"
          />
        </div>

        <div class="flex flex-wrap gap-2 max-md:justify-center">
          ${roleBtns}
          <button
            id="fav-filter-btn"
            class="font-teko text-sm tracking-[2px] py-2.5 px-5 cursor-pointer transition-all duration-300 clip-corner-sm max-[480px]:py-2 max-[480px]:px-3 max-[480px]:text-[0.8rem] ${
              showFavsOnly
                ? 'bg-val-red text-val-text border border-val-red'
                : 'text-val-muted bg-val-card border border-val-text/8 hover:text-val-text'
            }"
          >
            ❤️ FAVORITES (${favCount})
          </button>

          <div class="flex items-center gap-2.5 ml-auto max-md:ml-0 max-md:justify-center">
            <label class="font-teko text-sm tracking-[2px] text-val-muted">SORT BY:</label>
            <select
              id="sort-select"
              class="py-2.5 px-3.5 bg-val-card border border-val-text/8 text-val-text font-teko text-sm rounded cursor-pointer [&_option]:bg-val-modal focus:outline-none focus:border-val-red"
            >
              <option value="name" ${sortBy === 'name' ? 'selected' : ''}>NAME</option>
              <option value="role" ${sortBy === 'role' ? 'selected' : ''}>ROLE</option>
            </select>
          </div>
        </div>
      </div>

      ${gridHtml}
    </div>
  `;

  attachListeners();
  renderModal();
}

function attachListeners() {
  document.getElementById('search-input').addEventListener('input', (e) => {
    search = e.target.value;
    render();
    document.getElementById('search-input').focus();
  });

  document.querySelectorAll('.role-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      roleFilter = btn.getAttribute('data-role');
      render();
    });
  });

  document.getElementById('fav-filter-btn').addEventListener('click', () => {
    showFavsOnly = !showFavsOnly;
    render();
  });

  document.getElementById('sort-select').addEventListener('change', (e) => {
    sortBy = e.target.value;
    render();
  });

  document.querySelectorAll('.agent-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      selectedAgent = agents.find(a => a.uuid === id);
      renderModal();
    });
  });

  document.querySelectorAll('.fav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      toggleFavorite(id);
      render();
    });
  });
}

window.handleShare = (agentName) => {
  const text = \`Check out \${agentName} in VALORANT!\\n\${window.location.href}\`;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('share-btn');
    if (btn) {
      btn.innerHTML = 'COPIED!';
      btn.className = 'h-9 px-4 font-teko text-sm tracking-[2px] border transition-all duration-300 flex items-center gap-2 cursor-pointer bg-val-green text-val-dark border-val-green ring-4 ring-val-green/20';
      setTimeout(() => renderModal(), 2000);
    }
  });
};

function renderModal() {
  const container = document.getElementById('modal-container');
  if (!selectedAgent) {
    container.innerHTML = '';
    return;
  }

  const agent = selectedAgent;
  const colors = agent.backgroundGradientColors || [];
  const bg = colors.length >= 2
    ? \`background: linear-gradient(135deg, #\${colors[0].slice(0,6)}, #\${colors[1].slice(0,6)})\`
    : '';

  const abilitiesHtml = (agent.abilities || [])
    .filter(a => a.displayName)
    .map(ability => \`
      <div class="flex gap-3.5 p-3.5 bg-white/[0.03] border border-val-text/8 rounded mb-3 transition-colors duration-300 hover:border-val-text/15">
        \${ability.displayIcon ? \`<img src="\${ability.displayIcon}" alt="" class="w-11 h-11 object-contain brightness-0 invert shrink-0" />\` : ''}
        <div>
          <div class="font-teko text-lg font-semibold tracking-[2px] uppercase">\${ability.displayName}</div>
          <div class="text-[0.7rem] tracking-[2px] text-val-red uppercase mt-[2px] mb-1.5">\${ability.slot}</div>
          <div class="text-sm text-val-muted leading-[1.5]">\${ability.description}</div>
        </div>
      </div>
    \`).join('');

  container.innerHTML = \`
    <div class="fixed inset-0 z-[200] bg-black/80 backdrop-blur-[8px] flex items-center justify-center p-5 animate-fade-in" id="modal-backdrop">
      <div class="bg-val-modal border border-val-text/15 max-w-[650px] w-full max-h-[85vh] overflow-y-auto relative clip-corner-lg animate-modal-pop" id="modal-content">
        <div class="absolute top-4 right-4 flex gap-2 z-10">
          <button 
            id="share-btn"
            class="h-9 px-4 font-teko text-sm tracking-[2px] border transition-all duration-300 flex items-center gap-2 cursor-pointer bg-val-card border-val-text/8 text-val-muted hover:border-val-red hover:text-val-text"
            onclick="handleShare('\${agent.displayName}')"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            SHARE
          </button>
          <button id="close-modal-btn" class="w-9 h-9 bg-val-red/15 border border-val-red text-val-red text-xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-val-red hover:text-val-text">✕</button>
        </div>

        <div class="relative h-[300px] overflow-hidden flex items-center justify-center">
          <div class="absolute inset-0 opacity-20" style="\${bg}"></div>
          \${agent.fullPortrait ? \`<img src="\${agent.fullPortrait}" alt="\${agent.displayName}" class="relative z-[1] h-[280px] object-contain" />\` : ''}
        </div>

        <div class="p-[30px]">
          <div class="font-teko text-sm tracking-[4px] text-val-red uppercase mb-1.5 flex items-center gap-2">
            \${agent.role?.displayIcon ? \`<img src="\${agent.role.displayIcon}" class="w-[18px] h-[18px]" />\` : ''}
            \${agent.role?.displayName}
          </div>
          <h2 class="font-teko text-5xl font-bold tracking-[4px] uppercase leading-none mb-4">\${agent.displayName}</h2>
          <p class="text-val-muted text-[0.95rem] leading-[1.7] mb-6">\${agent.description}</p>

          <h3 class="font-teko text-[1.4rem] tracking-[3px] mb-4">ABILITIES</h3>
          \${abilitiesHtml}
        </div>
      </div>
    </div>
  \`;

  document.getElementById('close-modal-btn').addEventListener('click', () => {
    selectedAgent = null;
    renderModal();
  });
  
  document.getElementById('modal-backdrop').addEventListener('click', (e) => {
    if (e.target.id === 'modal-backdrop') {
      selectedAgent = null;
      renderModal();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initApp();
  
  // Show initial loading
  document.getElementById('app-content').innerHTML = \`
    <div class="text-center py-15 px-5 text-val-dim pt-[100px]">
      <p class="font-teko text-[1.4rem] tracking-[3px] mt-2.5">Loading agents...</p>
    </div>
  \`;
  
  // Handle URL params for targeted agent
  const params = new URLSearchParams(window.location.search);
  const targetId = params.get('id');
  if (targetId) {
    // Wait until loaded to select
    const checkInterval = setInterval(() => {
      if (agents.length > 0) {
        selectedAgent = agents.find(a => a.uuid === targetId);
        if (selectedAgent) renderModal();
        clearInterval(checkInterval);
        history.replaceState({}, '', '/agents.html');
      }
    }, 100);
  }

  loadData();
});
