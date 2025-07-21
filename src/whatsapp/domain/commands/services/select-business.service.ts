import axios from 'axios';

export async function setSelectBusiness(cookie: string) {
  const url = 'https://micronauta.dnsalias.net/usuario/select_empresa.php';

  const res = await axios.post(
    url,
    'id=5&c=2%2C2%2C2%2C2%2C2&a=1%2C2%2C3%2C4%2C5',
    {
      headers: {
        'Content-Type': 'text/plain',
        Cookie: `PHPSESSID=${cookie}`,
      },
    },
  );

  return res;
}
