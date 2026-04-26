import axios from 'axios';

export interface SegmentTrackingRequest {
  originGobId: string;
  destinationGobId: string;
  line: string;
  sense: 'I' | 'V';
}

export interface SegmentBus {
  localidad_nombre?: string | null;
  loc_gob_id?: string | number | null;
  coche?: string;
  linea?: string;
  sentido?: string;
  servicio?: string;
  tiempo?: string;
  lat?: string | number;
  lon?: string | number;
}

export interface RouteDetailPoint {
  localidad_nombre?: string | null;
  loc_gob_id?: string | number | null;
}

interface SegmentRawResponse {
  ok?: boolean;
  data?: {
    coches?: SegmentBus[];
    ruta_detalle?: RouteDetailPoint[];
  };
}

export interface SegmentTrackingData {
  buses: SegmentBus[];
  routeDetail: RouteDetailPoint[];
}

const SEGMENT_TRACKER_URL =
  'https://micronauta2.dnsalias.net/usuario/funciones/cmd.php';

export async function fetchSegmentTracking(
  cookie: string,
  request: SegmentTrackingRequest,
): Promise<SegmentTrackingData> {
  const postData = new URLSearchParams();
  postData.append('cmd', 'buscarcocheportramo');
  postData.append(
    'clientesTotal',
    JSON.stringify([
      {
        cliente: '2',
        lineas: [
          {
            linea_id: request.line,
            sentido: request.sense,
            ruta: '0',
          },
        ],
      },
    ]),
  );
  postData.append('ruta_linea', '0');
  postData.append('cliente', '2');
  postData.append('origen_gob', request.originGobId);
  postData.append('destino_gob', request.destinationGobId);
  postData.append('provincial', '0');
  postData.append('linea', request.line);
  postData.append('sentido', request.sense);
  postData.append('conf', 'elporvenir');

  const response = await axios.post<SegmentRawResponse>(
    SEGMENT_TRACKER_URL,
    postData.toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: '*/*',
        Cookie: `PHPSESSID=${cookie}`,
        'User-Agent':
          'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
      },
    },
  );

  const buses = Array.isArray(response.data?.data?.coches)
    ? response.data.data.coches
    : [];

  const routeDetail = Array.isArray(response.data?.data?.ruta_detalle)
    ? response.data.data.ruta_detalle
    : [];

  return {
    buses,
    routeDetail,
  };
}
