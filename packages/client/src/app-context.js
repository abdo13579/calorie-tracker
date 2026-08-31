import { createContext } from "react";

const AppContext = createContext({
  selectedDate: null,
  selectedDateString: "",
  dateIsValid: false,
  updateSelectedDate: () => {},
  totalCalories: 0,
  records: [],
  filteredRecords: [],
  isLoading: false,
  error: null,
  loadRecords: () => {},
  addRecord: async () => {},
  removeRecord: async () => {},
});

export default AppContext;
