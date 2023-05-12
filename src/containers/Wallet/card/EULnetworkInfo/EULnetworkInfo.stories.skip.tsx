import EULnetworkInfo, { Props } from './EULnetworkInfo';

export default {
  title: 'Components/EULnetworkInfo',
  component: EULnetworkInfo,
};

const Template = (args: Props) => <EULnetworkInfo {...args} />;

export const Default = Template.bind({});
Default.args = {
  totalCyber: {
    total: '1000',
    unclaimed: '500',
  },
  address: {
    bech32: 'cyber1abcdefghij',
  },
  loading: false,
  openEul: true,
  onClickDeleteAddress: () => {},
  network: {
    name: 'Bostrom',
    url: 'https://testnet.cybernode.ai',
  },
  balanceToken: {
    eul: '100',
  },
  onClick: () => {},
};
