import React, { useEffect, useState } from "react";
import { Form, Button, Spinner, Container, Row, Col, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarker, faArrowRight, faDice, faExchangeAlt } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import { useTrimetStops, StopOption } from "../hooks/useTrimetStops";
import StopLocationIndicator from "../../../component/stop/StopLocationIndicator";
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
  const [swapHovered, setSwapHovered] = useState(false);
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

  const handleFeelingLucky = () => {
    // Flatten all stop options from groups
    const allStops: StopOption[] = [];
    stopOptions.forEach((group: any) => {
      if (group.options) {
        allStops.push(...group.options);
      }
    });
    
    if (allStops.length < 2) return;
    
    // Get two random unique stops
    const randomIndex1 = Math.floor(Math.random() * allStops.length);
    let randomIndex2 = Math.floor(Math.random() * allStops.length);
    while (randomIndex2 === randomIndex1 && allStops.length > 1) {
      randomIndex2 = Math.floor(Math.random() * allStops.length);
    }
    
    const from = allStops[randomIndex1];
    const to = allStops[randomIndex2];
    
    setFromLocation(from);
    setToLocation(to);
    
    // Trigger search after state updates
    setTimeout(() => {
      onSearch(from, to);
    }, 0);
  };

  const handleSwapLocations = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
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
    group: (base: any) => ({
      ...base,
      paddingTop: "8px",
      paddingBottom: "8px"
    }),
    groupHeading: (base: any) => ({
      ...base,
      color: "#667eea",
      fontWeight: "600",
      fontSize: "0.85rem",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      paddingLeft: "12px",
      paddingRight: "12px",
      marginBottom: "4px"
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected ? "#667eea" : state.isFocused ? "#f0f0f0" : "white",
      color: state.isSelected ? "white" : "#333",
      padding: "10px 12px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "10px",
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
      <Container className="search-hero-content">
        <Row className="justify-content-center text-center mb-4">
          <Col>
            <h1>Go by Transit</h1>
            <p>Get directions and real-time arrival information for TriMet</p>
          </Col>
        </Row>
        
        {error && (
          <Row className="justify-content-center mb-3">
            <Col md={8}>
              <div className="search-error">{error}</div>
            </Col>
          </Row>
        )}
        
        <Form onSubmit={handleSearch} className="search-form">
          <Row className="justify-content-center mb-3">
            <Col xs={12} md={5} lg={4}>
              <Form.Group className="search-input-group">
                <Form.Label className="search-label">From</Form.Label>
                <Select
                  options={stopOptions}
                  value={fromLocation}
                  onChange={(option) => setFromLocation(option)}
                  isLoading={isLoading}
                  isClearable
                  isSearchable
                  placeholder="Select a stop or location..."
                  styles={customStyles}
                  formatOptionLabel={(option: StopOption) => (
                    <div className="stop-option-label">
                      <StopLocationIndicator locationId={parseInt(option.value, 10)} size="small" />
                      <span>{option.label}</span>
                    </div>
                  )}
                  className="react-select"
                  classNamePrefix="react-select"
                  menuPortalTarget={document.body}
                />
              </Form.Group>
            </Col>
            
            <Col xs={12} md="auto" lg="auto" className="d-flex justify-content-center swap-icon-col">
              <OverlayTrigger
                placement="bottom"
                overlay={
                  <Tooltip id="swap-tooltip">
                    Click to swap from and to locations
                  </Tooltip>
                }
              >
                <button
                  type="button"
                  className="swap-icon-button"
                  onClick={handleSwapLocations}
                  onMouseEnter={() => setSwapHovered(true)}
                  onMouseLeave={() => setSwapHovered(false)}
                >
                  <FontAwesomeIcon 
                    icon={swapHovered ? faExchangeAlt : faArrowRight} 
                    className="swap-icon-inner"
                  />
                </button>
              </OverlayTrigger>
            </Col>
            
            <Col xs={12} md={5} lg={4}>
              <Form.Group className="search-input-group">
                <Form.Label className="search-label">To</Form.Label>
                <Select
                  options={stopOptions}
                  value={toLocation}
                  onChange={(option) => setToLocation(option)}
                  isLoading={isLoading}
                  isClearable
                  isSearchable
                  placeholder="Select a stop or location..."
                  styles={customStyles}
                  formatOptionLabel={(option: StopOption) => (
                    <div className="stop-option-label">
                      <StopLocationIndicator locationId={parseInt(option.value, 10)} size="small" />
                      <span>{option.label}</span>
                    </div>
                  )}
                  className="react-select"
                  classNamePrefix="react-select"
                  menuPortalTarget={document.body}
                />
              </Form.Group>
            </Col>
          </Row>
          
          <Row className="justify-content-center g-2">
            <Col xs={12} md={6} lg={3}>
              <Button
                variant="primary"
                size="lg"
                type="submit"
                className="search-button w-100"
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
            </Col>
            <Col xs={12} md={6} lg={3}>
              <Button
                variant="secondary"
                size="lg"
                type="button"
                className="lucky-button w-100"
                disabled={isLoading || stopOptions.reduce((sum: number, group: any) => sum + (group.options?.length || 0), 0) < 2}
                onClick={handleFeelingLucky}
              >
                <FontAwesomeIcon icon={faDice} className="me-2" />
                I'm Feeling Lucky
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </div>
  );
}

export default SearchHero;
