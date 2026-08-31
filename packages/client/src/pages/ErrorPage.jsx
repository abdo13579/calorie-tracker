import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import styles from "./ErrorPage.module.css";

const HOME_DIR = "/";

export function ErrorPage() {
  const [counter, setCounter] = useState(10);
  const navigate = useNavigate();
  const hasNavigated = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => {
        const next = prev - 1;
        if (next <= 0 && !hasNavigated.current) {
          hasNavigated.current = true;
          clearInterval(interval);
          // Navigate on next tick to avoid state update during render
          setTimeout(() => navigate(HOME_DIR), 0);
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

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
