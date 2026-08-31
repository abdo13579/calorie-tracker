import styles from "./FormInput.module.css";

function FormInput(props) {
  const { value, onChange, hasError, type, id } = props;
  if (id == "meal") {
    return (
      <div className={styles.formGroup}>
        <label htmlFor={id}>{id}: </label>
        <select
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          className={hasError ? `${styles.select} ${styles.error}` : styles.select}
        >
          <option value="">Select a meal</option>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snack">Snack</option>
        </select>
      </div>
    );
  } else {
    return (
      <div className={styles.formGroup}>
        <label htmlFor={id}>{id}: </label>
        <input
          type={type}
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          className={hasError ? `${styles.input} ${styles.error}` : styles.input}
        />
      </div>
    );
  }
}
export default FormInput;
