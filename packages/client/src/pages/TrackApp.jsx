import { useState, useContext } from "react";
import ListingSection from "../components/calorieRecordSection/ListingSection.jsx";
import Modal from "../components/common/Modal.jsx";
import CalorieRecordForm from "../components/edit/CalorieRecordForm.jsx";
import AppContext from "../app-context.js";
import styles from "./TrackApp.module.css";

export function TrackApp() {
  const { addRecord, removeRecord, records, isLoading, error } =
    useContext(AppContext);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSaveRecord(record) {
    setIsSaving(true);
    setSaveError(null);
    try {
      await addRecord(record);
      setIsFormOpen(false);
      setSaveError(null);
    } catch (err) {
      console.error("Error saving record:", err);
      setSaveError(err.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteRecord(id) {
    try {
      await removeRecord(id);
    } catch (err) {
      console.error("Error deleting record:", err);
    }
  }

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
        <CalorieRecordForm
          onFormSubmit={handleSaveRecord}
          isSaving={isSaving}
        />
      </Modal>

      <div className={styles.toolbar}>
        <button
          type="button"
          className={styles.addButton}
          onClick={handleOpenForm}
        >
          + Add Food
        </button>
      </div>

      {records && (
        <ListingSection
          records={records}
          isLoading={isLoading}
          error={error}
          onDeleteRecord={handleDeleteRecord}
        />
      )}
    </div>
  );
}
