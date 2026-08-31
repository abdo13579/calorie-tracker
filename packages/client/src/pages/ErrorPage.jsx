import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import styles from "./ErrorPage.module.css";

const HOME_DIR = "/";

export function ErrorPage() {
  const [counter, setCounter] = useState(10);
  const interval = useRef();
  const homeNavigate = useNavigate();

  useEffect(() => {
    if (counter === 0) {
      clearInterval(interval.current);
      homeNavigate(HOME_DIR);
    }
  }, [counter, homeNavigate]);

  useEffect(() => {
    interval.current = setInterval(() => setCounter((prev) => prev - 1), 1000);
    return () => {
      clearInterval(interval.current);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.errorCard}>
        <div className={styles.errorIcon}>⚠️</div>
        <h1 className={styles.title}>Something went wrong</h1>
        <p className={styles.redirectText}>
          You will be redirected in{" "}
          <span className={styles.countdownBadge}>{counter}s</span>
        </p>
        <div className={styles.actions}>
          <Link to={HOME_DIR} className={styles.homeButton}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
