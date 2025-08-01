export async function getSeeBusCookie(): Promise<string> {
  const url = 'https://micronauta.dnsalias.net/usuario/index.php?a=diego';
  const res = await fetch(url);
  const cookie = res.headers.getSetCookie()[0].substr(11, 26);
  return cookie;
}
