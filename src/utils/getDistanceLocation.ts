import { getDistance, convertDistance } from 'geolib';

interface LocationsProps{
  fromLat: string;
  fromLon:string;
  toLat: string;
  toLon: string;
}

export default function getDistanceLocation({fromLat, fromLon, toLat, toLon}: LocationsProps){
  const distance = getDistance(
    {lat: fromLat, lon: fromLon},
    {lat: toLat, lon: toLon}
  )

  const distanceInKm = convertDistance(distance, 'km');
  return Math.floor(distanceInKm);
}
