const numberEmojis = [
  '0️⃣',
  '1️⃣',
  '2️⃣',
  '3️⃣',
  '4️⃣',
  '5️⃣',
  '6️⃣',
  '7️⃣',
  '8️⃣',
  '9️⃣',
];
export function getEmojiNumber(n: number): string {
  return n
    .toString()
    .split('')
    .map((d) => numberEmojis[Number(d)])
    .join('');
}
