import { ActionBar, Button } from 'src/components';
import { routes } from 'src/routes';
import { useEffect, useRef, useState } from 'react';
import CyberlinksGraphContainer from 'src/features/cyberlinks/CyberlinksGraph/CyberlinksGraphContainer';
import { Stars } from 'src/containers/portal/components';
import { TypingText } from 'src/containers/temple/pages/play/PlayBanerContent';
import { useDevice } from 'src/contexts/device';
import cx from 'classnames';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { setFocus } from 'src/containers/application/Header/Commander/commander.redux';
import styles from './Search.module.scss';
import KeywordButton from './components/KeywordButton/KeywordButton';
import TitleText from './components/TitleText/TitleText';
import Stats from './Stats/Stats';
import graphDataPrepared from './graphDataPrepared.json';
import Carousel from 'src/components/Carousel/Carousel';
import { Link } from 'react-router-dom';

export enum TitleType {
  search,
  ai,
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
    text2: (
      <>
        decentralized search is just one <strong>cyber</strong> <i>app</i> aip
      </>
    ),
  },
  [TitleType.learning]: {
    title: 'empower everyone',
    text: (
      <>
        <strong>learn</strong> yourself
      </>
    ),
    text2: (
      <>
        decentralized learning as simple as creating a <strong>link</strong>
      </>
    ),
  },
  [TitleType.ai]: {
    title: 'decentralized ai is alive',
    text: (
      <>
        behold the new <strong>truth medium</strong>
      </>
    ),
    text2: (
      <>
        <strong>cyber</strong> is the protocol for unified, provable, collective
        learning
      </>
    ),
  },
};

export const learningListConfig = listConfig[TitleType.learning];

function Search() {
  const [titleType, setTitleType] = useState(TitleType.ai);
  const [isRenderGraph, setIsRenderGraph] = useState(false);

  const { viewportWidth } = useDevice();

  const ref = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();

  // let graphSize = Math.min(viewportWidth / 3, 330);
  let graphSize = 220;

  const isCommanderFocused = useAppSelector(
    (state) => state.commander.isFocused
  );

  const isMobile =
    viewportWidth <= Number(styles.mobileBreakpoint.replace('px', ''));

  // if (isMobile) {
  //   graphSize = 330;
  // }

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

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setTitleType((prev) => {
  //       // refactor maybe, generated
  //       switch (prev) {
  //         case TitleType.search:
  //           return TitleType.learning;

  //         case TitleType.learning:
  //           return TitleType.ai;

  //         case TitleType.ai:
  //           return TitleType.search;

  //         default:
  //           return TitleType.search;
  //       }
  //     });
  //   }, 10 * 1000);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [titleType]);

  const { title, text2, text } = listConfig[titleType];

  console.log(styles);

  return (
    <div className={styles.wrapper} ref={ref}>
      <div className={styles.starsWrapper}>
        <Stars />
      </div>

      <header className={styles.header}>
        <Carousel
          noAnimation
          color="blue"
          activeStep={titleType}
          onChange={(index) => {
            setTitleType(index);
          }}
          slides={[TitleType.search, TitleType.ai, TitleType.learning].map(
            (type) => {
              return {
                title: mapTitleTypeToTitle[type],
                // step: type,
              };
            }
          )}
        />
      </header>

      <div className={styles.info2}>
        <h2
          ref={(ref) => {
            return;
            // debugger;
            // console.log(styles);

            // ref?.animate(styles.anim);
          }}
        >
          {title}
        </h2>
        <h3>{text}</h3>
        <h4>{text2}</h4>

        <Stats type={titleType} />
      </div>

      {/* <div className={styles.info}>
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
        </h2> */}

      {!isMobile && (
        <div className={styles.graphWrapper}>
          <Link to="/brain">
            <img src={require('images/enlarge.svg')} />
          </Link>
          {isRenderGraph && (
            <CyberlinksGraphContainer
              size={graphSize}
              data={graphDataPrepared}
            />
          )}
        </div>
      )}

      {/* not render to prevent requests */}
      {/* {!isMobile && <Stats type={titleType} />} */}
      {/* </div> */}

      {/* <ul className={styles.advantages}>
        {listConfig[titleType].map(({ title, text }) => {
          return (
            <li key={title}>
              <TitleText title={title} text={text} />
            </li>
          );
        })} */}

      {/* </ul> */}

      <div className={styles.footer}>
        {['cyber', 'donut of knowledge', 'help'].map((keyword) => {
          return <KeywordButton key={keyword} keyword={keyword} />;
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

export default Search;
