import { Pane } from '@cybercongress/gravity';
import { $TsFixMe } from 'src/types/tsfix';
import Tooltip from '../tooltip/tooltip';

export type Props = {
  img: $TsFixMe;
  active?: boolean;
  disabled?: boolean;
  text?: string | JSX.Element;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  styleContainer?: $TsFixMe;
  onClick?: () => void;
};

function ButtonIcon({
  img,
  active,
  disabled,
  text,
  placement = 'top',
  styleContainer,
  onClick,
  ...props
}: Props) {
  return (
    <Pane style={styleContainer}>
      <Tooltip placement={placement} tooltip={<Pane>{text}</Pane>}>
        <button
          type="button"
          style={{
            // boxShadow: active ? '0px 6px 3px -2px #36d6ae' : 'none',
            margin: '0 10px',
            padding: '5px 0',
          }}
          className={`container-buttonIcon ${active ? 'active-icon' : ''}`}
          disabled={disabled}
          onClick={onClick}
          {...props}
        >
          <img src={img} alt="img" />
        </button>
      </Tooltip>
    </Pane>
  );
}

export default ButtonIcon;
