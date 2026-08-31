import { useContext } from "react";
import styles from "./ListingSection.module.css";
import RecordList from "./RecordList";
import AppContext from "../../app-context.js";

function ListingSection({ records, isLoading, error }) {
  const { selectedDate, selectedDateString, dateIsValid, updateSelectedDate } =
    useContext(AppContext);

  const filteredRecords = !dateIsValid
    ? records
    : records.filter((record) => {
        const recordDate = new Date(record.date);

        return (
          recordDate.getFullYear() === selectedDate.getFullYear() &&
          recordDate.getMonth() === selectedDate.getMonth() &&
          recordDate.getDate() === selectedDate.getDate()
        );
      });

  return (
    <section>
      <div className={styles.filterBlock}>
        <label htmlFor="record-date" className={styles.label}>
          Filter by date
        </label>
        <input
          id="record-date"
          type="date"
          value={selectedDateString}
          onChange={(event) => updateSelectedDate(event.target.value)}
          className={styles.input}
        />
      </div>

      {isLoading ? (
        <p className={styles.emptyMessage}>Loading...</p>
      ) : error ? (
        <p className={styles.errorMessage}>Failed to load data: {error}</p>
      ) : filteredRecords.length === 0 ? (
        <p className={styles.emptyMessage}>No records for this date.</p>
      ) : (
        <RecordList records={filteredRecords} />
      )}
    </section>
  );
}

export default ListingSection;
