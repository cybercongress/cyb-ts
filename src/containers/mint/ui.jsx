import { Tab, Pane } from '@cybercongress/gravity';
import { formatNumber } from '../../utils/utils';
import { Dots } from '../../components';

function Btn({ onSelect, checkedSwitch, text, disabledBtn, ...props }) {
  return (
    <Tab
      isSelected={checkedSwitch}
      onSelect={onSelect}
      color="#36d6ae"
      boxShadow="0px 0px 10px #36d6ae"
      minWidth="100px"
      marginX={0}
      paddingX={10}
      paddingY={10}
      fontSize="18px"
      height={42}
      {...props}
    >
      {text}
    </Tab>
  );
}

function ItemBalance({ text, amount, currency }) {
  return (
    <Pane marginBottom={15}>
      <Pane color="#979797" fontSize="16px">
        {text}
      </Pane>
      {amount === null ? (
        <Dots />
      ) : (
        <Pane>
          {formatNumber(amount)} {currency}
        </Pane>
      )}
    </Pane>
  );
}

export { Btn, ItemBalance };
