export async function seeBusCookieFetcher(): Promise<string> {
  const url =
    'https://micronauta2.dnsalias.net/usuario/app/yaviene/?conf=elporvenir';
  const res = await fetch(url);
  const cookie = res.headers.getSetCookie()[0].substr(11, 26);
  return cookie;
}
