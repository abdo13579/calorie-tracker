import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./Detailes.module.css";

export function Detailes() {
  const { idrecord } = useParams();
  const [record, setRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadRecordDetails() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:3000/records/${idrecord}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Record not found");
          }
          throw new Error("Failed to load record details");
        }
        const data = await response.json();
        setRecord(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    if (idrecord) {
      loadRecordDetails();
    }
  }, [idrecord]);

  if (isLoading) {
    return <p className={styles.loading}>Loading record details...</p>;
  }

  if (error || !record) {
    return (
      <div className={styles.container}>
        <div className={styles.errorCard}>
          <p className={styles.errorMessage}>{error || "Record not found"}</p>
          <Link to="/tracker" className={styles.backLink}>
            ← Back to Tracker
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.detailsCard}>
        <div className={styles.header}>
          <h1 className={styles.foodTitle}>{record.r_food}</h1>
          <Link to="/tracker" className={styles.backLink}>
            ← Back to Tracker
          </Link>
        </div>

        <div className={styles.detailsTable}>
          <div className={styles.detailRow}>
            <span className={styles.label}>Meal</span>
            <span className={styles.value}>{record.r_meal}</span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.label}>Calories</span>
            <span className={`${styles.value} ${styles.caloriesValue}`}>
              {record.r_cal} kcal
            </span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.label}>Date</span>
            <span className={styles.value}>{record.r_date}</span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.label}>Record ID</span>
            <span className={styles.value}>#{record.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
