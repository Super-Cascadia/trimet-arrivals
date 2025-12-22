# New Search Homepage Implementation

## Overview
A new homepage has been implemented with a hero panel featuring a transit search interface and suggested popular routes below.

## Files Created

### Main Component
- **[src/view/home/SearchHome.tsx](src/view/home/SearchHome.tsx)** - Main homepage component that combines the hero search and suggestions

### Sub-Components
- **[src/view/home/components/SearchHero.tsx](src/view/home/components/SearchHero.tsx)** - Hero panel with dual input search form (From/To locations)
- **[src/view/home/components/SearchSuggestions.tsx](src/view/home/components/SearchSuggestions.tsx)** - Popular routes suggestion cards

### Styling
- **[src/view/home/SearchHome.scss](src/view/home/SearchHome.scss)** - Main component styles with gradient background
- **[src/view/home/components/SearchHero.scss](src/view/home/components/SearchHero.scss)** - Hero panel styles with responsive design
- **[src/view/home/components/SearchSuggestions.scss](src/view/home/components/SearchSuggestions.scss)** - Suggestion cards styling with hover effects

## Files Modified
- **[src/routes/RootAppRoutes.tsx](src/routes/RootAppRoutes.tsx)** - Updated routing to use `SearchHome` as the homepage (route "/") instead of redirecting to "/nearby"

## Features

### Hero Panel
- Beautiful gradient background with decorative circles
- Two input fields for "From" and "To" locations
- Disabled state for search button until both fields are filled
- Responsive design for mobile, tablet, and desktop

### Popular Routes Suggestions
Four pre-configured route suggestions with icons:
1. **Current Location to Airport** (PDX)
2. **Current Location to Zoo** (Oregon Zoo, Beaverton)
3. **Downtown to Airport** (Pioneer Courthouse Square to PDX)
4. **Downtown to Union Station** (Pioneer Courthouse Square to Union Station)

Each suggestion card includes:
- Descriptive title and subtitle
- Icon representation
- From/To location details
- Hover effects with elevation and scale
- Click handlers to populate the search form
- Keyboard accessibility (Enter key support)

## Styling Details
- **Color Scheme**: Purple gradient hero (#667eea to #764ba2) with coral/red accent button (#ff6b6b)
- **Icons**: Uses FontAwesome icons (faMapMarker, faMapPin, faPlane, faStoreAlt)
- **Responsive Breakpoints**: Mobile (<768px), Tablet (768-1024px), Desktop (>1024px)
- **Interactive Effects**: 
  - Button hover states with color change and elevation
  - Card hover states with lift effect
  - Smooth transitions on all interactive elements
  - Input focus states with shadow enhancement

## Future Implementation
The `onSearch` handler in SearchHome is ready to be connected to navigation logic that will:
- Navigate to a detailed directions view
- Populate search parameters in URL
- Trigger API calls to TriMet transit planner service
