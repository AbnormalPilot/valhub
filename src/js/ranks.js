import { initApp } from './main.js';

let tiers = [];

async function loadData() {
  try {
    const res = await fetch('https://valorant-api.com/v1/competitivetiers');
    const data = await res.json();
    const latest = data.data[data.data.length - 1];
    tiers = latest.tiers;
    render();
  } catch (err) {
    console.error('Error fetching ranks:', err);
    document.getElementById('app-content').innerHTML = `
      <div class="text-center py-15 px-5 text-val-dim">
        <p class="font-teko text-[1.4rem] tracking-[3px] mt-2.5">Error Loading Ranks</p>
      </div>
    `;
  }
}

function render() {
  const container = document.getElementById('app-content');

  const groupedTiers = tiers
    .filter(t => !t.divisionName?.includes('Unused') && t.tier >= 0)
    .reduce((groups, tier) => {
      const division = tier.divisionName || 'UNRANKED';
      if (!groups[division]) {
        groups[division] = [];
      }
      groups[division].push(tier);
      return groups;
    }, {});

  const divisionOrder = [
    'UNRANKED',
    'IRON',
    'BRONZE',
    'SILVER',
    'GOLD',
    'PLATINUM',
    'DIAMOND',
    'ASCENDANT',
    'IMMORTAL',
    'RADIANT',
  ];

  const html = divisionOrder.map(division => {
    const tiersInGroup = groupedTiers[division];
    if (!tiersInGroup) return '';

    return `
      <div class="mb-10">
        <h3 class="font-teko text-[1.8rem] tracking-[4px] uppercase mb-4 pb-2 border-b-2 border-val-text/8 text-val-muted">${division}</h3>
        <div class="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-4 max-md:grid-cols-[repeat(auto-fill,minmax(100px,1fr))] max-md:gap-2.5">
          ${tiersInGroup
            .sort((a, b) => a.tier - b.tier)
            .map(tier => `
              <div
                class="bg-val-card border border-val-text/8 py-5 px-3 text-center transition-all duration-300 clip-corner-xs hover:-translate-y-1 hover:border-val-text/15"
                style="border-color: ${tier.color ? `#${tier.color.slice(0,6)}` : ''}"
              >
                ${tier.largeIcon ? `<img src="${tier.largeIcon}" alt="${tier.tierName}" class="w-[72px] h-[72px] mx-auto mb-3 object-contain" />` : ''}
                <p class="font-teko text-base font-semibold tracking-[2px] uppercase">${tier.tierName}</p>
              </div>
            `).join('')}
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="pt-[100px] px-10 pb-[60px] max-w-[1400px] mx-auto min-h-screen animate-page-fade max-md:pt-[90px] max-md:px-5 max-md:pb-10">
      <div class="text-center mb-10">
        <h1 class="font-teko text-[4rem] font-bold tracking-[6px] uppercase leading-none mb-2 max-md:text-[2.8rem]">COMPETITIVE <span class="text-val-red">RANKS</span></h1>
        <p class="text-val-muted text-base tracking-[1px]">Climb the ladder. Prove your worth.</p>
      </div>
      <div class="max-w-[900px] mx-auto">
        ${html}
      </div>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  initApp();
  
  document.getElementById('app-content').innerHTML = `
    <div class="text-center py-[60px] px-5 text-val-dim pt-[100px]">
      <p class="font-teko text-[1.4rem] tracking-[3px] mt-2.5">Loading ranks...</p>
    </div>
  `;
  
  loadData();
});
