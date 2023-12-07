import s from './Slippage.module.scss';

type Props = {
  value: number;
};

function Slippage({ value }: Props) {
  return (
    <span className={s.container}>
      slippage: <span className={s.value}>{value}%</span>
    </span>
  );
}

export default Slippage;
