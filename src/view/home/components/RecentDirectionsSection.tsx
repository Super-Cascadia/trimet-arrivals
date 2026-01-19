import React from "react";
import { Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { StopOption } from "../hooks/useTrimetStops";
import "./RecentDirectionsSection.scss";

export interface RecentDirectionItem {
  fromId: string;
  fromLabel: string;
  toId: string;
  toLabel: string;
  timestamp: number;
}

interface Props {
  items: RecentDirectionItem[];
  onSelect: (from: StopOption, to: StopOption) => void;
}

function RecentDirectionsSection({ items, onSelect }: Props) {
  const handleClick = (item: RecentDirectionItem) => {
    const fromStop: StopOption = {
      value: item.fromId,
      label: item.fromLabel,
      stopData: {} as any,
    };
    const toStop: StopOption = {
      value: item.toId,
      label: item.toLabel,
      stopData: {} as any,
    };
    onSelect(fromStop, toStop);
  };

  return (
    <Card className="home-section-card">
      <Card.Body>
        <div className="home-section-header">
          <div>
            <Card.Title><FontAwesomeIcon icon={faClock} className="section-icon" /> Recent directions</Card.Title>
            <Card.Text className="section-subtitle">
              Jump back to places you just searched
            </Card.Text>
          </div>
        </div>
        {items.length === 0 ? (
          <div className="section-empty">No recent directions yet.</div>
        ) : (
          <div className="recent-directions-list">
            {items.map((item) => (
              <button
                key={`${item.fromId}-${item.toId}-${item.timestamp}`}
                className="recent-direction-row"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick(item);
                }}
              >
                <span className="recent-direction-labels">
                  <span className="recent-from">{item.fromLabel}</span>
                  <span className="chevron">→</span>
                  <span className="recent-to">{item.toLabel}</span>
                </span>
                <span className="recent-meta">{new Date(item.timestamp).toLocaleTimeString()}</span>
              </button>
            ))}
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default RecentDirectionsSection;
