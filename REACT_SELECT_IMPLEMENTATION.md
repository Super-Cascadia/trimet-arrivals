# SearchHome with react-select Implementation

## Summary of Changes

The search functionality has been enhanced to use `react-select` with a preloaded list of TriMet route stops.

## Files Modified

### 1. SearchHero Component
**File:** [src/view/home/components/SearchHero.tsx](src/view/home/components/SearchHero.tsx)

**Changes:**
- Replaced basic `Form.Control` inputs with `react-select` components
- Integrated `useTrimetStops` hook to load stops data
- Changed state from string to `StopOption` objects
- Added custom styling for react-select components
- Added loading state with spinner during stops data fetch
- Added error display for failed stop loading
- Added labels above each select component
- Improved form validation to check for selected options

### 2. SearchHero Styles
**File:** [src/view/home/components/SearchHero.scss](src/view/home/components/SearchHero.scss)

**Changes:**
- Added comprehensive react-select styling
- Styled `.react-select__control` for consistent appearance
- Added hover and focus states for select inputs
- Styled options menu with proper colors and hover effects
- Added styles for loading state and error messages
- Enhanced mobile responsiveness

### 3. New Hook: useTrimetStops
**File:** [src/view/home/hooks/useTrimetStops.ts](src/view/home/hooks/useTrimetStops.ts)

**Features:**
- Loads stops from Portland downtown area (default center location)
- Uses a 5000-foot search radius to capture comprehensive Portland metro stops
- Transforms stop data into react-select format with label and value
- Sorts options alphabetically by stop name
- Provides loading state and error handling
- Exports `StopOption` interface for type safety

## How It Works

1. **On Component Mount:** The `useTrimetStops` hook automatically fetches nearby stops using the TriMet API
2. **Data Transformation:** Raw stop data is transformed into react-select format:
   - `value`: Stop location ID (used as unique key)
   - `label`: "Stop Name (ID)" format for user display
   - `stopData`: Full stop object for reference

3. **User Interaction:**
   - User can search/filter stops in the dropdown by typing
   - Selections populate the From and To fields
   - Clear button (X) allows resetting selections
   - Submit button is disabled until both From and To are selected

4. **Error Handling:** If stops fail to load, an error message displays above the form

## Future Enhancements

- Load stops based on user's current location instead of fixed Portland center
- Add support for searching by address and geocoding
- Cache stops data to reduce API calls
- Implement route suggestions based on selected stops
- Add real-time arrival information display
