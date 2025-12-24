import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faHome, faBriefcase } from "@fortawesome/free-solid-svg-icons";
import { 
  getAllBookmarks, 
  BookmarkItem, 
  getDefaultBookmark 
} from "../../../api/localstorage/bookmarkGroups.localstorage";
import StopLocationIndicator from "../../../component/stop/StopLocationIndicator";
import "./BookmarksPreview.scss";

interface Props {
  // Props kept for backwards compatibility but not used
  bookmarks?: any[];
}

function BookmarksPreview({ }: Props) {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [homeBookmark, setHomeBookmark] = useState<BookmarkItem | null>(null);
  const [workBookmark, setWorkBookmark] = useState<BookmarkItem | null>(null);

  const loadBookmarks = () => {
    const home = getDefaultBookmark("home");
    const work = getDefaultBookmark("work");
    setHomeBookmark(home);
    setWorkBookmark(work);
    
    const allBookmarks = getAllBookmarks();
    console.log('loaded bookmarks', allBookmarks);
    
    // Filter out home and work bookmarks from the list
    const homeWorkIds = new Set([home?.id, work?.id].filter(Boolean));
    const filtered = allBookmarks.filter(b => !homeWorkIds.has(b.id));
    
    // Sort and take remaining slots (up to 2 more)
    const sorted = filtered
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
      .slice(0, 2);
    setBookmarks(sorted);
  };

  useEffect(() => {
    loadBookmarks();

    // Listen for storage events to refresh when bookmarks change
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'BOOKMARK_GROUPS_V2' || e.key === 'DEFAULT_BOOKMARKS_V1') {
        loadBookmarks();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom event for same-tab updates
    const handleBookmarkUpdate = () => {
      loadBookmarks();
    };
    
    window.addEventListener('bookmarksUpdated', handleBookmarkUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('bookmarksUpdated', handleBookmarkUpdate);
    };
  }, []);

  const renderBookmarkCard = (bookmark: BookmarkItem, label?: string, icon?: any, colorClass?: string) => {
    let linkTo: string;
    
    if (bookmark.type === "route" && bookmark.routeId !== undefined && bookmark.direction !== undefined) {
      linkTo = `/nearby/simple-routes/${bookmark.routeId}?stop=${bookmark.stopId}&direction=${bookmark.direction}`;
      // Add destination if available
      if (bookmark.destinationStopId !== undefined) {
        linkTo += `&destination=${bookmark.destinationStopId}`;
      }
    } else {
      linkTo = `/stop/${bookmark.stopId}`;
    }
    
    return (
      <Link key={bookmark.id} to={linkTo} className={`bookmark-card ${colorClass || ''}`}>
        {label && (
          <div className={`bookmark-label ${colorClass || ''}`}>
            {icon && <FontAwesomeIcon icon={icon} className="me-1" />}
            {label}
          </div>
        )}
        <div className="bookmark-header">
          <StopLocationIndicator locationId={bookmark.stopId} size="small" nearbyStops />
          <span className="bookmark-id">{bookmark.stopId}</span>
        </div>
        <div className="bookmark-desc">
          {bookmark.type === "route" ? (bookmark.routeDesc || `Route ${bookmark.routeId}`) : (bookmark.stopDesc || `Stop ${bookmark.stopId}`)}
        </div>
        {bookmark.type === "route" && (
          <div className="bookmark-meta">
            {bookmark.stopDesc || `Stop ${bookmark.stopId}`}
            {bookmark.destinationStopDesc && (
              <> → {bookmark.destinationStopDesc}</>
            )}
          </div>
        )}
      </Link>
    );
  };

  const renderEmptyDefaultCard = (type: "home" | "work") => {
    const icon = type === "home" ? faHome : faBriefcase;
    const label = type === "home" ? "Home" : "Work";
    const colorClass = type === "home" ? "bookmark-home" : "bookmark-work";
    
    return (
      <Link to="/bookmarks" className={`bookmark-card bookmark-card-empty ${colorClass}`} key={`empty-${type}`}>
        <div className={`bookmark-label ${colorClass}`}>
          <FontAwesomeIcon icon={icon} className="me-1" />
          {label}
        </div>
        <div className="bookmark-empty-content">
          <FontAwesomeIcon icon={icon} className="empty-icon" />
          <div className="empty-text">Set {type} route</div>
        </div>
      </Link>
    );
  };

  return (
    <Card className="home-section-card">
      <Card.Body>
        <div className="home-section-header">
          <div>
            <Card.Title><FontAwesomeIcon icon={faBookmark} className="section-icon" /> Bookmarks</Card.Title>
            <Card.Text className="section-subtitle">
              Quick links to your saved routes
            </Card.Text>
          </div>
          <Link to="/bookmarks" className="section-link">View all</Link>
        </div>
        {!homeBookmark && !workBookmark && bookmarks.length === 0 ? (
          <div className="section-empty">No bookmarks yet.</div>
        ) : (
          <div className="bookmarks-grid">
            {/* Home bookmark - show card or empty state */}
            {homeBookmark ? renderBookmarkCard(homeBookmark, "Home", faHome, "bookmark-home") : renderEmptyDefaultCard("home")}
            
            {/* Work bookmark - show card or empty state */}
            {workBookmark ? renderBookmarkCard(workBookmark, "Work", faBriefcase, "bookmark-work") : renderEmptyDefaultCard("work")}
            
            {/* Other recent bookmarks */}
            {bookmarks.map((bookmark) => renderBookmarkCard(bookmark))}
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default BookmarksPreview;
