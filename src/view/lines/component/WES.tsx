import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { RouteDataResultSet } from "../../../api/trimet/interfaces/routes";
import { getAllRoutes } from "../../../api/trimet/routeConfig";
import { createRoutesDictionary } from "../../../store/reducers/data/routeDataReducer";
import Loading from "../../loading/Loading";
import { getRoutes, getWesCommuterRail } from "./AllLines";

export function WES() {
  const [routes, setRoutes] = useState({});

  useEffect(() => {
    getAllRoutes().then((data: RouteDataResultSet) => {
      const routesDictionary = createRoutesDictionary(data.route);
      setRoutes(routesDictionary);
    });
  }, []);

  if (isEmpty(routes)) {
    return <Loading />;
  }

  const wesCommuterRail = getWesCommuterRail(routes);

  return (
    <div className="line-detail-view-wrapper">{getRoutes(wesCommuterRail)}</div>
  );
}
