import { Pane } from '@cybercongress/gravity';
import ActionBarContainer from './index';
import { ButtonIcon } from '../../../../components';
import BtnGrd from '../btnGrd';

const back = require('../../../../image/arrow-left-img.svg');

function ActionBarContentText({ children, gridGap, ...props }) {
  return (
    <Pane
      display="flex"
      fontSize="20px"
      justifyContent="center"
      alignItems="center"
      flexGrow={1}
      gridGap={gridGap}
      // marginRight="15px"
      {...props}
    >
      {children}
    </Pane>
  );
}

function ActionBarSteps({
  children,
  btnText,
  onClickFnc,
  onClickBack,
  disabled,
  gridGap,
}) {
  return (
    <ActionBarContainer>
      {onClickBack && (
        <ButtonIcon
          styleContainer={{ position: 'absolute', left: '0' }}
          style={{ padding: 0 }}
          img={back}
          onClick={onClickBack}
          text="previous step"
        />
      )}
      <ActionBarContentText
        gridGap={gridGap}
        //  marginLeft={onClickBack ? 30 : 0}
      >
        {children}
      </ActionBarContentText>
      {btnText && (
        <BtnGrd disabled={disabled} onClick={onClickFnc} text={btnText} />
      )}
    </ActionBarContainer>
  );
}

export default ActionBarSteps;
