// @ts-ignore
// tslint:disable-next-line:no-implicit-dependencies
import { Map } from "!mapbox-gl";
import { isString } from "lodash";

export function setMapZoom(
  map: Map,
  radiusSize: number,
  setZoom: React.Dispatch<React.SetStateAction<number>>
) {
  const radius = isString(radiusSize) ? parseInt(radiusSize, 10) : radiusSize;

  switch (radius) {
    case 250:
      setZoom(19);
      map.current.setZoom(19);
      break;
    case 500:
      setZoom(18);
      map.current.setZoom(18);
      break;
    case 750:
      setZoom(17);
      map.current.setZoom(17);
      break;
    case 1000:
      setZoom(16);
      map.current.setZoom(16);
      break;
    case 1500:
      setZoom(15.5);
      map.current.setZoom(15.5);
      break;
    case 2000:
      setZoom(15);
      map.current.setZoom(15);
      break;
    case 2500:
      setZoom(14.5);
      map.current.setZoom(14.5);
      break;
    case 5000:
      setZoom(13.5);
      map.current.setZoom(13.5);
      break;
    default:
      setZoom(16);
      map.current.setZoom(16);
  }
}
