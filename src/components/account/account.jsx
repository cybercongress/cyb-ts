import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { trimString } from '../../utils/utils';
import { Dots } from '../ui/Dots';
import { CYBER } from '../../utils/config';
import { AppContext } from '../../context';
import { activePassport } from '../../containers/portal/utils';

function useGetValidatorInfo(address) {
  const { jsCyber } = useContext(AppContext);

  const { data } = useQuery(
    ['validatorInfo', address],
    async () => {
      const response = await jsCyber.validator(address);
      if (response !== null) {
        return response;
      }
      return null;
    },
    {
      enabled: Boolean(
        jsCyber && address.includes(CYBER.BECH32_PREFIX_ACC_ADDR_CYBERVALOPER)
      ),
    }
  );

  return { data };
}

function useGetPassportByAddress(address) {
  const { jsCyber } = useContext(AppContext);
  const { data } = useQuery(
    ['activePassport', address],
    async () => {
      const response = await activePassport(jsCyber, address);
      if (response !== null) {
        return response;
      }
      return null;
    },
    {
      enabled: Boolean(
        jsCyber && !address.includes(CYBER.BECH32_PREFIX_ACC_ADDR_CYBERVALOPER)
      ),
    }
  );

  return {
    data,
  };
}

export function Account({ address, children, colorText, margin }) {
  const [moniker, setMoniker] = useState(null);
  const { data: dataValidInfo } = useGetValidatorInfo(address);
  const { data: dataPassport } = useGetPassportByAddress(address);

  useEffect(() => {
    if (dataValidInfo !== undefined) {
      const { description } = dataValidInfo.validator;
      setMoniker(description.moniker);
    }

    if (dataPassport !== undefined && dataPassport !== null) {
      const { extension } = dataPassport;
      setMoniker(extension.nickname);
    }
  }, [dataValidInfo, dataPassport]);

  const trimAddress = useMemo(() => {
    return trimString(address, 9, 3);
  }, [address]);

  const linkAddress = useMemo(() => {
    if (address.includes(CYBER.BECH32_PREFIX_ACC_ADDR_CYBERVALOPER)) {
      return `/network/bostrom/hero/${address}`;
    }

    return `/network/bostrom/contract/${address}`;
  }, [address]);

  return (
    <span>
      <Link
        style={{ color: colorText || '#36d6ae', padding: margin || 0 }}
        to={linkAddress}
      >
        {moniker === null ? trimAddress : moniker}
      </Link>
      {children}
    </span>
  );
}

export default Account;
