import styles from "./Navigation.module.css"
import { NavLink } from "react-router";
import { useAuth } from "../contexts/AuthContext.jsx";

function Navigation() {
  const { isAuthenticated } = useAuth();

 

  return (
    <nav className={styles.nav}>
      <ul className={styles.list}>
        <li>
          <NavLink to="/about" className={({isActive})=>
          isActive ? styles.active : styles.link
        }>
            About
          </NavLink>
        </li>

        {isAuthenticated && (
          <>
            <li>
              <NavLink to="/todos" className={({ isActive }) =>
                  isActive ? styles.active : styles.link
                }>
                Todos
              </NavLink>
            </li>
            <li>
              <NavLink to="/profile" className={({ isActive }) =>
                  isActive ? styles.active : styles.link
                }>
                Profile
              </NavLink>
            </li>
          </>
        )}

        {!isAuthenticated && (
          <li>
            <NavLink to="/login" className={({ isActive }) =>
                  isActive ? styles.active : styles.link
                }>
              Login
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;