import { useState, useEffect } from 'react'
import './index.css'

function App() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('https://valorant-api.com/v1/agents?isPlayableCharacter=true')
      .then(res => res.json())
      .then(json => {
        setData(json.data)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Loading data...</h2>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>Valorant API Data</h1>
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '20px', 
        justifyContent: 'center' 
      }}>
        {data.map(agent => (
          <div key={agent.uuid} style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '15px',
            width: '250px',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <img 
              src={agent.displayIcon} 
              alt={agent.displayName} 
              style={{ width: '100%', height: 'auto' }} 
            />
            <h3 style={{ margin: '15px 0 5px 0' }}>{agent.displayName}</h3>
            <p style={{ margin: '0', fontSize: '14px', color: '#555' }}>
              {agent.role ? agent.role.displayName : 'TBD'}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
