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

type Props = {
  selected: string | undefined;
} & AdviserProps;

function SenseViewer({ selected, adviser }: Props) {
  const { senseApi } = useBackend();

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

  console.log(particleData);

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
                        size={null}
                      />
                    </div>

                    <Link
                      className={styles.title}
                      to={routes.oracle.ask.getLink(selected)}
                    >
                      <ContentIpfs
                        // search
                        cid={selected}
                        details={particleData}
                        content={particleData?.content}
                      />
                    </Link>

                    {/* TODO: need refactor */}
                    {text && (
                      <p>
                        {/* {particleContentOpen && (
                          <TextMarkdown preview>{text}</TextMarkdown>
                        )} */}
                        {/* <button
                          type="button"
                          className={styles.toggleContent}
                          onClick={() =>
                            setParticleContentOpen(!particleContentOpen)
                          }
                        >
                          {particleContentOpen ? 'Hide' : 'Show'} content
                        </button> */}
                      </p>
                    )}
                  </header>
                ) : (
                  <header className={styles.header_Neuron}>
                    <Karma address={selected} />
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
