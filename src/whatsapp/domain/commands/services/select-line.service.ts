import axios from 'axios';

export async function setSelectLine(cookie: string) {
  const url = 'https://micronauta.dnsalias.net/usuario/select_linea.php';

  const res = await axios.post(url, 'id=5%3D2%3D-1%3A0', {
    headers: {
      'Content-Type': 'text/plain',
      Cookie: `PHPSESSID=${cookie}`,
    },
  });
  return res;
}
