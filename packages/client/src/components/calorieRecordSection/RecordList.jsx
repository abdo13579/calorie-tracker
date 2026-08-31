import CalorieRecord from "./CalorieRecord";
import styles from "./RecordList.module.css";
import { useContext } from "react";
import AppContext from "../../app-context.js";
import { Link } from "react-router-dom";

function RecordList(props) {
  const { totalCalories, setTotalCalories } = useContext(AppContext);

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeader}>
        <span className={styles.colDate}>Date</span>
        <span className={styles.colMeal}>Meal</span>
        <span className={styles.colFood}>Food / Item</span>
        <span className={styles.colCalories}>Calories</span>
        <span className={styles.colAction}>Details</span>
      </div>

      <ul className={styles.list}>
        {props.records.map((record) => (
          <li className={styles.listItem} key={record.id}>
            <Link
              to={`${record.id}`}
              className={styles.rowLink}
              aria-label={`View details for ${record.content}`}
            >
              <CalorieRecord {...record} addCalories={setTotalCalories} />
            </Link>
          </li>
        ))}
      </ul>

      <div className={styles.totalBar}>
        <span className={styles.totalLabel}>🔥 Total Daily Calories</span>
        <span className={styles.totalValue}>
          {totalCalories} <small>kcal</small>
        </span>
      </div>
    </div>
  );
}

export default RecordList;
