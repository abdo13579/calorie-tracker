import { useState } from "react";
import ListingSection from "./components/calorieRecordSection/ListingSection.jsx";
import SimpleModal from "./components/common/Modal.jsx";
import CalorieRecordForm from "./components/edit/CalorieRecordForm.jsx";
import styles from "./App.module.css";

const INITIAL_RECORDS = [
  {
    id: 1,
    date: new Date("2024-6-8"),
    meal: "lunch",
    content: "egg",
    calories: 23,
  },
  {
    id: 2,
    date: new Date("2024-6-8"),
    meal: "lunch",
    content: "egg",
    calories: 23,
  },
  {
    id: 3,
    date: new Date("2024-6-8"),
    meal: "lunch",
    content: "egg",
    calories: 23,
  },
  {
    id: 4,
    date: new Date("2024-6-8"),
    meal: "lunch",
    content: "egg",
    calories: 23,
  },
];

function App() {
  const [records, setRecords] = useState(INITIAL_RECORDS);
  const [nextID, setNextID] = useState(5);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const formSubmitHandler = (record) => {
    const normalizedRecord = {
      ...record,
      date: new Date(`${record.date}`),
      id: nextID,
    };
    setNextID((prevNextID) => prevNextID + 1);
    setRecords((prevRecords) => [normalizedRecord, ...prevRecords]);
    setIsFormOpen(false);
  };

  return (
    <div className={styles.app}>
      <header className={styles.appHeader}>
        <h1>🔥 Calorie Tracker</h1>
        <p>Track your daily calorie intake with ease</p>
      </header>

      <div className={styles.toolbar}>
        <button
          type="button"
          className={styles.addButton}
          onClick={() => setIsFormOpen(true)}
        >
          + Add Food
        </button>
      </div>

      <SimpleModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Add a food record"
      >
        <CalorieRecordForm onFormSubmit={formSubmitHandler} />
      </SimpleModal>

      <ListingSection records={records} />
    </div>
  );
}

export default App;
