import imgSwap from 'images/exchange-arrows.svg';
import { InputNumber } from 'src/components';
import TokenSetter from './tokenSetter.new';

// REFACT: Move outside or reuse
function ButtonIcon({
  img,
  disabled,
  onClick,
  ...props
}: {
  img: string;
  disabled?: boolean;
  props: any;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      // className={s.buttonIcon}
      disabled={disabled}
      onMouseUp={onClick}
      {...props}
    >
      <img src={img} alt="img" />
    </button>
  );
}

function DepositCreatePool({ stateProps, amountChangeHandler }) {
  const {
    accountBalances,
    tokenAAmount,
    tokenBAmount,
    tokenA,
    tokenB,
    setTokenA,
    setTokenB,
    totalSupply,
    tokenChange,
  } = stateProps;

  return (
    <>
      <TokenSetter
        accountBalances={accountBalances}
        balancesByDenom={tokenA}
        token={tokenA}
        totalSupply={totalSupply}
        selected={tokenB}
        onChangeSelect={setTokenA}
        // textLeft={getTextInput.tokenA}
      />
      <InputNumber
        id="tokenAAmount"
        onValueChange={amountChangeHandler}
        value={tokenAAmount}
      />

      <>
        <ButtonIcon
          onClick={() => tokenChange()}
          img={imgSwap}
          style={{
            position: 'relative',
            top: 0,
            transform: 'unset',
            left: 0,
            margin: '10px 0',
          }}
        />
        <TokenSetter
          accountBalances={accountBalances}
          balancesByDenom={tokenB}
          token={tokenB}
          totalSupply={totalSupply}
          selected={tokenA}
          onChangeSelect={setTokenB}
          // textLeft={getTextInput.tokenB}
        />
        <InputNumber
          id="tokenBAmount"
          value={tokenBAmount}
          onValueChange={amountChangeHandler}
        />
      </>
    </>
  );
}

export default DepositCreatePool;
