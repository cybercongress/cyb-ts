import { formatCurrency } from '../../utils/utils';
import { ContentTooltipProps } from './type';

const PREFIXES = [
  {
    prefix: 't',
    power: 10 ** 12,
  },
  {
    prefix: 'g',
    power: 10 ** 9,
  },
  {
    prefix: 'm',
    power: 10 ** 6,
  },
  {
    prefix: 'k',
    power: 10 ** 3,
  },
];

const emptyBatteryMessage =
  'Empty battery. You have no power & energy so you cannot submit cyberlinks. ';

const getBatteryMessage = ({
  bwMaxValue,
  amounPower,
  countLink,
}: ContentTooltipProps) =>
  bwMaxValue > 0
    ? `You have ${formatCurrency(
        amounPower,
        'W',
        2,
        PREFIXES
      )} and can immediately submit ${Math.floor(countLink)} cyberlinks. `
    : emptyBatteryMessage;

export default getBatteryMessage;
