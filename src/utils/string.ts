export function shortenString(string: string, length = 300) {
  return string.length > length ? `${string.slice(0, length)}...` : string;
}
