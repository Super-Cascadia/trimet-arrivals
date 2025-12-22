import { useEffect, useState } from "react";
import { StopLocation } from "../../../api/trimet/interfaces/types";
import { getNearbyStops } from "../../../api/trimet/stops";

export interface StopOption {
  value: string;
  label: string;
  stopData: StopLocation;
}

const NEARBY_SEARCH_RADIUS = 5000; // feet - approximately 1.5 km (entire Portland metro area)
const DEFAULT_CENTER_LAT = 45.5152; // Portland, OR center
const DEFAULT_CENTER_LNG = -122.6784;

/**
 * Hook to load TriMet stops for use in react-select
 * Loads stops from the default center location (Portland downtown)
 */
export function useTrimetStops(): {
  stopOptions: StopOption[];
  isLoading: boolean;
  error: string | null;
} {
  const [stopOptions, setStopOptions] = useState<StopOption[]>([]);
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
        
        // Transform stops into react-select format
        const options = (stopData.location || [])
          .map((stop: StopLocation) => ({
            value: stop.locid?.toString() || stop.desc,
            label: `${stop.desc} (${stop.locid || 'Unknown ID'})`,
            stopData: stop
          }))
          .sort((a, b) => a.label.localeCompare(b.label));

        setStopOptions(options);
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
