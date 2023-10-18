import { ActionBar, Button, MainContainer } from 'src/components';
import { routes } from 'src/routes';
import { id } from 'src/containers/application/Header/Commander/Commander';
import { useEffect, useState } from 'react';
import TitleText from './TitleText/TitleText';
import KeywordButton from './KeywordButton/KeywordButton';
import styles from './Search.module.scss';
import ForceGraph from 'src/containers/forceGraph/forceGraph';
import LinearGradientContainer from 'src/components/LinearGradientContainer/LinearGradientContainer';
import LinksGraphContainer from 'src/containers/forceGraph/LinksGraphContainer';
import { Stars } from 'src/containers/portal/components';
import { useGetGraphStats } from 'src/containers/temple/hooks';
import { TypingText } from 'src/containers/temple/pages/play/PlayBanerContent';

enum TitleType {
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

  const dataGetGraphStats = useGetGraphStats();

  console.log(dataGetGraphStats);

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

  useEffect(() => {
    const commander = document.getElementById(id);
    if (commander) {
      commander.focus();
    }
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.starsWrapper}>
        <Stars />
      </div>

      <header className={styles.header}>
        {['cyber', 'donut of knowledge', 'help'].map((keyword) => {
          return <KeywordButton key={keyword} keyword={keyword} />;
        })}
      </header>

      <div className={styles.info}>
        <h2 className={styles.title}>
          decentralized{' '}
          <span>
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
          </span>
          <br />
          is here
        </h2>

        <div className={styles.graphWrapper}>
          <LinksGraphContainer size={330} />
        </div>

        <div className={styles.particles}>
          {/* need keep block space */}
          {dataGetGraphStats.data?.cyberlinks && (
            <>
              <h4>
                {Number(dataGetGraphStats.data.cyberlinks)
                  .toLocaleString()
                  .replaceAll(',', ' ')}{' '}
                particles
              </h4>
              <span>+ 0%</span> <span>in 3 hours</span>
            </>
          )}
        </div>
      </div>

      <ul className={styles.advantages}>
        {listConfig[titleType].map(({ title, text }) => {
          console.log(text);

          return (
            <li key={title}>
              <TitleText title={title} text={text} />
            </li>
          );
        })}
      </ul>

      <ActionBar>
        <Button link="/particles">get high</Button>
        <Button link={routes.oracle.learn.path}>how to learn</Button>
      </ActionBar>
    </div>
  );
}

export default Search;
