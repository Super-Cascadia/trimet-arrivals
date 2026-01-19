import React from "react";
import { ListGroup } from "react-bootstrap";
import FontAwesome from "react-fontawesome";

interface ExpandCollapseListItemProps {
  onClick: () => void;
  icon: "chevron-up" | "chevron-down";
  children: React.ReactNode;
}

export const ExpandCollapseListItem: React.FC<ExpandCollapseListItemProps> = ({
  onClick,
  icon,
  children
}) => {
  return (
    <ListGroup.Item
      as="li"
      className="d-flex justify-content-center align-items-center"
      onClick={onClick}
      style={{ cursor: 'pointer', color: '#007bff', padding: '0.375rem 0.75rem', fontSize: '0.85rem' }}
    >
      <FontAwesome name={icon} className="me-2" />
      <span>{children}</span>
    </ListGroup.Item>
  );
};
