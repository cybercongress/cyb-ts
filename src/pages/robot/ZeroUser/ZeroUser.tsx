import BannerHelp from 'src/containers/help/BannerHelp';
import { useAdviser } from 'src/features/adviser/context';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { routes } from 'src/routes';
import Display from 'src/components/containerGradient/Display/Display';

function ZeroUser() {
  const { setAdviser } = useAdviser();

  useEffect(() => {
    setAdviser(
      <>
        Connect your wallet by adding a <Link to={routes.keys.path}>key</Link>{' '}
        to start using robot. <br /> Get your first{' '}
        <Link to={routes.citizenship.path}>citizenship</Link> to unlock all
        features of cyb
      </>
    );

    return () => {
      setAdviser(null);
    };
  }, [setAdviser]);

  return (
    <Display>
      <BannerHelp />
    </Display>
  );
}

export default ZeroUser;
