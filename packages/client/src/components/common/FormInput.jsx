import styles from "./FormInput.module.css";

function FormInput(props) {
  const { value, onChange, hasError, type, id, label, ...rest } = props;
  const displayLabel = label || `${id}: `;

  if (id === "meal") {
    return (
      <div className={styles.formGroup}>
        <label htmlFor={id}>{displayLabel}</label>
        <select
          id={id}
          name={id}
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
  } else {
    return (
      <div className={styles.formGroup}>
        <label htmlFor={id}>{displayLabel}</label>
        <input
          type={type}
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          className={
            hasError ? `${styles.input} ${styles.error}` : styles.input
          }
          {...rest}
        />
      </div>
    );
  }
}
export default FormInput;
