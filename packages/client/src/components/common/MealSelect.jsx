import styles from "./FormInput.module.css";

function MealSelect({ value, onChange, hasError, ...rest }) {
  return (
    <div className={styles.formGroup}>
      <label htmlFor="meal">meal: </label>
      <select
        id="meal"
        name="meal"
        value={value}
        onChange={onChange}
        className={
          hasError ? `${styles.select} ${styles.error}` : styles.select
        }
        {...rest}
      >
        <option value="">Select a meal</option>
        <option value="breakfast">Breakfast</option>
        <option value="lunch">Lunch</option>
        <option value="dinner">Dinner</option>
        <option value="snack">Snack</option>
      </select>
    </div>
  );
}

export default MealSelect;
