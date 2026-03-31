import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AgentCard from '../components/AgentCard'

function Home({ favorites, toggleFavorite, isFavorited }) {
  const [agents, setAgents] = useState([])
  const [maps, setMaps] = useState([])
  const [weapons, setWeapons] = useState([])

  useEffect(() => {
    fetch('https://valorant-api.com/v1/agents?isPlayableCharacter=true')
      .then(res => res.json())
      .then(data => setAgents(data.data))
      .catch(err => console.log(err))

    fetch('https://valorant-api.com/v1/maps')
      .then(res => res.json())
      .then(data => setMaps(data.data))
      .catch(err => console.log(err))

    fetch('https://valorant-api.com/v1/weapons')
      .then(res => res.json())
      .then(data => setWeapons(data.data))
      .catch(err => console.log(err))
  }, [])

  const getFeatured = () => {
    if (agents.length === 0) return []
    let shuffled = [...agents].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, 4)
  }

  const featured = getFeatured()

  return (
    <div>
      <div className="relative min-h-screen flex items-end justify-start overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center h-full overflow-hidden">
          {agents.slice(0, 7).map(agent => (
            <img
              key={agent.uuid}
              src={agent.fullPortrait}
              alt={agent.displayName}
              className="hero-portrait h-[85%] max-w-none object-contain opacity-50 mx-[-350px] brightness-[0.7] shrink-0"
            />
          ))}
        </div>
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to top, #0f1923 0%, rgba(15, 25, 35, 0.4) 50%, transparent 100%), linear-gradient(to right, rgba(15, 25, 35, 0.7) 0%, transparent 50%)'
        }}></div>
        <div className="relative z-[2] text-left px-[60px] pb-20 max-md:px-5 max-md:pb-[60px]">
          <p className="font-teko text-xl tracking-[6px] text-val-red mb-3">DEFY THE LIMITS</p>
          <h1 className="font-teko text-[6rem] font-bold leading-[0.95] tracking-[4px] mb-5 max-lg:text-[4.5rem] max-md:text-[3.5rem] max-[480px]:text-[2.5rem]">
            VALORANT<br />
            <span className="text-val-red text-[4.5rem] max-lg:text-[3.5rem] max-md:text-[2.5rem] max-[480px]:text-[2rem]">INFO HUB</span>
          </h1>
          <Link to="/agents" className="inline-block font-teko text-[1.15rem] font-semibold tracking-[3px] py-3.5 px-10 bg-val-red text-white border-none cursor-pointer transition-all duration-300 uppercase clip-corner-md hover:bg-val-red-dark hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(255,70,85,0.3)]">
            EXPLORE AGENTS
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-5 max-w-[1400px] mx-auto mb-[60px] px-10 max-lg:grid-cols-2 max-md:gap-3 max-md:px-5">
        {[
          { num: agents.length, label: 'AGENTS' },
          { num: maps.length, label: 'MAPS' },
          { num: weapons.length, label: 'WEAPONS' },
          { num: 9, label: 'RANK TIERS' },
        ].map(stat => (
          <div key={stat.label} className="bg-val-card py-[30px] px-5 text-center border border-val-text/8 clip-corner transition-all duration-300 hover:border-val-red hover:-translate-y-1">
            <div className="font-teko text-[3.5rem] font-bold text-val-red leading-none max-md:text-[2.5rem]">{stat.num}</div>
            <div className="font-teko text-base tracking-[4px] text-val-muted mt-2">{stat.label}</div>
          </div>
        ))}
      </div>

      {featured.length > 0 && (
        <div className="max-w-[1400px] mx-auto mb-[60px] px-10 max-md:px-5">
          <h2 className="font-teko text-[2.5rem] font-semibold tracking-[4px] uppercase mb-[30px] text-center">
            FEATURED <span className="text-val-red">AGENTS</span>
          </h2>
          <div className="grid grid-cols-4 gap-5 max-md:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] max-md:gap-3">
            {featured.map(agent => (
              <AgentCard key={agent.uuid} agent={agent} onClick={() => {}} isFavorited={isFavorited} toggleFavorite={toggleFavorite} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
