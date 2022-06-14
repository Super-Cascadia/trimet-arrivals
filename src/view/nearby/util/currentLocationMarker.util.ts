import { LatLngCoords } from "../components/NearbyMapV2";

function getPulsingDot(map: unknown) {
  const size = 200;

  return {
    data: new Uint8Array(size * size * 4),
    height: size,
    // When the layer is added to the map,
    // get the rendering context for the map canvas.
    onAdd() {
      const canvas = document.createElement("canvas");
      canvas.width = this.width;
      canvas.height = this.height;
      this.context = canvas.getContext("2d");
    },
    width: size,

    // Call once before every frame where the icon will be used.
    render() {
      const duration = 1000;
      const t = (performance.now() % duration) / duration;

      const radius = (size / 2) * 0.3;
      const outerRadius = (size / 2) * 0.7 * t + radius;
      const context = this.context;

      // Draw the outer circle.
      context.clearRect(0, 0, this.width, this.height);
      context.beginPath();
      context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2);
      context.fillStyle = `rgba(255, 200, 200, ${1 - t})`;
      context.fill();

      // Draw the inner circle.
      context.beginPath();
      context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
      context.fillStyle = "rgba(255, 100, 100, 1)";
      context.strokeStyle = "white";
      context.lineWidth = 2 + 4 * (1 - t);
      context.fill();
      context.stroke();

      // Update this image's data with data from the canvas.
      this.data = context.getImageData(0, 0, this.width, this.height).data;

      // Continuously repaint the map, resulting
      // in the smooth animation of the dot.
      // @ts-ignore
      map.triggerRepaint();

      // Return `true` to let the map know that the image was updated.
      return true;
    }
  };
}

export function setCurrentLocationMarker(
  map: unknown,
  currentLocation: LatLngCoords
) {
  if (currentLocation) {
    const pulsingDot = getPulsingDot(map);
    // @ts-ignore
    map.addImage("pulsing-dot", pulsingDot, { pixelRatio: 2 });
    // @ts-ignore
    map.addSource("dot-point", {
      data: {
        features: [
          {
            geometry: {
              coordinates: currentLocation, // icon position [lng, lat]
              type: "Point"
            },
            type: "Feature"
          }
        ],
        type: "FeatureCollection"
      },
      type: "geojson"
    });
    // @ts-ignore
    map.addLayer({
      id: "layer-with-pulsing-dot",
      layout: {
        "icon-image": "pulsing-dot"
      },
      source: "dot-point",
      type: "symbol"
    });
  }
}