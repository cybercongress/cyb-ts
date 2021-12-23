import React from 'react';
import { Link } from 'react-router-dom';
import ReactJson from 'react-json-view';
import { CardCantainer } from '../ui/ui';
import styles from './stylesHistoryInfo.scss';

const CodeLink = ({ codeId, text }) => {
  return <Link to={`/codes/${codeId}`}>{text || `Code #${codeId}`}</Link>;
};

function HistoryInfo({ contractCodeHistory }) {
  return (
    <CardCantainer>
      <div className={styles.containerHistoryInfo}>
        <span className={styles.containerHistoryInfoTitle}>History</span>
        {contractCodeHistory.map((item) => (
          <div className={styles.containerHistoryInfoItem}>
            <div className={styles.containerHistoryInfoItemTitle}>
              {item.operation}-<CodeLink codeId={item.codeId} />
            </div>
            <ReactJson
              src={item.msg}
              theme="twilight"
              displayObjectSize={false}
              displayDataTypes={false}
            />
          </div>
        ))}
      </div>
    </CardCantainer>
  );
}

export default HistoryInfo;
