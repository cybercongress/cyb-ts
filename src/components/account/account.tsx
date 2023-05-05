import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useQueryClient } from 'src/contexts/queryClient';
import { trimString } from '../../utils/utils';
import { CYBER } from '../../utils/config';
import { activePassport } from '../../containers/portal/utils';
import { AvataImgIpfs } from '../../containers/portal/components/avataIpfs';

function useGetValidatorInfo(address) {
  const queryClient = useQueryClient();

  const { data } = useQuery(
    ['validatorInfo', address],
    async () => {
      const response = await queryClient.validator(address);
      if (response !== null) {
        return response;
      }
      return null;
    },
    {
      enabled: Boolean(
        queryClient &&
          address.includes(CYBER.BECH32_PREFIX_ACC_ADDR_CYBERVALOPER)
      ),
    }
  );

  return { data };
}

function useGetPassportByAddress(address) {
  const queryClient = useQueryClient();
  const { data } = useQuery(
    ['activePassport', address],
    async () => {
      const response = await activePassport(queryClient, address);
      if (response !== null) {
        return response;
      }
      return null;
    },
    {
      enabled: Boolean(
        queryClient &&
          !address.includes(CYBER.BECH32_PREFIX_ACC_ADDR_CYBERVALOPER)
      ),
    }
  );

  return {
    data,
  };
}

type Props = {
  address: string;
  children?: React.ReactNode;
  colorText?: string;
  avatar?: boolean;
  margin?: string;
  sizeAvatar?: string;
  styleUser?: object;
  trimAddressParam?: [number, number];
};

function Account({
  address,
  children,
  colorText,
  avatar,
  margin,
  sizeAvatar,
  styleUser,
  trimAddressParam = [9, 3],
}: Props) {
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
    return trimString(address, trimAddressParam[0], trimAddressParam[1]);
  }, [address, trimAddressParam]);

  const linkAddress = useMemo(() => {
    if (address.includes(CYBER.BECH32_PREFIX_ACC_ADDR_CYBERVALOPER)) {
      return `/network/bostrom/hero/${address}`;
    }

    return `/network/bostrom/contract/${address}`;
  }, [address]);

  const cidAvatar = useMemo(() => {
    if (dataPassport !== undefined && dataPassport !== null) {
      const { extension } = dataPassport;
      return extension.avatar;
    }
    return null;
  }, [dataPassport]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'nowrap',
        gap: '10px',
        ...styleUser,
      }}
    >
      {avatar && (
        <div
          style={{
            width: sizeAvatar || '30px',
            height: sizeAvatar || '30px',
            borderRadius: '50%',
          }}
        >
          <AvataImgIpfs addressCyber={address} cidAvatar={cidAvatar} />
        </div>
      )}
      <Link
        style={{ color: colorText || '#36d6ae', padding: margin || 0 }}
        to={linkAddress}
      >
        {moniker === null ? trimAddress : moniker}
      </Link>
      {children}
    </div>
  );
}

export default Account;
