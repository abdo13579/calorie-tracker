# 🔥 Calorie Tracker

A modern, fast, and responsive calorie tracking web application built with **React 19**, **Vite**, and **CSS Modules**. Track your daily food intake, categorize meals, filter by date, and manage your nutrition goals with an intuitive interface.

---

## ✨ Features

- **📝 Add Food Records**: Easily log meals with date, meal category (Breakfast, Lunch, Dinner, Snack), food item description, and calorie count.
- **📅 Date-Based Filtering**: Filter your logged records by a specific date to monitor daily intake, with fallback empty states.
- **⚡ Quick Calorie Adjustments**: Click directly on calorie badges within records to quickly increment calorie counts on the fly.
- **🪟 Interactive Modal**: Accessible modal overlay for adding new records without cluttering the main dashboard.
- **⚡ React Compiler Enabled**: Leveraging the latest React Compiler with Vite for optimized component memoization and performance.
- **🎨 Modular Styling**: Scoped styles using CSS Modules and reusable custom styled components.

---

## 🛠️ Tech Stack

- **Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite 8](https://vite.dev/)
- **Optimization:** [React Compiler](https://react.dev/learn/react-compiler) (`babel-plugin-react-compiler`)
- **Styling:** CSS Modules & Vanilla CSS
- **Linting:** [ESLint](https://eslint.org/)

---

## 📁 Project Structure

```text
calorie-tracker/
├── public/                 # Static assets
├── src/
│   ├── assets/             # Images and media files
│   ├── components/
│   │   ├── calorieRecordSection/
│   │   │   ├── CalorieRecord.jsx          # Individual food record row & calorie incrementer
│   │   │   ├── CalorieRecord.module.css
│   │   │   ├── CalorieRecordDate.jsx      # Formatted date badge component
│   │   │   ├── CalorieRecordDate.module.css
│   │   │   ├── ListingSection.jsx         # Section containing date filter & record list
│   │   │   ├── ListingSection.module.css
│   │   │   ├── RecordList.jsx             # List renderer for calorie records
│   │   │   └── RecordList.module.css
│   │   ├── common/
│   │   │   ├── Modal.jsx                  # Reusable popup dialog modal
│   │   │   ├── Modal.module.css
│   │   │   ├── StyledRecordCell.jsx       # Reusable record date container
│   │   │   └── StyledRecordCell.css
│   │   └── edit/
│   │       ├── CalorieRecordForm.jsx      # Input form for adding meals & calories
│   │       └── CalorieRecordForm.module.css
│   ├── App.jsx             # Root application component & state management
│   ├── App.module.css      # App-level layout styles
│   ├── index.css           # Global reset and typography styles
│   └── main.jsx            # Application entry point
├── package.json
└── vite.config.js          # Vite and React Compiler configuration
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js** (v18 or higher recommended) and **npm** installed on your system.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/abdo13579/calorie-tracker
   cd calorie-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

Start the local development server:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### Available Scripts

- `npm run dev` – Starts the development server with Hot Module Replacement (HMR).
- `npm run build` – Bundles the application for production to the `dist` directory.
- `npm run preview` – Serves the production build locally for verification.
- `npm run lint` – Runs ESLint to identify and report code issues.

---

## 📄 License

This project is created for educational and practice purposes as part of a React course.


## Server Documentation

# Calorie Tracker Project

This is a demo react application with a small server to perform fetch requests to perform CRUD operations on in-memory data.

## Setup

- install node

- install project dependencies

```
npm install-all
```

- start client and server

```
npm run start
```

- To close both client and server, hit Ctrl+c

## Front-end

React based project using vite setup.

## Back-end

Small server with in-memory SQLite database that starts with random data for the past 60 days (day in / day out).

## API

- List all: http://localhost:3000/records (GET)
- List for specific date: http://localhost:3000/records?date=2000-2-28 (GET)
- Get specific record: http://localhost:3000/records/:id (GET)
- Create new record: http://localhost:3000/records (POST)
- Update existing record: http://localhost:3000/records/:id (PUT)
- Delete existing record: http://localhost:3000/records/:id (DELETE)

More details can be found in _packages/server/README.md_
