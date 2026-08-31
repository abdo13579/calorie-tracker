import SideBar from "../components/common/SideNav";
import { Outlet } from "react-router-dom";
import styles from "./PageLayout.module.css";
import AppContextProvider from "../AppContext";

export function PageLayout() {
  return (
    <AppContextProvider>
      <div className={styles.layout}>
        <SideBar />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </AppContextProvider>
  );
}
