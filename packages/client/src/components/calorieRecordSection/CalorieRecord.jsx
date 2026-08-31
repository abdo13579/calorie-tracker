import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./CalorieRecord.module.css";
import CalorieRecordDate from "./CalorieRecordDate";

const MEAL_BADGES = {
  Breakfast: { icon: "🌅", className: styles.badgeBreakfast },
  Lunch: { icon: "☀️", className: styles.badgeLunch },
  Dinner: { icon: "🌙", className: styles.badgeDinner },
  Snack: { icon: "🍎", className: styles.badgeSnack },
  breakfast: { icon: "🌅", className: styles.badgeBreakfast },
  lunch: { icon: "☀️", className: styles.badgeLunch },
  dinner: { icon: "🌙", className: styles.badgeDinner },
  snack: { icon: "🍎", className: styles.badgeSnack },
};

function CalorieRecord(props) {
  const { calories, onDelete, id, content, meal, date } = props;
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      if (onDelete) {
        await onDelete(id);
      }
    } catch (err) {
      console.error("Failed to delete record:", err);
      setIsDeleting(false);
    }
  };

  const mealInfo = MEAL_BADGES[meal] || {
    icon: "🍽️",
    className: styles.badgeDefault,
  };

  return (
    <div className={styles.recordRow}>
      <div className={styles.dateCell}>
        <CalorieRecordDate date={date} />
      </div>

      <div className={styles.mealCell}>
        <span className={`${styles.mealBadge} ${mealInfo.className}`}>
          <span className={styles.badgeIcon}>{mealInfo.icon}</span>
          {meal}
        </span>
      </div>

      <div className={styles.foodCell}>
        <span className={styles.foodName}>{content}</span>
      </div>

      <div className={styles.caloriesCell}>
        <span className={styles.caloriesValue}>{calories}</span>
        <span className={styles.caloriesUnit}>kcal</span>
      </div>

      <div className={styles.actionCell}>
        <Link
          to={`${id}`}
          className={styles.detailsBtn}
          aria-label={`View details for ${content}`}
        >
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
        </Link>
        <button
          type="button"
          onClick={handleDelete}
          className={styles.deleteBtn}
          disabled={isDeleting}
          title="Delete record"
          aria-label={`Delete record for ${content}`}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default CalorieRecord;
