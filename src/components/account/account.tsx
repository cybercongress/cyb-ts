import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useQueryClient } from 'src/contexts/queryClient';
import { routes } from 'src/routes';
import usePassportByAddress from 'src/features/passport/hooks/usePassportByAddress';
import cx from 'classnames';
import { trimString } from '../../utils/utils';
import { CYBER } from '../../utils/config';
import { AvataImgIpfs } from '../../containers/portal/components/avataIpfs';
import styles from './account.module.scss';

function useGetValidatorInfo(address: string) {
  const queryClient = useQueryClient();

  const { data } = useQuery(
    ['validatorInfo', address],
    async () => {
      if (!queryClient) {
        return null;
      }

      const response = await queryClient.validator(address);
      return response;
    },
    {
      enabled: Boolean(
        queryClient &&
          address &&
          address.includes(CYBER.BECH32_PREFIX_ACC_ADDR_CYBERVALOPER)
      ),
    }
  );

  return { data };
}

type Props = {
  address: string;
  children?: React.ReactNode;
  colorText?: string;
  onlyAvatar?: boolean;
  avatar?: boolean;
  margin?: string;
  sizeAvatar?: string;
  styleUser?: object;
  trimAddressParam?: [number, number];
  disabled?: boolean;
  containerClassName?: string;
  avatarClassName?: string;
  monikerClassName?: string;
};

function Account({
  address,
  children,
  colorText,
  onlyAvatar,
  avatar,
  margin,
  sizeAvatar,
  styleUser,
  trimAddressParam = [9, 3],
  disabled,
  containerClassName,
  avatarClassName,
  monikerClassName,
}: Props) {
  const { data: dataValidInfo } = useGetValidatorInfo(address);
  const { passport: dataPassport } = usePassportByAddress(address);
  const moniker =
    dataValidInfo?.validator?.description?.moniker ||
    dataPassport?.extension.nickname;

  const trimAddress = useMemo(() => {
    return trimString(address, trimAddressParam[0], trimAddressParam[1]);
  }, [address, trimAddressParam]);

  const linkAddress = useMemo(() => {
    if (address?.includes(CYBER.BECH32_PREFIX_ACC_ADDR_CYBERVALOPER)) {
      return `/network/bostrom/hero/${address}`;
    }

    if (moniker) {
      return routes.robotPassport.getLink(moniker);
    }

    return `/network/bostrom/contract/${address}`;
  }, [address, moniker]);

  const cidAvatar = useMemo(() => {
    if (dataPassport !== undefined && dataPassport !== null) {
      const { extension } = dataPassport;
      return extension.avatar;
    }
    return null;
  }, [dataPassport]);

  return (
    <div
      className={cx(styles.container, containerClassName)}
      style={{
        ...styleUser,
      }}
    >
      {avatar && (
        <div
          className={cx(styles.avatar, avatarClassName)}
          style={{
            width: sizeAvatar,
            height: sizeAvatar,
          }}
        >
          <AvataImgIpfs addressCyber={address} cidAvatar={cidAvatar} />
        </div>
      )}
      {!onlyAvatar && (
        <Link
          onClick={(e) => disabled && e.preventDefault()}
          className={cx(styles.moniker, monikerClassName)}
          style={{
            color: colorText,
            padding: margin,
          }}
          to={linkAddress}
        >
          {!moniker ? trimAddress : moniker}
        </Link>
      )}
      {children}
    </div>
  );
}

export default Account;
