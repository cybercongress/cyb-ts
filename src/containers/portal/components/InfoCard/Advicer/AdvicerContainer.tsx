import { useLocation } from 'react-router-dom';
import Advicer from './Advicer';
import { useAdvicer } from './advicer.context';
import styles from './AdvicerContainer.module.scss';
import { useEffect } from 'react';

function AdvicerContainer() {
  const { content, isOpen, setContent } = useAdvicer();

  const location = useLocation();

  useEffect(() => {
    setContent(null);
  }, [location.pathname]);

  return (
    <Advicer className={styles.advicer} isOpen={isOpen || !content}>
      {content || 'Hi from Cyb'}
    </Advicer>
  );
}

export default AdvicerContainer;
