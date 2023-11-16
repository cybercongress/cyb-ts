import imgSwap from 'images/exchange-arrows.svg';
import s from './index.module.scss';

function ButtonSwap({
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
      className={s.buttonIcon}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      <img src={imgSwap} alt="img" />
    </button>
  );
}

export default ButtonSwap;
