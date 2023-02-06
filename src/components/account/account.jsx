import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { trimString } from '../../utils/utils';
import { Dots } from '../ui/Dots';
import { CYBER } from '../../utils/config';
import { AppContext } from '../../context';

export function Account({ address, children, colorText, margin }) {
  const { jsCyber } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [moniker, setMoniker] = useState(address);
  const [linkAccount, setLinkAccount] = useState(
    `/network/bostrom/contract/${address}`
  );
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

  useEffect(() => {
    if (!address.includes(CYBER.BECH32_PREFIX_ACC_ADDR_CYBERVALOPER)) {
      setMoniker(trimString(address, 11, 6));
      setLoading(false);
    } else if (data !== undefined) {
      const { description } = data.validator;
      setMoniker(description.moniker);
      setLinkAccount(`/network/bostrom/hero/${address}`);
      setLoading(false);
    }
  }, [address, data]);

  if (loading) {
    return <Dots />;
  }

  return (
    <span>
      <Link
        style={{ color: colorText || '#36d6ae', padding: margin || 0 }}
        to={linkAccount}
      >
        {moniker}
      </Link>
      {children}
    </span>
  );
}

export default Account;
