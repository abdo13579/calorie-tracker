import { useState } from "react";
import AppContext from "./app-context.js";

function AppContextProvider({ children }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totalCalories, setTotalCalories] = useState(0);

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

  return (
    <AppContext.Provider
      value={{
        selectedDate,
        selectedDateString,
        dateIsValid,
        updateSelectedDate,
        totalCalories,
        setTotalCalories,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default AppContextProvider;
