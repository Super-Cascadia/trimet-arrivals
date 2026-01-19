import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Form, FormGroup, InputGroup, Dropdown, DropdownButton } from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import getCurrentPosition from "../../../../../api/geolocation/getCurrentPosition";
import BookmarkLocationModal from "../bookmarkLocation/BookmarkLocationModal";

/**
 * Props for the SearchRadiusSelection component.
 */
export interface SearchRadiusSelectionParams {
  /** The current radius size in feet */
  radiusSize: number;
  /** Handler function called when the radius selection changes */
  handleRadiusSelectionChange: (e) => void;
  /** Optional handler function to refresh the search results */
  handleRefresh?: () => void;
  /** Optional handler function to find nearby transit stops */
  handleFindNearMe?: () => void;
  /** Whether the current location is outside the TriMet service area */
  isOutsideServiceArea?: boolean;
}

/**
 * Component that allows users to select a search radius and trigger nearby transit searches.
 * Displays a dropdown with radius options (250-5000 feet), an optional refresh button,
 * and a "Find Near Me" button to locate nearby transit stops.
 *
 * @param props - The component props
 * @returns A form group containing the radius selector and action buttons
 */
export function SearchRadiusSelection({
  radiusSize,
  handleRadiusSelectionChange,
  handleRefresh,
  handleFindNearMe,
  isOutsideServiceArea = false
}: SearchRadiusSelectionParams) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const options = [250, 500, 750, 1000, 1500, 2000, 2500, 5000];
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [currentGeoLocation, setCurrentGeoLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isGeolocating, setIsGeolocating] = useState(false);

  const handleBookmarkLocation = async () => {
    setIsGeolocating(true);
    try {
      const location = await getCurrentPosition();
      const lat = location.coords.latitude;
      const lng = location.coords.longitude;
      
      setCurrentGeoLocation({ lat, lng });
      
      // Update query parameters with lat and lng
      const params = new URLSearchParams(searchParams);
      params.set("lat", lat.toString());
      params.set("lng", lng.toString());
      navigate(`?${params.toString()}`, { replace: true });
      
      setShowBookmarkModal(true);
    } catch (error) {
      console.error("Error getting current location:", error);
      alert("Unable to get your current location. Please check your browser permissions.");
    } finally {
      setIsGeolocating(false);
    }
  };

  return (
    <>
      <FormGroup>
        <InputGroup className="mb-1">
          <Form.Select
            aria-label="Default select example"
            value={radiusSize}
            onChange={handleRadiusSelectionChange}
          >
            <option>Select</option>
            {options.map(option => {
              return (
                <option key={option} value={option}>
                  {option} foot radius
                </option>
              );
            })}
          </Form.Select>
          {handleRefresh && (
            <Button variant="outline-secondary" onClick={handleRefresh} aria-label="Refresh">
              <FontAwesome name="refresh" />
            </Button>
          )}
          {!isOutsideServiceArea && (
            <Button variant="primary" onClick={handleFindNearMe} aria-label="Find transit near me">
              <FontAwesome name="location-arrow" />{" "}
              Find Near Me
            </Button>
          )}
          <DropdownButton
            variant="outline-primary"
            title={<FontAwesome name="bookmark" />}
            id="bookmark-location-dropdown"
            aria-label="Bookmark location options"
          >
            <Dropdown.Item onClick={handleBookmarkLocation} disabled={isGeolocating}>
              <FontAwesome name="map-marker" className="me-2" />
              {isGeolocating ? "Getting location..." : "Bookmark Current Location"}
            </Dropdown.Item>
          </DropdownButton>
        </InputGroup>
      </FormGroup>

      {currentGeoLocation && (
        <BookmarkLocationModal
          show={showBookmarkModal}
          onHide={() => {
            setShowBookmarkModal(false);
            setCurrentGeoLocation(null);
          }}
          latitude={currentGeoLocation.lat}
          longitude={currentGeoLocation.lng}
        />
      )}
    </>
  );
}
