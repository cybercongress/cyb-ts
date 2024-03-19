import Display from 'src/components/containerGradient/Display/Display';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import styles from './SenseViewer.module.scss';
import { useBackend } from 'src/contexts/backend/backend';
import { Account } from 'src/components';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { routes } from 'src/routes';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Loader2 from 'src/components/ui/Loader2';
import { cutSenseItem } from '../utils';
import ParticleAvatar from '../components/ParticleAvatar/ParticleAvatar';
import useParticleDetails from '../../../particle/useParticleDetails';
import { isParticle as isParticleFunc } from 'src/features/particle/utils';
import { AdviserProps } from '../Sense';
import { markAsRead } from 'src/features/sense/redux/sense.redux';
import Karma from 'src/containers/application/Karma/Karma';
import HydrogenBalance from 'src/components/HydrogenBalance/HydrogenBalance';

import Messages from './Messages/Messages';
import TextMarkdown from 'src/components/TextMarkdown';
import ContentIpfs from 'src/components/contentIpfs/contentIpfs';
import AdviserMeta from 'src/containers/ipfs/components/AdviserMeta/AdviserMeta';
import cx from 'classnames';

type Props = {
  selected: string | undefined;
} & AdviserProps;

function SenseViewer({ adviser, selected }: Props) {
  const { senseApi } = useBackend();

  // const selected = 'QmZ4b5kbCV9K9Jd2ZXpfUAKiPSkzPfD558wBbebYFpztKY';

  const isParticle = isParticleFunc(selected || '');

  const chat = useAppSelector((store) => {
    return selected && store.sense.chats[selected];
  });

  const { data: particleData } = useParticleDetails(selected!, {
    skip: !isParticle && !selected,
  });

  const dispatch = useAppDispatch();

  const [particleContentOpen, setParticleContentOpen] = useState(false);

  const { error, isLoading: loading, data: messages } = chat || {};

  const text = particleData?.text;

  // console.log(particleData);

  useEffect(() => {
    if (selected && senseApi) {
      dispatch(
        markAsRead({
          id: selected,
          senseApi,
        })
      );
    }
  }, [selected, senseApi, dispatch]);

  useEffect(() => {
    adviser.setLoading(loading);
  }, [loading, adviser]);

  useEffect(() => {
    adviser.setError(error || '');
  }, [error, adviser]);

  const largeContent = text?.length > 200;

  return (
    <div className={styles.wrapper}>
      <Display
        title={
          selected && (
            <DisplayTitle
              title={
                isParticle ? (
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
                        [styles.fullContent]:
                          largeContent && particleContentOpen,
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
                ) : (
                  <header className={styles.header_Neuron}>
                    {/* need this wrapper to prevent jump */}
                    <div className={styles.karma}>
                      <Karma address={selected} />
                    </div>

                    <Account address={selected} avatar />
                    <Link to={routes.neuron.getLink(selected)}>
                      <HydrogenBalance address={selected} />
                    </Link>
                  </header>
                )
              }
            />
          )
        }
      >
        {selected && !!messages?.length ? (
          <Messages messages={messages} currentChatId={selected} />
        ) : loading ? (
          <div className={styles.noData}>
            <Loader2 />
          </div>
        ) : (
          <p className={styles.noData}>
            {/* post to your log, <br /> */}
            {/* or  */}
            select chat to start messaging
          </p>
        )}
      </Display>
    </div>
  );
}

export default SenseViewer;
