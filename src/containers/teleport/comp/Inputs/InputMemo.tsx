import { Input } from 'src/components';
import { Color } from 'src/components/LinearGradientContainer/LinearGradientContainer';
import AddFileButton from 'src/components/buttons/AddFile/AddFile';
import { useCallback, useRef } from 'react';
import { addContenToIpfs } from 'src/utils/ipfs/utils-ipfs';
import { useIpfs } from 'src/contexts/ipfs';
import styles from './styles.module.scss';

type Props = {
  onChangeValue: React.Dispatch<React.SetStateAction<string>>;
  value: string;
};

function InputMemo({ onChangeValue, value }: Props) {
  const { node } = useIpfs();
  const inputOpenFileRef = useRef<HTMLInputElement>(null);

  const calculationIpfsTo = useCallback(
    async (file) => {
      if (!node) {
        return;
      }
      const toCid = await addContenToIpfs(node, file);

      if (toCid) {
        onChangeValue(toCid);
      }
    },
    [node, onChangeValue]
  );

  const onClickClear = () => {
    onChangeValue('');
  };

  const showOpenFileDlg = () => {
    inputOpenFileRef.current.click();
  };

  const onChangeInputFileRef = (files) => {
    const file = files.current.files[0];

    calculationIpfsTo(file);
  };

  return (
    <div className={styles.containerInputMemo}>
      <Input
        value={value}
        onChange={(e) => onChangeValue(e.target.value)}
        title="type public message"
        color={Color.Pink}
        classNameTextbox={styles.contentValueInput}
        isTextarea
      />
      <div className={styles.containerAddFileButton}>
        <input
          ref={inputOpenFileRef}
          onChange={() => onChangeInputFileRef(inputOpenFileRef)}
          type="file"
          style={{ display: 'none' }}
        />
        <AddFileButton
          isRemove={Boolean(value.length)}
          onClick={value.length ? onClickClear : showOpenFileDlg}
        />
      </div>
    </div>
  );
}

export default InputMemo;
