export interface TypingTextProps {
  content: string;
  delay?: number;
}

export const TypingText: React.FC<TypingTextProps>;

export function formatNumber(value: number, decimals?: number): string; 