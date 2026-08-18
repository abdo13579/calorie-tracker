import { useState } from "react";
import styles from "./CalorieRecordForm.module.css";

function CaloriesRecordForm(props) {
  const DEFAULT_RECORDS = {
    date: "",
    meal: "",
    content: "",
    calories: "",
  };
  const [records, setRecords] = useState(DEFAULT_RECORDS);

  const handleDateChange = (event) => {
    setRecords({
      ...records,
      date: event.target.value,
    });
  };

  const handleMealChange = (event) => {
    setRecords({
      ...records,
      meal: event.target.value,
    });
  };

  const handleContentChange = (event) => {
    setRecords({
      ...records,
      content: event.target.value,
    });
  };

  const handleCaloriesChange = (event) => {
    setRecords({
      ...records,
      calories: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    props.onFormSubmit(records);
    setRecords({ ...DEFAULT_RECORDS });
  };

  const caloriesHasError =
    records.calories !== "" && Number(records.calories) < 0;

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="date">Date: </label>
        <input
          type="date"
          id="date"
          name="date"
          value={records.date}
          onChange={handleDateChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="meal">Meal: </label>
        <select
          id="meal"
          name="meal"
          value={records.meal}
          onChange={handleMealChange}
        >
          <option value="">Select a meal</option>
          <option value="breakfast">breakfast</option>
          <option value="lunch">lunch</option>
          <option value="dinner">dinner</option>
          <option value="snack">snack</option>
        </select>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="content">Content: </label>
        <input
          type="text"
          id="content"
          name="content"
          value={records.content}
          onChange={handleContentChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="calories">Calories: </label>
        <input
          type="number"
          id="calories"
          name="calories"
          value={records.calories}
          onChange={handleCaloriesChange}
          className={caloriesHasError ? styles.error : ""}
        />
      </div>
      <div className={styles.footer}>
        <button type="submit">Add Record</button>
      </div>
    </form>
  );
}

export default CaloriesRecordForm;
