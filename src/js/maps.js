import { initApp } from './main.js';

let maps = [];
let search = '';
let sortAsc = true;
let typeFilter = 'all'; // all, main, practice
let selectedMap = null;

async function loadData() {
  try {
    const res = await fetch('https://valorant-api.com/v1/maps');
    const data = await res.json();
    maps = data.data;
    render();
  } catch (err) {
    console.error('Error fetching maps:', err);
    document.getElementById('app-content').innerHTML = `
      <div class="text-center py-15 px-5 text-val-dim">
        <p class="font-teko text-[1.4rem] tracking-[3px] mt-2.5">Error Loading Maps</p>
      </div>
    `;
  }
}

function getFilteredMaps() {
  return maps
    .filter(map => map.splash !== null)
    .filter(map => {
      const matchesSearch = map.displayName.toLowerCase().includes(search.toLowerCase());
      if (typeFilter === 'main') return matchesSearch && map.tacticalDescription;
      if (typeFilter === 'practice') return matchesSearch && !map.tacticalDescription;
      return matchesSearch;
    })
    .sort((a, b) => {
      const cmp = a.displayName.localeCompare(b.displayName);
      return sortAsc ? cmp : -cmp;
    });
}

function render() {
  const container = document.getElementById('app-content');
  const filteredMaps = getFilteredMaps();

  const typeBtns = ['all', 'main', 'practice'].map(type => `
    <button
      class="type-btn font-teko text-sm tracking-[2px] py-2.5 px-5 cursor-pointer transition-all duration-300 clip-corner-sm max-[480px]:py-2 max-[480px]:px-3 ${
        typeFilter === type
          ? 'bg-val-red text-val-text border border-val-red'
          : 'text-val-muted bg-val-card border border-val-text/8 hover:text-val-text'
      }"
      data-type="${type}"
    >
      ${type.toUpperCase()}
    </button>
  `).join('');

  const gridHtml = filteredMaps.length > 0 ? `
    <div class="grid grid-cols-[repeat(auto-fill,minmax(380px,1fr))] gap-6 max-md:grid-cols-1">
      ${filteredMaps.map(map => `
        <div class="map-card group relative h-60 overflow-hidden cursor-pointer border border-val-text/8 clip-corner-lg transition-all duration-300 hover:-translate-y-1 hover:border-val-red hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)]" data-id="${map.uuid}">
          <img src="${map.splash}" alt="${map.displayName}" class="w-full h-full object-cover transition-all duration-[400ms] group-hover:scale-[1.06]" />
          <div class="absolute inset-0 flex flex-col justify-end p-6" style="background: linear-gradient(to top, rgba(15, 25, 35, 0.95), rgba(15, 25, 35, 0.2) 60%)">
            <div class="font-teko text-[2.2rem] font-bold tracking-[3px] uppercase leading-none">${map.displayName}</div>
            ${map.coordinates ? `<div class="text-[0.8rem] text-val-muted tracking-[1px] mt-1">${map.coordinates}</div>` : ''}
          </div>
        </div>
      `).join('')}
    </div>
  ` : `
    <div class="text-center py-[60px] px-5 text-val-dim">
      <div class="text-5xl opacity-50">:/</div>
      <p class="font-teko text-[1.4rem] tracking-[3px] mt-2.5">NO MAPS FOUND</p>
    </div>
  `;

  container.innerHTML = `
    <div class="pt-[100px] px-10 pb-[60px] max-w-[1400px] mx-auto min-h-screen animate-page-fade max-md:pt-[90px] max-md:px-5 max-md:pb-10">
      <div class="text-center mb-10">
        <h1 class="font-teko text-[4rem] font-bold tracking-[6px] uppercase leading-none mb-2 max-md:text-[2.8rem]">MAPS</h1>
        <p class="text-val-muted text-base tracking-[1px]">Know the battlefield. Control the game.</p>
      </div>

      <div class="flex flex-wrap items-center gap-4 mb-8 max-md:flex-col max-md:items-stretch">
        <div class="relative flex-[0_0_280px] max-md:flex-auto">
          <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-val-dim pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            id="search-input"
            type="text"
            placeholder="Search maps..."
            value="${search}"
            class="w-full py-3 pr-4 pl-[42px] bg-val-card border border-val-text/8 text-val-text text-sm rounded transition-all duration-300 placeholder:text-val-dim focus:border-val-red focus:shadow-[0_0_0_3px_rgba(255,70,85,0.3)] focus:outline-none"
          />
        </div>

        <div class="flex flex-wrap gap-2 max-md:justify-center">
          ${typeBtns}
        </div>

        <div class="flex items-center gap-2.5 ml-auto max-md:ml-0 max-md:justify-center">
          <label class="font-teko text-sm tracking-[2px] text-val-muted text-nowrap">SORT:</label>
          <button 
            id="sort-btn"
            class="w-[38px] h-[38px] bg-val-card border border-val-text/8 text-val-text text-lg rounded cursor-pointer flex items-center justify-center transition-all duration-300 hover:border-val-red" 
            title="${sortAsc ? 'Sort Descending' : 'Sort Ascending'}"
          >
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

  document.querySelectorAll('.type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      typeFilter = btn.getAttribute('data-type');
      render();
    });
  });

  document.getElementById('sort-btn').addEventListener('click', () => {
    sortAsc = !sortAsc;
    render();
  });

  document.querySelectorAll('.map-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      selectedMap = maps.find(m => m.uuid === id);
      renderModal();
    });
  });
}

function renderModal() {
  const container = document.getElementById('modal-container');
  if (!selectedMap) {
    container.innerHTML = '';
    return;
  }

  const map = selectedMap;

  container.innerHTML = `
    <div class="fixed inset-0 z-[200] bg-black/80 backdrop-blur-[8px] flex items-center justify-center p-5 animate-fade-in" id="modal-backdrop">
      <div class="bg-val-modal border border-val-text/15 max-w-[800px] w-full max-h-[85vh] overflow-y-auto relative clip-corner-lg animate-modal-pop" id="modal-content">
        <button id="close-modal-btn" class="absolute top-4 right-4 w-9 h-9 bg-val-red/15 border border-val-red text-val-red text-xl flex items-center justify-center cursor-pointer z-10 transition-all duration-300 hover:bg-val-red hover:text-val-text">✕</button>

        <div class="relative h-[280px] overflow-hidden">
          <img src="${map.splash}" alt="${map.displayName}" class="w-full h-full object-cover" />
          <div class="absolute inset-0" style="background: linear-gradient(to top, var(--theme-modal), transparent 60%)"></div>
        </div>

        <div class="p-[30px]">
          <h2 class="font-teko text-5xl font-bold tracking-[4px] uppercase leading-none mb-1.5">${map.displayName}</h2>
          ${map.coordinates ? `<p class="text-sm text-val-dim mb-4">${map.coordinates}</p>` : ''}
          ${map.narrativeDescription ? `<p class="text-val-muted text-[0.95rem] leading-[1.7] mb-4">${map.narrativeDescription}</p>` : ''}
          ${map.tacticalDescription ? `<p class="text-val-red font-teko tracking-[2px] text-lg mb-4">${map.tacticalDescription}</p>` : ''}

          ${map.displayIcon ? `
            <div class="mt-5">
              <p class="font-teko text-xl tracking-[3px] text-val-muted mb-3">MINIMAP</p>
              <img src="${map.displayIcon}" alt="minimap" class="w-full max-w-[400px] mx-auto block opacity-80" />
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;

  document.getElementById('close-modal-btn').addEventListener('click', () => {
    selectedMap = null;
    renderModal();
  });
  
  document.getElementById('modal-backdrop').addEventListener('click', (e) => {
    if (e.target.id === 'modal-backdrop') {
      selectedMap = null;
      renderModal();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initApp();
  
  document.getElementById('app-content').innerHTML = `
    <div class="text-center py-[60px] px-5 text-val-dim pt-[100px]">
      <p class="font-teko text-[1.4rem] tracking-[3px] mt-2.5">Loading maps...</p>
    </div>
  `;
  
  loadData();
});
