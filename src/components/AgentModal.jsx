function AgentModal({ agent, onClose }) {
  if (!agent) return null

  const colors = agent.backgroundGradientColors || []
  const bg = colors.length >= 2
    ? { background: `linear-gradient(135deg, #${colors[0].slice(0,6)}, #${colors[1].slice(0,6)})` }
    : {}

  return (
    <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-[8px] flex items-center justify-center p-5 animate-fade-in" onClick={onClose}>
      <div className="bg-val-modal border border-val-text/15 max-w-[650px] w-full max-h-[85vh] overflow-y-auto relative clip-corner-lg animate-modal-pop" onClick={e => e.stopPropagation()}>
        <button className="absolute top-4 right-4 w-9 h-9 bg-val-red/15 border border-val-red text-val-red text-xl flex items-center justify-center cursor-pointer z-10 transition-all duration-300 hover:bg-val-red hover:text-white" onClick={onClose}>✕</button>

        <div className="relative h-[300px] overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 opacity-20" style={bg}></div>
          {agent.fullPortrait && (
            <img src={agent.fullPortrait} alt={agent.displayName} className="relative z-[1] h-[280px] object-contain" />
          )}
        </div>

        <div className="p-[30px]">
          <div className="font-teko text-sm tracking-[4px] text-val-red uppercase mb-1.5 flex items-center gap-2">
            {agent.role?.displayIcon && <img src={agent.role.displayIcon} className="w-[18px] h-[18px]" />}
            {agent.role?.displayName}
          </div>
          <h2 className="font-teko text-5xl font-bold tracking-[4px] uppercase leading-none mb-4">{agent.displayName}</h2>
          <p className="text-val-muted text-[0.95rem] leading-[1.7] mb-6">{agent.description}</p>

          <h3 className="font-teko text-[1.4rem] tracking-[3px] mb-4">ABILITIES</h3>
          {agent.abilities && agent.abilities
            .filter(a => a.displayName)
            .map((ability, i) => (
              <div className="flex gap-3.5 p-3.5 bg-white/[0.03] border border-val-text/8 rounded mb-3 transition-colors duration-300 hover:border-val-text/15" key={i}>
                {ability.displayIcon && <img src={ability.displayIcon} alt="" className="w-11 h-11 object-contain brightness-0 invert shrink-0" />}
                <div>
                  <div className="font-teko text-lg font-semibold tracking-[2px] uppercase">{ability.displayName}</div>
                  <div className="text-[0.7rem] tracking-[2px] text-val-red uppercase mt-[2px] mb-1.5">{ability.slot}</div>
                  <div className="text-sm text-val-muted leading-[1.5]">{ability.description}</div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default AgentModal
