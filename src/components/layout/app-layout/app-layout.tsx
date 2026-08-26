import { Outlet } from "react-router-dom";

import Header from "../header";
import Footer from "../footer";
import styles from './app-layout.module.scss'

export default function AppLayout() {
  return (
    <div className={styles.layout}>
      <Header />

      <main className={styles.main}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}