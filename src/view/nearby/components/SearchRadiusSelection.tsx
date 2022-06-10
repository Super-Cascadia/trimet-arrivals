import React from "react";
import { Form, FormGroup } from "react-bootstrap";

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
      <Form.Select
        aria-label="Default select example"
        value={radiusSize}
        onChange={handleRadiusSelectionChange}
      >
        <option>Select</option>
        {options.map(option => {
          return (
            <option key={option} value={option}>
              {option}
            </option>
          );
        })}
      </Form.Select>
    </FormGroup>
  );
}
