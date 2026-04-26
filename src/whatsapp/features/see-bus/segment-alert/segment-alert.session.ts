export interface SegmentAlertSessionData {
  cookie: string;
  originPlaces: { [key: string]: string };
  destinationPlaces: { [key: string]: string };
  idOrigin: string;
  idDestination: string;
  numUserOrigin: number;
  numUserDestination: number;
}
