import { CHANGE_THEME } from "../constants";

export interface ThemeReducerState {
  theme: "light" | "dark";
}

const getInitialTheme = (): "light" | "dark" => {
  const savedTheme = localStorage.getItem("theme") as "light" | "dark";
  if (savedTheme) {
    return savedTheme;
  }
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
};

const initialState: ThemeReducerState = {
  theme: getInitialTheme()
};

interface Action {
  type: string;
  payload: {
    theme: "light" | "dark";
  };
}

const themeReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case CHANGE_THEME:
      localStorage.setItem("theme", action.payload.theme);
      return {
        ...state,
        theme: action.payload.theme
      };
    default:
      return {
        ...state
      };
  }
};

export default themeReducer;
