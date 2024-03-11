import { PATTERN_CYBER } from 'src/constants/app';

export function cutSenseItem(value: string) {
  return `${value.slice(0, 5)}...${value.slice(-5)}`;
}

export function isBostromAddress(value: string) {
  return value.match(PATTERN_CYBER);
}
