import React, {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import styles from './Switch.module.scss';

type Props = {
  label?: string;
  value?: boolean;
  onChange: (checked: boolean) => void;
};

function Switch({ label, onChange, value }: Props) {
  const ref = useRef<HTMLLabelElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.setProperty(
        '--length',
        String(label?.length || 'Off'.length)
      );
    }
  }, [ref, label]);

  const onInputChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (e) => onChange(e.target.checked),
    [onChange]
  );

  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label className={styles.switch} ref={ref}>
      <input type="checkbox" defaultChecked={value} onChange={onInputChange} />
      <span className={styles.slider} />
      <span
        className={styles.labels}
        data-on={label || 'On'}
        data-off={label || 'Off'}
      />
    </label>
  );
}

export default React.memo(Switch);
