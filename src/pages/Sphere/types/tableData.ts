import { Coin } from '@cosmjs/stargate';
import { Validator } from '@cybercongress/cyber-ts/cosmos/staking/v1beta1/staking';

export interface ValidatorTableData extends Validator {
  id: number;
  rank: 'imperator' | 'jedi' | 'padawan' | 'heroes' | 'relax' | 'inactive';
  apr: number;
  powerPercent: string;
  delegation?: Coin;
}
