import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Account } from 'src/components';
import ContentIpfs from 'src/components/contentIpfs/contentIpfs';
import HydrogenBalance from 'src/components/HydrogenBalance/HydrogenBalance';
import Karma from 'src/containers/application/Karma/Karma';
import AdviserMeta from 'src/containers/ipfs/components/AdviserMeta/AdviserMeta';
import useParticleDetails from 'src/features/particle/useParticleDetails';
import { routes } from 'src/routes';
import { isParticle as isParticleFunc } from 'src/features/particle/utils';
import cx from 'classnames';
import styles from './SenseViewerHeader.module.scss';

function SenseViewerHeader({ selected }: { selected: string }) {
  const isParticle = isParticleFunc(selected || '');

  const { data: particleData } = useParticleDetails(selected!, {
    skip: !isParticle && !selected,
  });

  const [particleContentOpen, setParticleContentOpen] = useState(false);

  const text = particleData?.text;
  const largeContent = text?.length > 200;

  if (isParticle) {
    return (
      <header className={styles.header}>
        {/* <ParticleAvatar particleId={selected} /> */}

        {/* {cutSenseItem(selected)} */}

        <div className={styles.meta}>
          <AdviserMeta
            cid={selected}
            type={particleData?.type}
            size={particleData?.content?.length}
          />
        </div>

        <Link
          className={cx(styles.title, {
            [styles.largeContent]: largeContent,
            [styles.fullContent]: largeContent && particleContentOpen,
          })}
          to={routes.oracle.ask.getLink(selected)}
        >
          <ContentIpfs
            // search
            cid={selected}
            details={particleData}
          />
        </Link>
      </header>
    );
  }

  return (
    <header className={styles.header_Neuron}>
      {/* need this wrapper to prevent jump */}
      <div className={styles.karma}>
        <Karma address={selected} />
      </div>

      {/* fix this check in parent */}
      {selected?.includes('bostrom') && <Account address={selected} avatar />}
      <Link to={routes.neuron.getLink(selected)}>
        <HydrogenBalance address={selected} />
      </Link>
    </header>
  );
}

export default SenseViewerHeader;
