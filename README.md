# 🔥 Calorie Tracker

A modern, fast, and responsive full-stack calorie tracking application built with **React 19**, **Vite**, **Express**, and **SQLite**. Search thousands of food items with live **USDA FoodData Central API** autocomplete, calculate calories automatically based on weight in grams, or enter custom entries with ease.

---

## ✨ Features

- **🔍 Live USDA Food Search & Autocomplete**: Search the official USDA FoodData Central database with debounced suggestions showing food descriptions, brands, and calorie density per 100g.
- **⚖️ Automatic Grams-Based Calorie Calculation**: Enter weight in grams (defaults to 100g) to automatically compute total calories (`kcal/100g × grams ÷ 100`).
- **✏️ Manual Calorie Fallback & Overrides**: If a custom food isn't in the database or requires custom calories, the calorie field remains open and fully editable at all times.
- **💾 Dual Data Strategy (Backend + LocalStorage)**: Automatically syncs with the Express backend if available, or seamlessly falls back to browser `localStorage` when deployed standalone (e.g. on Cloudflare Pages) or offline.
- **📝 Meal Logging**: Log meals categorized as Breakfast, Lunch, Dinner, or Snack with custom dates and descriptions.
- **📅 Date-Based Filtering & Daily Summaries**: Filter logged records by specific date to monitor daily calorie consumption and track progress.
- **⚡ Quick Calorie Adjustments**: Click directly on calorie badges within records to increment counts quickly.
- **🪟 Interactive Modal**: Accessible modal dialog for adding new records without cluttering the main dashboard.
- **⚡ React 19 & React Compiler**: Powered by React 19 and the React Compiler (`babel-plugin-react-compiler`) with Vite for automated memoization and high performance.
- **🎨 Modular Dark UI**: Styled using scoped CSS Modules with custom theme variables.

---

## 🛠️ Tech Stack

### Frontend (`packages/client`)
- **Framework:** [React 19](https://react.dev/)
- **Routing:** [React Router v7](https://reactrouter.com/)
- **Build Tool:** [Vite 8](https://vite.dev/)
- **Optimization:** [React Compiler](https://react.dev/learn/react-compiler)
- **Styling:** CSS Modules & Vanilla CSS
- **API Integration:** [USDA FoodData Central API](https://fdc.nal.usda.gov/)

### Backend (`packages/server`)
- **Server:** [Express](https://expressjs.com/)
- **Database:** In-memory [SQLite3](https://www.sqlite.org/) with seed data generator
- **CORS & Middleware:** `cors`, `body-parser`

---

## 📁 Project Structure

```text
calorie-tracker/
├── packages/
│   ├── client/                          # React frontend
│   │   ├── public/
│   │   │   └── _redirects               # SPA routing fallback for Cloudflare Pages
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── calorieRecordSection/ # Record listing & date filter components
│   │   │   │   ├── common/              # Reusable FormInput, Modal, SideNav
│   │   │   │   └── edit/
│   │   │   │       ├── CalorieRecordForm.jsx   # Form with grams & calculation logic
│   │   │   │       ├── FoodAutocomplete.jsx    # USDA live search dropdown
│   │   │   │       └── FoodAutocomplete.module.css
│   │   │   ├── pages/                   # TrackApp, Details, Landing, Error pages
│   │   │   ├── services/
│   │   │   │   ├── recordsApi.js        # Records API client & localStorage fallback
│   │   │   │   └── usdaApi.js           # USDA API client & nutrient parsers
│   │   │   ├── AppContext.jsx           # Global state context
│   │   │   └── main.jsx                 # Client entry point
│   │   ├── .env.example                 # Example frontend environment variables
│   │   ├── .gitignore                   # Client-level gitignore
│   │   ├── package.json
│   │   └── vite.config.js
│   │
│   └── server/                          # Express backend
│       ├── data-generator.js            # Sample data seeder
│       ├── server.js                    # Express API endpoints & SQLite in-memory DB
│       └── package.json
│
├── .gitignore
├── lerna.json
├── package.json                         # Root workspace configuration
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)

### 1. Installation

Clone the repository and install all dependencies across workspace packages:

```bash
git clone https://github.com/abdo13579/calorie-tracker
cd calorie-tracker
npm run install-all
```

### 2. Environment Setup (Optional)

The application works out-of-the-box using USDA's public `DEMO_KEY` and automatic `localStorage` fallback. To configure custom keys or a custom backend URL:

1. Copy the example file in `packages/client`:
   ```bash
   cp packages/client/.env.example packages/client/.env
   ```
2. Set your environment variables in `packages/client/.env`:
   ```env
   # Optional: Free USDA API Key (from https://fdc.nal.usda.gov/api-key-signup.html)
   VITE_USDA_API_KEY=your_actual_usda_api_key_here

   # Optional: Custom Backend API URL (falls back to localStorage if empty or offline)
   VITE_API_URL=https://your-backend-api.com
   ```

### 3. Running Locally

Start both the client and server concurrently from the root directory:

```bash
npm start
```

- **Frontend:** `http://localhost:5173`
- **Backend API:** `http://localhost:3000`

---

## ☁️ Deployment on Cloudflare Pages

1. In the [Cloudflare Dashboard](https://dash.cloudflare.com/), navigate to **Workers & Pages** &rarr; **Create application** &rarr; **Pages** &rarr; **Connect to Git**.
2. Select your repository (`calorie-tracker`).
3. Set the build configuration:
   - **Framework preset:** `Vite` (or `None`)
   - **Build command:** `npm run build`
   - **Build output directory:** `packages/client/dist`
   - **Environment variables (Optional):** Add `VITE_USDA_API_KEY` or `VITE_API_URL`
4. Click **Save and Deploy**. Cloudflare will deploy your application with full client-side routing support via [`_redirects`](file:///home/abdoalhythm/Documents/Projects/advanced%20react/calorie-tracker/packages/client/public/_redirects).

---

## 🔌 API Reference (Backend)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/records` | List all records (supports `?date=YYYY-MM-DD` query) |
| `GET` | `/records/:id` | Get details of a single record by ID |
| `POST` | `/records` | Create a new food record (`{ r_date, r_meal, r_food, r_cal }`) |
| `PUT` | `/records/:id` | Update an existing record |
| `DELETE` | `/records/:id` | Delete a record |

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm start` | Runs both client and server concurrently |
| `npm run client` | Runs the client development server (`vite`) |
| `npm run server` | Runs the Express API server |
| `npm run build` | Builds the client production bundle |
| `npm run lint` | Runs ESLint across the codebase |

---

## 📄 License

This project is created for educational and practice purposes.
