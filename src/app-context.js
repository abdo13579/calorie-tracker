import { createContext } from "react";

const AppContext = createContext({
  selectedDate: null,
  selectedDateString: "",
  dateIsValid: false,
  updateSelectedDate: () => {},
  totalCalories: 0,
  setTotalCalories: () => {},
});

export default AppContext;
