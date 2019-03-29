import { map } from "lodash";
import React from "react";
import { StopLocation } from "../../../api/trimet/types";
import StopContainer from "../../stops/containers/StopContainer";

interface Props {
  bookmarks: StopLocation[];
}

const noop = () => {
  return;
};

export default class BookmarksComponent extends React.Component<Props> {
  public render() {
    return (
      <section>
        <h1>Bookmarks!</h1>
        <div>
          {map(this.props.bookmarks, (stopLocation: StopLocation) => {
            const locationId = stopLocation.locid;
            return (
              <StopContainer
                key={locationId}
                locationId={locationId}
                onRouteIndicatorClick={noop}
                showArrivals={true}
              />
            );
          })}
        </div>
      </section>
    );
  }
}
