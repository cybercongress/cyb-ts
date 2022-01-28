import React, { useEffect, useState, useContext } from 'react';
import { calculateFee } from '@cosmjs/stargate';
import { GasPrice } from '@cosmjs/launchpad';
import { Link } from 'react-router-dom';
import JSONInput from 'react-json-editor-ajrm';
import { AppContext } from '../../../context';
import { jsonInputStyle, FlexWrapCantainer } from '../ui/ui';
import { CYBER } from '../../../utils/config';
import { trimString } from '../../../utils/utils';
import styles from './stylesInstantiationContract.scss';
import { CardItem } from '../codes/code';
import RenderInstantiateMsg from './RenderInstantiateMsg';
import SelectFile from './renderAbi/SelectFile';
import useParseJsonSchema from './renderAbi/useParseJsonSchema';

const executePlaceholder = {
  name: 'Nation coin',
  symbol: 'NTN',
  decimals: 0,
  initial_balances: [
    {
      address: 'bostrom1p0r7uxstcw8ehrwuj4kn8qzzs0yypsjwxgd445',
      amount: '100000',
    },
  ],
  mint: {
    minter: 'bostrom1p0r7uxstcw8ehrwuj4kn8qzzs0yypsjwxgd445',
    cap: '1000000',
  },
};

export const JSONInputCard = ({ title, placeholder, setState, height }) => (
  <div className={styles.containerJsonContractJSONInput}>
    <span className={styles.containerJsonContractJSONInputTitle}>{title}:</span>
    <JSONInput
      width="100%"
      height={height || '200px'}
      placeholder={placeholder}
      confirmGood={false}
      style={jsonInputStyle}
      onChange={({ jsObject }) => setState({ result: jsObject })}
    />
  </div>
);

function InstantiationContract({ codeId, updateFnc }) {
  const [error, setError] = useState(null);

  const [memo, setMemo] = useState('');
  const [label, setLabel] = useState('');

  const [fileAbiExecute, setFileAbiExecute] = useState(null);
  const { dataObj: schemaExecute } = useParseJsonSchema(fileAbiExecute);

  let content;

  const updateFncInst = () => {
    if (updateFnc) {
      updateFnc();
    }
    setFileAbiExecute(null);
    setLabel('');
    setMemo('');
  };

  if (fileAbiExecute === null) {
    if (label.length === 0) {
      content = <div style={{ fontSize: '18px' }}>You must add a label</div>;
    } else {
      content = (
        <div>
          <SelectFile
            text="Upload instantiate schema"
            useStateCallback={setFileAbiExecute}
          />
        </div>
      );
    }
  } else {
    content = (
      <RenderInstantiateMsg
        schema={schemaExecute}
        codeId={codeId}
        memo={memo}
        label={label}
        updateFnc={updateFncInst}
      />
    );
  }

  return (
    <div className={styles.containerJsonContract}>
      <div className={styles.containerJsonContractInputContainer}>
        <div className={styles.containerJsonContractInputContainerItem}>
          <span>Label</span>
          <input
            className={styles.containerJsonContractInputContainerItemInput}
            value={label}
            onChange={(event) => setLabel(event.target.value)}
          />
        </div>
        <div className={styles.containerJsonContractInputContainerItem}>
          <span>Memo</span>
          <input
            className={styles.containerJsonContractInputContainerItemInput}
            value={memo}
            onChange={(event) => setMemo(event.target.value)}
          />
        </div>
      </div>
      <FlexWrapCantainer style={{ flexDirection: 'column' }}>
        {content}
      </FlexWrapCantainer>

      {error !== null && (
        <div>
          <div>{error}</div>
        </div>
      )}
    </div>
  );
}

export default InstantiationContract;
