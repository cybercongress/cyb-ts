export function cutSenseItem(value: string) {
  return `${value.slice(0, 5)}...${value.slice(-5)}`;
}
