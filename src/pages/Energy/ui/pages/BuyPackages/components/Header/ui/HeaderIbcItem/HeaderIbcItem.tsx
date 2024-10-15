import { useAppSelector } from 'src/redux/hooks';
import { StatusTx } from 'src/features/ibc-history/HistoriesItem';
import StatusIbc from '../../../StatusIbc/StatusIbc';

function HeaderIbcItem() {
  const { ibcResult } = useAppSelector((state) => state.energy);

  let contentStatus = <span>via IBC</span>;
  let contentInfo = 'from 2 sec to several hours';

  if (ibcResult) {
    contentStatus = <StatusIbc />;
  }

  if (ibcResult && ibcResult.status === StatusTx.COMPLETE) {
    contentInfo = 'sended to bostrom';
  }

  return (
    <span>
      <p>{contentStatus}</p>
      <p>{contentInfo}</p>
    </span>
  );
}

export default HeaderIbcItem;
