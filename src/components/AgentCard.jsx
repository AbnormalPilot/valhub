function AgentCard({ agent, onClick, isFavorited, toggleFavorite }) {
  const colors = agent.backgroundGradientColors || []
  const gradientStyle = colors.length >= 2
    ? { background: `linear-gradient(135deg, #${colors[0].slice(0,6)}, #${colors[1].slice(0,6)})` }
    : { background: '#1c2b3a' }

  const handleFav = (e) => {
    e.stopPropagation()
    if (toggleFavorite) toggleFavorite(agent.uuid)
  }

  const favorited = isFavorited ? isFavorited(agent.uuid) : false

  return (
    <div className="group relative bg-val-card border border-val-text/8 overflow-hidden cursor-pointer transition-all duration-300 clip-corner hover:-translate-y-1.5 hover:border-val-red hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)]" onClick={() => onClick(agent)}>
      {toggleFavorite && (
        <button className={`absolute top-2.5 right-2.5 z-[5] text-xl cursor-pointer bg-black/50 border-none rounded-full w-9 h-9 flex items-center justify-center transition-all duration-300 hover:scale-[1.15] ${favorited ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`} onClick={handleFav}>
          {favorited ? '❤️' : '🤍'}
        </button>
      )}
      <div className="relative h-[260px] overflow-hidden flex items-center justify-center max-md:h-[200px] max-[480px]:h-[160px]">
        <div className="absolute inset-0 opacity-15 transition-opacity duration-300 group-hover:opacity-25" style={gradientStyle}></div>
        {agent.displayIcon && <img src={agent.displayIcon} alt={agent.displayName} className="relative z-[1] h-[240px] object-contain transition-transform duration-300 group-hover:scale-105 max-md:h-[180px] max-[480px]:h-[140px]" />}
      </div>
      <div className="p-4">
        <div className="font-teko text-xs tracking-[3px] text-val-red uppercase mb-1">{agent.role?.displayName || 'Unknown'}</div>
        <div className="font-teko text-[1.6rem] font-semibold tracking-[2px] uppercase max-[480px]:text-[1.2rem]">{agent.displayName}</div>
      </div>
    </div>
  )
}

export default AgentCard
