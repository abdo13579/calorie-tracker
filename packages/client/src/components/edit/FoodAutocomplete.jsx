import { useState, useEffect, useRef } from "react";
import { searchFoods } from "../../services/usdaApi.js";
import styles from "./FoodAutocomplete.module.css";

function FoodAutocomplete({
  id = "content",
  value,
  onChange,
  onSelectFood,
  hasError,
  placeholder = "e.g. Banana, Chicken Breast, Pizza...",
  inputRef,
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const skipNextSearchRef = useRef(false);

  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (skipNextSearchRef.current) {
      skipNextSearchRef.current = false;
      return;
    }

    const query = (value || "").trim();
    if (query.length < 2) {
      return;
    }

    const abortController = new AbortController();

    const timer = setTimeout(async () => {
      setIsLoading(true);
      setSearchError(null);
      try {
        const results = await searchFoods(query, abortController.signal);
        setSuggestions(results);
        setIsOpen(true);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.warn("USDA food search failed:", err);
          setSearchError(err.message || "Failed to fetch USDA suggestions");
          setSuggestions([]);
          setIsOpen(true);
        }
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      abortController.abort();
    };
  }, [value]);

  const handleInputChange = (e) => {
    const newVal = e.target.value;
    if (newVal.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      setSearchError(null);
      setIsLoading(false);
    }
    onChange(e);
  };

  const handleSelectItem = (item) => {
    skipNextSearchRef.current = true;
    setIsOpen(false);
    onSelectFood(item);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className={styles.autocompleteContainer} ref={containerRef}>
      <label htmlFor={id}>Food / Content:</label>
      <div className={styles.inputWrapper}>
        <input
          ref={inputRef}
          type="text"
          id={id}
          name={id}
          value={value}
          onChange={handleInputChange}
          onFocus={() => {
            if (suggestions.length > 0 || isLoading || searchError) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          className={
            hasError ? `${styles.input} ${styles.error}` : styles.input
          }
        />
        {isLoading && <span className={styles.spinner} aria-label="Loading" />}
      </div>

      {isOpen && (
        <ul className={styles.dropdown} role="listbox">
          {isLoading && suggestions.length === 0 && (
            <li className={styles.dropdownStatus}>Searching USDA database...</li>
          )}

          {!isLoading && searchError && (
            <li className={`${styles.dropdownStatus} ${styles.error}`}>
              {searchError}
            </li>
          )}

          {!isLoading && !searchError && suggestions.length === 0 && (
            <li className={styles.dropdownStatus}>
              No foods found. Enter calories manually below.
            </li>
          )}

          {suggestions.map((item) => (
            <li
              key={item.id}
              role="option"
              aria-selected={false}
              className={styles.dropdownItem}
              onClick={() => handleSelectItem(item)}
            >
              <div className={styles.itemInfo}>
                <span className={styles.itemTitle}>{item.description}</span>
                {(item.brand || item.category) && (
                  <span className={styles.itemSubtitle}>
                    {[item.brand, item.category].filter(Boolean).join(" • ")}
                  </span>
                )}
              </div>
              {item.kcalPer100g != null && (
                <span className={styles.calorieBadge}>
                  {item.kcalPer100g} kcal/100g
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FoodAutocomplete;
