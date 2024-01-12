import { Input } from 'src/components';
import { Color } from 'src/components/LinearGradientContainer/LinearGradientContainer';
import AddFileButton from 'src/components/buttons/AddFile/AddFile';
import { useCallback, useRef } from 'react';
import { useBackend } from 'src/contexts/backend';
import styles from './InputMemo.module.scss';

type Props = {
  onChangeValue: React.Dispatch<React.SetStateAction<string>>;
  value: string;
};

function InputMemo({ onChangeValue, value }: Props) {
  const { ipfsApi, isIpfsInitialized } = useBackend();
  const inputOpenFileRef = useRef<HTMLInputElement>(null);

  const calculationIpfsTo = useCallback(
    async (file) => {
      if (!ipfsApi || !isIpfsInitialized) {
        return;
      }
      const toCid = await ipfsApi.addContent(file);

      if (toCid) {
        onChangeValue(toCid);
      }
    },
    [ipfsApi, onChangeValue]
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
        isTextarea
        autoFocus
        className={styles.valueInputMemo}
      />
      <div className={styles.containerAddFileButton}>
        <input
          ref={inputOpenFileRef}
          onChange={() => onChangeInputFileRef(inputOpenFileRef)}
          type="file"
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
