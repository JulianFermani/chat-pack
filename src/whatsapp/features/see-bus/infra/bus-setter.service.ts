import axios, { AxiosResponse } from 'axios';

export async function busSetter(
  cookie: string,
  url: string,
  data: {
    cmd: string;
    conf: string;
    tkn: string;
  },
): Promise<AxiosResponse<any, any>> {
  const dataToUrl = new URLSearchParams(data).toString();

  const res = await axios.post(url, dataToUrl, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
      Accept: '*/*',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      Cookie: `PHPSESSID=${cookie}`,
    },
  });

  return res;
}
