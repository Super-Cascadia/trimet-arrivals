import React, { lazy } from "react";

const MainNavigation = lazy(() =>
  import(
    /* webpackChunkName: "MainNavigation" */ "../component/nav/MainNavigation"
  )
);
const LoadIndicator = lazy(() =>
  import(
    /* webpackChunkName: "LoadIndicator" */ "../component/loadIndicator/LoadIndicator"
  )
);

export default function Home() {
  return (
    <div>
      <MainNavigation />
      <LoadIndicator />
    </div>
  );
}
