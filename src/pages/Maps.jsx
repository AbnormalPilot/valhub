import { useState, useEffect } from 'react'

function Maps() {
  const [maps, setMaps] = useState([])
  const [search, setSearch] = useState('')
  const [sortAsc, setSortAsc] = useState(true)
  const [typeFilter, setTypeFilter] = useState('all') // all, main, practice
  const [selectedMap, setSelectedMap] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('https://valorant-api.com/v1/maps')
      .then(res => res.json())
      .then(data => {
        setMaps(data.data)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
  }, [])

  const filteredMaps = maps
    .filter(map => map.splash !== null)
    .filter(map => {
      const matchesSearch = map.displayName.toLowerCase().includes(search.toLowerCase())
      if (typeFilter === 'main') return matchesSearch && map.tacticalDescription
      if (typeFilter === 'practice') return matchesSearch && !map.tacticalDescription
      return matchesSearch
    })
    .sort((a, b) => {
      const cmp = a.displayName.localeCompare(b.displayName)
      return sortAsc ? cmp : -cmp
    })

  return (
    <div className="pt-[100px] px-10 pb-[60px] max-w-[1400px] mx-auto min-h-screen animate-page-fade max-md:pt-[90px] max-md:px-5 max-md:pb-10">
      <div className="text-center mb-10">
        <h1 className="font-teko text-[4rem] font-bold tracking-[6px] uppercase leading-none mb-2 max-md:text-[2.8rem]">MAPS</h1>
        <p className="text-val-muted text-base tracking-[1px]">Know the battlefield. Control the game.</p>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-8 max-md:flex-col max-md:items-stretch">
        <div className="relative flex-[0_0_280px] max-md:flex-auto">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-val-dim pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search maps..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full py-3 pr-4 pl-[42px] bg-val-card border border-val-text/8 text-val-text text-sm rounded transition-all duration-300 placeholder:text-val-dim focus:border-val-red focus:shadow-[0_0_0_3px_rgba(255,70,85,0.3)] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-2 max-md:justify-center">
          {['all', 'main', 'practice'].map(type => (
            <button
              key={type}
              className={`font-teko text-sm tracking-[2px] py-2.5 px-5 cursor-pointer transition-all duration-300 clip-corner-sm max-[480px]:py-2 max-[480px]:px-3 ${
                typeFilter === type
                  ? 'bg-val-red text-white border border-val-red'
                  : 'text-val-muted bg-val-card border border-val-text/8 hover:text-val-text'
              }`}
              onClick={() => setTypeFilter(type)}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2.5 ml-auto max-md:ml-0 max-md:justify-center">
          <label className="font-teko text-sm tracking-[2px] text-val-muted text-nowrap">SORT:</label>
          <button 
            className="w-[38px] h-[38px] bg-val-card border border-val-text/8 text-val-text text-lg rounded cursor-pointer flex items-center justify-center transition-all duration-300 hover:border-val-red" 
            onClick={() => setSortAsc(!sortAsc)}
            title={sortAsc ? 'Sort Descending' : 'Sort Ascending'}
          >
            {sortAsc ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-[60px] px-5 text-val-dim">
          <p className="font-teko text-[1.4rem] tracking-[3px] mt-2.5">Loading maps...</p>
        </div>
      ) : filteredMaps.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(380px,1fr))] gap-6 max-md:grid-cols-1">
          {filteredMaps.map(map => (
            <div className="group relative h-60 overflow-hidden cursor-pointer border border-val-text/8 clip-corner-lg transition-all duration-300 hover:-translate-y-1 hover:border-val-red hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)]" key={map.uuid} onClick={() => setSelectedMap(map)}>
              <img src={map.splash} alt={map.displayName} className="w-full h-full object-cover transition-all duration-[400ms] group-hover:scale-[1.06]" />
              <div className="absolute inset-0 flex flex-col justify-end p-6" style={{ background: 'linear-gradient(to top, rgba(15, 25, 35, 0.95), rgba(15, 25, 35, 0.2) 60%)' }}>
                <div className="font-teko text-[2.2rem] font-bold tracking-[3px] uppercase leading-none">{map.displayName}</div>
                {map.coordinates && <div className="text-[0.8rem] text-val-muted tracking-[1px] mt-1">{map.coordinates}</div>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-[60px] px-5 text-val-dim">
          <div className="text-5xl opacity-50">:/</div>
          <p className="font-teko text-[1.4rem] tracking-[3px] mt-2.5">NO MAPS FOUND</p>
        </div>
      )}

      {selectedMap && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-[8px] flex items-center justify-center p-5 animate-fade-in" onClick={() => setSelectedMap(null)}>
          <div className="bg-val-modal border border-val-text/15 max-w-[800px] w-full max-h-[85vh] overflow-y-auto relative clip-corner-lg animate-modal-pop" onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4 w-9 h-9 bg-val-red/15 border border-val-red text-val-red text-xl flex items-center justify-center cursor-pointer z-10 transition-all duration-300 hover:bg-val-red hover:text-white" onClick={() => setSelectedMap(null)}>✕</button>

            <div className="relative h-[280px] overflow-hidden">
              <img src={selectedMap.splash} alt={selectedMap.displayName} className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #1a2634, transparent 60%)' }}></div>
            </div>

            <div className="p-[30px]">
              <h2 className="font-teko text-5xl font-bold tracking-[4px] uppercase leading-none mb-1.5">{selectedMap.displayName}</h2>
              {selectedMap.coordinates && (
                <p className="text-sm text-val-dim mb-4">{selectedMap.coordinates}</p>
              )}
              {selectedMap.narrativeDescription && (
                <p className="text-val-muted text-[0.95rem] leading-[1.7] mb-4">{selectedMap.narrativeDescription}</p>
              )}
              {selectedMap.tacticalDescription && (
                <p className="text-val-red font-teko tracking-[2px] text-lg mb-4">
                  {selectedMap.tacticalDescription}
                </p>
              )}

              {selectedMap.displayIcon && (
                <div className="mt-5">
                  <p className="font-teko text-xl tracking-[3px] text-val-muted mb-3">MINIMAP</p>
                  <img src={selectedMap.displayIcon} alt="minimap" className="w-full max-w-[400px] mx-auto block opacity-80" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Maps
