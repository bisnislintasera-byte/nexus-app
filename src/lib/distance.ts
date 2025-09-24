export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  console.log('Calculating distance for coordinates:', { lat1, lon1, lat2, lon2 });
  
  const R = 6371000; // Radius bumi dalam meter
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  const distance = R * c; // dalam meter
  console.log('Calculated distance:', distance, 'meters');
  
  return distance;
}

export function formatDistance(distance: number): string {
  if (distance >= 1000) {
    return `${(distance / 1000).toFixed(2)} kilometer`;
  }
  return `${Math.round(distance)} meter`;
}

export function isWithinRadius(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  maxRadius: number = 100
): { isValid: boolean; distance: number } {
  console.log('Calculating distance with parameters:', { lat1, lon1, lat2, lon2, maxRadius });
  const distance = calculateDistance(lat1, lon1, lat2, lon2);
  console.log('Calculated distance:', distance, 'meters');
  return {
    isValid: distance <= maxRadius,
    distance
  };
}