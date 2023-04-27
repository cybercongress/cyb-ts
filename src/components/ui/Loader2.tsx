import { Dots } from './Dots';
import styles from './Loading.module.scss';

// temp
function Loader2() {
  return (
    <div className={styles.container}>
      <span
        style={{
          display: 'flex',
          margin: '15px 100%',
        }}
      >
        Loading <Dots />
      </span>
    </div>
  );
}

export default Loader2;
