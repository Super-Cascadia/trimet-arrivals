import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { Badge, Container, Dropdown, Nav, Navbar, OverlayTrigger, Tooltip } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useParams } from "react-router-dom";
import FontAwesome from "react-fontawesome";
import { getArrivals } from "../../../../api/trimet/arrivals";
import {
  ArrivalData,
  ArrivalLocation
} from "../../../../api/trimet/interfaces/arrivals";
import StopLocationIndicator from "../../../../component/stop/StopLocationIndicator";
import { getNormalizedDistanceString } from "../../util/turfUtils";
import { ArrivalList } from "../common/arrivals/NearbyStopArrivals";
import {
  addStopBookmark,
  getBookmarkItemId,
  isStopBookmarked,
  isBookmarkDefault,
  setDefaultBookmark,
  DefaultBookmarkType
} from "../../../../api/localstorage/bookmarkGroups.localstorage";

interface Props {
  currentLocation: number[];
  handleStopOpened: (stopLocation: ArrivalLocation) => void;
}

/**
 * Component that displays detailed information about a specific nearby transit stop.
 * 
 * Fetches and displays arrival data for a selected stop, including location information
 * and upcoming arrivals. The component also handles navigation back to the stops list.
 * 
 * @param currentLocation - The user's current location as [longitude, latitude]
 * @param handleStopOpened - Callback function triggered when a stop is opened, receives the stop location data
 * 
 * @example
 * ```tsx
 * <NearbyStopsDetail 
 *   currentLocation={[-122.6765, 45.5231]} 
 *   handleStopOpened={(location) => console.log(location)} 
 * />
 * ```
 */
export function NearbyStopsDetail({
  currentLocation,
  handleStopOpened
}: Props) {
  const { id } = useParams();
  const [data, setData] = useState<ArrivalData | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [defaultType, setDefaultType] = useState<DefaultBookmarkType | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      const arrivals = await getArrivals(id, 90);
      const stopLocation = arrivals.location[0];
      handleStopOpened(stopLocation);
      setData(arrivals);
    }

    fetchData();
  }, [id]);

  useEffect(() => {
    if (id) {
      const stopId = parseInt(id, 10);
      const bookmarked = isStopBookmarked(stopId);
      setIsBookmarked(bookmarked);
      
      if (bookmarked) {
        const bookmarkId = getBookmarkItemId("stop", stopId);
        setDefaultType(isBookmarkDefault(bookmarkId));
      } else {
        setDefaultType(null);
      }
    }
  }, [id, data]);

  const handleBookmarkClick = () => {
    if (!data) return;
    
    const stopLocation = data.location[0];
    const stopId = stopLocation.id;
    
    if (!isBookmarked) {
      // Add bookmark
      addStopBookmark(
        stopId,
        stopLocation.desc,
        stopLocation.lat,
        stopLocation.lng
      );
      setIsBookmarked(true);
      setDefaultType(null);
    }
  };

  const handleSetAsDefault = (type: DefaultBookmarkType) => {
    if (!data) return;
    
    const stopLocation = data.location[0];
    const stopId = stopLocation.id;
    const bookmarkId = getBookmarkItemId("stop", stopId);
    
    setDefaultBookmark(type, bookmarkId);
    setDefaultType(type);
  };

  const getBookmarkTooltip = () => {
    if (!isBookmarked) {
      return "Bookmark this stop";
    }
    if (defaultType === "home_location") {
      return "Home location - Click to manage";
    }
    if (defaultType === "work_location") {
      return "Work location - Click to manage";
    }
    return "Bookmarked stop - Click to manage";
  };

  if (isEmpty(data)) {
    return null;
  }

  const stopLocation = data.location[0];
  const stopLocationCoords = [stopLocation.lng, stopLocation.lat];
  const distanceDescription = getNormalizedDistanceString(
    currentLocation,
    stopLocationCoords
  );

  return (
    <div className="scrollarea nearby-stop-detail">
      <Navbar bg="secondary" variant="dark">
        <Container>
          <Nav className="align-items-center">
            <StopLocationIndicator locationId={stopLocation.id} />
            <span className="ms-2 navbar-text text-white">
              {stopLocation.desc}
            </span>
          </Nav>
          <Nav>
            {/* Bookmark dropdown */}
            {isBookmarked ? (
              <Dropdown>
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip id="bookmark-tooltip">{getBookmarkTooltip()}</Tooltip>}
                >
                  <Dropdown.Toggle
                    variant="link"
                    className="nav-link bookmarked p-0"
                    id="bookmark-dropdown"
                  >
                    {defaultType ? (
                      <Badge 
                        bg={defaultType === "home_location" ? "info" : "warning"}
                        className="bookmark-badge"
                      >
                        <FontAwesome 
                          name={defaultType === "home_location" ? "home" : "briefcase"} 
                        />
                      </Badge>
                    ) : (
                      <FontAwesome name="bookmark" />
                    )}
                  </Dropdown.Toggle>
                </OverlayTrigger>
                <Dropdown.Menu>
                  <Dropdown.Header>Set as default...</Dropdown.Header>
                  <Dropdown.Item
                    onClick={() => handleSetAsDefault("home_location")}
                    disabled={defaultType === "home_location"}
                  >
                    <FontAwesome name="home" className="me-2" />
                    Home Location
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleSetAsDefault("work_location")}
                    disabled={defaultType === "work_location"}
                  >
                    <FontAwesome name="briefcase" className="me-2" />
                    Work Location
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item href="/bookmarks">
                    <FontAwesome name="bookmark" className="me-2" />
                    Manage Bookmarks
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip id="bookmark-tooltip">{getBookmarkTooltip()}</Tooltip>}
              >
                <a className="nav-link" onClick={handleBookmarkClick} style={{ cursor: 'pointer' }}>
                  <FontAwesome name="bookmark-o" />
                </a>
              </OverlayTrigger>
            )}
            <LinkContainer to="/nearby/stops">
              <a className="nav-link">Back</a>
            </LinkContainer>
          </Nav>
        </Container>
      </Navbar>
      <br />
      <ArrivalList data={data} />
    </div>
  );
}
