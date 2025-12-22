import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarker,
  faMapPin,
  faPlane,
  faBuilding,
} from "@fortawesome/free-solid-svg-icons";
import { StopOption } from "../hooks/useTrimetStops";
import StopLocationIndicator from "../../../component/stop/StopLocationIndicator";
import "./SearchSuggestions.scss";

interface RouteSuggestion {
  id: string;
  title: string;
  description: string;
  fromStopId: string;
  fromStopLabel: string;
  toStopId: string;
  toStopLabel: string;
  icon: any;
}

interface SearchSuggestionsProps {
  onSuggestionClick: (fromStop: StopOption, toStop: StopOption) => void;
}

// Popular route suggestions with actual TriMet stop IDs
const suggestions: RouteSuggestion[] = [
  {
    id: "downtown-to-airport",
    title: "Downtown to Airport",
    description: "Pioneer Square to PDX via MAX Red Line",
    fromStopId: "8333",
    fromStopLabel: "SW 6th & Morrison",
    toStopId: "10572",
    toStopLabel: "Portland International Airport",
    icon: faPlane,
  },
  {
    id: "downtown-to-zoo",
    title: "Downtown to Oregon Zoo",
    description: "Pioneer Square to Washington Park",
    fromStopId: "8333",
    fromStopLabel: "SW 6th & Morrison",
    toStopId: "10120",
    toStopLabel: "Washington Park",
    icon: faMapPin,
  },
  {
    id: "union-station-to-pioneer",
    title: "Union Station to Pioneer Square",
    description: "MAX from Union Station to downtown",
    fromStopId: "8989",
    fromStopLabel: "NW 5th & Glisan",
    toStopId: "8333",
    toStopLabel: "SW 6th & Morrison",
    icon: faBuilding,
  },
  {
    id: "pioneer-to-lloyd-center",
    title: "Pioneer Square to Lloyd Center",
    description: "Take MAX across the river",
    fromStopId: "8333",
    fromStopLabel: "SW 6th & Morrison",
    toStopId: "8347",
    toStopLabel: "NE 11th Ave MAX Station",
    icon: faMapMarker,
  },
];

function SearchSuggestions({ onSuggestionClick }: SearchSuggestionsProps) {
  const handleSuggestionClick = (suggestion: RouteSuggestion) => {
    const fromStop: StopOption = {
      value: suggestion.fromStopId,
      label: suggestion.fromStopLabel,
      stopData: {} as any, // Minimal data needed for navigation
    };
    const toStop: StopOption = {
      value: suggestion.toStopId,
      label: suggestion.toStopLabel,
      stopData: {} as any,
    };
    onSuggestionClick(fromStop, toStop);
  };

  const renderStopIndicator = (stopId: string) => (
    <span
      className="route-indicator"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <StopLocationIndicator
        locationId={Number(stopId)}
        size="small"
        nearbyStops
      />
    </span>
  );

  return (
    <div className="search-suggestions">
      <Row className="suggestions-grid">
        {suggestions.map((suggestion) => (
          <Col
            key={suggestion.id}
            xs={12}
            sm={6}
            lg={3}
            className="suggestion-col"
          >
            <Card
              className="suggestion-card"
              onClick={() => handleSuggestionClick(suggestion)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSuggestionClick(suggestion);
                }
              }}
            >
              <Card.Body>
                <div className="suggestion-header">
                  <div className="suggestion-icon">
                    <FontAwesomeIcon icon={suggestion.icon} />
                  </div>
                  <div className="suggestion-text">
                    <Card.Title>{suggestion.title}</Card.Title>
                    <Card.Text className="suggestion-description">
                      {suggestion.description}
                    </Card.Text>
                  </div>
                </div>
                <div className="suggestion-route">
                  <span className="route-label">From:</span>
                  {renderStopIndicator(suggestion.fromStopId)}
                  <span className="route-value">{suggestion.fromStopLabel}</span>
                </div>
                <div className="suggestion-route">
                  <span className="route-label">To:</span>
                  {renderStopIndicator(suggestion.toStopId)}
                  <span className="route-value">{suggestion.toStopLabel}</span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default SearchSuggestions;
