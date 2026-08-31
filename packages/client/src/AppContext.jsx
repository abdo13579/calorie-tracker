import { useState, useMemo, useEffect, useCallback } from "react";
import AppContext from "./app-context.js";
import {
  fetchRecords,
  createRecord,
  deleteRecord,
} from "./services/recordsApi.js";

function AppContextProvider({ children }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  function updateSelectedDate(dateString) {
    if (!dateString) {
      setSelectedDate(null);
      return;
    }

    const date = new Date(`${dateString}T00:00:00`);
    setSelectedDate(Number.isNaN(date.getTime()) ? null : date);
  }

  const dateIsValid =
    selectedDate instanceof Date && !Number.isNaN(selectedDate.getTime());
  const selectedDateString = dateIsValid
    ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`
    : "";

  // Load records on mount
  useEffect(() => {
    let ignore = false;

    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const rawRecords = await fetchRecords();
        if (!ignore) {
          const formattedRecords = (rawRecords || []).map((record) => ({
            id: record.id,
            date: new Date(`${record.r_date}T00:00:00`),
            meal: record.r_meal,
            content: record.r_food,
            calories: Number(record.r_cal),
          }));
          setRecords(formattedRecords);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      ignore = true;
    };
  }, []);

  // Filter records by selected date
  const filteredRecords = useMemo(() => {
    if (!dateIsValid) return records;
    return records.filter((record) => {
      const recordDate = new Date(record.date);
      return (
        recordDate.getFullYear() === selectedDate.getFullYear() &&
        recordDate.getMonth() === selectedDate.getMonth() &&
        recordDate.getDate() === selectedDate.getDate()
      );
    });
  }, [records, selectedDate, dateIsValid]);

  // Compute total calories from filtered records (no useEffect accumulation)
  const totalCalories = useMemo(
    () => filteredRecords.reduce((sum, r) => sum + r.calories, 0),
    [filteredRecords],
  );

  const addRecord = useCallback(async (record) => {
    const data = await createRecord(record);
    const normalizedRecord = {
      id: data.id,
      date: new Date(`${record.date}T00:00:00`),
      meal: record.meal,
      content: record.content,
      calories: Number(record.calories),
    };
    setRecords((prev) => [...prev, normalizedRecord]);
    return data;
  }, []);

  const removeRecord = useCallback(async (id) => {
    await deleteRecord(id);
    setRecords((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const contextValue = useMemo(
    () => ({
      selectedDate,
      selectedDateString,
      dateIsValid,
      updateSelectedDate,
      totalCalories,
      records,
      filteredRecords,
      isLoading,
      error,
      addRecord,
      removeRecord,
    }),
    [
      selectedDate,
      selectedDateString,
      dateIsValid,
      totalCalories,
      records,
      filteredRecords,
      isLoading,
      error,
      addRecord,
      removeRecord,
    ],
  );

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export default AppContextProvider;
