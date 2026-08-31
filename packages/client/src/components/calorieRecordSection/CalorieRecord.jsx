import { useState, useEffect } from "react";
import styles from "./CalorieRecord.module.css";
import CalorieRecordDate from "./CalorieRecordDate";

const MEAL_BADGES = {
  Breakfast: { icon: "🌅", className: styles.badgeBreakfast },
  Lunch: { icon: "☀️", className: styles.badgeLunch },
  Dinner: { icon: "🌙", className: styles.badgeDinner },
  Snack: { icon: "🍎", className: styles.badgeSnack },
};

function CalorieRecord(props) {
  const { addCalories, calories } = props;
  const [currentCalories, setCurrentCalories] = useState(Number(calories));

  function handleCaloriesChange(event) {
    event.preventDefault();
    event.stopPropagation();
    setCurrentCalories((previousCalories) => previousCalories + 10);
  }

  useEffect(() => {
    addCalories((previousTotal) => previousTotal + Number(calories));

    return () => {
      addCalories((previousTotal) => previousTotal - Number(calories));
    };
  }, [addCalories, calories]);

  const mealInfo = MEAL_BADGES[props.meal] || {
    icon: "🍽️",
    className: styles.badgeDefault,
  };

  return (
    <div className={styles.recordRow}>
      <div className={styles.dateCell}>
        <CalorieRecordDate date={props.date} />
      </div>

      <div className={styles.mealCell}>
        <span className={`${styles.mealBadge} ${mealInfo.className}`}>
          <span className={styles.badgeIcon}>{mealInfo.icon}</span>
          {props.meal}
        </span>
      </div>

      <div className={styles.foodCell}>
        <span className={styles.foodName}>{props.content}</span>
      </div>

      <div
        className={styles.caloriesCell}
        onClick={handleCaloriesChange}
        title="Click to add +10 kcal"
      >
        <span className={styles.caloriesValue}>{currentCalories}</span>
        <span className={styles.caloriesUnit}>kcal</span>
      </div>

      <div className={styles.actionCell}>
        <span className={styles.detailsBtn}>
          Details
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </span>
      </div>
    </div>
  );
}

export default CalorieRecord;
