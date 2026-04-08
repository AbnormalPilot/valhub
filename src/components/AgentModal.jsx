import { useState } from 'react'

function AgentModal({ agent, onClose }) {
  const [copied, setCopied] = useState(false)
  if (!agent) return null

  const handleShare = () => {
    const text = `Check out ${agent.displayName} in VALORANT!\n${window.location.href}`
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const colors = agent.backgroundGradientColors || []
  const bg = colors.length >= 2
    ? { background: `linear-gradient(135deg, #${colors[0].slice(0,6)}, #${colors[1].slice(0,6)})` }
    : {}

  return (
    <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-[8px] flex items-center justify-center p-5 animate-fade-in" onClick={onClose}>
      <div className="bg-val-modal border border-val-text/15 max-w-[650px] w-full max-h-[85vh] overflow-y-auto relative clip-corner-lg animate-modal-pop" onClick={e => e.stopPropagation()}>
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <button 
            className={`h-9 px-4 font-teko text-sm tracking-[2px] border transition-all duration-300 flex items-center gap-2 cursor-pointer ${
              copied 
                ? 'bg-val-green text-val-dark border-val-green ring-4 ring-val-green/20' 
                : 'bg-val-card border-val-text/8 text-val-muted hover:border-val-red hover:text-val-text'
            }`}
            onClick={handleShare}
          >
            {copied ? 'COPIED!' : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                SHARE
              </>
            )}
          </button>
          <button className="w-9 h-9 bg-val-red/15 border border-val-red text-val-red text-xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-val-red hover:text-white" onClick={onClose}>✕</button>
        </div>

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
