require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const app = express();
const generateRecords = require("./data-generator");

// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.json());

// Database setup in memory
// Database path: defaults to in-memory. Set DB_PATH env var for file-based persistence.
const dbPath = process.env.DB_PATH || ":memory:";
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log(`Connected to SQLite database (${dbPath === ":memory:" ? "in-memory" : dbPath}).`);
});

// Create table and populate with initial data
const setupDb = () => {
  db.run(
    "CREATE TABLE calorie_records (id INTEGER PRIMARY KEY AUTOINCREMENT, r_date text, r_meal text, r_food text, r_cal integer)",
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Table created.");
        console.log("Generating random records");
        const data = generateRecords();
        console.log("Inserting random data into table");
        let stmt = db.prepare(
          "INSERT INTO calorie_records (r_date, r_meal, r_food, r_cal) VALUES (?, ?, ?, ?)"
        );
        for (let i = 0; i < data.length; i++) {
          const { date, meal, content, calories } = data[i];
          stmt.run(date, meal, content, calories);
        }
        stmt.finalize();
        console.log("Records inserted successfully.");
      }
    }
  );
};

setupDb();

let domainWhiteList;
try {
  domainWhiteList = JSON.parse(process.env.DOMAIN_WHITELIST || '[]');
} catch (err) {
  console.warn('Invalid DOMAIN_WHITELIST env var, defaulting to allow all localhost origins');
  domainWhiteList = ['http://localhost:5173', 'http://localhost:3000'];
}
console.log('CORS whitelist:', domainWhiteList);

// Allow receiving requests from React server
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || domainWhiteList.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

// Server start and endpoints
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

/**
 * List API; lists all stored records.
 * If date query parameter is provided,
 * it returns records for the given date only
 * Example: GET /records?date=2023-1-7
 */
app.get("/records", (req, res) => {
  console.log("Received 'List' request");
  let sql;
  if (req.query.date) {
    sql = `SELECT * FROM calorie_records WHERE r_date = ?`;
    db.all(sql, [req.query.date], (err, rows) => {
      if (err) {
        res.status(500).send(err.message);
        return console.error(err.message);
      }
      res.json({ result: rows });
    });
  } else {
    sql = "SELECT * FROM calorie_records";
    db.all(sql, [], (err, rows) => {
      if (err) {
        res.status(500).send(err.message);
        return console.error(err.message);
      }
      res.json({ result: rows });
    });
  }
});

/**
 * Get single record API. It accepts 'id' as a parameter.
 * Returns the record for the given ID or '404' not found error if ID doesn't exist
 * Example: GET /records/300 => returns the details of the record with id == 300
 */
app.get("/records/:id", (req, res) => {
  console.log("Received 'Detail' request");
  const { id } = req.params;

  let sql = "SELECT * FROM calorie_records WHERE id = ?";
  db.get(sql, [id], (err, row) => {
    if (err) {
      res.status(500).send(err.message);
      return console.error(err.message);
    }
    // If the query found a record, row will be an object representing that record,
    // otherwise it will be undefined.
    if (row) {
      res.send(row);
    } else {
      res.status(404).send("Record not found");
    }
  });
});

/**
 * Creates new record. The record is passed into the requesy body.
 * You need to pass 'date', 'meal', 'content' and 'calories' in order
 * for request to succeed.
 * Example POST /records (with request body filled)
 */
app.post("/records", (req, res) => {
  console.log("Received 'Create' request");
  const { r_date, r_meal, r_food, r_cal } = req.body;

  // Input validation
  if (!r_date || !r_meal || !r_food || r_cal == null) {
    return res.status(400).json({ error: "Please provide all record fields: r_date, r_meal, r_food, r_cal." });
  }
  if (typeof r_cal !== 'number' || !Number.isFinite(r_cal) || r_cal < 0) {
    return res.status(400).json({ error: "r_cal must be a non-negative finite number." });
  }
  const validMeals = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'breakfast', 'lunch', 'dinner', 'snack'];
  if (!validMeals.includes(r_meal)) {
    return res.status(400).json({ error: `r_meal must be one of: ${validMeals.join(', ')}` });
  }
  if (typeof r_date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(r_date)) {
    return res.status(400).json({ error: "r_date must be a string in YYYY-MM-DD format." });
  }
  if (typeof r_food !== 'string' || r_food.length > 500) {
    return res.status(400).json({ error: "r_food must be a string with max 500 characters." });
  }

  let sql =
    "INSERT INTO calorie_records (r_date, r_meal, r_food, r_cal) VALUES (?, ?, ?, ?)";
  db.run(sql, [r_date, r_meal, r_food, r_cal], function (err) {
    if (err) {
      res.status(500).send(err.message);
      return console.error(err.message);
    }
    res.status(200).send({ message: "Record inserted.", id: this.lastID });
  });
});

/**
 * Updates the record with a given id
 * 'id' is passed as a request parameter.
 * You need to pass all properties of the record: date, meal, content & calories
 * in order for the request to succeed.
 * Example: PUT /records/300 (with request body filled)
 */
app.put("/records/:id", (req, res) => {
  console.log("Received 'Update' request");
  const { r_date, r_meal, r_food, r_cal } = req.body;
  const { id } = req.params;

  // Input validation
  if (!r_date || !r_meal || !r_food || r_cal == null) {
    return res.status(400).json({ error: "Please provide all record fields: r_date, r_meal, r_food, r_cal." });
  }
  if (typeof r_cal !== 'number' || !Number.isFinite(r_cal) || r_cal < 0) {
    return res.status(400).json({ error: "r_cal must be a non-negative finite number." });
  }
  const validMeals = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'breakfast', 'lunch', 'dinner', 'snack'];
  if (!validMeals.includes(r_meal)) {
    return res.status(400).json({ error: `r_meal must be one of: ${validMeals.join(', ')}` });
  }
  if (typeof r_date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(r_date)) {
    return res.status(400).json({ error: "r_date must be a string in YYYY-MM-DD format." });
  }
  if (typeof r_food !== 'string' || r_food.length > 500) {
    return res.status(400).json({ error: "r_food must be a string with max 500 characters." });
  }

  let sql = "SELECT * FROM calorie_records WHERE id = ?";
  db.get(sql, [id], (err, row) => {
    if (err) {
      res.status(500).send(err.message);
      return console.error(err.message);
    }
    if (row) {
      sql = `UPDATE calorie_records SET r_date = ?, r_meal = ?, r_food = ?, r_cal = ? WHERE id = ?`;
      db.run(sql, [r_date, r_meal, r_food, r_cal, id], function (err) {
        if (err) {
          res.status(500).send(err.message);
          return console.error(err.message);
        }
        res.send({ message: "Record updated.", id: id });
      });
    } else {
      res.status(404).send("Record not found");
    }
  });
});

app.delete("/records/:id", (req, res) => {
  console.log("Received 'Delete' request");
  const { id } = req.params;

  let sql = "SELECT * FROM calorie_records WHERE id = ?";
  db.get(sql, [id], (err, row) => {
    if (err) {
      res.status(500).send(err.message);
      return console.error(err.message);
    }
    if (row) {
      sql = "DELETE FROM calorie_records WHERE id = ?";
      db.run(sql, [id], (err) => {
        if (err) {
          res.status(500).send(err.message);
          return console.error(err.message);
        }
        res.send({ message: "Record deleted.", id: id });
      });
    } else {
      res.status(404).send("Record not found");
    }
  });
});

// Global error handler — catches CORS errors and other unhandled errors
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});
