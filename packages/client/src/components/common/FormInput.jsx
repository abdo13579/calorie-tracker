import styles from "./FormInput.module.css";

function FormInput(props) {
  const { value, onChange, hasError, type, id, label, ...rest } = props;
  const displayLabel = label || `${id}: `;

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
export default FormInput;
