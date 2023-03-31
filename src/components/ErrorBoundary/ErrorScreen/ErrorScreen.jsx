import React from 'react';
import BtnGrd from '../../btnGrd';
import styles from './ErrorScreen.module.scss';

function ErrorScreen() {
  return (
    <div className={styles.wrapper}>
      <img src={require('../../../image/robot.svg')} alt="Robot" />

      <p>
        something went wrong, <br />
        go back or reload the page
      </p>

      {history.length > 0 && (
        <BtnGrd
          className={styles.btnGoBack}
          text="go back"
          onClick={() => {
            history.back();
            window.location.reload();
          }}
        />
      )}

      <BtnGrd text="reload page" onClick={() => window.location.reload()} />
    </div>
  );
}

export default ErrorScreen;
