import { Link } from 'react-router-dom';
import { ActionBar } from 'src/components';
import { routes } from 'src/routes';
import styles from './Search.module.scss';
import { id } from 'src/containers/application/Header/Commander/Commander';
import { useEffect } from 'react';
import useCanvas from 'src/containers/temple/components/canvasOne/useCanvas';

function Search() {
  const { canvasRef } = useCanvas();

  useEffect(() => {
    const commander = document.getElementById(id);
    if (commander) {
      commander.focus();
    }
  }, []);
  return (
    <div>
      <header className={styles.header}>
        {['cyber', 'donut of knowledge', 'help'].map((keyword) => {
          return (
            <Link
              className={styles.keywordBtn}
              key={keyword}
              to={routes.search.getLink(keyword)}
            >
              {keyword}
            </Link>
          );
        })}
      </header>

      <div className={styles.content}>
        <canvas
          className={styles.slider}
          // style={{ top: mediaQuery ? '12%' : '6%' }}
          ref={canvasRef}
          id="canvasOne"
          width="300"
          height="320"
        />

        <img
          className={styles.image}
          src={require('./oracle.png')}
          alt="cyber"
        />

        <div className={styles.info}>
          <h2>decentralized search is here</h2>

          <div>
            <h4>111 000 particles</h4>
            <span>+ 5% in 3 hours</span>
          </div>
        </div>

        <ul className={styles.advantages}>
          {[
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
          ].map(({ title, text }) => {
            return (
              <li key={title}>
                <h6>{title}</h6>
                <p>{text}</p>
              </li>
            );
          })}
        </ul>
      </div>

      <ActionBar
        button={{
          text: 'Ask me anything',
          link: routes.search.getLink('cyber'),
        }}
      />
    </div>
  );
}

export default Search;
