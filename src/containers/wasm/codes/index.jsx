import { useEffect, useState, useContext } from 'react';
import { connect } from 'react-redux';
import { AppContext } from '../../../context';
import Code from './code';
import ActionBar from './actionBar';
import useSetActiveAddress from '../../../hooks/useSetActiveAddress';

import styles from './styles.scss';

function Codes({ defaultAccount }) {
  const { jsCyber } = useContext(AppContext);
  const { addressActive } = useSetActiveAddress(defaultAccount);
  const [codes, setCodes] = useState([]);
  const [updateFnc, setUpdateFunc] = useState(0);

  useEffect(() => {
    const getCodes = async () => {
      try {
        if (jsCyber !== null) {
          const resposeCodes = await jsCyber.getCodes();
          if (resposeCodes && resposeCodes.length > 0) {
            setCodes(resposeCodes.reverse());
          }
        }
      } catch (error) {
        console.log(`error getCodes`, error);
        setCodes([]);
      }
    };
    getCodes();
  }, [jsCyber, updateFnc]);

  console.log(`codes`, codes);

  return (
    <>
      <main className="block-body">
        <div className={styles.containerCodes}>
          {codes.length > 0 &&
            codes.map((item) => {
              return <Code data={item} key={item.id} />;
            })}
        </div>
      </main>
      <ActionBar
        addressActive={addressActive}
        updateFnc={() => setUpdateFunc((item) => item + 1)}
      />
    </>
  );
}

const mapStateToProps = (store) => {
  return {
    defaultAccount: store.pocket.defaultAccount,
  };
};

export default connect(mapStateToProps)(Codes);
