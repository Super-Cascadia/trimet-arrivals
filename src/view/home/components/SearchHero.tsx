import React, { useEffect, useState } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarker, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import { useTrimetStops, StopOption } from "../hooks/useTrimetStops";
import "./SearchHero.scss";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1511993226957-cd166aba52e8?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1517959105821-eaf2591984c2?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1541809379-338226448b6b?auto=format&fit=crop&w=1600&q=80",
];

interface SearchHeroProps {
  onSearch: (fromStop: StopOption, toStop: StopOption) => void;
}

function SearchHero({ onSearch }: SearchHeroProps) {
  const [fromLocation, setFromLocation] = useState<StopOption | null>(null);
  const [toLocation, setToLocation] = useState<StopOption | null>(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const { stopOptions, isLoading, error } = useTrimetStops();

  useEffect(() => {
    const interval = window.setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 8000);

    return () => window.clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (fromLocation && toLocation) {
      onSearch(fromLocation, toLocation);
    }
  };

  const customStyles = {
    control: (base: any) => ({
      ...base,
      padding: "0.25rem 0",
      borderRadius: "8px",
      border: "none",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
      transition: "all 0.3s ease",
      "&:focus": {
        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
      },
      "&:hover": {
        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
      }
    }),
    input: (base: any) => ({
      ...base,
      color: "#333",
      fontSize: "1rem"
    }),
    placeholder: (base: any) => ({
      ...base,
      color: "#999"
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected ? "#667eea" : state.isFocused ? "#f0f0f0" : "white",
      color: state.isSelected ? "white" : "#333",
      padding: "10px 12px",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: state.isSelected ? "#667eea" : "#f0f0f0"
      }
    }),
    menuList: (base: any) => ({
      ...base,
      maxHeight: "300px",
      fontSize: "0.95rem"
    }),
    menuPortal: (base: any) => ({
      ...base,
      zIndex: 9999,
    })
  };

  return (
    <div
      className="search-hero"
      style={{
        backgroundImage: `url(${HERO_IMAGES[heroIndex]})`,
      }}
    >
      <div className="search-hero-content">
        <h1>Go by Transit</h1>
        <p>Get directions and real-time arrival information for TriMet</p>
        
        {error && <div className="search-error">{error}</div>}
        
        <Form onSubmit={handleSearch} className="search-form">
          <div className="search-inputs-row">
            <div className="search-input-group">
              <label className="search-label">From</label>
              <Select
                options={stopOptions}
                value={fromLocation}
                onChange={(option) => setFromLocation(option)}
                isLoading={isLoading}
                isClearable
                isSearchable
                placeholder="Select a stop or location..."
                styles={customStyles}
                className="react-select"
                classNamePrefix="react-select"
                menuPortalTarget={document.body}
              />
            </div>
            
            <div className="swap-icon">
              <FontAwesomeIcon icon={faArrowRight} />
            </div>
            
            <div className="search-input-group">
              <label className="search-label">To</label>
              <Select
                options={stopOptions}
                value={toLocation}
                onChange={(option) => setToLocation(option)}
                isLoading={isLoading}
                isClearable
                isSearchable
                placeholder="Select a stop or location..."
                styles={customStyles}
                className="react-select"
                classNamePrefix="react-select"
                menuPortalTarget={document.body}
              />
            </div>
          </div>
          
          <Button
            variant="primary"
            size="lg"
            type="submit"
            className="search-button"
            disabled={!fromLocation || !toLocation || isLoading}
          >
            {isLoading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Loading stops...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faMapMarker} className="me-2" />
                Search Routes
              </>
            )}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default SearchHero;
