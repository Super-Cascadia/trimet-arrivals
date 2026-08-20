import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const publicUrl = env.PUBLIC_URL || "";

  return {
    define: {
      "process.env.NODE_ENV": JSON.stringify(mode),
      "process.env.PUBLIC_URL": JSON.stringify(publicUrl),
      "process.env.REACT_APP_USE_DEFAULT_PORTLAND_LOCATION": JSON.stringify(
        env.REACT_APP_USE_DEFAULT_PORTLAND_LOCATION
      ),
      "process.env.REACT_APP_USE_FIXTURE": JSON.stringify(
        env.REACT_APP_USE_FIXTURE
      )
    },
    plugins: [react()],
    resolve: {
      alias: {
        "!mapbox-gl": "mapbox-gl"
      }
    }
  };
});
