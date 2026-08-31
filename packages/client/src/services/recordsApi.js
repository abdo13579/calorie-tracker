const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:3000" : "");

const STORAGE_KEY = "calorie_tracker_records_v1";

const INITIAL_FOODS = [
  { food: "Apple", cal: 95, meal: "breakfast" },
  { food: "Oatmeal with Almonds", cal: 250, meal: "breakfast" },
  { food: "Grilled Chicken Salad", cal: 420, meal: "lunch" },
  { food: "Brown Rice with Steamed Broccoli", cal: 310, meal: "lunch" },
  { food: "Salmon Fillet with Quinoa", cal: 520, meal: "dinner" },
  { food: "Greek Yogurt with Honey", cal: 180, meal: "snack" },
];

function getStoredRecords() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn("Error reading from localStorage:", err);
  }

  const defaultRecords = [];
  const today = new Date();
  for (let i = 0; i < 5; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    INITIAL_FOODS.forEach((item) => {
      defaultRecords.push({
        id: defaultRecords.length + 1,
        r_date: dateStr,
        r_meal: item.meal,
        r_food: item.food,
        r_cal: item.cal,
      });
    });
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultRecords));
  } catch (err) {
    console.warn("Error saving to localStorage:", err);
  }
  return defaultRecords;
}

function saveStoredRecords(records) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.warn("Error saving to localStorage:", err);
  }
}

export async function fetchRecords(dateQuery) {
  if (API_BASE_URL) {
    try {
      const url = dateQuery
        ? `${API_BASE_URL}/records?date=${encodeURIComponent(dateQuery)}`
        : `${API_BASE_URL}/records`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        if (data.result && !dateQuery) {
          saveStoredRecords(data.result);
        }
        return data.result || [];
      }
    } catch (err) {
      console.warn(
        "Backend API unavailable, falling back to local storage:",
        err.message,
      );
    }
  }

  const records = getStoredRecords();
  if (dateQuery) {
    return records.filter((r) => r.r_date === dateQuery);
  }
  return records;
}

export async function fetchRecordById(id) {
  if (API_BASE_URL) {
    try {
      const response = await fetch(`${API_BASE_URL}/records/${id}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.warn(
        "Backend API unavailable, falling back to local storage:",
        err.message,
      );
    }
  }

  const records = getStoredRecords();
  const found = records.find((r) => String(r.id) === String(id));
  if (!found) {
    throw new Error("Record not found");
  }
  return found;
}

export async function createRecord(record) {
  if (API_BASE_URL) {
    try {
      const response = await fetch(`${API_BASE_URL}/records`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          r_date: record.date,
          r_meal: record.meal,
          r_food: record.content,
          r_cal: Number(record.calories),
        }),
      });
      if (response.ok) {
        const data = await response.json();
        const records = getStoredRecords();
        const createdItem = {
          id: data.id,
          r_date: record.date,
          r_meal: record.meal,
          r_food: record.content,
          r_cal: Number(record.calories),
        };
        if (!records.some((r) => String(r.id) === String(data.id))) {
          records.push(createdItem);
          saveStoredRecords(records);
        }
        return data;
      }
    } catch (err) {
      console.warn(
        "Backend API unavailable, falling back to local storage:",
        err.message,
      );
    }
  }

  const records = getStoredRecords();
  const newId =
    records.length > 0
      ? Math.max(...records.map((r) => Number(r.id) || 0)) + 1
      : 1;
  const newRecord = {
    id: newId,
    r_date: record.date,
    r_meal: record.meal,
    r_food: record.content,
    r_cal: Number(record.calories),
  };
  records.push(newRecord);
  saveStoredRecords(records);
  return { message: "Record inserted.", id: newId };
}

export async function deleteRecord(id) {
  if (API_BASE_URL) {
    try {
      const response = await fetch(`${API_BASE_URL}/records/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        const records = getStoredRecords().filter(
          (r) => String(r.id) !== String(id),
        );
        saveStoredRecords(records);
        return await response.json();
      }
    } catch (err) {
      console.warn(
        "Backend API unavailable, falling back to local storage:",
        err.message,
      );
    }
  }

  const records = getStoredRecords().filter((r) => String(r.id) !== String(id));
  saveStoredRecords(records);
  return { message: "Record deleted.", id };
}

export async function updateRecord(id, record) {
  if (API_BASE_URL) {
    try {
      const response = await fetch(`${API_BASE_URL}/records/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          r_date: record.date,
          r_meal: record.meal,
          r_food: record.content,
          r_cal: Number(record.calories),
        }),
      });
      if (response.ok) {
        const data = await response.json();
        const records = getStoredRecords().map((r) =>
          String(r.id) === String(id)
            ? {
                ...r,
                r_date: record.date,
                r_meal: record.meal,
                r_food: record.content,
                r_cal: Number(record.calories),
              }
            : r,
        );
        saveStoredRecords(records);
        return data;
      }
    } catch (err) {
      console.warn(
        "Backend API unavailable, falling back to local storage:",
        err.message,
      );
    }
  }

  const records = getStoredRecords().map((r) =>
    String(r.id) === String(id)
      ? {
          ...r,
          r_date: record.date,
          r_meal: record.meal,
          r_food: record.content,
          r_cal: Number(record.calories),
        }
      : r,
  );
  saveStoredRecords(records);
  return { message: "Record updated.", id };
}
