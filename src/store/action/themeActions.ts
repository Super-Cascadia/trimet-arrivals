import { CHANGE_THEME } from "../constants";

export const changeTheme = (theme: "light" | "dark") => {
  return {
    payload: {
      theme
    },
    type: CHANGE_THEME
  };
};
