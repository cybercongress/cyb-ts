import { ClipboardEventHandler, useCallback, useEffect, useState } from 'react';
import { Button, Display, Input } from 'src/components';
import Dropdown from 'src/components/Dropdown/Dropdown';

const columnsIndexes12 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const columnsIndexes24 = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  22, 23,
];
const columns = { '12': columnsIndexes12, '24': columnsIndexes24 };

interface ConnectWalletModalProps {
  onAdd(name: string, mnemonic: string): void | Promise<void>;
  onCancel(): void;
}

export default function ConnectWalletModal({
  onAdd,
  onCancel,
}: ConnectWalletModalProps) {
  const [mnemonicsLength, setMnemonicsLength] =
    useState<keyof typeof columns>('12');
  const [columnsIndexes, setColumnsIndexes] = useState(columnsIndexes12);
  const [values, setValues] = useState<Record<number, string>>(
    columnsIndexes.reduce((acc, index) => ({ ...acc, [index]: '' }), {})
  );
  const [name, setName] = useState('');

  const onMnemonicsPaste = useCallback<ClipboardEventHandler<HTMLDivElement>>(
    (event) => {
      event.preventDefault();

      const paste = (event.clipboardData || window.clipboardData).getData(
        'text'
      );

      const words = paste.split(' ');
      const newValues = { ...values };
      for (let i = 0; i < words.length; i++) {
        newValues[i] = words[i];
      }

      setValues(newValues);
    },
    [values]
  );

  useEffect(() => {
    setColumnsIndexes(columns[mnemonicsLength]);
  }, [mnemonicsLength]);

  const onAddClick = useCallback(async () => {
    try {
      await onAdd(name, Object.values(values).join(' '));
    } catch (error) {
      console.error('Failed to add mnemonics:', error);
    }
  }, [onAdd, name, values]);

  const canAdd =
    !!name &&
    Object.values(values).filter(Boolean).length === Number(mnemonicsLength);

  return (
    <div
      style={{
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        position: 'fixed',
        minWidth: '70vw',
        minHeight: '80vh',
        backgroundColor: 'black',
        zIndex: 10000,
      }}
      onPaste={onMnemonicsPaste}
    >
      <Display
        title={
          <>
            <div>
              <h3 style={{ padding: '15px' }}>Enter your name</h3>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h3 style={{ padding: '15px' }}>Enter your seed phrase</h3>
              <div style={{ paddingTop: '15px' }}>
                <Dropdown
                  value={mnemonicsLength}
                  options={[
                    { label: '12', value: '12' },
                    { label: '24', value: '24' },
                  ]}
                  onChange={setMnemonicsLength as any}
                />
              </div>
            </div>
          </>
        }
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '25px',
          }}
        >
          {columnsIndexes.map((index) => (
            <Input
              key={`mnemonic-input-${index}`}
              title={`${index + 1}`}
              value={values[index]}
              onChange={(e) => {
                const update = { ...values };
                update[index] = e.target.value;
                setValues(update);
              }}
            />
          ))}
        </div>
        <div
          style={{
            paddingTop: '25px',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Button onClick={onCancel}>Cancel</Button>
          <Button onClick={onAddClick} disabled={!canAdd}>
            Add
          </Button>
        </div>
      </Display>
    </div>
  );
}
