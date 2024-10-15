import { Colors } from '../../../components/containerGradient/types';
import ghostIcon from './images/ghost.png';
import smartIcon from './images/smart.png';
import prodigyIcon from './images/prodigy.png';
import geniusIcon from './images/genius.png';

export interface Feature {
  label: string;
  subLabel: string;
}

export interface Plan {
  name: string;
  color: Colors;
  price: string;
  icon: string;
  features: boolean[];
  symbols: string;
  uploads: number;
  fuel: number;
  energy: number;
  influence: number;
}

export const features: Feature[] = [
  { label: 'brain surf', subLabel: 'search for free' },
  { label: 'private pins', subLabel: 'unlimited' },
  { label: 'public upload', subLabel: 'cyberlinks daily' },
  { label: '.moon citizenship', subLabel: 'afford cool short name' },
  { label: 'fuel', subLabel: 'main token, liquid' },
  { label: 'energy', subLabel: 'your power, A x V = kW' },
  { label: 'influence', subLabel: 'your content visibility' },
  { label: '3 free to use aips', subLabel: '' },
  { label: 'all powered aips', subLabel: '' },
];

export const plans: Plan[] = [
  {
    name: 'ghost',
    color: Colors.WHITE,
    price: 'free',
    icon: ghostIcon,
    features: [true, true, false, false, false, false, false, true, false],
    symbols: ' 8 ',
    uploads: 0,
    fuel: 0,
    energy: 0,
    influence: 0,
  },
  {
    name: 'smart',
    color: Colors.GREEN,
    price: '10$',
    icon: smartIcon,
    features: [true, true, true, true, true, true, true, true, false],
    symbols: ' 5 ',
    uploads: 80,
    fuel: 2,
    energy: 4,
    influence: 1,
  },
  {
    name: 'prodigy',
    color: Colors.BLUE,
    price: '100$',
    icon: prodigyIcon,
    features: [true, true, true, true, true, true, true, true, true],
    symbols: ' 4 ',
    uploads: 800,
    fuel: 20,
    energy: 1,
    influence: 7,
  },
  {
    name: 'genius',
    color: Colors.PURPLE,
    price: '1000$',
    icon: geniusIcon,
    features: [true, true, true, true, true, true, true, true, true],
    symbols: ' 3 ',
    uploads: 8000,
    fuel: 200,
    energy: 11,
    influence: 19,
  },
];
