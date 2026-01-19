import { Dictionary } from "lodash";
import { StopData, TrimetRoute } from "../../../api/trimet/interfaces/types";
import { ArrivalLocation } from "../../../api/trimet/interfaces/arrivals";

export interface NearbyViewComponentOutletContextProps {
  currentLocation: number[];
  nearbyRoutes: Dictionary<TrimetRoute[]>;
  nearbyStops: StopData;
  radiusSize: number;
  minLoadingTime: boolean;
  handleRadiusSelectionChange: (e: any) => void;
  handleRefresh: () => void;
  handleFindNearMe: () => void;
  initializeMap: () => void;
  handleRouteArrivalsOpened: (
    id: string,
    direction: string,
    stop: string,
    stopLocation: ArrivalLocation,
    destinationStopLocation?: ArrivalLocation
  ) => void;
  handleStopOpened: (stopLocation: ArrivalLocation) => void;
  handleSimpleRoutesOpened: (labeledStops?: Array<{locid: number, label: string, lng: number, lat: number}>) => void;
  highlightStopMarker: (stopId: string | null) => void;
  clearAllMapLayers: () => void;
  onEnableMarkerPlacement?: () => void;
  isUsingDroppedMarker?: boolean;
  droppedMarkerLocation?: { lat: number; lng: number } | null;
  handleResetToGeoLocation?: () => void;
  handlePlaceMarker?: () => void;
  handlePlaceMarkerInServiceArea?: () => void;
  handleFlyToCurrentLocation?: () => void;
}
