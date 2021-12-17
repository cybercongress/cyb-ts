import React, { useEffect, useState, useContext } from 'react';
import JSONInput from 'react-json-editor-ajrm';
import { AppContext } from '../../../context';
import { JsonView, jsonInputStyle } from '../ui/ui';

const queryPlaceholder = {
  balance: { address: 'bostrom180tz4ahtyfhwnqwkpdqj3jelyxff4wlx2ymsv3' },
};

function QueryContract({ contractAddress }) {
  const { jsCyber } = useContext(AppContext);
  const [error, setError] = useState(null);
  const [queryObject, setQueryObject] = useState({});
  const [queryResponse, setQueryResponse] = useState({});

  useEffect(() => {
    setQueryObject({ result: queryPlaceholder });
  }, []);

  useEffect(() => {
    if (queryObject.error) {
      setError(queryObject.error);
      return;
    }

    if (queryResponse.error) {
      setError(queryResponse.error);
      return;
    }

    setError(undefined);
  }, [queryObject, queryResponse]);

  const runQuery = async () => {
    if (jsCyber === null || !queryObject.result) {
      return;
    }

    try {
      const queryResponseResult = await jsCyber.queryContractSmart(
        contractAddress,
        queryObject.result
      );
      const formattedResult = JSON.stringify(queryResponseResult, null, '  ');
      setQueryResponse({ result: formattedResult });
    } catch (e) {
      setQueryResponse({ error: `Query error: ${e.message}` });
    }
  };

  return (
    <div>
      <div>Query contract:</div>{' '}
      <JSONInput
        width="100%"
        height="200px"
        placeholder={queryPlaceholder}
        confirmGood={false}
        style={jsonInputStyle}
        onChange={({ jsObject }) => setQueryObject({ result: jsObject })}
      />
      <button
        type="button"
        className="btn btn-primary"
        style={{
          cursor: jsCyber && queryObject.result ? 'pointer' : 'not-allowed',
        }}
        onClick={runQuery}
        disabled={!queryObject?.result}
      >
        Run query
      </button>
      {queryResponse.result && (
        <>
          <div>Response:</div>
          <JsonView src={JSON.parse(queryResponse.result)} />
        </>
      )}
      {error !== null && (
        <div>
          <span className="text-danger" title="The contract query error">
            {error}
          </span>
        </div>
      )}
    </div>
  );
}

export default QueryContract;
