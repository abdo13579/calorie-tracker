import { useState, useEffect } from "react";
import ListingSection from "../components/calorieRecordSection/ListingSection.jsx";
import Modal from "../components/common/Modal.jsx";
import CalorieRecordForm from "../components/edit/CalorieRecordForm.jsx";
import styles from "./TrackApp.module.css";
import AppContextProvider from "../AppContext.jsx";

const LOCAL_STORAGE_KEY = "calorie-tracker-records";

export function TrackApp() {
  const [records, setRecords] = useState(() => {
    const savedRecords = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedRecords
      ? JSON.parse(savedRecords).map((record) => ({
          ...record,
          date: new Date(record.date),
          calories: Number(record.calories),
        }))
      : [];
  });
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(records));
  }, [records]);

  const formSubmitHandler = (record) => {
    const normalizedRecord = {
      ...record,
      date: new Date(`${record.date}T00:00:00`),
      id: crypto.randomUUID(),
    };
    setIsFormOpen(false);
    setRecords((prevRecords) => [...prevRecords, normalizedRecord]);
  };

  return (
    <div className={styles.app}>
      <header className={styles.appHeader}>
        <h1>🔥 Calorie Tracker</h1>
        <p>Track your daily calorie intake with ease</p>
      </header>

        <Modal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          title="Add a food record"
        >
          <CalorieRecordForm onFormSubmit={formSubmitHandler} />
        </Modal>

        <ListingSection records={records} />
      
      <div className={styles.toolbar}>
        <button
          type="button"
          className={styles.addButton}
          onClick={() => setIsFormOpen(true)}
        >
          + Add Food
        </button>
      </div>
    </div>
  );
}