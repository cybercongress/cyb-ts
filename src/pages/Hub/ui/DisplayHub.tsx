import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Display, DisplayTitle } from 'src/components';
import { HUB_CONTRACTS } from 'src/constants/hubContracts';
import { routes } from 'src/routes';

type Hub = 'networks' | 'channels' | 'tokens';

function DisplayHub({
  title,
  children,
  type,
}: {
  children: ReactNode;
  title: Hub;
  type: keyof typeof HUB_CONTRACTS;
}) {
  return (
    <Display
      title={
        <DisplayTitle
          title={
            <Link to={routes.contracts.byAddress.getLink(HUB_CONTRACTS[type])}>
              hub {title}
            </Link>
          }
        />
      }
    >
      {children}
    </Display>
  );
}

export default DisplayHub;
