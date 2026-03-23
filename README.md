# VALORANT // INFO HUB

A web application that serves as a companion hub for the game VALORANT, allowing users to explore agents, maps, weapons, and competitive ranks all in one place.

<p align="center">
  <img src="https://media.valorant-api.com/agents/e370fa57-4757-3604-3648-499e1f642d3f/fullportrait.png" width="120" />
  <img src="https://media.valorant-api.com/agents/8e253930-4c05-31dd-1b6c-968525494517/fullportrait.png" width="120" />
  <img src="https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/fullportrait.png" width="120" />
  <img src="https://media.valorant-api.com/agents/f94c3b30-42be-e959-889c-5aa313dba261/fullportrait.png" width="120" />
  <img src="https://media.valorant-api.com/agents/a3bfb853-43b2-7238-a4f1-ad90e9e46bcc/fullportrait.png" width="120" />
</p>

## Purpose

VALORANT has a large roster of agents, a growing map pool, and a wide arsenal of weapons — but there is no single lightweight place to browse and compare everything at a glance. This project solves that by pulling live data from a public API and presenting it in a clean, searchable, and filterable interface. It is built as a single-page application using modern frontend technologies.

## API

This project uses the **[valorant-api.com](https://valorant-api.com)** public REST API. It is free, requires no authentication or API key, and returns JSON data for all in-game content.

### Endpoints used

| Endpoint | Purpose |
|----------|---------|
| `GET /v1/agents?isPlayableCharacter=true` | Fetch all playable agents with abilities, portraits, and role info |
| `GET /v1/maps` | Fetch all maps with splash art, coordinates, descriptions, and minimaps |
| `GET /v1/weapons` | Fetch all weapons with stats, damage ranges, costs, and skin previews |
| `GET /v1/competitivetiers` | Fetch all competitive rank tiers with icons and division groupings |

### Example response (agent)

```json
{
  "uuid": "e370fa57-4757-3604-3648-499e1f642d3f",
  "displayName": "Gekko",
  "description": "Gekko the Angeleno leads a tight-knit crew of...",
  "role": { "displayName": "Initiator" },
  "abilities": [...],
  "displayIcon": "https://media.valorant-api.com/agents/.../displayicon.png",
  "fullPortrait": "https://media.valorant-api.com/agents/.../fullportrait.png"
}
```

## Planned Features

### Search
- Real-time text search across agents by name
- Real-time text search across weapons by name
- Real-time text search across maps by name

### Filtering
- Filter agents by role (Duelist, Initiator, Controller, Sentinel)
- Filter weapons by category (Rifle, SMG, Shotgun, Sniper, Heavy, Sidearm)
- Filter agents by favorites (saved to localStorage)

### Sorting
- Sort weapons by name, cost, fire rate, body damage, or magazine size
- Toggle ascending/descending sort direction

### Detail Views
- Agent modal with full portrait, description, role, and all four abilities
- Weapon modal with full stats grid, damage range table, and skin gallery
- Map modal with splash image, coordinates, narrative description, and minimap
- Rank page with all tiers grouped by division (Iron through Radiant)

### Other
- Favorites system for agents and weapons, persisted in localStorage
- Animated loading screen on initial visit
- Responsive layout from desktop down to mobile (480px)
- Hero banner on the home page with dynamic agent portraits from the API
- Stats overview showing total counts of agents, maps, and weapons

## Technologies

| Technology | Version | Role |
|------------|---------|------|
| React | 19 | UI framework and component architecture |
| React Router | 7 | Client-side routing between pages |
| Tailwind CSS | 4 | Utility-first styling with custom theme |
| Vite | 8 | Development server and production bundler |
| ESLint | 9 | Code linting and quality checks |

## Project Structure

```
src/
├── components/
│   ├── AgentCard.jsx       # Reusable agent card with gradient, image, and fav button
│   └── AgentModal.jsx      # Detail modal for a single agent and their abilities
├── pages/
│   ├── Home.jsx            # Hero banner, stats row, featured agents
│   ├── Agents.jsx          # Agent grid with search, role filter, favorites filter
│   ├── Maps.jsx            # Map grid with search, detail modal with minimap
│   ├── Weapons.jsx         # Weapon grid with search, category filter, sorting, detail modal
│   └── Ranks.jsx           # Competitive tiers grouped by division
├── App.jsx                 # Root layout with navbar, routing, and footer
├── main.jsx                # Entry point, renders App inside BrowserRouter
└── index.css               # Tailwind config, custom utilities, and base styles
```

## Setup and Run

```bash
# clone the repository
git clone https://github.com/AbnormalPilot/valhub.git
cd valorant

# install dependencies
npm install

# start the development server
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite dev server with hot module replacement |
| `npm run build` | Create an optimized production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint to check for code issues |
