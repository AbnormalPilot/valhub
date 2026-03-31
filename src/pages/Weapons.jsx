import { useState, useEffect } from 'react'

function Weapons({ favorites, toggleFavorite, isFavorited }) {
  const [weapons, setWeapons] = useState([])
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [sortAsc, setSortAsc] = useState(true)
  const [selectedWeapon, setSelectedWeapon] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('https://valorant-api.com/v1/weapons')
      .then(res => res.json())
      .then(data => {
        setWeapons(data.data)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
  }, [])

  const getCat = (weapon) => {
    if (!weapon.shopData) return 'Melee'
    const cat = weapon.shopData.categoryText
    return cat || 'Other'
  }

  const getCost = (weapon) => {
    return weapon.shopData?.cost || 0
  }

  const filteredWeapons = weapons
    .filter(w => {
      if (!w.displayName.toLowerCase().includes(search.toLowerCase())) return false
      if (catFilter !== 'all') {
        const cat = getCat(w)
        if (cat !== catFilter) return false
      }
      return true
    })
    .sort((a, b) => {
      let comparison = 0

      if (sortBy === 'name') {
        comparison = a.displayName.localeCompare(b.displayName)
      } else if (sortBy === 'cost') {
        comparison = getCost(a) - getCost(b)
      } else if (sortBy === 'fireRate') {
        const rateA = a.weaponStats?.fireRate || 0
        const rateB = b.weaponStats?.fireRate || 0
        comparison = rateA - rateB
      } else if (sortBy === 'damage') {
        const dmgA = a.weaponStats?.damageRanges?.[0]?.bodyDamage || 0
        const dmgB = b.weaponStats?.damageRanges?.[0]?.bodyDamage || 0
        comparison = dmgA - dmgB
      } else if (sortBy === 'magazine') {
        const magA = a.weaponStats?.magazineSize || 0
        const magB = b.weaponStats?.magazineSize || 0
        comparison = magA - magB
      }

      return sortAsc ? comparison : -comparison
    })

  const categories = ['all', 'Rifle', 'SMG', 'Shotgun', 'Sniper', 'Heavy', 'Sidearm']

  return (
    <div className="pt-[100px] px-10 pb-[60px] max-w-[1400px] mx-auto min-h-screen animate-page-fade max-md:pt-[90px] max-md:px-5 max-md:pb-10">
      <div className="text-center mb-10">
        <h1 className="font-teko text-[4rem] font-bold tracking-[6px] uppercase leading-none mb-2 max-md:text-[2.8rem]">WEAPONS</h1>
        <p className="text-val-muted text-base tracking-[1px]">Pick your arsenal. Know your firepower.</p>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-8 max-md:flex-col max-md:items-stretch">
        <div className="relative flex-[0_0_280px] max-md:flex-auto">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-val-dim pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search weapons..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full py-3 pr-4 pl-[42px] bg-val-card border border-val-text/8 text-val-text text-sm rounded transition-all duration-300 placeholder:text-val-dim focus:border-val-red focus:shadow-[0_0_0_3px_rgba(255,70,85,0.3)] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-2 max-md:justify-center">
          {categories.map(cat => (
            <button
              key={cat}
              className={`font-teko text-sm tracking-[2px] py-2.5 px-5 cursor-pointer transition-all duration-300 clip-corner-sm max-[480px]:py-2 max-[480px]:px-3 max-[480px]:text-[0.8rem] ${
                catFilter === cat
                  ? 'bg-val-red text-white border border-val-red'
                  : 'text-val-muted bg-val-card border border-val-text/8 hover:text-val-text'
              }`}
              onClick={() => setCatFilter(cat)}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2.5 ml-auto max-md:ml-0 max-md:justify-center">
          <label className="font-teko text-sm tracking-[2px] text-val-muted">SORT BY:</label>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="py-2.5 px-3.5 bg-val-card border border-val-text/8 text-val-text font-teko text-sm rounded cursor-pointer [&_option]:bg-val-modal">
            <option value="name">NAME</option>
            <option value="cost">COST</option>
            <option value="fireRate">FIRE RATE</option>
            <option value="damage">DAMAGE</option>
            <option value="magazine">MAGAZINE</option>
          </select>
          <button className="w-[38px] h-[38px] bg-val-card border border-val-text/8 text-val-text text-lg rounded cursor-pointer flex items-center justify-center" onClick={() => setSortAsc(!sortAsc)}>
            {sortAsc ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-[60px] px-5 text-val-dim">
          <p className="font-teko text-[1.4rem] tracking-[3px] mt-2.5">Loading weapons...</p>
        </div>
      ) : filteredWeapons.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5 max-md:grid-cols-1">
          {filteredWeapons.map(weapon => (
            <div className="group relative bg-val-card border border-val-text/8 p-6 cursor-pointer transition-all duration-300 clip-corner hover:-translate-y-1 hover:border-val-red hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)]" key={weapon.uuid} onClick={() => setSelectedWeapon(weapon)}>
              <button className={`absolute top-2.5 right-2.5 z-[5] text-xl cursor-pointer bg-black/50 border-none rounded-full w-9 h-9 flex items-center justify-center transition-all duration-300 hover:scale-[1.15] ${isFavorited(weapon.uuid) ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`} onClick={(e) => { e.stopPropagation(); toggleFavorite(weapon.uuid) }}>
                {isFavorited(weapon.uuid) ? '❤️' : '🤍'}
              </button>
              <div className="flex justify-between mb-4">
                <span className="font-teko text-xs tracking-[3px] text-val-red uppercase">{getCat(weapon)}</span>
                <span className="font-teko text-base text-val-green">{getCost(weapon) > 0 ? `${getCost(weapon)}` : 'FREE'}</span>
              </div>
              <div className="h-20 flex items-center justify-center mb-4">
                {weapon.displayIcon && <img src={weapon.displayIcon} alt={weapon.displayName} className="max-h-[70px] brightness-0 invert opacity-90 transition-all duration-300 group-hover:opacity-100 group-hover:drop-shadow-[0_0_8px_rgba(255,70,85,0.4)]" />}
              </div>
              <div className="font-teko text-[1.8rem] font-semibold tracking-[2px] uppercase mb-3">{weapon.displayName}</div>
              {weapon.weaponStats && (
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <span className="font-teko text-xl font-semibold block">{weapon.weaponStats.fireRate}</span>
                    <span className="text-[0.65rem] tracking-[1px] text-val-dim uppercase">FIRE RATE</span>
                  </div>
                  <div>
                    <span className="font-teko text-xl font-semibold block">{weapon.weaponStats.magazineSize}</span>
                    <span className="text-[0.65rem] tracking-[1px] text-val-dim uppercase">MAG SIZE</span>
                  </div>
                  <div>
                    <span className="font-teko text-xl font-semibold block">{weapon.weaponStats.damageRanges?.[0]?.bodyDamage || '-'}</span>
                    <span className="text-[0.65rem] tracking-[1px] text-val-dim uppercase">BODY DMG</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-[60px] px-5 text-val-dim">
          <div className="text-5xl opacity-50">:/</div>
          <p className="font-teko text-[1.4rem] tracking-[3px] mt-2.5">NO WEAPONS FOUND</p>
        </div>
      )}

      {selectedWeapon && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-[8px] flex items-center justify-center p-5 animate-fade-in" onClick={() => setSelectedWeapon(null)}>
          <div className="bg-val-modal border border-val-text/15 max-w-[800px] w-full max-h-[85vh] overflow-y-auto relative clip-corner-lg animate-modal-pop" onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4 w-9 h-9 bg-val-red/15 border border-val-red text-val-red text-xl flex items-center justify-center cursor-pointer z-10 transition-all duration-300 hover:bg-val-red hover:text-white" onClick={() => setSelectedWeapon(null)}>✕</button>

            <div className="p-10 flex items-center justify-center border-b border-val-text/8" style={{ background: 'linear-gradient(135deg, #1c2b3a, #1a2634)' }}>
              {selectedWeapon.displayIcon && <img src={selectedWeapon.displayIcon} alt="" className="max-h-[120px] brightness-0 invert" />}
            </div>

            <div className="p-[30px]">
              <div className="font-teko text-sm tracking-[4px] text-val-red uppercase mb-1.5">{getCat(selectedWeapon)}</div>
              <h2 className="font-teko text-5xl font-bold tracking-[4px] uppercase leading-none mb-2.5">{selectedWeapon.displayName}</h2>
              {getCost(selectedWeapon) > 0 && (
                <div className="font-teko text-[1.4rem] text-val-green mb-6">⊙ {getCost(selectedWeapon)} Credits</div>
              )}

              {selectedWeapon.weaponStats && (
                <>
                  <div className="grid grid-cols-3 gap-4 mb-[30px] max-md:grid-cols-2">
                    {[
                      { val: selectedWeapon.weaponStats.fireRate, lbl: 'Fire Rate' },
                      { val: selectedWeapon.weaponStats.magazineSize, lbl: 'Magazine' },
                      { val: `${selectedWeapon.weaponStats.reloadTimeSeconds}s`, lbl: 'Reload' },
                      { val: `${selectedWeapon.weaponStats.equipTimeSeconds}s`, lbl: 'Equip Time' },
                      { val: selectedWeapon.weaponStats.firstBulletAccuracy, lbl: '1st Bullet Acc' },
                      { val: selectedWeapon.weaponStats.wallPenetration?.split('::')[1] || '-', lbl: 'Wall Pen' },
                    ].map((stat, i) => (
                      <div key={i} className="bg-white/[0.03] border border-val-text/8 p-4 text-center rounded">
                        <span className="font-teko text-[1.6rem] text-val-red block">{stat.val}</span>
                        <span className="text-[0.7rem] tracking-[1px] text-val-dim uppercase mt-1">{stat.lbl}</span>
                      </div>
                    ))}
                  </div>

                  {selectedWeapon.weaponStats.damageRanges && selectedWeapon.weaponStats.damageRanges.length > 0 && (
                    <>
                      <h3 className="font-teko text-[1.3rem] tracking-[3px] mb-3.5">DAMAGE RANGES</h3>
                      <table className="w-full border-collapse text-sm">
                        <thead>
                          <tr>
                            <th className="py-2.5 px-3.5 text-center border-b border-val-text/8 font-teko text-[0.8rem] tracking-[2px] text-val-dim uppercase">Range</th>
                            <th className="py-2.5 px-3.5 text-center border-b border-val-text/8 font-teko text-[0.8rem] tracking-[2px] text-val-dim uppercase">Head</th>
                            <th className="py-2.5 px-3.5 text-center border-b border-val-text/8 font-teko text-[0.8rem] tracking-[2px] text-val-dim uppercase">Body</th>
                            <th className="py-2.5 px-3.5 text-center border-b border-val-text/8 font-teko text-[0.8rem] tracking-[2px] text-val-dim uppercase">Leg</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedWeapon.weaponStats.damageRanges.map((range, i) => (
                            <tr key={i}>
                              <td className="py-2.5 px-3.5 text-center border-b border-val-text/8">{range.rangeStartMeters}-{range.rangeEndMeters}m</td>
                              <td className="py-2.5 px-3.5 text-center border-b border-val-text/8 text-val-red font-semibold">{Math.round(range.headDamage)}</td>
                              <td className="py-2.5 px-3.5 text-center border-b border-val-text/8 text-val-text">{Math.round(range.bodyDamage)}</td>
                              <td className="py-2.5 px-3.5 text-center border-b border-val-text/8">{Math.round(range.legDamage)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  )}
                </>
              )}

              {selectedWeapon.skins && (
                <>
                  <h3 className="font-teko text-[1.3rem] tracking-[3px] mt-6 mb-3.5">SKINS</h3>
                  <div className="flex gap-3 overflow-x-auto pb-2.5">
                    {selectedWeapon.skins
                      .filter(s => s.displayIcon != null)
                      .slice(0, 8)
                      .map(skin => (
                        <div className="shrink-0 w-[140px] h-20 bg-val-card border border-val-text/8 rounded flex items-center justify-center" key={skin.uuid} title={skin.displayName}>
                          <img src={skin.displayIcon} alt={skin.displayName} className="max-w-[120px] max-h-[60px] object-contain" />
                        </div>
                      ))
                    }
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Weapons
