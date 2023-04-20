import { Pane } from '@cybercongress/gravity';
import { Card, TableSlots } from '../ui';
import { Dots, LinkWindow } from '../../../components';
import { formatNumber } from '../../../utils/utils';

const voltImg = require('../../../image/lightning2.png');
const amperImg = require('../../../image/light.png');

function ValueImg({ text, img }) {
  return (
    <div style={{ display: 'flex' }}>
      <span>{text}</span> <img style={{ width: 20 }} src={img} alt="text" />
    </div>
  );
}

function MyEnergy({ slotsData, balacesResource, loadingAuthAccounts }) {
  return (
    <div>
      <Pane marginY={30} textAlign="center">
        <LinkWindow>Energy </LinkWindow> (W) is the product of{' '}
        <LinkWindow>ampers </LinkWindow> and <LinkWindow>volts</LinkWindow>
      </Pane>
      <Pane marginBottom={20} fontSize="20px">
        Balance:
      </Pane>
      <Pane
        marginBottom={60}
        display="flex"
        alignItems="center"
        justifyContent="center"
        flex-irection="row"
      >
        <Card
          title={<ValueImg text="A" img={amperImg} />}
          value={
            balacesResource.milliampere
              ? formatNumber(balacesResource.milliampere)
              : 0
          }
          stylesContainer={{ maxWidth: '200px' }}
        />
        <Pane marginX={10} fontSize="18px">
          x
        </Pane>
        <Card
          title={<ValueImg text="V" img={voltImg} />}
          value={
            balacesResource.millivolt
              ? formatNumber(balacesResource.millivolt)
              : 0
          }
          stylesContainer={{ maxWidth: '200px' }}
        />
        <Pane marginX={10} fontSize="18px">
          =
        </Pane>
        <Card
          title="W"
          value={
            balacesResource.millivolt && balacesResource.milliampere
              ? formatNumber(
                  balacesResource.millivolt * balacesResource.milliampere
                )
              : 0
          }
          stylesContainer={{ maxWidth: '200px' }}
        />
      </Pane>

      {loadingAuthAccounts ? <Dots big /> : <TableSlots data={slotsData} />}
    </div>
  );
}

export default MyEnergy;
