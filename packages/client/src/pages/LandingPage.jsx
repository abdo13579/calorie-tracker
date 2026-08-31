import { Link } from "react-router-dom";
import styles from "./LandingPage.module.css";

export function LandingPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🔥 Welcome to Calorie Tracker</h1>
      <p className={styles.subtitle}>
        Take control of your daily nutrition, track meals effortlessly, and maintain a healthier lifestyle.
      </p>
      <Link to="tracker" className={styles.ctaButton}>
        Get Started →
      </Link>
    </div>
  );
}
