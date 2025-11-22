import React, { useState } from "react";
import { Card, Button, Form, Modal, ListGroup, Badge, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import FontAwesome from "react-fontawesome";
import {
  BookmarkGroup,
  BookmarkGroups,
  renameBookmarkGroup,
  deleteBookmarkGroup,
  removeBookmark,
  moveBookmarkToGroup,
  DEFAULT_GROUP_ID,
  BookmarkItem
} from "../../../api/localstorage/bookmarkGroups.localstorage";
import "./BookmarkGroupCard.scss";

interface Props {
  group: BookmarkGroup;
  allGroups: BookmarkGroups;
  onUpdate: () => void;
}

export default function BookmarkGroupCard({ group, allGroups, onUpdate }: Props) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(group.name);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const routeBookmarks = group.items.filter(item => item.type === "route");
  const stopBookmarks = group.items.filter(item => item.type === "stop");
  
  const otherGroups = Object.values(allGroups).filter(g => g.id !== group.id);

  const handleRename = () => {
    if (editedName.trim() && editedName !== group.name) {
      renameBookmarkGroup(group.id, editedName.trim());
      onUpdate();
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteBookmarkGroup(group.id);
    setShowDeleteModal(false);
    onUpdate();
  };

  const handleRemoveBookmark = (bookmarkId: string) => {
    removeBookmark(bookmarkId);
    onUpdate();
  };

  const handleMoveToGroup = (bookmarkId: string, targetGroupId: string) => {
    moveBookmarkToGroup(bookmarkId, targetGroupId);
    onUpdate();
  };

  const handleDragStart = (e: React.DragEvent, bookmarkId: string) => {
    setDraggedItem(bookmarkId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", bookmarkId);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleRouteClick = (item: BookmarkItem) => {
    if (item.routeId && item.direction !== undefined) {
      navigate(`/nearby/simple-routes/${item.routeId}?stop=${item.stopId}&direction=${item.direction}`);
    }
  };

  const handleStopClick = (item: BookmarkItem) => {
    navigate(`/stop/${item.stopId}`);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const bookmarkId = e.dataTransfer.getData("text/plain");
    if (bookmarkId && bookmarkId !== draggedItem) {
      handleMoveToGroup(bookmarkId, group.id);
    }
    setDraggedItem(null);
  };

  const renderRouteBookmark = (item: BookmarkItem) => (
    <ListGroup.Item
      key={item.id}
      className={`d-flex justify-content-between align-items-center bookmark-item ${draggedItem === item.id ? 'dragging' : ''}`}
      draggable
      onDragStart={(e) => handleDragStart(e, item.id)}
      onDragEnd={handleDragEnd}
    >
      <div className="d-flex align-items-center flex-grow-1">
        <FontAwesome name="grip-vertical" className="me-2 text-muted drag-handle" />
        <div
          className="flex-grow-1 cursor-pointer"
          onClick={() => handleRouteClick(item)}
          style={{ cursor: "pointer" }}
        >
          <div className="fw-bold">
            <FontAwesome name="bus" className="me-2 text-primary" />
            Route {item.routeId} - {item.routeDesc}
          </div>
          <small className="text-muted">
            {item.directionDesc && `${item.directionDesc} • `}
            at {item.stopDesc} ({item.stopId})
          </small>
        </div>
      </div>
      <div className="d-flex align-items-center gap-1">
        {otherGroups.length > 0 && (
          <Dropdown onClick={(e) => e.stopPropagation()}>
            <Dropdown.Toggle
              variant="link"
              size="sm"
              className="p-1"
              title="Move to group"
            >
              <FontAwesome name="folder" />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Header>Move to...</Dropdown.Header>
              {otherGroups.map(targetGroup => (
                <Dropdown.Item
                  key={targetGroup.id}
                  onClick={() => handleMoveToGroup(item.id, targetGroup.id)}
                >
                  <FontAwesome name="folder-o" className="me-2" />
                  {targetGroup.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        )}
        <Button
          variant="link"
          size="sm"
          className="text-danger p-1"
          onClick={(e) => {
            e.stopPropagation();
            handleRemoveBookmark(item.id);
          }}
          title="Remove bookmark"
        >
          <FontAwesome name="times-circle" />
        </Button>
      </div>
    </ListGroup.Item>
  );

  const renderStopBookmark = (item: BookmarkItem) => (
    <ListGroup.Item
      key={item.id}
      className={`d-flex justify-content-between align-items-center bookmark-item ${draggedItem === item.id ? 'dragging' : ''}`}
      draggable
      onDragStart={(e) => handleDragStart(e, item.id)}
      onDragEnd={handleDragEnd}
    >
      <div className="d-flex align-items-center flex-grow-1">
        <FontAwesome name="grip-vertical" className="me-2 text-muted drag-handle" />
        <div
          className="flex-grow-1 cursor-pointer"
          onClick={() => handleStopClick(item)}
          style={{ cursor: "pointer" }}
        >
          <div className="fw-bold">
            <FontAwesome name="map-marker" className="me-2 text-success" />
            {item.stopDesc}
          </div>
          <small className="text-muted">Stop ID: {item.stopId}</small>
        </div>
      </div>
      <div className="d-flex align-items-center gap-1">
        {otherGroups.length > 0 && (
          <Dropdown onClick={(e) => e.stopPropagation()}>
            <Dropdown.Toggle
              variant="link"
              size="sm"
              className="p-1"
              title="Move to group"
            >
              <FontAwesome name="folder" />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Header>Move to...</Dropdown.Header>
              {otherGroups.map(targetGroup => (
                <Dropdown.Item
                  key={targetGroup.id}
                  onClick={() => handleMoveToGroup(item.id, targetGroup.id)}
                >
                  <FontAwesome name="folder-o" className="me-2" />
                  {targetGroup.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        )}
        <Button
          variant="link"
          size="sm"
          className="text-danger p-1"
          onClick={(e) => {
            e.stopPropagation();
            handleRemoveBookmark(item.id);
          }}
          title="Remove bookmark"
        >
          <FontAwesome name="times-circle" />
        </Button>
      </div>
    </ListGroup.Item>
  );

  return (
    <>
      <Card
        className="mb-3 bookmark-group-card"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center flex-grow-1">
            <Button
              variant="link"
              size="sm"
              className="p-0 me-2"
              onClick={() => setExpanded(!expanded)}
            >
              <FontAwesome name={expanded ? "chevron-down" : "chevron-right"} />
            </Button>
            
            {isEditing ? (
              <Form.Control
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onBlur={handleRename}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleRename();
                  }
                }}
                size="sm"
                className="w-50"
                autoFocus
              />
            ) : (
              <h5 className="mb-0">
                {group.name}
                {group.id === DEFAULT_GROUP_ID && (
                  <Badge bg="secondary" className="ms-2">Default</Badge>
                )}
                <Badge bg="info" className="ms-2">
                  {group.items.length}
                </Badge>
              </h5>
            )}
          </div>

          <div>
            {!isEditing && (
              <Button
                variant="link"
                size="sm"
                onClick={() => {
                  setEditedName(group.name);
                  setIsEditing(true);
                }}
                title="Rename group"
              >
                <FontAwesome name="edit" />
              </Button>
            )}
            {group.id !== DEFAULT_GROUP_ID && (
              <Button
                variant="link"
                size="sm"
                className="text-danger"
                onClick={() => setShowDeleteModal(true)}
                title="Delete group"
              >
                <FontAwesome name="trash" />
              </Button>
            )}
          </div>
        </Card.Header>

        {expanded && (
          <Card.Body>
            {group.items.length === 0 ? (
              <div className="text-center text-muted py-3">
                <FontAwesome name="inbox" size="2x" className="mb-2" />
                <p className="mb-0">No bookmarks in this group yet</p>
              </div>
            ) : (
              <>
                {routeBookmarks.length > 0 && (
                  <div className="mb-3">
                    <h6 className="text-muted mb-2">
                      <FontAwesome name="bus" className="me-2" />
                      Routes ({routeBookmarks.length})
                    </h6>
                    <ListGroup variant="flush">
                      {routeBookmarks.map(renderRouteBookmark)}
                    </ListGroup>
                  </div>
                )}

                {stopBookmarks.length > 0 && (
                  <div>
                    <h6 className="text-muted mb-2">
                      <FontAwesome name="map-marker" className="me-2" />
                      Stops ({stopBookmarks.length})
                    </h6>
                    <ListGroup variant="flush">
                      {stopBookmarks.map(renderStopBookmark)}
                    </ListGroup>
                  </div>
                )}
              </>
            )}
          </Card.Body>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Group?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete the group "{group.name}"?</p>
          {group.items.length > 0 && (
            <p className="text-muted">
              <FontAwesome name="info-circle" className="me-1" />
              The {group.items.length} bookmark(s) in this group will be moved to the default group.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete Group
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
