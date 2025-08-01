import axios from 'axios';
interface MapResponse {
  buffer: Buffer;
  location: string;
}

export async function getStaticMapBuffer(
  lat: string,
  lng: string,
): Promise<MapResponse> {
  const mapsApi = process.env.MAPS_API;
  const mapResponse: MapResponse = {
    // este tipo?
    buffer: new Buffer(''),
    location: '',
  };
  const zoom = 13;
  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=1280x720&maptype=hybrid&markers=color:red%7C${lat},${lng}&key=${mapsApi}`;

  console.log(staticMapUrl);
  const response = await axios.get(staticMapUrl, {
    responseType: 'arraybuffer',
  });

  const { data } = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${mapsApi}`,
  );

  const location = data.results[0].formatted_address;

  mapResponse.buffer = Buffer.from(response.data, 'binary');
  mapResponse.location = location;

  return mapResponse;
}
