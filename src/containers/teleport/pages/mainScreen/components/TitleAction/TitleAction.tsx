import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import styles from './styles.module.scss';

function TitleAction({ title, subTitle }: { title: string; subTitle: string }) {
  return (
    <DisplayTitle
      inDisplay
      title={
        <div className={styles.container}>
          <h3 className={styles.title}>{title}</h3>
          <span className={styles.subTitle}>{subTitle}</span>
        </div>
      }
    />
  );
}

export default TitleAction;
