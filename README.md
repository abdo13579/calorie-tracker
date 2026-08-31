# 🔥 Calorie Tracker

A modern, fast, and responsive full-stack calorie tracking application built with **React 19**, **Vite 8**, **Express**, and **SQLite**. Search thousands of food items with live **USDA FoodData Central API** autocomplete, calculate calories automatically based on weight in grams, manage records with full CRUD operations, and run seamlessly either connected to a backend or fully offline via `localStorage`.

---

## ✨ Features

- **🔍 Live USDA Food Search & Autocomplete**: Search the official USDA FoodData Central database with debounced suggestions showing food descriptions, brands, and calorie density per 100g.
- **⚖️ Automatic Grams-Based Calorie Calculation**: Enter weight in grams (defaults to 100g) to automatically compute total calories (`kcal/100g × grams ÷ 100`).
- **✏️ Full CRUD Record Management**: Create, read, update, and delete food entries with instant UI updates and detailed views.
- **💾 Dual Data Strategy (Backend + LocalStorage)**: Automatically syncs with the Express backend if available, or seamlessly falls back to browser `localStorage` when deployed standalone (e.g. on Cloudflare Pages) or offline.
- **🛡️ Resilient UI with Error Boundaries**: Robust React error boundaries prevent entire application crashes in the event of unexpected runtime issues.
- **📝 Meal Logging**: Log meals categorized as Breakfast, Lunch, Dinner, or Snack with custom dates and descriptions.
- **📅 Date-Based Filtering & Daily Summaries**: Filter logged records by specific date to monitor daily calorie consumption and track progress.
- **⚡ Quick Calorie Adjustments**: Click directly on calorie badges within records to increment counts quickly.
- **🪟 Interactive Modal Dialogs**: Accessible modal forms for adding new records cleanly without cluttering the main dashboard.
- **⚡ React 19 & React Compiler**: Powered by React 19 and the React Compiler (`babel-plugin-react-compiler`) with Vite for automated memoization and blazing performance.
- **🎨 Modular Dark UI**: Scoped CSS Modules with custom theme variables, responsive design, and smooth transitions.

---

## 🛠️ Tech Stack

### Frontend (`packages/client`)

- **Framework:** [React 19](https://react.dev/)
- **Routing:** [React Router v7](https://reactrouter.com/)
- **Build Tool:** [Vite 8](https://vite.dev/)
- **Optimization:** [React Compiler](https://react.dev/learn/react-compiler)
- **Styling:** CSS Modules & Scoped CSS
- **State Management:** React Context (`AppContext`)
- **API Integration:** [USDA FoodData Central API](https://fdc.nal.usda.gov/)

### Backend (`packages/server`)

- **Server:** [Express](https://expressjs.com/)
- **Database:** [SQLite3](https://www.sqlite.org/) (configurable in-memory `:memory:` or file-based persistence via `DB_PATH`)
- **CORS & Middleware:** `cors`, `body-parser`, `dotenv`
- **Validation:** Strict payload validation for dates, meal types, and calorie values

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
│   │   │   │   ├── calorieRecordSection/ # Record listing, date filter & item components
│   │   │   │   │   ├── CalorieRecord.jsx
│   │   │   │   │   ├── CalorieRecord.module.css
│   │   │   │   │   ├── CalorieRecordDate.jsx
│   │   │   │   │   ├── ListingSection.jsx
│   │   │   │   │   └── RecordList.jsx
│   │   │   │   ├── common/              # Shared UI components
│   │   │   │   │   ├── ErrorBoundary.jsx    # Component error boundary
│   │   │   │   │   ├── FormInput.jsx        # Reusable form field
│   │   │   │   │   ├── MealSelect.jsx       # Meal category selector
│   │   │   │   │   ├── Modal.jsx            # Accessible dialog modal
│   │   │   │   │   ├── SideNav.jsx          # App navigation bar
│   │   │   │   │   └── StyledRecordCell.jsx # Styled record item card
│   │   │   │   └── edit/
│   │   │   │       ├── CalorieRecordForm.jsx # Add record form with grams & calculation logic
│   │   │   │       ├── FoodAutocomplete.jsx  # USDA live search dropdown
│   │   │   │       └── FoodAutocomplete.module.css
│   │   │   ├── pages/                   # TrackApp, Details, Landing, Error pages
│   │   │   │   ├── Detailes.jsx
│   │   │   │   ├── ErrorPage.jsx
│   │   │   │   ├── LandingPage.jsx
│   │   │   │   ├── PageLayout.jsx
│   │   │   │   └── TrackApp.jsx
│   │   │   ├── services/
│   │   │   │   ├── recordsApi.js        # Records API client & localStorage dual-sync
│   │   │   │   └── usdaApi.js           # USDA API client & nutrient calculation
│   │   │   ├── AppContext.jsx           # Global state provider (CRUD & sync)
│   │   │   ├── app-context.js           # React Context definition
│   │   │   ├── App.jsx                  # Root router configuration
│   │   │   └── main.jsx                 # Client entry point
│   │   ├── .env.example                 # Example frontend environment variables
│   │   ├── package.json
│   │   └── vite.config.js
│   │
│   └── server/                          # Express backend
│       ├── data-generator.js            # Sample data seeder for 60-day history
│       ├── server.js                    # Express API endpoints & SQLite DB
│       ├── .env                         # Server environment configuration
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

Clone the repository and install all dependencies across the monorepo workspace:

```bash
git clone https://github.com/abdo13579/calorie-tracker.git
cd calorie-tracker
npm run install-all
```

### 2. Environment Setup (Optional)

The application works out-of-the-box using USDA's public `DEMO_KEY` and automatic `localStorage` fallback. To configure custom keys or a custom backend URL:

#### Frontend (`packages/client/.env`)

1. Copy the example file in `packages/client`:
   ```bash
   cp packages/client/.env.example packages/client/.env
   ```
2. Configure optional environment variables:

   ```env
   # Optional: Free USDA API Key (from https://fdc.nal.usda.gov/api-key-signup.html)
   VITE_USDA_API_KEY=your_actual_usda_api_key_here

   # Optional: Custom Backend API URL (falls back to localStorage if empty or offline)
   VITE_API_URL=http://localhost:3000
   ```

#### Backend (`packages/server/.env`)

```env
PORT=3000
DOMAIN_WHITELIST=["http://localhost:5173"]
# Optional: Set file path for persistent SQLite database (defaults to ":memory:")
# DB_PATH=./records.db
```

### 3. Running Locally

Start both the client and server concurrently from the root directory:

```bash
npm start
```

Or start individual services independently:

- **Client only:** `npm run start:client` (Runs on `http://localhost:5173`)
- **Server only:** `npm run start:server` (Runs on `http://localhost:3000`)

---

## ☁️ Deployment on Cloudflare Pages

The client is optimized for static hosting on **Cloudflare Pages**:

1. In the [Cloudflare Dashboard](https://dash.cloudflare.com/), navigate to **Workers & Pages** &rarr; **Create application** &rarr; **Pages** &rarr; **Connect to Git**.
2. Select your repository (`calorie-tracker`).
3. Set the build configuration:
   - **Framework preset:** `Vite` (or `None`)
   - **Build command:** `npm run build`
   - **Build output directory:** `packages/client/dist`
   - **Environment variables (Optional):** Add `VITE_USDA_API_KEY` or `VITE_API_URL`
4. Click **Save and Deploy**. Cloudflare will deploy your application with full client-side routing support via [`_redirects`](packages/client/public/_redirects).

---

## 🔌 API Reference (Backend)

| Method   | Endpoint       | Description                    | Payload / Query                     |
| -------- | -------------- | ------------------------------ | ----------------------------------- |
| `GET`    | `/records`     | List all records               | Optional `?date=YYYY-MM-DD`         |
| `GET`    | `/records/:id` | Get details of a single record | N/A                                 |
| `POST`   | `/records`     | Create a new food record       | `{ r_date, r_meal, r_food, r_cal }` |
| `PUT`    | `/records/:id` | Update an existing record      | `{ r_date, r_meal, r_food, r_cal }` |
| `DELETE` | `/records/:id` | Delete a record by ID          | N/A                                 |

---

## 📜 Available Scripts

| Command                | Description                                                           |
| ---------------------- | --------------------------------------------------------------------- |
| `npm start`            | Runs both client and server concurrently using `concurrently`         |
| `npm run start:client` | Starts the Vite development server for the client package             |
| `npm run start:server` | Starts the Express backend server with SQLite                         |
| `npm run build`        | Builds the client application for production (`packages/client/dist`) |
| `npm run install-all`  | Installs dependencies across all workspace packages via Lerna         |

---

## 📄 License

This project is created for educational and practice purposes.
