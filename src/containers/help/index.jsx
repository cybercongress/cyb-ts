import React from 'react';
import { connect } from 'react-redux';
import useSetActiveAddress from '../../hooks/useSetActiveAddress';
import BanerHelp from './banerHelp';

function Help({ defaultAccount }) {
  const { addressActive } = useSetActiveAddress(defaultAccount);

  return <BanerHelp addressActive={addressActive} />;
}

const mapStateToProps = (store) => {
  return {
    defaultAccount: store.pocket.defaultAccount,
  };
};

export default connect(mapStateToProps)(Help);
