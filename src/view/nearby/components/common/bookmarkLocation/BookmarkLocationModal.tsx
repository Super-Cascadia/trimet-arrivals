import React, { useState } from "react";
import { Modal, Button, ButtonGroup, Alert } from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import { 
  createBookmarkGroup, 
  addStopBookmark, 
  DefaultBookmarkType,
  setDefaultBookmark,
  fetchBookmarkGroups,
  DEFAULT_GROUP_ID,
  getBookmarkItemId
} from "../../../../../api/localstorage/bookmarkGroups.localstorage";
import { getNearbyStops } from "../../../../../api/trimet/stops";

interface BookmarkLocationModalProps {
  show: boolean;
  onHide: () => void;
  latitude: number;
  longitude: number;
  locationDescription?: string;
}

/**
 * Modal component for bookmarking the user's current location as home or work.
 * Allows users to save their geolocated position as a stop bookmark.
 */
export default function BookmarkLocationModal({
  show,
  onHide,
  latitude,
  longitude,
  locationDescription = "Current Location"
}: BookmarkLocationModalProps) {
  const [selectedType, setSelectedType] = useState<"home" | "work" | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!selectedType) {
      setError("Please select Home or Work location");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // Find the nearest stop to use as the bookmark
      const location = {
        coords: { latitude, longitude }
      };
      
      // Search within 500 feet radius to find nearest stop
      const nearbyStopsData = await getNearbyStops(location, 500);
      
      if (!nearbyStopsData?.location || nearbyStopsData.location.length === 0) {
        setError("No transit stops found near this location. Try a location closer to transit.");
        setSaving(false);
        return;
      }

      // Use the closest stop
      const closestStop = nearbyStopsData.location[0];
      const stopId = closestStop.locid || closestStop.id;
      const stopDesc = closestStop.desc || locationDescription;
      
      // Ensure default group exists
      const groups = fetchBookmarkGroups();
      let defaultGroupId = DEFAULT_GROUP_ID;
      
      if (!groups[DEFAULT_GROUP_ID]) {
        defaultGroupId = createBookmarkGroup("My Bookmarks");
      }

      // Create the stop bookmark
      addStopBookmark(
        stopId,
        stopDesc,
        closestStop.lat,
        closestStop.lng,
        defaultGroupId,
        closestStop
      );

      // Get the bookmark ID
      const bookmarkId = getBookmarkItemId("stop", stopId);

      // Set as default home or work location
      const defaultType: DefaultBookmarkType = selectedType === "home" ? "home_location" : "work_location";
      setDefaultBookmark(defaultType, bookmarkId);

      // Success! Close the modal
      onHide();
    } catch (err) {
      console.error("Error bookmarking location:", err);
      setError("Failed to save bookmark. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setSelectedType(null);
    setError(null);
    onHide();
  };

  return (
    <Modal show={show} onHide={handleCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <FontAwesome name="map-marker" className="me-2" />
          Bookmark Current Location
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-muted mb-3">
          Save the nearest transit stop to your current location for quick access. 
          You can use it for trip planning and directions.
        </p>
        
        <div className="mb-3">
          <strong>Location:</strong> {locationDescription}
          <br />
          <small className="text-muted">
            Lat: {latitude.toFixed(6)}, Lng: {longitude.toFixed(6)}
          </small>
        </div>

        <div className="mb-3">
          <strong className="d-block mb-2">Save as:</strong>
          <ButtonGroup className="w-100">
            <Button
              variant={selectedType === "home" ? "primary" : "outline-primary"}
              onClick={() => setSelectedType("home")}
              className="d-flex align-items-center justify-content-center"
            >
              <FontAwesome name="home" className="me-2" />
              Home Location
            </Button>
            <Button
              variant={selectedType === "work" ? "success" : "outline-success"}
              onClick={() => setSelectedType("work")}
              className="d-flex align-items-center justify-content-center"
            >
              <FontAwesome name="briefcase" className="me-2" />
              Work Location
            </Button>
          </ButtonGroup>
        </div>

        {error && (
          <Alert variant="danger" className="mb-0">
            {error}
          </Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancel} disabled={saving}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={!selectedType || saving}
        >
          {saving ? (
            <>
              <FontAwesome name="spinner" spin className="me-2" />
              Saving...
            </>
          ) : (
            <>
              <FontAwesome name="bookmark" className="me-2" />
              Save Bookmark
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
