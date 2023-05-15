import { Link } from 'react-router-dom';
import { Pane, ActionBar } from '@cybercongress/gravity';
import ActionBarContainer from '../Search/ActionBarContainer';
import { trimString } from '../../utils/utils';

function ActionBarCont({
  mobile,
  addressActive,
  keywordHash,
  updateFunc,
  rankLink,
  textBtn,
}) {
  if (!mobile && addressActive && addressActive !== null) {
    if (addressActive.keys !== 'read-only') {
      return (
        <ActionBarContainer
          keywordHash={keywordHash}
          update={updateFunc}
          rankLink={rankLink}
          textBtn={textBtn}
        />
      );
    }
    return (
      <ActionBar>
        <Pane fontSize="18px">
          this {trimString(addressActive.bech32, 8, 6)} cyber address is
          read-only
        </Pane>
      </ActionBar>
    );
  }

  return (
    <ActionBar>
      <Pane fontSize="18px">
        add cyber address in your <Link to="/">pocket</Link>
      </Pane>
    </ActionBar>
  );
}

export default ActionBarCont;
