import WeightsTable from './WeightsTable/WeightsTable';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import Display from 'src/components/containerGradient/Display/Display';
import useAdviserTexts from 'src/features/cybernet/_move/useAdviserTexts';

type Props = {};

function Weights({}: Props) {
  useAdviserTexts({
    // defaultText: 'Subnet weights',
  });

  return (
    <div>
      <Display noPaddingX>
        <WeightsTable />
      </Display>

      <br />
    </div>
  );
}

export default Weights;
