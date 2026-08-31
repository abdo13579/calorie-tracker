import { useEffect, useState, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { fetchRecordById } from "../services/recordsApi.js";
import AppContext from "../app-context.js";
import styles from "./Detailes.module.css";

export function Detailes() {
  const { idrecord } = useParams();
  const navigate = useNavigate();
  const { records, removeRecord } = useContext(AppContext);
  const [record, setRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadRecordDetails() {
      setIsLoading(true);
      setError(null);

      // Try to find the record in the context first
      const contextRecord = records.find(
        (r) => String(r.id) === String(idrecord),
      );
      if (contextRecord) {
        if (!ignore) {
          setRecord({
            id: contextRecord.id,
            r_food: contextRecord.content,
            r_meal: contextRecord.meal,
            r_cal: contextRecord.calories,
            r_date:
              contextRecord.date instanceof Date &&
              !Number.isNaN(contextRecord.date.getTime())
                ? `${contextRecord.date.getFullYear()}-${String(contextRecord.date.getMonth() + 1).padStart(2, "0")}-${String(contextRecord.date.getDate()).padStart(2, "0")}`
                : "Unknown",
          });
          setIsLoading(false);
        }
        return;
      }

      // Fall back to API
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
    } else {
      setIsLoading(false);
      setError("No record ID provided.");
    }

    return () => {
      ignore = true;
    };
  }, [idrecord, records]);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await removeRecord(idrecord);
      navigate("/tracker");
    } catch (err) {
      setError(err.message);
      setIsDeleting(false);
    }
  }

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
          <div className={styles.headerActions}>
            <button
              type="button"
              onClick={handleDelete}
              className={styles.deleteBtn}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Record"}
            </button>
            <Link to="/tracker" className={styles.backLink}>
              ← Back to Tracker
            </Link>
          </div>
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
