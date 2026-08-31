import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchRecordById } from "../services/recordsApi.js";
import styles from "./Detailes.module.css";

export function Detailes() {
  const { idrecord } = useParams();
  const [record, setRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadRecordDetails() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchRecordById(idrecord);
        if (!ignore) {
          setRecord(data);
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

    if (idrecord) {
      loadRecordDetails();
    }

    return () => {
      ignore = true;
    };
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
