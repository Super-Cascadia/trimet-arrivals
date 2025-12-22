import React from "react";
import { Card, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faInfoCircle,
  faCheckCircle,
  faTimesCircle,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import "./SystemAlerts.scss";

export interface SystemAlert {
  id: string;
  type: "warning" | "info" | "success" | "danger";
  title: string;
  message: string;
  timestamp?: number;
  dismissible?: boolean;
}

interface Props {
  alerts?: SystemAlert[];
}

const getIcon = (type: string) => {
  switch (type) {
    case "warning":
      return faExclamationTriangle;
    case "success":
      return faCheckCircle;
    case "danger":
      return faTimesCircle;
    case "info":
    default:
      return faInfoCircle;
  }
};

const getBsVariant = (type: string) => {
  switch (type) {
    case "warning":
      return "warning";
    case "success":
      return "success";
    case "danger":
      return "danger";
    case "info":
    default:
      return "info";
  }
};

function SystemAlerts({ alerts = [] }: Props) {
  const [dismissedIds, setDismissedIds] = React.useState<Set<string>>(new Set());

  const visibleAlerts = alerts.filter((alert) => !dismissedIds.has(alert.id));

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  return (
    <Card className="home-section-card">
      <Card.Body>
        <div className="home-section-header">
          <div>
            <Card.Title><FontAwesomeIcon icon={faBell} className="section-icon" /> System alerts</Card.Title>
            <Card.Text className="section-subtitle">
              Important updates about TriMet services
            </Card.Text>
          </div>
        </div>
        {visibleAlerts.length === 0 ? (
          <div className="section-empty">No active alerts.</div>
        ) : (
          <div className="alerts-list">
            {visibleAlerts.map((alert) => (
              <Alert
                key={alert.id}
                variant={getBsVariant(alert.type)}
                dismissible={alert.dismissible !== false}
                onClose={() => handleDismiss(alert.id)}
                className="system-alert"
              >
                <div className="alert-content">
                  <FontAwesomeIcon icon={getIcon(alert.type)} className="alert-icon" />
                  <div className="alert-text">
                    <div className="alert-title">{alert.title}</div>
                    <div className="alert-message">{alert.message}</div>
                    {alert.timestamp && (
                      <div className="alert-timestamp">
                        {new Date(alert.timestamp).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default SystemAlerts;
