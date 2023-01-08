import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../../../context';
import styles from './styles.scss';
import { trimString } from '../../../../utils/utils';

export const CardItem = ({ title, value }) => (
  <div className={styles.containetCodesCardFillsItem}>
    <div className={styles.containetCodesCardFillsItemTitle}>{title}:</div>
    <div className={styles.containetCodesCardFillsItemValue}>{value}</div>
  </div>
);

function Code({ data }) {
  const { jsCyber } = useContext(AppContext);

  const [instantiationInfo, setInstantiationInfo] = useState(0);

  useEffect(() => {
    const getContracts = async () => {
      try {
        if (jsCyber !== null && data.id) {
          const response = await jsCyber.getContracts(data.id);
          setInstantiationInfo(response.length);
        }
      } catch (error) {
        console.log(`error getContracts`, error);
        setInstantiationInfo(0);
      }
    };
    getContracts();
  }, [data, jsCyber]);

  const { id, creator, checksum } = data;

  return (
    <Link to={`/libs/${data.id}`}>
      <div className={styles.containetCodesCard}>
        <div className={styles.containetCodesCardId}>#{id}</div>
        <div className={styles.containetCodesCardFills}>
          <CardItem title="Creator" value={trimString(creator, 10)} />
          <CardItem title="Checksum" value={trimString(checksum, 8, 8)} />
          <CardItem title="Instances" value={instantiationInfo} />
        </div>
      </div>
    </Link>
  );
}

export default Code;
