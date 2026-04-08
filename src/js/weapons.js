import { initApp, isFavorited, toggleFavorite, getFavorites } from './main.js';

let weapons = [];
let search = '';
let catFilter = 'all';
let sortBy = 'name';
let sortAsc = true;
let selectedWeapon = null;

const categories = ['all', 'Rifle', 'SMG', 'Shotgun', 'Sniper', 'Heavy', 'Sidearm'];

function getCat(weapon) {
  if (!weapon.shopData) return 'Melee';
  return weapon.shopData.categoryText || 'Other';
}

function getCost(weapon) {
  return weapon.shopData?.cost || 0;
}

async function loadData() {
  try {
    const res = await fetch('https://valorant-api.com/v1/weapons');
    const data = await res.json();
    weapons = data.data;
    render();
  } catch (err) {
    console.error('Error fetching weapons:', err);
    document.getElementById('app-content').innerHTML = `
      <div class="text-center py-15 px-5 text-val-dim">
        <p class="font-teko text-[1.4rem] tracking-[3px] mt-2.5">Error Loading Weapons</p>
      </div>
    `;
  }
}

function getFilteredWeapons() {
  return weapons
    .filter(w => {
      if (!w.displayName.toLowerCase().includes(search.toLowerCase())) return false;
      if (catFilter !== 'all') {
        const cat = getCat(w);
        if (cat !== catFilter) return false;
      }
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;

      if (sortBy === 'name') {
        comparison = a.displayName.localeCompare(b.displayName);
      } else if (sortBy === 'cost') {
        comparison = getCost(a) - getCost(b);
      } else if (sortBy === 'fireRate') {
        const rateA = a.weaponStats?.fireRate || 0;
        const rateB = b.weaponStats?.fireRate || 0;
        comparison = rateA - rateB;
      } else if (sortBy === 'damage') {
        const dmgA = a.weaponStats?.damageRanges?.[0]?.bodyDamage || 0;
        const dmgB = b.weaponStats?.damageRanges?.[0]?.bodyDamage || 0;
        comparison = dmgA - dmgB;
      } else if (sortBy === 'magazine') {
        const magA = a.weaponStats?.magazineSize || 0;
        const magB = b.weaponStats?.magazineSize || 0;
        comparison = magA - magB;
      }

      return sortAsc ? comparison : -comparison;
    });
}

function render() {
  const container = document.getElementById('app-content');
  const filteredWeapons = getFilteredWeapons();

  const catBtns = categories.map(cat => `
    <button
      class="cat-btn font-teko text-sm tracking-[2px] py-2.5 px-5 cursor-pointer transition-all duration-300 clip-corner-sm max-[480px]:py-2 max-[480px]:px-3 max-[480px]:text-[0.8rem] ${
        catFilter === cat
          ? 'bg-val-red text-val-text border border-val-red'
          : 'text-val-muted bg-val-card border border-val-text/8 hover:text-val-text'
      }"
      data-cat="${cat}"
    >
      ${cat.toUpperCase()}
    </button>
  `).join('');

  const gridHtml = filteredWeapons.length > 0 ? `
    <div class="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5 max-md:grid-cols-1">
      ${filteredWeapons.map(weapon => {
        const favorited = isFavorited(weapon.uuid);
        return `
          <div class="weapon-card group relative bg-val-card border border-val-text/8 p-6 cursor-pointer transition-all duration-300 clip-corner hover:-translate-y-1 hover:border-val-red hover:shadow-[0_15px_40px_rgba(var(--shadow-color),0.4)]" data-id="${weapon.uuid}">
            <button class="fav-btn absolute top-2.5 right-2.5 z-[5] text-xl cursor-pointer bg-val-dark/50 border-none rounded-full w-9 h-9 flex items-center justify-center transition-all duration-300 hover:scale-[1.15] ${favorited ? 'opacity-100' : 'opacity-70 hover:opacity-100'}" data-id="${weapon.uuid}">
              ${favorited ? '❤️' : '🤍'}
            </button>
            <div class="flex justify-between mb-4">
              <span class="font-teko text-xs tracking-[3px] text-val-red uppercase">${getCat(weapon)}</span>
              <span class="font-teko text-base text-val-green">${getCost(weapon) > 0 ? getCost(weapon) : 'FREE'}</span>
            </div>
            <div class="h-20 flex items-center justify-center mb-4">
              ${weapon.displayIcon ? `<img src="${weapon.displayIcon}" alt="${weapon.displayName}" class="max-h-[70px] opacity-90 transition-all duration-300 group-hover:opacity-100 group-hover:drop-shadow-[0_0_8px_rgba(255,70,85,0.4)]" />` : ''}
            </div>
            <div class="font-teko text-[1.8rem] font-semibold tracking-[2px] uppercase mb-3">${weapon.displayName}</div>
            ${weapon.weaponStats ? `
              <div class="grid grid-cols-3 gap-2 text-center">
                <div>
                  <span class="font-teko text-xl font-semibold block">${weapon.weaponStats.fireRate}</span>
                  <span class="text-[0.65rem] tracking-[1px] text-val-dim uppercase">FIRE RATE</span>
                </div>
                <div>
                  <span class="font-teko text-xl font-semibold block">${weapon.weaponStats.magazineSize}</span>
                  <span class="text-[0.65rem] tracking-[1px] text-val-dim uppercase">MAG SIZE</span>
                </div>
                <div>
                  <span class="font-teko text-xl font-semibold block">${weapon.weaponStats.damageRanges?.[0]?.bodyDamage || '-'}</span>
                  <span class="text-[0.65rem] tracking-[1px] text-val-dim uppercase">BODY DMG</span>
                </div>
              </div>
            ` : ''}
          </div>
        `;
      }).join('')}
    </div>
  ` : `
    <div class="text-center py-[60px] px-5 text-val-dim">
      <div class="text-5xl opacity-50">:/</div>
      <p class="font-teko text-[1.4rem] tracking-[3px] mt-2.5">NO WEAPONS FOUND</p>
    </div>
  `;

  container.innerHTML = `
    <div class="pt-[100px] px-10 pb-[60px] max-w-[1400px] mx-auto min-h-screen animate-page-fade max-md:pt-[90px] max-md:px-5 max-md:pb-10">
      <div class="text-center mb-10">
        <h1 class="font-teko text-[4rem] font-bold tracking-[6px] uppercase leading-none mb-2 max-md:text-[2.8rem]">WEAPONS</h1>
        <p class="text-val-muted text-base tracking-[1px]">Pick your arsenal. Know your firepower.</p>
      </div>

      <div class="flex flex-wrap items-center gap-4 mb-8 max-md:flex-col max-md:items-stretch">
        <div class="relative flex-[0_0_280px] max-md:flex-auto">
          <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-val-dim pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            id="search-input"
            type="text"
            placeholder="Search weapons..."
            value="${search}"
            class="w-full py-3 pr-4 pl-[42px] bg-val-card border border-val-text/8 text-val-text text-sm rounded transition-all duration-300 placeholder:text-val-dim focus:border-val-red focus:shadow-[0_0_0_3px_rgba(255,70,85,0.3)] focus:outline-none"
          />
        </div>

        <div class="flex flex-wrap gap-2 max-md:justify-center">
          ${catBtns}
        </div>

        <div class="flex items-center gap-2.5 ml-auto max-md:ml-0 max-md:justify-center">
          <label class="font-teko text-sm tracking-[2px] text-val-muted">SORT BY:</label>
          <select id="sort-select" class="py-2.5 px-3.5 bg-val-card border border-val-text/8 text-val-text font-teko text-sm rounded cursor-pointer [&_option]:bg-val-modal focus:outline-none focus:border-val-red">
            <option value="name" ${sortBy === 'name' ? 'selected' : ''}>NAME</option>
            <option value="cost" ${sortBy === 'cost' ? 'selected' : ''}>COST</option>
            <option value="fireRate" ${sortBy === 'fireRate' ? 'selected' : ''}>FIRE RATE</option>
            <option value="damage" ${sortBy === 'damage' ? 'selected' : ''}>DAMAGE</option>
            <option value="magazine" ${sortBy === 'magazine' ? 'selected' : ''}>MAGAZINE</option>
          </select>
          <button id="sort-btn" class="w-[38px] h-[38px] bg-val-card border border-val-text/8 text-val-text text-lg rounded cursor-pointer flex items-center justify-center transition-all hover:border-val-red">
            ${sortAsc ? '↑' : '↓'}
          </button>
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

  document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      catFilter = btn.getAttribute('data-cat');
      render();
    });
  });

  document.getElementById('sort-select').addEventListener('change', (e) => {
    sortBy = e.target.value;
    render();
  });

  document.getElementById('sort-btn').addEventListener('click', () => {
    sortAsc = !sortAsc;
    render();
  });

  document.querySelectorAll('.weapon-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      selectedWeapon = weapons.find(w => w.uuid === id);
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

window.handleShare = (weaponName) => {
  const text = `Check out ${weaponName} in VALORANT!\n${window.location.href}`;
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
  if (!selectedWeapon) {
    container.innerHTML = '';
    return;
  }

  const weapon = selectedWeapon;
  const wStats = weapon.weaponStats;

  let statsHtml = '';
  if (wStats) {
    statsHtml += `
      <div class="grid grid-cols-3 gap-4 mb-[30px] max-md:grid-cols-2">
        ${[
          { val: wStats.fireRate, lbl: 'Fire Rate' },
          { val: wStats.magazineSize, lbl: 'Magazine' },
          { val: `${wStats.reloadTimeSeconds}s`, lbl: 'Reload' },
          { val: `${wStats.equipTimeSeconds}s`, lbl: 'Equip Time' },
          { val: wStats.firstBulletAccuracy, lbl: '1st Bullet Acc' },
          { val: wStats.wallPenetration?.split('::')[1] || '-', lbl: 'Wall Pen' },
        ].map(stat => `
          <div class="bg-white/[0.03] border border-val-text/8 p-4 text-center rounded">
            <span class="font-teko text-[1.6rem] text-val-red block">${stat.val}</span>
            <span class="text-[0.7rem] tracking-[1px] text-val-dim uppercase mt-1">${stat.lbl}</span>
          </div>
        `).join('')}
      </div>
    `;

    if (wStats.damageRanges && wStats.damageRanges.length > 0) {
      statsHtml += `
        <h3 class="font-teko text-[1.3rem] tracking-[3px] mb-3.5">DAMAGE RANGES</h3>
        <table class="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th class="py-2.5 px-3.5 text-center border-b border-val-text/8 font-teko text-[0.8rem] tracking-[2px] text-val-dim uppercase">Range</th>
              <th class="py-2.5 px-3.5 text-center border-b border-val-text/8 font-teko text-[0.8rem] tracking-[2px] text-val-dim uppercase">Head</th>
              <th class="py-2.5 px-3.5 text-center border-b border-val-text/8 font-teko text-[0.8rem] tracking-[2px] text-val-dim uppercase">Body</th>
              <th class="py-2.5 px-3.5 text-center border-b border-val-text/8 font-teko text-[0.8rem] tracking-[2px] text-val-dim uppercase">Leg</th>
            </tr>
          </thead>
          <tbody>
            ${wStats.damageRanges.map(range => `
              <tr>
                <td class="py-2.5 px-3.5 text-center border-b border-val-text/8">${range.rangeStartMeters}-${range.rangeEndMeters}m</td>
                <td class="py-2.5 px-3.5 text-center border-b border-val-text/8 text-val-red font-semibold">${Math.round(range.headDamage)}</td>
                <td class="py-2.5 px-3.5 text-center border-b border-val-text/8 text-val-text">${Math.round(range.bodyDamage)}</td>
                <td class="py-2.5 px-3.5 text-center border-b border-val-text/8">${Math.round(range.legDamage)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }
  }

  let skinsHtml = '';
  if (weapon.skins) {
    const validSkins = weapon.skins.filter(s => s.displayIcon != null).slice(0, 8);
    if (validSkins.length > 0) {
      skinsHtml = `
        <h3 class="font-teko text-[1.3rem] tracking-[3px] mt-6 mb-3.5">SKINS</h3>
        <div class="flex gap-3 overflow-x-auto pb-2.5">
          ${validSkins.map(skin => `
            <div class="shrink-0 w-[140px] h-20 bg-val-card border border-val-text/8 rounded flex items-center justify-center" title="${skin.displayName}">
              <img src="${skin.displayIcon}" alt="${skin.displayName}" class="max-w-[120px] max-h-[60px] object-contain" />
            </div>
          `).join('')}
        </div>
      `;
    }
  }

  container.innerHTML = `
    <div class="fixed inset-0 z-[200] bg-black/80 backdrop-blur-[8px] flex items-center justify-center p-5 animate-fade-in" id="modal-backdrop">
      <div class="bg-val-modal border border-val-text/15 max-w-[800px] w-full max-h-[85vh] overflow-y-auto relative clip-corner-lg animate-modal-pop" id="modal-content">
        <div class="absolute top-4 right-4 flex gap-2 z-10">
          <button 
            id="share-btn"
            class="h-9 px-4 font-teko text-sm tracking-[2px] border transition-all duration-300 flex items-center gap-2 cursor-pointer bg-val-card border-val-text/8 text-val-muted hover:border-val-red hover:text-val-text"
            onclick="handleShare('${weapon.displayName}')"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            SHARE
          </button>
          <button id="close-modal-btn" class="w-9 h-9 bg-val-red/15 border border-val-red text-val-red text-xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-val-red hover:text-val-text">✕</button>
        </div>

        <div class="p-10 flex items-center justify-center border-b border-val-text/8" style="background: linear-gradient(135deg, var(--theme-card), var(--theme-modal))">
          ${weapon.displayIcon ? `<img src="${weapon.displayIcon}" alt="" class="max-h-[120px]" style="filter: var(--icon-filter)" />` : ''}
        </div>

        <div class="p-[30px]">
          <div class="font-teko text-sm tracking-[4px] text-val-red uppercase mb-1.5">${getCat(weapon)}</div>
          <h2 class="font-teko text-5xl font-bold tracking-[4px] uppercase leading-none mb-2.5">${weapon.displayName}</h2>
          ${getCost(weapon) > 0 ? `<div class="font-teko text-[1.4rem] text-val-green mb-6">⊙ ${getCost(weapon)} Credits</div>` : ''}

          ${statsHtml}
          ${skinsHtml}
        </div>
      </div>
    </div>
  `;

  document.getElementById('close-modal-btn').addEventListener('click', () => {
    selectedWeapon = null;
    renderModal();
  });
  
  document.getElementById('modal-backdrop').addEventListener('click', (e) => {
    if (e.target.id === 'modal-backdrop') {
      selectedWeapon = null;
      renderModal();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initApp();
  
  document.getElementById('app-content').innerHTML = `
    <div class="text-center py-[60px] px-5 text-val-dim pt-[100px]">
      <p class="font-teko text-[1.4rem] tracking-[3px] mt-2.5">Loading weapons...</p>
    </div>
  `;
  
  loadData();
});
