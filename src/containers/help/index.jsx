import { connect } from 'react-redux';
import useSetActiveAddress from '../../hooks/useSetActiveAddress';
import BannerHelp from './BannerHelp';

function Help({ defaultAccount }) {
  const { addressActive } = useSetActiveAddress(defaultAccount);

  return (
    <main className="block-body">
      <BannerHelp addressActive={addressActive} />
    </main>
  );
}

const mapStateToProps = (store) => {
  return {
    defaultAccount: store.pocket.defaultAccount,
  };
};

export default connect(mapStateToProps)(Help);
