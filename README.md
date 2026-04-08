# VALORANT Info Hub

A multi-page web application built with HTML, CSS, JavaScript, and Tailwind CSS that uses the public VALORANT API to display agents, maps, weapons, and competitive ranks.

## Project Purpose

This project was created to demonstrate:

- API integration using `fetch()`
- dynamic UI rendering with JavaScript
- search, filter, and sort features using array higher-order functions
- responsive web design using Tailwind CSS and custom CSS

## Public API Used

This project uses the free public API from [valorant-api.com](https://valorant-api.com/).

### Endpoints

- `https://valorant-api.com/v1/agents?isPlayableCharacter=true`
- `https://valorant-api.com/v1/maps`
- `https://valorant-api.com/v1/weapons`
- `https://valorant-api.com/v1/competitivetiers`

## Features

- Home page with hero section and live stats
- Agents page with:
  - search by name
  - filter by role
  - sort by name or role
  - favorites saved in `localStorage`
- Maps page with:
  - search by name
  - filter by map type
  - alphabetical sorting
  - detail modal
- Weapons page with:
  - search by name
  - filter by category
  - sorting by name, cost, fire rate, damage, and magazine size
  - favorites saved in `localStorage`
  - detail modal
- Ranks page with competitive tiers grouped by division
- Dark mode / light mode toggle
- Responsive layout for mobile, tablet, and desktop
- Loading and error states for API requests

## Array HOFs Used

The project uses array higher-order functions instead of traditional loops for the required features:

- `map()` for rendering cards and sections
- `filter()` for search and category filtering
- `sort()` for alphabetical and numeric sorting
- `reduce()` for grouping rank tiers
- `find()` for modal item selection

## Tech Stack

- HTML5
- CSS3
- JavaScript (ES Modules)
- [Tailwind CSS CDN](https://tailwindcss.com/)
- VALORANT Public API

## Project Structure

```text
valorant/
├── index.html
├── agents.html
├── maps.html
├── weapons.html
├── ranks.html
├── public/
├── src/
│   ├── index.css
│   ├── assets/
│   └── js/
│       ├── main.js
│       ├── home.js
│       ├── agents.js
│       ├── maps.js
│       ├── weapons.js
│       └── ranks.js
└── README.md
```

## How to Run

Because this is now a plain static project, no build tool is required.

1. Clone the repository.
2. Open the folder in VS Code.
3. Run it with a simple static server such as Live Server.

You can also open `index.html` directly, but using a local server is recommended for a smoother browser experience.

## Milestone Coverage

### Milestone 1
- project idea chosen
- VALORANT public API selected
- README created
- project structure planned

### Milestone 2
- API calls implemented with `fetch()`
- live API data displayed dynamically
- loading states added
- responsive layout completed

### Milestone 3
- search implemented
- filtering implemented
- sorting implemented
- favorites interaction added
- dark/light mode added

### Milestone 4
- codebase cleaned and documented
- ready for deployment on GitHub Pages, Netlify, or Vercel static hosting

## Notes

- Favorites and theme choice are stored with `localStorage`.
- The project uses plain JavaScript modules and does not require React or Vite.
