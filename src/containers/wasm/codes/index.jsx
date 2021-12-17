import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../../../context';
import Code from './code';

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
      {codes.length > 0 &&
        codes.map((item) => {
          return (
            <>
              <Code data={item} key={item.id} />
            </>
          );
        })}
    </main>
  );
}

export default Codes;
