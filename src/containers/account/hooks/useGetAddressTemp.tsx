import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState } from 'src/redux/store';

function useGetAddressTemp() {
  const params = useParams();
  const { defaultAccount } = useSelector((store: RootState) => store.pocket);

  return params.address || defaultAccount.account?.cyber.bech32;
}

export default useGetAddressTemp;
