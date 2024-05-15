import { Pane } from '@cybercongress/gravity';
import Display from 'src/components/containerGradient/Display/Display';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';

function Columns({ title, children }) {
  return (
    <Pane
      width="100%"
      display="grid"
      gridTemplateColumns="100%"
      gridGap="20px"
      gridAutoRows="max-content"
      alignItems="flex-start"
      // boxShadow="0 0 3px 0px #fff"
      paddingTop={10}
      paddingBottom={15}
      borderRadius="5px"
    >
      <Display noPaddingY title={<DisplayTitle title={title} />}></Display>
      {children}
    </Pane>
  );
}

export default Columns;
