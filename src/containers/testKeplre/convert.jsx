import Button from 'src/components/btnGrd';
import { Btn } from './ui';

function Convert({
  amount,
  select,
  setSelect,
  setAmount,
  convert,
  time,
  setTime,
}) {
  return (
    <>
      amount
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '150px 100px 100px',
          marginBottom: 5,
          gridGap: '2px',
        }}
      >
        <input
          value={amount}
          style={{ width: 100, height: 42, textAlign: 'end' }}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Btn
          text="volt"
          checkedSwitch={select === 'volt'}
          onSelect={() => setSelect('volt')}
        />
        <Btn
          text="amper"
          checkedSwitch={select === 'amper'}
          onSelect={() => setSelect('amper')}
        />
      </div>
      time
      <input
        value={time}
        style={{ width: 100, marginBottom: 30, height: 42, textAlign: 'end' }}
        onChange={(e) => setTime(e.target.value)}
      />
      <Button
        className="btn"
        maxWidth="160px"
        onClick={convert}
        disabled={amount <= 0}
      >
        convert
      </Button>
    </>
  );
}

// eslint-disable-next-line import/no-unused-modules
export default Convert;
