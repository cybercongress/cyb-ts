import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../../../context';

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

  return (
    <Link to={`/codes/${data.id}`}>
      <div>
        <div>#{data.id}</div>
        <div>Creator:{data.creator}</div>
        <div>Checksum: {data.checksum}</div>
        <div>Instances: {instantiationInfo}</div>
      </div>
    </Link>
  );
}

export default Code;
