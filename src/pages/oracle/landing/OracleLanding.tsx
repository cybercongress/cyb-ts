import { ActionBar, Button } from 'src/components';
import { routes } from 'src/routes';
import { useEffect, useMemo, useRef, useState } from 'react';
import CyberlinksGraphContainer from 'src/features/cyberlinks/CyberlinksGraph/CyberlinksGraphContainer';
import { Stars } from 'src/containers/portal/components';

import { useDevice } from 'src/contexts/device';

import { useAppDispatch } from 'src/redux/hooks';
import { setFocus } from 'src/containers/application/Header/Commander/commander.redux';
import Carousel from 'src/components/Carousel/Carousel';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styles from './OracleLanding.module.scss';
import KeywordButton from './components/KeywordButton/KeywordButton';

import Stats from './Stats/Stats';
import graphDataPrepared from './graphDataPrepared.json';

export enum TitleType {
  search,
  ai, // ask
  learning,
}

const mapTitleTypeToTitle = {
  [TitleType.search]: 'search',
  [TitleType.learning]: 'learn',
  [TitleType.ai]: 'ask',
};

const listConfig = {
  [TitleType.search]: {
    title: 'instantly and censorfree',
    text: (
      <>
        <strong>find</strong> and <strong>deliver</strong> content
      </>
    ),
    description: (
      <>
        decentralized search is just one{' '}
        <Link to={routes.oracle.ask.getLink('cyber')}>cyber</Link> <i>app</i>{' '}
        aip
      </>
    ),
  },
  [TitleType.learning]: {
    title: 'empower everyone',
    text: (
      <>
        <Link to={routes.oracle.learn.path}>learn</Link> yourself
      </>
    ),
    description: (
      <>
        decentralized learning as simple as creating a <strong>link</strong>
      </>
    ),
  },
  [TitleType.ai]: {
    title: 'decentralized ai is alive',
    text: (
      <>
        behold the new{' '}
        <Link to={routes.oracle.ask.getLink('truth')}>truth medium</Link>
      </>
    ),
    description: (
      <>
        <Link to={routes.oracle.ask.getLink('cyber')}>cyber</Link> is the
        protocol for unified, provable, collective learning
      </>
    ),
  },
};

const QUERY_KEY = 'type';

function OracleLanding() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get(QUERY_KEY);

  const [titleType, setTitleType] = useState<TitleType>(
    Number(
      Object.entries(mapTitleTypeToTitle).find(
        ([, value]) => value === type
      )?.[0]
    ) ?? TitleType.ai
  );

  const [isRenderGraph, setIsRenderGraph] = useState(false);

  const { viewportWidth } = useDevice();
  const navigate = useNavigate();

  const ref = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  const graphSize = 220;
  const isMobile =
    viewportWidth <= Number(styles.mobileBreakpoint.replace('px', ''));

  useEffect(() => {
    dispatch(setFocus(true));

    const timeout = setTimeout(() => {
      setIsRenderGraph(true);
    }, 1000 * 1.5);

    return () => {
      clearTimeout(timeout);
    };
  }, [dispatch]);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    ref.current.style.setProperty('--graph-size', `${graphSize}px`);
  }, [ref, graphSize]);

  const { title, description, text } = listConfig[titleType];

  const listSlides = useMemo(() => {
    return [TitleType.search, TitleType.ai, TitleType.learning].map((type) => {
      return {
        title: mapTitleTypeToTitle[type],
        // step: type,
      };
    });
  }, []);

  return (
    <div className={styles.wrapper} ref={ref}>
      <div className={styles.starsWrapper}>
        <Stars />
      </div>

      <header className={styles.header}>
        <Carousel
          color="blue"
          noAnimation
          activeStep={titleType}
          onChange={(index: TitleType) => {
            setTitleType(index);
            navigate(`?${QUERY_KEY}=${mapTitleTypeToTitle[index]}`, {
              replace: true,
            });
          }}
          slides={listSlides}
        />
      </header>

      <div className={styles.info}>
        <h2>{title}</h2>
        <h3>{text}</h3>
        <h4>{description}</h4>

        <Stats type={titleType} />
      </div>

      {!isMobile && (
        <div className={styles.graphWrapper}>
          <Link
            to={routes.brain.path}
            className={styles.enlargeBtn}
            title="open full graph"
          />

          {isRenderGraph && (
            <CyberlinksGraphContainer
              size={graphSize}
              data={graphDataPrepared}
            />
          )}
        </div>
      )}

      <div className={styles.footer}>
        {[
          {
            query: 'cyber',
            author: 'bostrom1d8754xqa9245pctlfcyv8eah468neqzn3a0y0t',
          },
          {
            query: 'donut of knowledge',
            author: 'bostrom1k7nssnnvxezpp4una7lvk6j53895vadpqe6jh6',
          },
          {
            query: 'help',
            author: 'bostrom1hmkqhy8ygl6tnl5g8tc503rwrmmrkjcq3lduwj',
          },
        ].map(({ query, author }) => {
          return <KeywordButton key={query} keyword={query} author={author} />;
        })}
      </div>

      <ActionBar>
        {(() => {
          switch (titleType) {
            case TitleType.search:
              return (
                <Button link="/particles" className={styles.actionBarBtn}>
                  get high
                </Button>
              );

            case TitleType.learning:
              return (
                <Button
                  link={routes.oracle.learn.path}
                  className={styles.actionBarBtn}
                >
                  how to learn
                </Button>
              );

            case TitleType.ai:
              return (
                <Button
                  onClick={() => dispatch(setFocus(true))}
                  className={styles.actionBarBtn}
                >
                  ask something
                </Button>
              );

            default:
              return null;
          }
        })()}
      </ActionBar>
    </div>
  );
}

export default OracleLanding;
