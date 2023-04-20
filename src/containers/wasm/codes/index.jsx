import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useQueryClient } from 'src/contexts/queryClient';
import Code from './code';
import ActionBar from './actionBar';
import useSetActiveAddress from '../../../hooks/useSetActiveAddress';

import styles from './styles.scss';

function Codes({ defaultAccount }) {
  const queryClient = useQueryClient();
  const { addressActive } = useSetActiveAddress(defaultAccount);
  const [codes, setCodes] = useState([]);
  const [updateFnc, setUpdateFunc] = useState(0);

  useEffect(() => {
    const getCodes = async () => {
      try {
        if (queryClient) {
          const resposeCodes = await queryClient.getCodes();
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
  }, [queryClient, updateFnc]);

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
