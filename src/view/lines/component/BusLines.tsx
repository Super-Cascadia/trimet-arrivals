import React from "react";
import FontAwesome from "react-fontawesome";
import { RouteDataDictionary } from "../../../store/reducers/data/routeDataReducer";
import CollapsiblePane from "../../lineDetail/component/CollapsiblePane";
import { getBusLines, getRoutes } from "./AllLines";

export function BusLines({ routes }: { routes: RouteDataDictionary }) {
  const busLines = getBusLines(routes);

  return (
    <div>
      <h2>
        <FontAwesome className="bus" name="bus" />
        Max Bus
      </h2>
      <CollapsiblePane
        className="route-detail-information-pane"
        title="Schedule"
        open={true}
      >
        <p>
          Some lines offer <strong>Frequent Service</strong>, others provide{" "}
          <strong>24-hour Service</strong> all days of the week.
        </p>
      </CollapsiblePane>
      <br />
      {getRoutes(busLines)}
    </div>
  );
}
