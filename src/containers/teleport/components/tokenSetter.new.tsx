import { Pane } from '@cybercongress/gravity';
import BalanceToken from './balanceToken';
import Select from './select';
import { DenomArr, InputNumber, OptionSelect } from '../../../components';
import { $TsFixMeFunc } from 'src/types/tsfix';

type BalanceTokenDataType = {
  [key: string]: number;
};

type TokenSetterProps = {
  accountBalances: BalanceTokenDataType[] | null;
  totalSupply: BalanceTokenDataType[] | null;
  selected: string;
  token: string;
  onChangeSelect: $TsFixMeFunc;
  textLeft?: string;
};

const renderOptions = (
  data: BalanceTokenDataType[],
  selected: string,
  valueSelect: string
) => {
  return Object.keys(data)
    .filter((item) => item !== selected && item !== valueSelect)
    .map((key) => (
      <OptionSelect
        key={key}
        value={key}
        bgrImg={key.includes('pool')}
        text={<DenomArr denomValue={key} onlyText tooltipStatusText={false} />}
        img={<DenomArr denomValue={key} onlyImg tooltipStatusImg={false} />}
      />
    ));
};

function TokenSetter({
  accountBalances,
  totalSupply,
  selected,
  token,
  onChangeSelect,
  textLeft,
}: TokenSetterProps) {
  return (
    <Pane width="inherit">
      <BalanceToken data={accountBalances} token={token} />
      <Pane
        display="grid"
        gridTemplateColumns="40px 1fr"
        gridGap="27px"
        alignItems="flex-start"
        marginBottom={20}
      >
        <Pane width="33px" fontSize="20px" paddingBottom={10}>
          {textLeft}
        </Pane>
        <Pane width="100%" display="flex" flexDirection="column" gap="20px">
          <Select
            width="100%"
            valueSelect={token}
            textSelectValue={token !== '' ? token : ''}
            onChangeSelect={(item) => onChangeSelect(item)}
          >
            {!!totalSupply && renderOptions(totalSupply, selected, token)}
          </Select>
        </Pane>
      </Pane>
    </Pane>
  );
}

export default TokenSetter;
