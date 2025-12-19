/**
 * Utility functions for parsing and processing TriMet Trip Planner responses.
 */

/**
 * Normalizes a value into an array (handles single objects vs arrays).
 */
function normalizeToArray(value: any): Array<any> {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return [value];
}

/**
 * Extracts the first itinerary's legs from a Trip Planner response.
 * Useful for simple cases where only one route is needed.
 * 
 * @param plan - The parsed Trip Planner response (XML→JSON)
 * @returns Array of leg objects
 */
export function extractLegsFromTripPlan(plan: any): Array<any> {
  if (!plan || typeof plan !== "object") return [];

  try {
    const response = plan.response;
    if (!response) return [];

    const itineraries = response.itineraries;
    if (!itineraries) return [];

    const itinerary = itineraries.itinerary;
    if (!itinerary) return [];

    // Handle both single itinerary (object) and multiple (array)
    const firstItinerary = Array.isArray(itinerary) ? itinerary[0] : itinerary;
    if (!firstItinerary) return [];

    const legs = normalizeToArray(firstItinerary.leg);
    if (legs.length > 0) {
      console.log("Extracted Trip Planner legs:", legs);
      if (legs[0]) {
        console.log("Sample leg structure:", legs[0]);
      }
    }
    return legs;
  } catch (e) {
    console.warn("Failed to extract legs from trip plan", e);
  }
  return [];
}

/**
 * Extracts all itineraries from a Trip Planner response.
 * Use this when presenting multiple route options to the user.
 * 
 * @param plan - The parsed Trip Planner response (XML→JSON)
 * @returns Array of itinerary objects
 */
export function extractAllItineraries(plan: any): Array<any> {
  if (!plan || typeof plan !== "object") return [];
  try {
    const response = plan.response;
    if (!response) return [];
    const itineraries = response.itineraries;
    if (!itineraries) return [];
    const itinerary = itineraries.itinerary;
    if (!itinerary) return [];
    // Normalize to array
    return Array.isArray(itinerary) ? itinerary : [itinerary];
  } catch (e) {
    console.warn("Failed to extract itineraries", e);
  }
  return [];
}

/**
 * Extracts legs from a specific itinerary.
 * 
 * @param itinerary - An itinerary object from Trip Planner response
 * @returns Array of leg objects for the itinerary
 */
export function getLegsForItinerary(itinerary: any): Array<any> {
  if (!itinerary) return [];
  return normalizeToArray(itinerary.leg);
}

/**
 * Extracts timing and transfer info from an itinerary.
 * 
 * @param itinerary - An itinerary object from Trip Planner response
 * @returns Object with timing, transfer, and distance info
 */
export function getItineraryTimingInfo(itinerary: any) {
  const timeDistInfo = itinerary["time-distance"];
  return {
    startTime: timeDistInfo?.startTime || "?",
    endTime: timeDistInfo?.endTime || "?",
    duration: timeDistInfo?.duration || "?",
    numberOfTransfers: timeDistInfo?.numberOfTransfers || 0,
    walkingTime: timeDistInfo?.walkingTime || 0,
    transitTime: timeDistInfo?.transitTime || 0,
    distance: timeDistInfo?.distance || "?"
  };
}
