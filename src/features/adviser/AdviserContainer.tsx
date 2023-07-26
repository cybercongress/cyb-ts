import { useLocation } from 'react-router-dom';
import Adviser from './Adviser/Adviser';
import { useAdviser } from './context';
import styles from './AdviserContainer.module.scss';
import { useEffect } from 'react';

function AdviserContainer() {
  const { content, isOpen, setAdviser, color } = useAdviser();

  const location = useLocation();

  useEffect(() => {
    setAdviser(null);
  }, [setAdviser, location.pathname]);

  return (
    <Adviser
      className={styles.adviser}
      isOpen={isOpen && !!content}
      color={color}
    >
      {content}
    </Adviser>
  );
}

export default AdviserContainer;
