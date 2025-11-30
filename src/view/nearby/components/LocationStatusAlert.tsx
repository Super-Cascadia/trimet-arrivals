import React from "react";

interface LocationStatusAlertProps {
  isUsingDroppedMarker: boolean;
  droppedMarkerLocation: { lat: number; lng: number } | null;
  handleResetToGeoLocation: () => void;
  handlePlaceMarker: () => void;
  lng?: number;
  lat?: number;
  zoom?: number;
}

export const LocationStatusAlert: React.FC<LocationStatusAlertProps> = ({
  isUsingDroppedMarker,
  droppedMarkerLocation,
  handleResetToGeoLocation,
  handlePlaceMarker,
  lng,
  lat,
  zoom
}) => {
  if (isUsingDroppedMarker && droppedMarkerLocation) {
    return (
      <div className="alert alert-info d-flex justify-content-between align-items-center mb-2" role="alert">
        <div>
          <div>
            <strong>📍 Searching from dropped marker</strong> - Drag the marker to change location
          </div>
          <small className="text-muted">
            {droppedMarkerLocation.lat.toFixed(6)}, {droppedMarkerLocation.lng.toFixed(6)}
          </small>
        </div>
        <button 
          className="btn btn-sm btn-primary" 
          onClick={handleResetToGeoLocation}
        >
          Reset to My Location
        </button>
      </div>
    );
  }

  return (
    <div className="alert alert-secondary d-flex justify-content-between align-items-center mb-2" role="alert">
      <div>
        <div>
          <strong>🗺️ Searching from your location</strong>
        </div>
        <small className="text-muted">
          Longitude: {lng?.toFixed(6)} | Latitude: {lat?.toFixed(6)} | Zoom: {zoom?.toFixed(2)}
        </small>
      </div>
      <button 
        className="btn btn-sm btn-outline-primary" 
        onClick={handlePlaceMarker}
      >
        📍 Place Marker Here
      </button>
    </div>
  );
};
