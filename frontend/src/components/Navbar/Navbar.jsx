import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useDispatch, useSelector } from "react-redux";
import { signout } from "../../api/internal";
import { resetUser } from "../../store/userSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  let isAuthenticated = useSelector((state) => state.user.auth);

  const handleSignout = async () => {
    await signout();
    dispatch(resetUser());
  };

  return (
    <>
      <nav>
        <div className={styles.navbar}>
          <NavLink to="/" className={`${styles.logo} ${styles.inActiveStyle}`}>
            CoinBounce
          </NavLink>
          <NavLink
            to="/"
            exact
            className={({ isActive }) =>
              isActive ? styles.activeStyle : styles.inActiveStyle
            }
          >
            Home
          </NavLink>
          <NavLink
            to="crypto"
            exact
            className={({ isActive }) =>
              isActive ? styles.activeStyle : styles.inActiveStyle
            }
          >
            Cryptocurrencies
          </NavLink>
          <NavLink
            to="blogs"
            exact
            className={({ isActive }) =>
              isActive ? styles.activeStyle : styles.inActiveStyle
            }
          >
            Blogs
          </NavLink>
          <NavLink
            to="submit"
            exact
            className={({ isActive }) =>
              isActive ? styles.activeStyle : styles.inActiveStyle
            }
          >
            Submit a blog
          </NavLink>
          {isAuthenticated ? (
            <div>
              <NavLink>
                <button
                  className={styles.signOutButton}
                  onClick={handleSignout}
                >
                  Sign out
                </button>
              </NavLink>
            </div>
          ) : (
            <div>
              {" "}
              <NavLink
                to="login"
                exact
                className={({ isActive }) =>
                  isActive ? styles.activeStyle : styles.inActiveStyle
                }
              >
                <button className={styles.logInButton}>Login In</button>
              </NavLink>
              <NavLink
                to="signup"
                exact
                className={({ isActive }) =>
                  isActive ? styles.activeStyle : styles.inActiveStyle
                }
              >
                <button className={styles.signUpButton}>Sign up</button>
              </NavLink>
            </div>
          )}
        </div>
      </nav>
      <div className={styles.separator}></div>
    </>
  );
};

export default Navbar;
