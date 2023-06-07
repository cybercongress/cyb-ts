/* eslint-disable no-nested-ternary */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { useDevice } from 'src/contexts/device';
import { useQueryClient } from 'src/contexts/queryClient';
import { getIpfsHash, chekFollow } from '../../utils/search/utils';
import { ActionBar } from '../../components';
import ActionBarContainer from './actionBar';
import { useGetBalance, useGetHeroes } from './hooks';
import { PATTERN_CYBER } from '../../utils/config';

// DELETE:
function AccountDetails({ defaultAccount }) {
  const { balance, loadingBalanceInfo } = useGetBalance(address, updateAddress);

  // const [karmaNeuron, setKarmaNeuron] = useState(0);
  const { isMobile: mobile } = useDevice();

  // useEffect(() => {
  //   const getKarma = async () => {
  //     if (queryClient && address.match(PATTERN_CYBER)) {
  //       const responseKarma = await queryClient.karma(address);
  //       if (responseKarma.karma) {
  //         setKarmaNeuron(parseFloat(responseKarma.karma));
  //       }
  //     }
  //   };
  //   getKarma();
  // }, [queryClient, address]);

  return <div></div>;
}

export default AccountDetails;
