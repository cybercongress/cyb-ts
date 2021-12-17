import React from 'react';
import ReactJson from 'react-json-view';

function JsonView({ src, strLength }) {
  return (
    <ReactJson
      src={src}
      name={false}
      displayDataTypes={false}
      displayObjectSize={false}
      collapseStringsAfterLength={strLength ?? 24}
      theme="twilight"
    />
  );
}

const jsonInputStyle = {
  container: { display: 'flex', flexDirection: 'column' },
  body: { order: '1' },
  warningBox: { order: '2' },
};

export { jsonInputStyle, JsonView };
