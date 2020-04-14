import React from 'react';
import { useParams } from 'react-router-dom';
import GiftInfo from './giftInfo';
import GiftAddress from './giftAddress';

const Gift = () => {
  const { address } = useParams();

  if (address !== undefined) {
    return <GiftAddress address={address} />;
  }
  return <GiftInfo />;
};
export default Gift;
