import CalorieRecord from "./CalorieRecord";
import styles from "./RecordList.module.css";
import { useContext } from "react";
import AppContext from "../../app-context.js";
import { Link } from "react-router-dom";

function RecordList(props) {
  const { totalCalories, setTotalCalories } = useContext(AppContext);
  return (
    <>
      <ul className={styles["list"]}>
        {props.records.map((record) => (
          <li className={styles["listItem"]} key={record.id}>
            <Link to={`${record.id}`}>
              <CalorieRecord {...record} addCalories={setTotalCalories} />
            </Link>
          </li>
        ))}
      </ul>
      <p className={styles["totalCalories"]}>Total Calories: {totalCalories}</p>
    </>
  );
}

export default RecordList;
