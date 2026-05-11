import axios from 'axios';

interface MapResponse {
  buffer: Buffer;
  location: string;
}

interface GeocodeResult {
  formatted_address: string;
}

interface GeocodeResponse {
  results: GeocodeResult[];
}

export async function seeBusMapGenerator(
  lat: string,
  lng: string,
): Promise<MapResponse> {
  const mapsApi = process.env.MAPS_API;
  const mapResponse: MapResponse = {
    buffer: Buffer.from(''),
    location: '',
  };
  const zoom = 13;
  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=1280x720&maptype=hybrid&markers=color:red%7C${lat},${lng}&key=${mapsApi}`;

  const response = await axios.get<ArrayBuffer>(staticMapUrl, {
    responseType: 'arraybuffer',
  });

  const { data } = await axios.get<GeocodeResponse>(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${mapsApi}`,
  );

  const location = data.results[0]?.formatted_address ?? `${lat}, ${lng}`;

  mapResponse.buffer = Buffer.from(response.data);
  mapResponse.location = location;

  return mapResponse;
}
