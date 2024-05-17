import { InputNumber } from 'src/components';
import { useSubnet } from '../subnet.context';

type Props = {
  uid: number;
};

function GradeSetterInput({ uid }: Props) {
  const {
    grades: { newGrades },
  } = useSubnet();

  return (
    <InputNumber
      // data-address={hotkey}
      maxValue={10}
      value={newGrades?.data?.[uid] || 0}
      onChange={(e) => {
        newGrades?.setGrade(uid.toString(), +e);
      }}
    />
  );
}

export default GradeSetterInput;
