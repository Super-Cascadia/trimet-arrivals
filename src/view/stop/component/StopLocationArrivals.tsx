import React from "react";
import { Route, Routes } from "react-router-dom";
import { ArrivalData } from "../../../api/trimet/interfaces/arrivals";
import StopLocationArrivalsTable from "./StopLocationArrivalsTable";

interface Props {
  arrivalData: ArrivalData;
}

function StopLocationArrivals({ arrivalData }: Props) {
  return (
    <Routes>
      <Route
        path="/"
        element={<StopLocationArrivalsTable arrivalData={arrivalData} />}
      />
      <Route path={`/route/:routeId`}>
        <StopLocationArrivalsTable arrivalData={arrivalData} />
      </Route>
    </Routes>
  );
}

export default StopLocationArrivals;
