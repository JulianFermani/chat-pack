export interface SeeBusesData {
  cookie: string;
  originPlaces: { [key: string]: string };
  destinationPlaces: { [key: string]: string };
  idOrigin: string;
  numUserOrigin: number;
  idDestination: string;
  numUserDestination: number;
  lat: string;
  lng: string;
}
