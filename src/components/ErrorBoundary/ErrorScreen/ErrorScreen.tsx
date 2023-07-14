import BtnGrd from '../../btnGrd';
import styles from './ErrorScreen.module.scss';

import robot from '../../../image/robot.svg';

function ErrorScreen({ error }) {
  return (
    <div className={styles.wrapper}>
      <img src={robot} alt="Robot" />

      <p>
        something went wrong, <br />
        go back or reload the page
      </p>

      <p>{error.message}</p>
      <p>{error.stack}</p>

      {window.history.length > 0 && (
        <BtnGrd
          className={styles.btnGoBack}
          text="go back"
          onClick={() => {
            window.history.back();
            window.location.reload();
          }}
        />
      )}

      <BtnGrd text="reload page" onClick={() => window.location.reload()} />
    </div>
  );
}

export default ErrorScreen;
