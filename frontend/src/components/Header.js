import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import logoPath from "../images/logo.svg";

function Header({ isLoggedIn, userEmail, onSignOut, isLoading }) {
  const location = useLocation();
  const isLocationSignIn = location.pathname === "/sign-in";
  const isLocationMain = location.pathname === "/";
  const [isColumnMenu, setColumnMenu] = React.useState(false);

  function handleSignOut() {
    onSignOut();
    setColumnMenu(false);
  }

  function handleSignIn() {}

  function handleMenuClick() {
    setColumnMenu(true);
  }

  function handleCloseMenu() {
    setColumnMenu(false);
  }

  return (
    <header className={`header`}>
      <div
        className={`header__container ${isColumnMenu ? "header_columned" : ""}`}
      >
        <div
          className={`header__logo-container ${
            isColumnMenu ? "header__logo-container_column" : ""
          }`}
        >
          <a
            className={`header__logo ${
              isColumnMenu ? "header__logo_columned" : ""
            }`}
            href="/react-mesto-auth"
          >
            <img src={logoPath} alt="Логотип сайта" className="header__image" />
          </a>
          <button
            className={`btn-close ${
              isColumnMenu ? "btn-close_active" : "btn-close_inactive"
            }`}
            onClick={handleCloseMenu}
            type="button"
          >
            &times;
          </button>
        </div>
        <div
          className={`header__burger-menu ${
            !isLoggedIn || isColumnMenu ? "header__burger-menu_inactive" : ""
          }`}
          onClick={handleMenuClick}
        >
          <div className="header__burger-line"></div>
          <div className="header__burger-line"></div>
          <div className="header__burger-line"></div>
        </div>
        {(!isLoading || isLocationMain) && (
          <nav
            className={`header__nav-container ${
              isLoggedIn && !isColumnMenu
                ? "header__nav-container_type_inactive"
                : ""
            } ${isColumnMenu ? "header__nav-container_type_column" : ""}`}
          >
            <p className="header__email">{isLoggedIn ? userEmail : ""}</p>
            {!isLocationSignIn ? (
              <NavLink
                className={`header__nav-item ${
                  isLocationMain ? "header__nav-item_active" : ""
                }`}
                to={"/sign-in"}
                onClick={!isLoggedIn ? handleSignIn : handleSignOut}
              >
                {isLoggedIn ? "Выйти" : "Войти"}
              </NavLink>
            ) : (
              <NavLink
                className="header__nav-item"
                activeClassName="header__nav-item_active"
                to={"/sign-up"}
              >
                {!isLoggedIn ? "Регистрация" : ""}
              </NavLink>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;
