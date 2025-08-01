import axios from 'axios';

export async function busSetter(
  cookie: string,
  url: string,
  data: { id: string; c?: string; a?: string },
) {
  const dataToUrl = new URLSearchParams(data).toString();

  const res = await axios.post(url, dataToUrl, {
    // Pensar si poner afuera esto para modificar de manera separada...
    headers: {
      'User-Agent':
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
      Accept: '*/*',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      Cookie: `PHPSESSID=${cookie}`,
    },
  });

  // console.log('ACÁ VA...');
  // console.log(`Res: ${res.data}`);
  // console.log('TERMINO..');

  return res;
}
