import React, { useState } from 'react';
import { Pill } from '@cybercongress/gravity';
import styles from './Switch.module.scss';

function Switch({
  isOn,
  onToggle,
  label = undefined,
}: {
  isOn: boolean;
  onToggle: (isOn: boolean) => void;
  label: React.ReactNode;
}) {
  // const [active, setActive] = useState(isOn);
  const swichActive = () => {
    // setActive(!active);
    onToggle(!isOn);
  };

  return (
    <div className={styles.panel}>
      {label}
      <Pill marginLeft={10} onClick={swichActive}>
        {isOn ? 'on' : 'off'}
      </Pill>
    </div>
  );
}

export default Switch;
