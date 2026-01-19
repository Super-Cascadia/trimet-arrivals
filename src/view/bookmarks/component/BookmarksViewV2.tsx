import React, { useState, useEffect } from "react";
import { Container, Button, Row, Col, Form, Modal } from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import {
  fetchBookmarkGroups,
  createBookmarkGroup,
  BookmarkGroups,
  getDefaultBookmark
} from "../../../api/localstorage/bookmarkGroups.localstorage";
import BookmarkGroupCard from "./BookmarkGroupCard";
import DefaultBookmarkCard from "./DefaultBookmarkCard";
import "./BookmarksViewV2.scss";

export default function BookmarksViewV2() {
  const [groups, setGroups] = useState<BookmarkGroups>({});
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [homeCommuteBookmark, setHomeCommuteBookmark] = useState<any>(null);
  const [workCommuteBookmark, setWorkCommuteBookmark] = useState<any>(null);
  const [homeLocationBookmark, setHomeLocationBookmark] = useState<any>(null);
  const [workLocationBookmark, setWorkLocationBookmark] = useState<any>(null);

  useEffect(() => {
    loadGroups();
    loadDefaultBookmarks();
  }, []);

  const loadGroups = () => {
    const loadedGroups = fetchBookmarkGroups();
    setGroups(loadedGroups);
  };

  const loadDefaultBookmarks = () => {
    setHomeCommuteBookmark(getDefaultBookmark("home_commute"));
    setWorkCommuteBookmark(getDefaultBookmark("work_commute"));
    setHomeLocationBookmark(getDefaultBookmark("home_location"));
    setWorkLocationBookmark(getDefaultBookmark("work_location"));
  };

  const handleUpdate = () => {
    loadGroups();
    loadDefaultBookmarks();
  };

  const handleAddGroup = () => {
    if (newGroupName.trim()) {
      createBookmarkGroup(newGroupName.trim());
      setNewGroupName("");
      setShowAddGroupModal(false);
      handleUpdate();
    }
  };

  const sortedGroups = Object.values(groups).sort((a, b) => a.order - b.order);

  return (
    <Container className="bookmarks-view-v2">
      <Row className="mt-4 mb-3">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h2>
              <FontAwesome name="bookmark" className="me-2" />
              My Bookmarks
            </h2>
            <Button
              variant="primary"
              onClick={() => setShowAddGroupModal(true)}
              size="sm"
            >
              <FontAwesome name="plus" className="me-1" />
              New Group
            </Button>
          </div>
        </Col>
      </Row>

      {/* Default Bookmarks Section */}
      <Row className="mb-4">
        <Col>
          <h5 className="text-muted mb-3">
            <FontAwesome name="star" className="me-2" />
            Quick Access
          </h5>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col md={6} className="mb-3 mb-md-0">
          <DefaultBookmarkCard
            type="home_commute"
            bookmark={homeCommuteBookmark}
            onUpdate={handleUpdate}
          />
        </Col>
        <Col md={6}>
          <DefaultBookmarkCard
            type="work_commute"
            bookmark={workCommuteBookmark}
            onUpdate={handleUpdate}
          />
        </Col>
      </Row>
      <Row className="mb-4">
        <Col md={6} className="mb-3 mb-md-0">
          <DefaultBookmarkCard
            type="home_location"
            bookmark={homeLocationBookmark}
            onUpdate={handleUpdate}
          />
        </Col>
        <Col md={6}>
          <DefaultBookmarkCard
            type="work_location"
            bookmark={workLocationBookmark}
            onUpdate={handleUpdate}
          />
        </Col>
      </Row>

      {/* All Bookmarks Section */}
      <Row className="mb-3">
        <Col>
          <h5 className="text-muted">
            <FontAwesome name="folder" className="me-2" />
            All Bookmarks
          </h5>
        </Col>
      </Row>

      <Row>
        <Col>
          {sortedGroups.length === 0 ? (
            <div className="text-center text-muted py-5">
              <FontAwesome name="bookmark-o" size="3x" className="mb-3" />
              <p>No bookmarks yet. Start bookmarking routes and stops!</p>
            </div>
          ) : (
            sortedGroups.map(group => (
              <BookmarkGroupCard
                key={group.id}
                group={group}
                allGroups={groups}
                onUpdate={handleUpdate}
              />
            ))
          )}
        </Col>
      </Row>

      {/* Add Group Modal */}
      <Modal show={showAddGroupModal} onHide={() => setShowAddGroupModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Group Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter group name (e.g., Work, Home, Favorites)"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleAddGroup();
                }
              }}
              autoFocus
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddGroupModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAddGroup}
            disabled={!newGroupName.trim()}
          >
            Create Group
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
