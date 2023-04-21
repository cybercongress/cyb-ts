import { Pane } from '@cybercongress/gravity';
import Tooltip from '../tooltip/tooltip';

function ButtonIcon({
  img,
  active,
  disabled,
  text,
  placement = 'top',
  styleContainer,
  ...props
}) {
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
          {...props}
        >
          <img src={img} alt="img" />
        </button>
      </Tooltip>
    </Pane>
  );
}

export default ButtonIcon;
