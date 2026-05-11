import { RouteDetailPoint, SegmentBus } from './segment-bus-tracker.service';

export interface LocalityRef {
  id: string;
  name: string;
}

export function resolvePreviousLocality(
  routeDetail: RouteDetailPoint[],
  destinationGobId: string,
): LocalityRef | undefined {
  const orderedLocalities: LocalityRef[] = [];

  routeDetail.forEach((point) => {
    if (!point.loc_gob_id || !point.localidad_nombre) {
      return;
    }

    const locality: LocalityRef = {
      id: String(point.loc_gob_id),
      name: point.localidad_nombre,
    };

    const lastLocality = orderedLocalities.at(-1);
    if (lastLocality?.id === locality.id) {
      return;
    }

    orderedLocalities.push(locality);
  });

  const destinationIndex = orderedLocalities.findIndex(
    (locality) => locality.id === destinationGobId,
  );

  if (destinationIndex <= 0) {
    return;
  }

  return orderedLocalities[destinationIndex - 1];
}

export function isBusInLocality(
  bus: SegmentBus,
  locality: LocalityRef,
): boolean {
  if (!bus.loc_gob_id) {
    return false;
  }

  return String(bus.loc_gob_id) === locality.id;
}
