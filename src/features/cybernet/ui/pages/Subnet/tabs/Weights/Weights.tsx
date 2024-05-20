import WeightsTable from './WeightsTable/WeightsTable';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import Display from 'src/components/containerGradient/Display/Display';
import useAdviserTexts from 'src/features/cybernet/_move/useAdviserTexts';

type Props = {
  addressRegisteredInSubnet: boolean;
};

function Weights({ addressRegisteredInSubnet }: Props) {
  useAdviserTexts({
    defaultText: 'Subnet weights',
  });

  return (
    <div>
      <Display title={<DisplayTitle title="Grades" />}>
        <WeightsTable />
      </Display>

      <br />
    </div>
  );
}

export default Weights;
