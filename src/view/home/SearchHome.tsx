import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import SearchHero from "./components/SearchHero";
import "./SearchHome.scss";
import { StopOption } from "./hooks/useTrimetStops";
import SearchSuggestions from "./components/SearchSuggestions";
import RecentDirectionsSection, {
  RecentDirectionItem,
} from "./components/RecentDirectionsSection";
import BookmarksPreview from "./components/BookmarksPreview";
import HomeLocationMap from "./components/HomeLocationMap";
import SystemAlerts, { SystemAlert } from "./components/SystemAlerts";
import { bookmarkedStopLocationSelector } from "../../store/selectors/bookmarkSelectors";
import { StopLocation } from "../../api/trimet/interfaces/types";
import { getSytemAlerts } from "../../api/trimet/alerts";
import geoLocateCurrentPosition from "../../api/geolocation/geoLocateCurrentPosition";
import { logger } from "../../api/util/logger";
import { isCurrentLocationValue, findNearestStopFromCurrentLocation } from "./utils/locationUtils";

const RECENT_DIRECTIONS_KEY = "recent-directions";

function loadRecentDirections(): RecentDirectionItem[] {
  try {
    const stored = localStorage.getItem(RECENT_DIRECTIONS_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (e) {
    console.error("Failed to load recent directions", e);
    return [];
  }
}

function persistRecentDirections(items: RecentDirectionItem[]) {
  try {
    localStorage.setItem(RECENT_DIRECTIONS_KEY, JSON.stringify(items));
  } catch (e) {
    console.error("Failed to save recent directions", e);
  }
}

function SearchHome() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const bookmarks = useSelector(bookmarkedStopLocationSelector) as StopLocation[];
  const [recentDirections, setRecentDirections] = useState<RecentDirectionItem[]>([]);
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([]);
  const [loadingAlerts, setLoadingAlerts] = useState(true);

  useEffect(() => {
    setRecentDirections(loadRecentDirections());
  }, []);

  // Perform geolocation on load and set URL params
  useEffect(() => {
    const latParam = searchParams.get("lat");
    const lngParam = searchParams.get("lng");

    // Only attempt geolocation if URL params don't already exist
    if (!latParam || !lngParam) {
      logger.debug('[SearchHome] Attempting geolocation on load');
      geoLocateCurrentPosition()
        .then((location) => {
          if (location?.coords?.latitude && location?.coords?.longitude) {
            logger.info('[SearchHome] Successfully obtained geolocation', {
              lat: location.coords.latitude,
              lng: location.coords.longitude
            });
            setSearchParams({
              lat: location.coords.latitude.toString(),
              lng: location.coords.longitude.toString()
            });
          }
        })
        .catch((error) => {
          logger.debug('[SearchHome] Geolocation failed on home page', error);
          // Silently fail - user can still search without geolocation
        });
    }
  }, []);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoadingAlerts(true);
        const data = await getSytemAlerts();
        const converted: SystemAlert[] = (data.alert || [])
          .filter((alert) => alert.system_wide_flag)
          .map((alert) => ({
            id: String(alert.id),
            type: "warning" as const,
            title: alert.header_text,
            message: alert.desc,
            timestamp: alert.begin * 1000,
            dismissible: true,
          }));
        setSystemAlerts(converted);
      } catch (error) {
        console.error("Failed to fetch system alerts", error);
      } finally {
        setLoadingAlerts(false);
      }
    };

    fetchAlerts();
  }, []);

  const recordRecent = (fromStop: StopOption, toStop: StopOption) => {
    const newEntry: RecentDirectionItem = {
      fromId: String(fromStop.value),
      fromLabel: fromStop.label,
      toId: String(toStop.value),
      toLabel: toStop.label,
      timestamp: Date.now(),
    };

    setRecentDirections((prev) => {
      const filtered = prev.filter(
        (item) => !(item.fromId === newEntry.fromId && item.toId === newEntry.toId)
      );
      const next = [newEntry, ...filtered].slice(0, 5);
      persistRecentDirections(next);
      return next;
    });
  };

  const handleSearch = async (fromStop: StopOption, toStop: StopOption) => {
    recordRecent(fromStop, toStop);
    
    // Resolve current location values to actual stop IDs
    let fromStopId = fromStop.value;
    let toStopId = toStop.value;
    
    // Handle "current location" values by finding nearest stops
    if (isCurrentLocationValue(fromStopId)) {
      logger.info('[SearchHome] Resolving "from" current location to nearest stop');
      const nearestStopId = await findNearestStopFromCurrentLocation(fromStopId);
      if (nearestStopId) {
        fromStopId = nearestStopId.toString();
      } else {
        logger.error('[SearchHome] Could not find nearest stop for "from" location');
        // TODO: Show error to user
        return;
      }
    }
    
    if (isCurrentLocationValue(toStopId)) {
      logger.info('[SearchHome] Resolving "to" current location to nearest stop');
      const nearestStopId = await findNearestStopFromCurrentLocation(toStopId);
      if (nearestStopId) {
        toStopId = nearestStopId.toString();
      } else {
        logger.error('[SearchHome] Could not find nearest stop for "to" location');
        // TODO: Show error to user
        return;
      }
    }
    
    // Navigate to directions view with resolved stop IDs
    navigate(`/nearby/directions?from=${fromStopId}&to=${toStopId}`);
  };

  const handleRecentSelection = (fromStop: StopOption, toStop: StopOption) => {
    handleSearch(fromStop, toStop);
  };

  return (
    <div className="search-home">
      <SearchHero onSearch={handleSearch} />
      <Container className="search-home-content">
        <SearchSuggestions onSuggestionClick={handleSearch} />
        <Row className="home-sections">

          <Col xs={12} sm={6} lg={4}>
            <RecentDirectionsSection
              items={recentDirections}
              onSelect={handleRecentSelection}
            />
          </Col>
          <Col xs={12} sm={6} lg={4}>
            <BookmarksPreview bookmarks={bookmarks || []} />
          </Col>
          <Col xs={12} sm={6} lg={4}>
            <HomeLocationMap />
          </Col>
        <Col xs={12}>
            <SystemAlerts alerts={systemAlerts} />
        </Col>
        </Row>
      </Container>
    </div>
  );
}

export default SearchHome;
