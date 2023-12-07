import s from './Slippage.module.scss';

type Props = {
  value: number;
};

function Slippage({ value }: Props) {
  return (
    <div className={s.container}>
      slippage: <span className={s.value}>{value}%</span>
    </div>
  );
}

export default Slippage;
