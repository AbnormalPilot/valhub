import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Home from './pages/Home'
import Agents from './pages/Agents'
import Maps from './pages/Maps'
import Weapons from './pages/Weapons'
import Ranks from './pages/Ranks'

function App() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('valorant-favs')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('valorant-favs', JSON.stringify(favorites))
  }, [favorites])

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(f => f !== id))
    } else {
      setFavorites([...favorites, id])
    }
  }

  const isFavorited = (id) => favorites.includes(id)

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1500)
  }, [])

const [theme, setTheme] = useState(() => {
    return localStorage.getItem('valorant-theme') || 'dark'
  })

  useEffect(() => {
    localStorage.setItem('valorant-theme', theme)
    if (theme === 'light') {
      document.body.classList.add('light-mode')
    } else {
      document.body.classList.remove('light-mode')
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return 'active'
    if (path !== '/' && location.pathname.startsWith(path)) return 'active'
    return ''
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-val-dark flex items-center justify-center z-[9999] flex-col gap-4">
        <div className="loading-bar"></div>
        <div className="font-teko text-xl tracking-[4px] text-val-muted">LOADING // VALORANT</div>
      </div>
    )
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-10 h-[70px] bg-val-dark/90 backdrop-blur-[12px] border-b border-val-text/8 max-md:px-5">
        <Link to="/" className="font-teko text-[2rem] font-bold tracking-[2px] cursor-pointer">
          <span className="text-val-red">VAL</span><span className="text-val-text">HUB</span>
        </Link>

<button className="hidden max-md:flex flex-col gap-[5px] cursor-pointer bg-transparent border-none p-[5px]" onClick={() => setMenuOpen(!menuOpen)}>
            <span className="w-6 h-0.5 bg-val-text transition-all duration-300"></span>
            <span className="w-6 h-0.5 bg-val-text transition-all duration-300"></span>
            <span className="w-6 h-0.5 bg-val-text transition-all duration-300"></span>
          </button>

        <ul className={`nav-links ${menuOpen ? 'show' : ''}`}>
          <li><Link to="/" className={`nav-link ${isActive('/')}`}>HOME</Link></li>
          <li><Link to="/agents" className={`nav-link ${isActive('/agents')}`}>AGENTS</Link></li>
          <li><Link to="/maps" className={`nav-link ${isActive('/maps')}`}>MAPS</Link></li>
          <li><Link to="/weapons" className={`nav-link ${isActive('/weapons')}`}>WEAPONS</Link></li>
          <li><Link to="/ranks" className={`nav-link ${isActive('/ranks')}`}>RANKS</Link></li>
          <li>
            <button
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-val-card border border-val-text/8 text-val-text cursor-pointer transition-all duration-300 hover:border-val-red hover:text-val-red"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.95 16.95l.707.707M7.05 7.05l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Home favorites={favorites} toggleFavorite={toggleFavorite} isFavorited={isFavorited} />} />
        <Route path="/agents" element={<Agents favorites={favorites} toggleFavorite={toggleFavorite} isFavorited={isFavorited} />} />
        <Route path="/maps" element={<Maps />} />
        <Route path="/weapons" element={<Weapons favorites={favorites} toggleFavorite={toggleFavorite} isFavorited={isFavorited} />} />
        <Route path="/ranks" element={<Ranks />} />
      </Routes>

      <footer className="text-center py-10 px-5 border-t border-val-text/8 text-val-dim text-sm">
        <p>VALORANT INFO HUB — Built with ♥ using <a href="https://valorant-api.com" target="_blank" className="text-val-red">valorant-api.com</a></p>
      </footer>
    </>
  )
}

export default App
