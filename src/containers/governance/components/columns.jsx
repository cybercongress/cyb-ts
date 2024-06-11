import Display from 'src/components/containerGradient/Display/Display';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import styles from './styles.module';

function Columns({ title, children }) {
  return (
    <div className={styles.columnItem}>
      <div className={styles.displayContainer}>
        <Display title={<DisplayTitle title={title} />}></Display>
      </div>
      {children}
    </div>
  );
}

export default Columns;
