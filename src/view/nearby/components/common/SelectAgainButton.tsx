import React from "react";
import { Button } from "react-bootstrap";
import FontAwesome from "react-fontawesome";

interface SelectAgainButtonProps {
  onClick: () => void;
  className?: string;
}

export const SelectAgainButton: React.FC<SelectAgainButtonProps> = ({ onClick, className }) => {
  return (
    <Button 
      variant="outline-primary" 
      size="sm"
      onClick={onClick}
      className={className}
    >
      <FontAwesome name="repeat" className="me-1" />
      Select Again
    </Button>
  );
};
