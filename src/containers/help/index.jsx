import { connect } from 'react-redux';
import useSetActiveAddress from '../../hooks/useSetActiveAddress';
import BannerHelp from './BannerHelp';
import { MainContainer } from 'src/components';

function Help({ defaultAccount }) {
  const { addressActive } = useSetActiveAddress(defaultAccount);

  return (
    <MainContainer>
      <BannerHelp addressActive={addressActive} />
    </MainContainer>
  );
}

const mapStateToProps = (store) => {
  return {
    defaultAccount: store.pocket.defaultAccount,
  };
};

export default connect(mapStateToProps)(Help);
