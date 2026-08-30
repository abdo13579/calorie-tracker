import { useState, useEffect } from "react";
import styles from "./CalorieRecord.module.css";
import CalorieRecordDate from "./CalorieRecordDate";

function CalorieRecord(props) {
  const { addCalories, calories } = props;
  const [currentCalories, setCurrentCalories] = useState(
    Number(calories),
  );
  function handleCaloriesChange() {
    setCurrentCalories((previousCalories) => previousCalories + 10);
  }

  useEffect(() => {
    addCalories(
      (previousTotal) => previousTotal + Number(calories),
    );

    return () => {
      addCalories(
        (previousTotal) => previousTotal - Number(calories),
      );
    };
  }, [addCalories, calories]);

  return (
    <ul className={styles["record"]}>
      <li>
        <CalorieRecordDate date={props.date} />
      </li>
      <li>{props.meal}</li>
      <li>{props.content}</li>
      <li className={styles["record-calories"]} onClick={handleCaloriesChange}>
        {currentCalories}
      </li>
    </ul>
  );
}

export default CalorieRecord;
