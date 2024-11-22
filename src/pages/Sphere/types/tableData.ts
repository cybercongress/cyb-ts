import { Coin } from '@cosmjs/stargate';
import { Validator } from '@cybercongress/cyber-ts/cosmos/staking/v1beta1/staking';

export interface ValidatorTableData extends Validator {
  id: number;
  rank: '33' | '67' | 'primary' | 'imperator';
  apr: number;
  powerPercent: string;
  delegation?: Coin;
}
