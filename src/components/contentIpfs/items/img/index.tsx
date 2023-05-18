import styles from './styles.scss';

function Img({ content }: { content: string }) {
  return <img className={styles.img} alt="img" src={content} />;
}

export default Img;
