import { useSubnet } from '../../../subnet.context';
import ActionBar from 'src/components/actionBar';
import useAdviserTexts from 'src/features/adviser/useAdviserTexts';

function SubnetMentorsActionBar() {
  const {
    grades: {
      newGrades: { save, isGradesUpdated, isLoading, blocksLeftToSetGrades },
    },
  } = useSubnet();

  useAdviserTexts({
    defaultText:
      blocksLeftToSetGrades &&
      `you have ${blocksLeftToSetGrades} blocks left to set grades`,
  });

  return (
    <ActionBar
      button={{
        text: !blocksLeftToSetGrades
          ? 'update grades'
          : 'update grades disabled',
        onClick: save,
        disabled: !isGradesUpdated || blocksLeftToSetGrades,
        pending: isLoading,
      }}
    />
  );
}

export default SubnetMentorsActionBar;
