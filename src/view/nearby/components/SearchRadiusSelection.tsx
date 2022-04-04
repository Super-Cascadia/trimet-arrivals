import React from "react";
import { Button, Form, FormGroup, InputGroup } from "react-bootstrap";
import FontAwesome from "react-fontawesome";

export interface SearchRadiusSelectionParams {
  radiusSize: number;
  handleRadiusSelectionChange: (e) => void;
}

export function SearchRadiusSelection({
  radiusSize,
  handleRadiusSelectionChange
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
        <Button variant="primary" aria-label="Find transit near me">
          <FontAwesome name="location-arrow" />
          Find Near Me
        </Button>
      </InputGroup>
    </FormGroup>
  );
}
