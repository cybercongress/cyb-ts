import { useLocation } from 'react-router-dom';
import Adviser from './Adviser/Adviser';
import { useAdviser } from './context';
import styles from './AdviserContainer.module.scss';
import { useEffect } from 'react';

function AdviserContainer() {
  const { content, isOpen, setAdviser, setIsOpen, color } = useAdviser();

  const location = useLocation();

  useEffect(() => {
    setAdviser(null);
  }, [setAdviser, location.pathname]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.blurWrapper}>
        <Adviser
          disabled={!content}
          className={styles.adviser}
          isOpen={isOpen && !!content}
          color={color}
          openCallback={setIsOpen}
        >
          {content}
        </Adviser>
      </div>
    </div>
  );
}

export default AdviserContainer;
