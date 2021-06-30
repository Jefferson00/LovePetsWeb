import { formatDistance } from 'date-fns';
import { pt } from 'date-fns/locale';

export default function getDistanceTime(create_at: Date) {
  const distanceTime = formatDistance(
    new Date(create_at),
    new Date(),
    { locale: pt, addSuffix: true }
  );

  return distanceTime;
}
