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
        index
        element={<StopLocationArrivalsTable arrivalData={arrivalData} />}
      />
      <Route
        path="route/:routeId"
        element={<StopLocationArrivalsTable arrivalData={arrivalData} />}
      />
    </Routes>
  );
}

export default StopLocationArrivals;
