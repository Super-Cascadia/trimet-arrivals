import { useEffect, useState } from "react";
import { StopLocation } from "../../../api/trimet/interfaces/types";
import { getNearbyStops } from "../../../api/trimet/stops";

export interface StopOption {
  value: string;
  label: string;
  stopData: StopLocation;
}

export interface StopOptionGroup {
  label: string;
  options: StopOption[];
}

export type GroupedStopOptions = StopOptionGroup[];

const NEARBY_SEARCH_RADIUS = 5000; // feet - approximately 1.5 km (entire Portland metro area)
const DEFAULT_CENTER_LAT = 45.5152; // Portland, OR center
const DEFAULT_CENTER_LNG = -122.6784;

/**
 * Determine quadrant based on coordinates relative to Portland center
 */
function getQuadrant(lat: number, lng: number): string {
  const isNorth = lat >= DEFAULT_CENTER_LAT;
  const isEast = lng >= DEFAULT_CENTER_LNG;
  
  if (isNorth && isEast) return "NE";
  if (isNorth && !isEast) return "NW";
  if (!isNorth && isEast) return "SE";
  return "SW";
}

/**
 * Hook to load TriMet stops for use in react-select
 * Loads stops from the default center location (Portland downtown)
 * Groups stops by quadrant (NE, NW, SE, SW)
 */
export function useTrimetStops(): {
  stopOptions: GroupedStopOptions;
  isLoading: boolean;
  error: string | null;
} {
  const [stopOptions, setStopOptions] = useState<GroupedStopOptions>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStops = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const location = {
          coords: {
            latitude: DEFAULT_CENTER_LAT,
            longitude: DEFAULT_CENTER_LNG
          }
        };

        const stopData = await getNearbyStops(location, NEARBY_SEARCH_RADIUS);
        
        // Transform stops into react-select format with quadrant grouping
        const stopsByQuadrant: { [key: string]: StopOption[] } = {
          NE: [],
          NW: [],
          SE: [],
          SW: []
        };
        
        (stopData.location || []).forEach((stop: StopLocation) => {
          const quadrant = getQuadrant(stop.lat, stop.lng);
          stopsByQuadrant[quadrant].push({
            value: stop.locid?.toString() || stop.desc,
            label: `${stop.desc} (${stop.locid || 'Unknown ID'})`,
            stopData: stop
          });
        });
        
        // Sort stops within each quadrant
        Object.keys(stopsByQuadrant).forEach(quadrant => {
          stopsByQuadrant[quadrant].sort((a, b) => a.label.localeCompare(b.label));
        });
        
        // Create grouped options for react-select
        const groupedOptions: GroupedStopOptions = [
          { label: "Northeast (NE)", options: stopsByQuadrant.NE },
          { label: "Northwest (NW)", options: stopsByQuadrant.NW },
          { label: "Southeast (SE)", options: stopsByQuadrant.SE },
          { label: "Southwest (SW)", options: stopsByQuadrant.SW }
        ].filter(group => group.options.length > 0); // Only include quadrants with stops

        setStopOptions(groupedOptions);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load stops");
        console.error("Error loading stops:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadStops();
  }, []);

  return { stopOptions, isLoading, error };
}
