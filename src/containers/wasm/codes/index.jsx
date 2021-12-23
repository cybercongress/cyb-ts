import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../../../context';
import Code from './code';

import styles from './styles.scss';

function Codes() {
  const { jsCyber } = useContext(AppContext);
  const [codes, setCodes] = useState([]);

  useEffect(() => {
    const getCodes = async () => {
      try {
        if (jsCyber !== null) {
          const resposeCodes = await jsCyber.getCodes();
          if (resposeCodes && resposeCodes.length > 0) {
            setCodes(resposeCodes);
          }
        }
      } catch (error) {
        console.log(`error getCodes`, error);
        setCodes([]);
      }
    };
    getCodes();
  }, [jsCyber]);

  console.log(`codes`, codes);

  return (
    <main className="block-body">
      <div className={styles.containerCodes}>
        {codes.length > 0 &&
          codes.map((item) => {
            return <Code data={item} key={item.id} />;
          })}
      </div>
    </main>
  );
}

export default Codes;
