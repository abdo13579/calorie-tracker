import { useState } from "react";
import styles from "./ListingSection.module.css";
import RecordList from "./RecordList";

function ListingSection({ records }) {
  const [selectedDate, setSelectedDate] = useState("");

  const filteredRecords = !selectedDate
    ? records
    : records.filter((record) => {
        const recordDate = new Date(record.date);
        const selected = new Date(selectedDate);

        return (
          recordDate.getFullYear() === selected.getFullYear() &&
          recordDate.getMonth() === selected.getMonth() &&
          recordDate.getDate() === selected.getDate()
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
          value={selectedDate}
          onChange={(event) => setSelectedDate(event.target.value)}
          className={styles.input}
        />
      </div>

      {filteredRecords.length === 0 ? (
        <p className={styles.emptyMessage}>No records for this date.</p>
      ) : (
        <RecordList records={filteredRecords} />
      )}
    </section>
  );
}

export default ListingSection;
