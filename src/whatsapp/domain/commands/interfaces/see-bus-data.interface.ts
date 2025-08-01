export interface SeeBusesData {
  cookie: string;
  originPlaces: { [key: string]: string };
  destinationPlaces: { [key: string]: string };
  idOrigin: string;
  idDestination: string;
  lat: string;
  lng: string;
}
