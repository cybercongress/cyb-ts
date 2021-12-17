import React from 'react';
import { Link } from 'react-router-dom';
import ReactJson from 'react-json-view';

const CodeLink = ({ codeId, text }) => {
  return <Link to={`/codes/${codeId}`}>{text || `Code #${codeId}`}</Link>;
};

function HistoryInfo({ contractCodeHistory }) {
  return (
    <div>
      <div>
        <div>History</div>
        {contractCodeHistory.map((item) => (
          <>
            <div>
              {item.operation}-<CodeLink codeId={item.codeId} />
            </div>
            <ReactJson
              src={item.msg}
              theme="twilight"
              displayObjectSize={false}
              displayDataTypes={false}
            />
          </>
        ))}
      </div>
    </div>
  );
}

export default HistoryInfo;
