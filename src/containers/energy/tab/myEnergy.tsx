import { Pane } from '@cybercongress/gravity';
import { Card, TableSlots } from '../ui';
import { DenomArr, Dots } from '../../../components';
import { formatNumber } from '../../../utils/utils';
import { routes } from 'src/routes';
import { Link } from 'react-router-dom';

// TODO: finish
type Props = {
  balacesResource: {
    milliampere: number | null;
    millivolt: number | null;
  };
  slotsData: unknown;
  loadingAuthAccounts: unknown;
};

function MyEnergy({ slotsData, balacesResource, loadingAuthAccounts }: Props) {
  return (
    <div>
      <div
        style={{
          padding: '15px',
        }}
      >
        <Pane marginY={30} textAlign="center">
          <Link to={routes.oracle.ask.getLink('energy')}>Energy </Link> (W) is
          the product of{' '}
          <Link to={routes.oracle.ask.getLink('amper')}>ampers </Link> and{' '}
          <Link to={routes.oracle.ask.getLink('volt')}>volts</Link>
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
            title={<DenomArr denomValue="milliampere" />}
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
            title={<DenomArr denomValue="millivolt" />}
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
      </div>

      {loadingAuthAccounts ? <Dots big /> : <TableSlots data={slotsData} />}
    </div>
  );
}

export default MyEnergy;
