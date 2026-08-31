import { useState, useEffect } from "react";
import ListingSection from "../components/calorieRecordSection/ListingSection.jsx";
import Modal from "../components/common/Modal.jsx";
import CalorieRecordForm from "../components/edit/CalorieRecordForm.jsx";
import styles from "./TrackApp.module.css";

export function TrackApp() {
  const [records, setRecords] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  async function saveRecord(record) {
    setIsSaving(true);
    setSaveError(null);
    try {
      const response = await fetch("http://localhost:3000/records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          r_date: record.date,
          r_meal: record.meal,
          r_food: record.content,
          r_cal: Number(record.calories),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to save record to the server");
      }

      const data = await response.json();
      const normalizedRecord = {
        id: data.id,
        date: new Date(`${record.date}T00:00:00`),
        meal: record.meal,
        content: record.content,
        calories: Number(record.calories),
      };

      setRecords((prevRecords) => [...prevRecords, normalizedRecord]);
      setIsFormOpen(false);
      setSaveError(null);
    } catch (err) {
      console.error("Error saving record:", err);
      setSaveError(err.message);
    } finally {
      setIsSaving(false);
    }
  }

  useEffect(() => {
    let ignore = false;

    async function fetchRecords() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:3000/records");
        if (!response.ok) {
          throw new Error("Failed to fetch records from the server");
        }
        const data = await response.json();
        if (!ignore) {
          const formattedRecords = (data.result || []).map((record) => ({
            id: record.id,
            date: new Date(record.r_date),
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
          setLoading(false);
        }
      }
    }

    fetchRecords();

    return () => {
      ignore = true;
    };
  }, []);

  const handleOpenForm = () => {
    setSaveError(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setSaveError(null);
    setIsFormOpen(false);
  };

  return (
    <div className={styles.app}>
      <header className={styles.appHeader}>
        <h1>🔥 Calorie Tracker</h1>
        <p>Track your daily calorie intake with ease</p>
      </header>

      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title="Add a food record"
      >
        {saveError && (
          <p
            style={{
              color: "#ff9166",
              backgroundColor: "rgba(255, 107, 53, 0.1)",
              border: "1px solid rgba(255, 107, 53, 0.3)",
              borderRadius: "6px",
              padding: "10px 14px",
              margin: "0 0 16px 0",
              fontSize: "0.9rem",
            }}
          >
            Failed to save record: {saveError}
          </p>
        )}
        <CalorieRecordForm onFormSubmit={saveRecord} isSaving={isSaving} />
      </Modal>

      {records && (
        <ListingSection records={records} isLoading={loading} error={error} />
      )}

      <div className={styles.toolbar}>
        <button
          type="button"
          className={styles.addButton}
          onClick={handleOpenForm}
        >
          + Add Food
        </button>
      </div>
    </div>
  );
}
