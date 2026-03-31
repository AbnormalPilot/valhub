import { useState, useEffect } from 'react'

function Ranks() {
  const [tiers, setTiers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('https://valorant-api.com/v1/competitivetiers')
      .then(res => res.json())
      .then(data => {
        const latest = data.data[data.data.length - 1]
        setTiers(latest.tiers)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
  }, [])

  const groupedTiers = tiers
    .filter(t => !t.divisionName.includes('Unused') && t.tier >= 0)
    .reduce((groups, tier) => {
      const division = tier.divisionName || 'UNRANKED'
      if (!groups[division]) {
        groups[division] = []
      }
      groups[division].push(tier)
      return groups
    }, {})

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
  ]

  return (
    <div className="pt-[100px] px-10 pb-[60px] max-w-[1400px] mx-auto min-h-screen animate-page-fade max-md:pt-[90px] max-md:px-5 max-md:pb-10">
      <div className="text-center mb-10">
        <h1 className="font-teko text-[4rem] font-bold tracking-[6px] uppercase leading-none mb-2 max-md:text-[2.8rem]">COMPETITIVE <span className="text-val-red">RANKS</span></h1>
        <p className="text-val-muted text-base tracking-[1px]">Climb the ladder. Prove your worth.</p>
      </div>

      {loading ? (
        <div className="text-center py-[60px] px-5 text-val-dim">
          <p className="font-teko text-[1.4rem] tracking-[3px] mt-2.5">Loading ranks...</p>
        </div>
      ) : (
        <div className="max-w-[900px] mx-auto">
          {divisionOrder.map(division => {
            const tiersInGroup = groupedTiers[division]
            if (!tiersInGroup) return null

            return (
              <div className="mb-10" key={division}>
                <h3 className="font-teko text-[1.8rem] tracking-[4px] uppercase mb-4 pb-2 border-b-2 border-val-text/8 text-val-muted">{division}</h3>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-4 max-md:grid-cols-[repeat(auto-fill,minmax(100px,1fr))] max-md:gap-2.5">
                  {tiersInGroup
                    .sort((a, b) => a.tier - b.tier)
                    .map(tier => (
                      <div
                        className="bg-val-card border border-val-text/8 py-5 px-3 text-center transition-all duration-300 clip-corner-xs hover:-translate-y-1 hover:border-val-text/15"
                        key={tier.tier}
                        style={{ borderColor: tier.color ? `#${tier.color.slice(0,6)}` : undefined }}
                      >
                        {tier.largeIcon && <img src={tier.largeIcon} alt={tier.tierName} className="w-[72px] h-[72px] mx-auto mb-3 object-contain" />}
                        <p className="font-teko text-base font-semibold tracking-[2px] uppercase">{tier.tierName}</p>
                      </div>
                    ))
                  }
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Ranks
