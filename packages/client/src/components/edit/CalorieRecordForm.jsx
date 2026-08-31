import { useReducer, useContext, useRef, useEffect } from "react";
import styles from "./CalorieRecordForm.module.css";
import AppContext from "../../app-context.js";
import FormInput from "../common/FormInput.jsx";
import FoodAutocomplete from "./FoodAutocomplete.jsx";

const DEFAULT_RECORDS = {
  date: { value: "", isValid: false },
  meal: { value: "", isValid: false },
  content: { value: "", isValid: false },
  grams: { value: 100, isValid: true },
  calories: { value: "", isValid: false },
  selectedFoodKcalPer100g: null,
};

function formReducer(state, action) {
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        [action.key]: {
          ...state[action.key],
          value: action.value,
        },
      };
    case "CONTENT_CHANGE":
      return {
        ...state,
        content: {
          ...state.content,
          value: action.value,
        },
        selectedFoodKcalPer100g: null,
      };
    case "SELECT_FOOD": {
      const grams = Number(state.grams.value) || 100;
      const kcalPer100g = action.food.kcalPer100g;
      const calculatedCalories =
        kcalPer100g != null
          ? Math.round((kcalPer100g * grams) / 100)
          : state.calories.value;

      return {
        ...state,
        content: {
          ...state.content,
          value: action.food.description,
        },
        selectedFoodKcalPer100g: kcalPer100g,
        calories: {
          ...state.calories,
          value:
            calculatedCalories !== ""
              ? calculatedCalories
              : state.calories.value,
        },
      };
    }
    case "UPDATE_GRAMS": {
      const newGrams = action.value;
      const parsedGrams = Number(newGrams);
      let updatedCalories = state.calories.value;

      if (
        state.selectedFoodKcalPer100g != null &&
        newGrams !== "" &&
        !isNaN(parsedGrams) &&
        parsedGrams > 0
      ) {
        updatedCalories = Math.round(
          (state.selectedFoodKcalPer100g * parsedGrams) / 100,
        );
      }

      return {
        ...state,
        grams: {
          ...state.grams,
          value: newGrams,
        },
        calories: {
          ...state.calories,
          value: updatedCalories,
        },
      };
    }
    case "RESET_FORM":
      return {
        ...DEFAULT_RECORDS,
        date: { value: action.date, isValid: Boolean(action.date) },
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
    contentInputRef.current?.focus();
  }, []);

  const content = (formState.content.value || "").trim().toLowerCase();
  const calories = Number(formState.calories.value);
  const caloriesAreValid =
    formState.calories.value !== "" &&
    !isNaN(calories) &&
    (content === "sports" ? calories < 0 : calories > 0);

  const grams = Number(formState.grams.value);
  const gramsAreValid =
    formState.grams.value !== "" && !isNaN(grams) && grams > 0;

  const isFormValid =
    formState.date.value !== "" &&
    formState.meal.value !== "" &&
    formState.content.value.trim() !== "" &&
    gramsAreValid &&
    caloriesAreValid;

  const dateHasError = formState.date.value === "";
  const mealHasError = formState.meal.value === "";
  const contentHasError = formState.content.value.trim() === "";
  const gramsHasError = !gramsAreValid;
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
      type: "CONTENT_CHANGE",
      value: event.target.value,
    });
  };

  const handleSelectFood = (food) => {
    dispatch({
      type: "SELECT_FOOD",
      food,
    });
  };

  const handleGramsChange = (event) => {
    dispatch({
      type: "UPDATE_GRAMS",
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
    props.onFormSubmit({
      date: formState.date.value,
      meal: formState.meal.value,
      content: formState.content.value,
      calories: Number(formState.calories.value),
    });

    dispatch({
      type: "RESET_FORM",
      date: selectedDateString,
    });
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
      <div className={styles.fullWidth}>
        <FoodAutocomplete
          id="content"
          inputRef={contentInputRef}
          value={formState.content.value}
          onChange={handleContentChange}
          onSelectFood={handleSelectFood}
          hasError={contentHasError}
          placeholder="Search USDA food (e.g. Apple) or type custom..."
        />
      </div>
      <FormInput
        type="number"
        id="grams"
        label="Weight (grams): "
        value={formState.grams.value}
        onChange={handleGramsChange}
        min="1"
        step="1"
        hasError={gramsHasError}
        placeholder="e.g. 100"
      />
      <FormInput
        type="number"
        id="calories"
        label="Calories (kcal): "
        value={formState.calories.value}
        onChange={handleCaloriesChange}
        hasError={caloriesHasError}
        placeholder="e.g. 150"
      />
      <div className={styles.footer}>
        <button
          type="submit"
          disabled={!isFormValid || props.isSaving}
          className={!isFormValid || props.isSaving ? styles.disabled : ""}
        >
          {props.isSaving ? "Saving..." : "Add Record"}
        </button>
      </div>
    </form>
  );
}

export default CaloriesRecordForm;
