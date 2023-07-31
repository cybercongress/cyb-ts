import { Input } from 'src/components';
import { Color } from 'src/components/LinearGradientContainer/LinearGradientContainer';
import styles from './styles.module.scss';

type Props = {
  onChangeValue: React.Dispatch<React.SetStateAction<string>>;
  value: string;
};

function InputMemo({ onChangeValue, value }: Props) {
  return (
    <Input
      value={value}
      onChange={(e) => onChangeValue(e.target.value)}
      title="type public message"
      color={Color.Pink}
      classNameTextbox={styles.contentValueInput}
    />
  );
}

export default InputMemo;