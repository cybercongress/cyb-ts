import { ActionBar, Button } from 'src/components';
import { routes } from 'src/routes';
import { useEffect, useRef, useState } from 'react';
import CyberlinksGraphContainer from 'src/features/cyberlinks/CyberlinksGraph/CyberlinksGraphContainer';
import { Stars } from 'src/containers/portal/components';
import { TypingText } from 'src/containers/temple/pages/play/PlayBanerContent';
import { useDevice } from 'src/contexts/device';
import styles from './Search.module.scss';
import KeywordButton from './components/KeywordButton/KeywordButton';
import TitleText from './components/TitleText/TitleText';
import Stats from './Stats/Stats';
import cx from 'classnames';
import { useAppDispatch } from 'src/redux/hooks';
import { setFocus } from 'src/containers/application/Header/Commander/commander.redux';

export enum TitleType {
  search,
  learning,
  ai,
}

const listConfig = {
  [TitleType.search]: [
    {
      title: 'censorfree',
      text: (
        <>
          its a blockchain <br /> limitless participation
        </>
      ),
    },
    {
      title: 'direct',
      text: (
        <>
          pure content <br /> directly from peers
        </>
      ),
    },
    {
      title: 'instant',
      text: (
        <>
          your content is searchable <br /> in 5 seconds
        </>
      ),
    },
  ],
  [TitleType.learning]: [
    {
      title: 'upgrade',
      text: 'your intelligence to superintelligence',
    },
    {
      title: 'spread',
      text: 'your content cheaper',
    },
    {
      title: 'upload',
      text: (
        <>
          your brain into eternity, <br /> and more
        </>
      ),
    },
  ],
  [TitleType.ai]: [
    {
      title: 'collaborative',
      text: (
        <>
          cooperate and interact <br /> with ai together
        </>
      ),
    },
    {
      title: 'self-sufficient',
      text: (
        <>
          build autonomous AI <br /> without limitations
        </>
      ),
    },
    {
      title: 'freedom',
      text: (
        <>
          let your ai <br /> live in cyberverse
        </>
      ),
    },
  ],
};

export const learningListConfig = listConfig[TitleType.learning];

function Search() {
  const [titleType, setTitleType] = useState(TitleType.search);
  const [isRenderGraph, setIsRenderGraph] = useState(false);

  const { viewportWidth } = useDevice();

  const ref = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();

  let graphSize = Math.min(viewportWidth / 3, 330);

  const isMobile =
    viewportWidth <= Number(styles.mobileBreakpoint.replace('px', ''));

  if (isMobile) {
    graphSize = 330;
  }

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

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleType((prev) => {
        // refactor maybe, generated
        switch (prev) {
          case TitleType.search:
            return TitleType.learning;

          case TitleType.learning:
            return TitleType.ai;

          case TitleType.ai:
            return TitleType.search;

          default:
            return TitleType.search;
        }
      });
    }, 10 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [titleType]);

  return (
    <div className={styles.wrapper} ref={ref}>
      <div className={styles.starsWrapper}>
        <Stars />
      </div>

      <header className={styles.header}>
        {['cyber', 'donut of knowledge', 'help'].map((keyword) => {
          return <KeywordButton key={keyword} keyword={keyword} />;
        })}
      </header>

      <div className={styles.info}>
        <h2 className={cx(styles.infoText, styles.title)}>
          decentralized{' '}
          <strong className={styles.keyword}>
            <TypingText
              content={(() => {
                switch (titleType) {
                  case TitleType.search:
                    return 'search';

                  case TitleType.learning:
                    return 'learning';

                  case TitleType.ai:
                    return 'ai';

                  default:
                    return '';
                }
              })()}
              delay={40}
            />
          </strong>{' '}
          <span className={styles.lastTextBlock}>is here</span>
        </h2>

        <div className={styles.graphWrapper}>
          {isRenderGraph && <CyberlinksGraphContainer size={graphSize} />}
        </div>

        {/* not render to prevent requests */}
        {!isMobile && <Stats type={titleType} />}
      </div>

      <ul className={styles.advantages}>
        {listConfig[titleType].map(({ title, text }) => {
          return (
            <li key={title}>
              <TitleText title={title} text={text} />
            </li>
          );
        })}
      </ul>

      <ActionBar>
        <Button link="/particles" className={styles.actionBarBtn}>
          get high
        </Button>
        <Button link={routes.oracle.learn.path} className={styles.actionBarBtn}>
          how to learn
        </Button>
      </ActionBar>
    </div>
  );
}

export default Search;
