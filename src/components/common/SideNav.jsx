import { NavLink } from "react-router-dom";
import styles from "./SideNav.module.css";

function SideBar() {
  return (
    <nav className={styles.sidebar}>
      <div className={styles.brand}>
        <h1>Calorie tracker</h1>
      </div>
      <div className={styles.links}>
        <NavLink className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : `${styles.link}`} to="/">Home</NavLink>
        <NavLink className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : `${styles.link}`} to="tracker">Tracker</NavLink>
      </div>
    </nav>
  );
}

export default SideBar;
