import CalorieRecord from "./CalorieRecord";
import styles from "./RecordList.module.css";

function RecordList(props) {
  return (
    <ul className={styles["list"]}>
      {props.records.map((record) => (
        <li className={styles["listItem"]} key={record.id}>
          <CalorieRecord
            date={record.date}
            meal={record.meal}
            content={record.content}
            calories={record.calories}
          />
        </li>
      ))}
    </ul>
  );
}

export default RecordList;
