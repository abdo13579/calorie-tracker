import StyledRecordCell from "../common/StyledRecordCell.jsx";
import styles from "./CalorieRecordDate.module.css";

function CalorieRecordDate({ date }) {
  const day = date.toLocaleString("en-US", { day: "2-digit" });
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.toLocaleString("en-US", { year: "numeric" });

  return (
    <StyledRecordCell>
      <div className={styles["record-date-day"]}>{day}</div>
      <div className={styles["record-date-month"]}>{month}</div>
      <div className={styles["record-date-year"]}>{year}</div>
    </StyledRecordCell>
  );
}

export default CalorieRecordDate;
