import { Pane, Pill } from '@cybercongress/gravity';
import { formatNumber } from 'src/utils/utils';

// TODO: Move to reusable components
function PaneWithPill({ caption, count, active }) {
  return (
    <Pane display="flex" alignItems="center">
      <Pane>{caption}</Pane>
      {count > 0 && (
        <Pill marginLeft={5} active={active}>
          {formatNumber(count)}
        </Pill>
      )}
    </Pane>
  );
}

export default PaneWithPill;
