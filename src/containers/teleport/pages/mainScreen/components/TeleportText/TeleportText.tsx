import styles from './TeleportText.module.scss';

function TeleportText() {
  return (
    <div className={styles.container}>
      <header className={styles.title}>
        <h2>communicate</h2> <span>by exchanging value</span>
      </header>
      <p className={styles.description}>
        safely exchange value in first web 3 powered app, send public texts,
        check historical data with your contacts in timeline and many more
      </p>
    </div>
  );
}

export default TeleportText;
