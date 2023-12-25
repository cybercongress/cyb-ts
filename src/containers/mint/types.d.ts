export type Slot = {
  length: number;
  status: 'Liquid' | 'Unfreezing';
  time: string;
  amount: {
    hydrogen: number;
    millivolt: number;
    milliampere: number;
  };
};
