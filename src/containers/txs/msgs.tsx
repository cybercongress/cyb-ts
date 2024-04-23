import { Pane } from '@cybercongress/gravity';
import Activites from './Activites';
import Display from 'src/components/containerGradient/Display/Display';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';

function Msgs({ data }) {
  return (
    <Display title={<DisplayTitle title=" Msgs" />} color="blue">
      <Pane display="flex" width="100%" flexDirection="column">
        {data.map((msg, index) => (
          <Activites key={index} msg={msg} />
        ))}
      </Pane>
    </Display>
  );
}

export default Msgs;
