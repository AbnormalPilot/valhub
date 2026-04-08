import { useState, useEffect } from 'react'
import AgentCard from '../components/AgentCard'
import AgentModal from '../components/AgentModal'

function Agents({ favorites, toggleFavorite, isFavorited }) {
  const [agents, setAgents] = useState([])
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [showFavsOnly, setShowFavsOnly] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState(null)
  const [sortBy, setSortBy] = useState('name')

  useEffect(() => {
    fetch('https://valorant-api.com/v1/agents?isPlayableCharacter=true')
      .then(res => res.json())
      .then(data => {
        setAgents(data.data)
        setLoading(false)
      })
      .catch(err => {
        console.log('error fetching agents:', err)
        setLoading(false)
      })
  }, [])

  const filteredAgents = agents
    .filter(agent => {
      const matchesSearch = agent.displayName.toLowerCase().includes(search.toLowerCase())
      const matchesRole = roleFilter === 'all' || agent.role?.displayName === roleFilter
      const matchesFav = !showFavsOnly || favorites.includes(agent.uuid)
      return matchesSearch && matchesRole && matchesFav
    })
    .sort((a, b) => {
      if (sortBy === 'role') {
        const roleA = a.role?.displayName || ''
        const roleB = b.role?.displayName || ''
        if (roleA !== roleB) return roleA.localeCompare(roleB)
      }
      return a.displayName.localeCompare(b.displayName)
    })

  const favCount = agents.filter(a => favorites.includes(a.uuid)).length

  const roles = ['all', 'Duelist', 'Initiator', 'Controller', 'Sentinel']

  return (
    <div className="pt-[100px] px-10 pb-[60px] max-w-[1400px] mx-auto min-h-screen animate-page-fade max-md:pt-[90px] max-md:px-5 max-md:pb-10">
      <div className="text-center mb-10">
        <h1 className="font-teko text-[4rem] font-bold tracking-[6px] uppercase leading-none mb-2 max-md:text-[2.8rem]">AGENTS</h1>
        <p className="text-val-muted text-base tracking-[1px]">Choose your fighter. Master their abilities.</p>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-8 max-md:flex-col max-md:items-stretch">
        <div className="relative flex-[0_0_280px] max-md:flex-auto">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-val-dim pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search agents..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full py-3 pr-4 pl-[42px] bg-val-card border border-val-text/8 text-val-text text-sm rounded transition-all duration-300 placeholder:text-val-dim focus:border-val-red focus:shadow-[0_0_0_3px_rgba(255,70,85,0.3)] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-2 max-md:justify-center">
          {roles.map(role => (
            <button
              key={role}
              className={`font-teko text-sm tracking-[2px] py-2.5 px-5 cursor-pointer transition-all duration-300 clip-corner-sm max-[480px]:py-2 max-[480px]:px-3 max-[480px]:text-[0.8rem] ${
                roleFilter === role
                  ? 'bg-val-red text-white border border-val-red'
                  : 'text-val-muted bg-val-card border border-val-text/8 hover:text-val-text'
              }`}
              onClick={() => setRoleFilter(role)}
            >
              {role.toUpperCase()}
            </button>
          ))}
          <button
            className={`font-teko text-sm tracking-[2px] py-2.5 px-5 cursor-pointer transition-all duration-300 clip-corner-sm max-[480px]:py-2 max-[480px]:px-3 max-[480px]:text-[0.8rem] ${
              showFavsOnly
                ? 'bg-val-red text-white border border-val-red'
                : 'text-val-muted bg-val-card border border-val-text/8 hover:text-val-text'
            }`}
            onClick={() => setShowFavsOnly(!showFavsOnly)}
          >
            ❤️ FAVORITES ({favCount})
          </button>

          <div className="flex items-center gap-2.5 ml-auto max-md:ml-0 max-md:justify-center">
            <label className="font-teko text-sm tracking-[2px] text-val-muted">SORT BY:</label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="py-2.5 px-3.5 bg-val-card border border-val-text/8 text-val-text font-teko text-sm rounded cursor-pointer [&_option]:bg-val-modal focus:outline-none focus:border-val-red"
            >
              <option value="name">NAME</option>
              <option value="role">ROLE</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-15 px-5 text-val-dim">
          <p className="font-teko text-[1.4rem] tracking-[3px] mt-2.5">Loading agents...</p>
        </div>
      ) : filteredAgents.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5 max-md:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] max-md:gap-3 max-[480px]:grid-cols-2 max-[480px]:gap-2.5">
          {filteredAgents.map(agent => (
            <AgentCard
              key={agent.uuid}
              agent={agent}
              onClick={(a) => setSelectedAgent(a)}
              isFavorited={isFavorited}
              toggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-15 px-5 text-val-dim">
          <div className="text-5xl opacity-50">:/</div>
          <p className="font-teko text-[1.4rem] tracking-[3px] mt-2.5">{showFavsOnly ? 'NO FAVORITE AGENTS YET' : 'NO AGENTS FOUND'}</p>
        </div>
      )}

      {selectedAgent && (
        <AgentModal agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
      )}
    </div>
  )
}

export default Agents
