import { useState } from "react";
import styles from "./CalorieRecord.module.css";
import CalorieRecordDate from "./CalorieRecordDate";

function CalorieRecord(props) {
  const [currentCalories, setCurrentCalories] = useState(Number(props.calories));
  function handleCaloriesChange(event) {
    setCurrentCalories(currentCalories + 10);
  }

  return (
    <ul className={styles["record"]}>
      {props.calories < 0 ? (
        <li>Invalid calorie count</li>
      ) : (
        <>
          <li>
            <CalorieRecordDate date={props.date} />
          </li>
          <li>{props.meal}</li>
          <li>{props.content}</li>
          <li
            className={styles["record-calories"]}
            onClick={handleCaloriesChange}
          >
            {currentCalories}
          </li>
        </>
      )}
    </ul>
  );
}

export default CalorieRecord;
