import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { getAllBookmarks, BookmarkItem } from "../../../api/localstorage/bookmarkGroups.localstorage";
import StopLocationIndicator from "../../../component/stop/StopLocationIndicator";
import "./BookmarksPreview.scss";

interface Props {
  // Props kept for backwards compatibility but not used
  bookmarks?: any[];
}

function BookmarksPreview({ }: Props) {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);

  const loadBookmarks = () => {
    const allBookmarks = getAllBookmarks();
    console.log('loaded bookmarks', allBookmarks);
    const sorted = allBookmarks
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
      .slice(0, 4);
    setBookmarks(sorted);
  };

  useEffect(() => {
    loadBookmarks();

    // Listen for storage events to refresh when bookmarks change
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'BOOKMARK_GROUPS_V2') {
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
        {bookmarks.length === 0 ? (
          <div className="section-empty">No bookmarks yet.</div>
        ) : (
          <div className="bookmarks-grid">
            {bookmarks.map((bookmark) => {
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
                <Link key={bookmark.id} to={linkTo} className="bookmark-card">
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
            })}
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default BookmarksPreview;
