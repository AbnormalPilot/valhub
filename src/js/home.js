import { initApp, isFavorited, toggleFavorite } from './main.js';

let agents = [];
let maps = [];
let weapons = [];

async function loadData() {
  try {
    const [agentsRes, mapsRes, weaponsRes] = await Promise.all([
      fetch('https://valorant-api.com/v1/agents?isPlayableCharacter=true').then(res => res.json()),
      fetch('https://valorant-api.com/v1/maps').then(res => res.json()),
      fetch('https://valorant-api.com/v1/weapons').then(res => res.json())
    ]);
    
    agents = agentsRes.data;
    maps = mapsRes.data;
    weapons = weaponsRes.data;
    
    render();
  } catch (err) {
    console.error('Error fetching home data:', err);
  }
}

function render() {
  const container = document.getElementById('app-content');
  
  if (agents.length === 0) {
    container.innerHTML = `
      <div class="fixed inset-0 bg-val-dark flex items-center justify-center z-[9999] flex-col gap-4">
        <div class="loading-bar"></div>
        <div class="font-teko text-xl tracking-[4px] text-val-muted">LOADING // VALORANT</div>
      </div>
    `;
    return;
  }

  let shuffled = [...agents].sort(() => 0.5 - Math.random());
  const featured = shuffled.slice(0, 4);

  const heroPortraits = agents.slice(0, 7).map(agent => `
    <img src="${agent.fullPortrait}" alt="${agent.displayName}" class="hero-portrait h-[85%] max-w-none object-contain opacity-50 mx-[-350px] brightness-[0.7] shrink-0" />
  `).join('');

  const statsHtml = [
    { num: agents.length, label: 'AGENTS' },
    { num: maps.length, label: 'MAPS' },
    { num: weapons.length, label: 'WEAPONS' },
    { num: 9, label: 'RANK TIERS' },
  ].map(stat => `
    <div class="bg-val-card py-[30px] px-5 text-center border border-val-text/8 clip-corner transition-all duration-300 hover:border-val-red hover:-translate-y-1">
      <div class="font-teko text-[3.5rem] font-bold text-val-red leading-none max-md:text-[2.5rem]">${stat.num}</div>
      <div class="font-teko text-base tracking-[4px] text-val-muted mt-2">${stat.label}</div>
    </div>
  `).join('');

  const featuredHtml = featured.map(agent => {
    const favorited = isFavorited(agent.uuid);
    const colors = agent.backgroundGradientColors || [];
    const gradientStyle = colors.length >= 2
      ? `background: linear-gradient(135deg, #${colors[0].slice(0,6)}, #${colors[1].slice(0,6)})`
      : 'background: var(--theme-card)';
      
    return `
      <div class="group relative bg-val-card border border-val-text/8 overflow-hidden cursor-pointer transition-all duration-300 clip-corner hover:-translate-y-1.5 hover:border-val-red hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)]" onclick="window.location.href='/agents.html?id=${agent.uuid}'">
        <button class="fav-btn absolute top-2.5 right-2.5 z-[5] text-xl cursor-pointer bg-black/50 border-none rounded-full w-9 h-9 flex items-center justify-center transition-all duration-300 hover:scale-[1.15] ${favorited ? 'opacity-100' : 'opacity-70 hover:opacity-100'}" data-id="${agent.uuid}">
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
  }).join('');

  container.innerHTML = `
    <div>
      <div class="relative min-h-screen flex items-end justify-start overflow-hidden">
        <div class="absolute bottom-0 left-0 right-0 flex items-end justify-center h-full overflow-hidden">
          ${heroPortraits}
        </div>
        <div class="absolute inset-0" style="background: linear-gradient(to top, var(--theme-dark) 0%, transparent 100%), linear-gradient(to right, var(--theme-dark) 0%, transparent 50%)"></div>
        <div class="relative z-[2] text-left px-[60px] pb-20 max-md:px-5 max-md:pb-[60px]">
          <p class="font-teko text-xl tracking-[6px] text-val-red mb-3">DEFY THE LIMITS</p>
          <h1 class="font-teko text-[6rem] font-bold leading-[0.95] tracking-[4px] mb-5 max-lg:text-[4.5rem] max-md:text-[3.5rem] max-[480px]:text-[2.5rem]">
            VALORANT<br />
            <span class="text-val-red text-[4.5rem] max-lg:text-[3.5rem] max-md:text-[2.5rem] max-[480px]:text-[2rem]">INFO HUB</span>
          </h1>
          <a href="/agents.html" class="inline-block font-teko text-[1.15rem] font-semibold tracking-[3px] py-3.5 px-10 bg-val-red text-white border-none cursor-pointer transition-all duration-300 uppercase clip-corner-md hover:bg-val-red-dark hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(255,70,85,0.3)]">
            EXPLORE AGENTS
          </a>
        </div>
      </div>

      <div class="grid grid-cols-4 gap-5 max-w-[1400px] mx-auto mb-[60px] px-10 max-lg:grid-cols-2 max-md:gap-3 max-md:px-5">
        ${statsHtml}
      </div>

      ${featured.length > 0 ? `
        <div class="max-w-[1400px] mx-auto mb-[60px] px-10 max-md:px-5">
          <h2 class="font-teko text-[2.5rem] font-semibold tracking-[4px] uppercase mb-[30px] text-center">
            FEATURED <span class="text-val-red">AGENTS</span>
          </h2>
          <div class="grid grid-cols-4 gap-5 max-md:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] max-md:gap-3">
            ${featuredHtml}
          </div>
        </div>
      ` : ''}
    </div>
  `;

  // Attach fav button listeners
  document.querySelectorAll('.fav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      toggleFavorite(id);
      render(); // re-render to update fav icons
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initApp();
  render(); // render loading state
  loadData();
});
