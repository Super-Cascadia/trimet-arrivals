import React, { useEffect, useRef, useState } from "react";
import { Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import geoLocateCurrentPosition from "../../../api/geolocation/geoLocateCurrentPosition";
import { getNearbyStops } from "../../../api/trimet/stops";
import { Location, StopData, TrimetRoute } from "../../../api/trimet/interfaces/types";
import RouteIndicator from "../../../component/route/RouteIndicator";
import "./HomeLocationMap.scss";

mapboxgl.accessToken = "pk.eyJ1IjoiamFtZXNvbm55ZWhvbHQiLCJhIjoiY2p3NWoyamV0MTk1dDQ0cGNmdGZkenViMiJ9.TqDD3r62vlPzVgPnYjocsg";

function HomeLocationMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [nearbyRoutes, setNearbyRoutes] = useState<TrimetRoute[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingRoutes, setLoadingRoutes] = useState(false);

  useEffect(() => {
    geoLocateCurrentPosition()
      .then((loc: Location) => {
        setLocation(loc);
        // Fetch nearby stops to get routes
        setLoadingRoutes(true);
        return getNearbyStops(loc, 2000); // 2000 feet radius
      })
      .then((stopData: StopData) => {
        // Extract unique routes from nearby stops
        const routes: TrimetRoute[] = [];
        const routeIds = new Set<number>();
        
        if (stopData.location) {
          stopData.location.forEach((stop) => {
            if (stop.route) {
              stop.route.forEach((route) => {
                if (!routeIds.has(route.route)) {
                  routeIds.add(route.route);
                  routes.push(route);
                }
              });
            }
          });
        }
        
        // Sort routes by route number
        routes.sort((a, b) => a.route - b.route);
        setNearbyRoutes(routes.slice(0, 8)); // Show first 8 routes
        setLoadingRoutes(false);
      })
      .catch((err) => {
        console.error("Error getting location or routes:", err);
        setError("Unable to get location");
        setLoadingRoutes(false);
      });
  }, []);

  useEffect(() => {
    if (!location || !mapContainerRef.current || mapRef.current) return;

    const lng = location.coords.longitude;
    const lat = location.coords.latitude;

    try {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [lng, lat],
        zoom: 13,
        interactive: false, // Disable interactions for a static preview
      });

      // Add a marker at the user's location
      new mapboxgl.Marker({ color: "#667eea" })
        .setLngLat([lng, lat])
        .addTo(map);

      mapRef.current = map;

      return () => {
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    } catch (err) {
      console.error("Error initializing map:", err);
      setError("Failed to load map");
    }
  }, [location]);

  return (
    <Card className="home-section-card home-location-map-card">
      <Card.Body>
        <div className="home-section-header">
          <div>
            <Card.Title>
              <FontAwesomeIcon icon={faMapMarkerAlt} className="section-icon" /> Your location
            </Card.Title>
            <Card.Text className="section-subtitle">
              Centered on your current position
            </Card.Text>
          </div>
        </div>
        {error ? (
          <div className="section-empty">{error}</div>
        ) : !location ? (
          <div className="section-empty">Loading location...</div>
        ) : (
          <>
            {loadingRoutes ? (
              <div className="nearby-routes-loading">Loading nearby routes...</div>
            ) : nearbyRoutes.length > 0 ? (
              <div className="nearby-routes-list">
                {nearbyRoutes.map((route) => (
                  <Link
                    key={route.route}
                    to={`/nearby/routes/${route.route}`}
                    className="nearby-route-item"
                  >
                    <RouteIndicator routeId={route.route} />
                  </Link>
                ))}
              </div>
            ) : null}
            <div className="home-map-container" ref={mapContainerRef} />
          </>
        )}
      </Card.Body>
    </Card>
  );
}

export default HomeLocationMap;
