import { Link } from 'react-router-dom';
import { formatNumber } from '../../utils/search/utils';
import { ValueInformation } from './type';
import Display from 'src/components/containerGradient/Display/Display';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import { useMemo } from 'react';
import { Color } from 'src/components/LinearGradientContainer/LinearGradientContainer';
import { trimString } from 'src/utils/utils';
import StatusTxs from 'src/components/TableTxsInfinite/component/StatusTxs';
import { routes } from 'src/routes';
import Raw, { RowsContainer } from '../../components/Row/Row';

type Props = {
  data: ValueInformation | undefined;
};

function InformationTxs({ data }: Props) {
  let status = !data ? Color.Yellow : data.status ? Color.Green : Color.Red;

  const value = useMemo(() => {
    if (!data) {
      return <Raw title="status" value="pending" />;
    }

    return Object.keys(data).map((key) => {
      let valueRaw = data[key];

      switch (key) {
        case 'txHash':
          valueRaw = trimString(valueRaw, 6, 6);
          break;

        case 'height':
          valueRaw = (
            <Link to={routes.blocks.idBlock.getLink(valueRaw)}>
              {formatNumber(valueRaw)}
            </Link>
          );
          break;

        case 'status':
          valueRaw = <StatusTxs success={valueRaw} />;
          break;

        case 'timestamp':
          valueRaw = new Date(valueRaw).toString();
          break;
      }
      return <Raw key={key} title={key} value={valueRaw} />;
    });
  }, [data]);

  return (
    <Display color={status} title={<DisplayTitle title="Information" />}>
      <RowsContainer>{value}</RowsContainer>
    </Display>
  );
}

export default InformationTxs;
