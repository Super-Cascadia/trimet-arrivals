import React from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { changeTheme } from "../../store/action/themeActions";
import { RootState } from "../../store/reducers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

export const ThemeToggle = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.themeReducer.theme);

  const toggleTheme = () => {
    dispatch(changeTheme(theme === "light" ? "dark" : "light"));
  };

  return (
    <Button variant="link" onClick={toggleTheme} className="nav-link text-reset">
      <FontAwesomeIcon icon={theme === "light" ? faMoon : faSun} />
    </Button>
  );
};
