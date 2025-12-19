import React from "react";
import { Button, Form, FormGroup, InputGroup } from "react-bootstrap";
import FontAwesome from "react-fontawesome";

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
  handleFindNearMe
}: SearchRadiusSelectionParams) {
  const options = [250, 500, 750, 1000, 1500, 2000, 2500, 5000];
  return (
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
        <Button variant="primary" onClick={handleFindNearMe} aria-label="Find transit near me">
          <FontAwesome name="location-arrow" />{" "}
          Find Near Me
        </Button>
      </InputGroup>
    </FormGroup>
  );
}
