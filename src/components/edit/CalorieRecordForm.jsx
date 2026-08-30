import { useReducer, useContext, useRef, useEffect } from "react";
import styles from "./CalorieRecordForm.module.css";
import AppContext from "../../app-context.js";
import FormInput from "../common/FormInput.jsx";

const DEFAULT_RECORDS = {
  date: { value: "", isValid: false },
  meal: { value: "", isValid: false },
  content: { value: "", isValid: false },
  calories: { value: 0, isValid: true },
};
function formReducer(state, action) {
  const { type, key, value } = action;
  switch (type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        [key]: {
          ...state[key],
          value,
        },
      };
    default:
      return state;
  }
}

function CaloriesRecordForm(props) {
  const contentInputRef = useRef();
  const { selectedDateString, dateIsValid, updateSelectedDate, totalCalories } =
    useContext(AppContext);
  const [formState, dispatch] = useReducer(
    formReducer,
    DEFAULT_RECORDS,
    (initialState) => {
      return {
        ...initialState,
        date: { value: selectedDateString, isValid: dateIsValid },
      };
    },
  );

  useEffect(() => {
    if (formState.content.value.trim() === "") {
      contentInputRef.current?.focus();
    }
  }, []);

  const content = formState.content.value.trim().toLowerCase();
  const calories = Number(formState.calories.value);
  const caloriesAreValid =
    formState.calories.value !== "" &&
    (content === "sports" ? calories < 0 : calories > 0);

  const isFormValid =
    formState.date.value !== "" &&
    formState.meal.value !== "" &&
    formState.content.value.trim() !== "" &&
    caloriesAreValid;

  const dateHasError = formState.date.value === "";
  const mealHasError = formState.meal.value === "";
  const contentHasError =
    formState.content.value.trim() === "" || !caloriesAreValid;
  const caloriesHasError = !caloriesAreValid;

  const handleDateChange = (event) => {
    dispatch({
      type: "UPDATE_FIELD",
      key: "date",
      value: event.target.value,
    });
  };

  const handleMealChange = (event) => {
    dispatch({
      type: "UPDATE_FIELD",
      key: "meal",
      value: event.target.value,
    });
  };

  const handleContentChange = (event) => {
    dispatch({
      type: "UPDATE_FIELD",
      key: "content",
      value: event.target.value,
    });
  };

  const handleCaloriesChange = (event) => {
    dispatch({
      type: "UPDATE_FIELD",
      key: "calories",
      value: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    props.onFormSubmit(
      Object.keys(formState).reduce((acc, key) => {
        acc[key] = formState[key].value;
        return acc;
      }, {}),
    );
    dispatch({ type: "UPDATE_FIELD", key: "date", value: "" });
    dispatch({ type: "UPDATE_FIELD", key: "meal", value: "" });
    dispatch({ type: "UPDATE_FIELD", key: "content", value: "" });
    dispatch({ type: "UPDATE_FIELD", key: "calories", value: 0 });
    updateSelectedDate(formState.date.value);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <p className={styles.totalCalories}>
        <span>Your current calories</span>
        <strong>{totalCalories}</strong>
      </p>
      <FormInput
        type="date"
        id="date"
        value={formState.date.value}
        onChange={handleDateChange}
        hasError={dateHasError}
      />
      <FormInput
        id="meal"
        value={formState.meal.value}
        onChange={handleMealChange}
        hasError={mealHasError}
      />
      <FormInput
        type="text"
        id="content"
        value={formState.content.value}
        onChange={handleContentChange}
        hasError={contentHasError}
      />
      <FormInput
        type="number"
        id="calories"
        value={formState.calories.value}
        onChange={handleCaloriesChange}
        hasError={caloriesHasError}
      />
      <div className={styles.footer}>
        <button
          type="submit"
          disabled={!isFormValid}
          className={!isFormValid ? styles.disabled : ""}
        >
          Add Record
        </button>
      </div>
    </form>
  );
}
export default CaloriesRecordForm;
