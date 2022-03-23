import React from 'react';
import { connect } from 'react-redux';
import useSetActiveAddress from '../../hooks/useSetActiveAddress';
import BanerHelp from './banerHelp';

function Help({ defaultAccount }) {
  const { addressActive } = useSetActiveAddress(defaultAccount);

  return (
    <main className="block-body">
      <BanerHelp addressActive={addressActive} />
    </main>
  );
}

const mapStateToProps = (store) => {
  return {
    defaultAccount: store.pocket.defaultAccount,
  };
};

export default connect(mapStateToProps)(Help);
